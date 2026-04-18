from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.throttling import ScopedRateThrottle
from django.utils import timezone
from django.http import HttpResponse
import csv
from .models import Member, Cotisation, Notification
from .serializers import MemberSerializer, AdhesionSerializer, CotisationSerializer, MemberPublicSerializer, NotificationSerializer
from .permissions import IsStaffOrMemberRole


class AdhesionView(generics.CreateAPIView):
    """POST /api/members/adhesion/ — Soumettre une demande d'adhésion"""
    serializer_class   = AdhesionSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes   = [ScopedRateThrottle]
    throttle_scope     = "adhesion_submit"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member = serializer.save()
        # Envoyer email de confirmation (Celery)
        from .tasks import envoyer_email_confirmation_adhesion
        envoyer_email_confirmation_adhesion.delay(member.id)
        return Response({
            "message": "Votre demande d'adhésion a été enregistrée. Vous recevrez une confirmation par e-mail.",
            "numero_membre": member.numero_membre,
        }, status=status.HTTP_201_CREATED)


class MonProfilView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/members/moi/ — Profil du membre connecté"""
    serializer_class   = MemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return self.request.user.member_profile


class MemberViewSet(viewsets.ModelViewSet):
    """CRUD complet membres — réservé admin"""
    queryset           = Member.objects.select_related("user").prefetch_related("cotisations")
    serializer_class   = MemberSerializer
    permission_classes = [IsStaffOrMemberRole]
    allowed_member_roles = [Member.Role.BUREAU]
    filterset_fields   = ["categorie", "statut", "ville"]
    search_fields      = ["nom", "prenom", "email", "numero_membre", "structure"]
    ordering_fields    = ["created_at", "nom", "annee"]

    @action(detail=True, methods=["post"], url_path="valider")
    def valider(self, request, pk=None):
        """Valider un membre en attente"""
        member = self.get_object()
        if member.statut != Member.Statut.EN_ATTENTE:
            return Response({"error": "Ce membre n'est pas en attente."}, status=400)
        member.statut       = Member.Statut.ACTIF
        member.date_adhesion = timezone.now().date()
        member.save()
        # Créer automatiquement la cotisation de l'année en cours
        Cotisation.objects.get_or_create(
            member=member, annee=timezone.now().year,
            defaults={"montant": member.montant_adhesion}
        )
        # Notification in-app
        Notification.objects.create(
            member=member,
            type=Notification.Type.ADHESION,
            titre="Adhésion validée !",
            message=f"Félicitations ! Votre adhésion au REMEHBS a été validée. Bienvenue {member.prenom} !",
            lien="/espace-membre",
        )
        return Response({"message": f"Membre {member.numero_membre} validé."})

    @action(detail=True, methods=["post"], url_path="suspendre")
    def suspendre(self, request, pk=None):
        """Suspendre un membre actif"""
        member = self.get_object()
        if member.statut == Member.Statut.SUSPENDU:
            return Response({"error": "Ce membre est déjà suspendu."}, status=400)
        member.statut = Member.Statut.SUSPENDU
        member.save()
        return Response({"message": f"Membre {member.numero_membre} suspendu."})

    @action(detail=True, methods=["post"], url_path="reactiver")
    def reactiver(self, request, pk=None):
        """Réactiver un membre suspendu"""
        member = self.get_object()
        if member.statut != Member.Statut.SUSPENDU:
            return Response({"error": "Ce membre n'est pas suspendu."}, status=400)
        member.statut = Member.Statut.ACTIF
        member.save()
        return Response({"message": f"Membre {member.numero_membre} réactivé."})

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        """Statistiques globales"""
        total       = Member.objects.count()
        actifs      = Member.objects.filter(statut="actif").count()
        en_attente  = Member.objects.filter(statut="en_attente").count()
        year        = timezone.now().year
        cotis_payees = Cotisation.objects.filter(annee=year, statut="paye").count()
        return Response({
            "total_membres": total,
            "membres_actifs": actifs,
            "en_attente_validation": en_attente,
            "cotisations_payees_cette_annee": cotis_payees,
        })

    @action(detail=False, methods=["get"], url_path="export")
    def export_csv(self, request):
        rows = self.filter_queryset(self.get_queryset())
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = (
            f'attachment; filename="membres_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        )

        writer = csv.writer(response)
        writer.writerow([
            "numero_membre", "nom", "prenom", "email", "telephone",
            "categorie", "role", "statut", "profession", "structure",
            "ville", "province", "date_adhesion",
        ])
        for member in rows:
            writer.writerow([
                member.numero_membre,
                member.nom,
                member.prenom,
                member.email,
                member.telephone,
                member.categorie,
                member.role,
                member.statut,
                member.profession,
                member.structure,
                member.ville,
                member.province,
                member.date_adhesion or "",
            ])
        return response


class CotisationViewSet(viewsets.ModelViewSet):
    """Gestion des cotisations"""
    queryset           = Cotisation.objects.select_related("member")
    serializer_class   = CotisationSerializer
    permission_classes = [IsStaffOrMemberRole]
    allowed_member_roles = [Member.Role.BUREAU, Member.Role.TRESORIER]
    filterset_fields   = ["statut", "annee", "mode_paiement"]
    search_fields      = ["member__nom", "member__prenom", "member__numero_membre", "reference"]
    ordering_fields    = ["annee", "created_at", "montant"]

    @action(detail=True, methods=["post"], url_path="marquer-paye")
    def marquer_paye(self, request, pk=None):
        """Marquer manuellement une cotisation comme payée (paiement espèces/virement)"""
        cotisation = self.get_object()
        cotisation.statut        = Cotisation.Statut.PAYE
        cotisation.paid_at       = timezone.now()
        cotisation.mode_paiement = request.data.get("mode_paiement", Cotisation.ModePaiement.ESPECES)
        cotisation.reference     = request.data.get("reference", "")
        cotisation.save()
        return Response({"message": "Cotisation marquée comme payée."})

    @action(detail=False, methods=["get"], url_path="export")
    def export_csv(self, request):
        rows = self.filter_queryset(self.get_queryset())
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = (
            f'attachment; filename="cotisations_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        )

        writer = csv.writer(response)
        writer.writerow([
            "member_numero", "member_nom", "member_prenom", "annee",
            "montant", "statut", "mode_paiement", "reference", "paid_at",
        ])
        for cotisation in rows:
            writer.writerow([
                cotisation.member.numero_membre,
                cotisation.member.nom,
                cotisation.member.prenom,
                cotisation.annee,
                cotisation.montant,
                cotisation.statut,
                cotisation.mode_paiement,
                cotisation.reference,
                cotisation.paid_at or "",
            ])
        return response


class MesCotisationsView(generics.ListAPIView):
    """GET /api/members/mes-cotisations/ — Cotisations du membre connecté"""
    serializer_class   = CotisationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.member_profile.cotisations.all()


class AnnuaireView(generics.ListAPIView):
    """GET /api/members/annuaire/ — Liste publique des membres actifs"""
    serializer_class   = MemberPublicSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields   = ["categorie", "ville"]
    search_fields      = ["nom", "prenom", "structure", "profession"]

    def get_queryset(self):
        return Member.objects.filter(statut=Member.Statut.ACTIF)


class AttestationView(generics.GenericAPIView):
    """GET /api/members/attestation/ — Génère une attestation PDF"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        member = request.user.member_profile
        if not member.est_a_jour:
            return Response(
                {"error": "Votre cotisation n'est pas à jour."},
                status=status.HTTP_403_FORBIDDEN,
            )

        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas as pdf_canvas
        from io import BytesIO

        buf = BytesIO()
        c = pdf_canvas.Canvas(buf, pagesize=A4)
        w, h = A4

        # Header
        c.setFont("Helvetica-Bold", 22)
        c.drawCentredString(w / 2, h - 80, "REMEHBS")
        c.setFont("Helvetica", 11)
        c.drawCentredString(w / 2, h - 100, "Réseau Mère Enfant des Hauts-Bassins")

        # Title
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredString(w / 2, h - 160, "ATTESTATION D'ADHÉSION")

        # Body
        c.setFont("Helvetica", 12)
        year = timezone.now().year
        lines = [
            f"Je soussigné, le Président du REMEHBS, atteste que :",
            "",
            f"    {member.nom_complet}",
            f"    N° membre : {member.numero_membre}",
            f"    Catégorie : {member.get_categorie_display()}",
            f"    Profession : {member.profession}",
            f"    Structure : {member.structure or '—'}",
            "",
            f"est membre actif du Réseau Mère Enfant des Hauts-Bassins",
            f"et est à jour de sa cotisation pour l'année {year}.",
            "",
            f"Bobo-Dioulasso, le {timezone.now().strftime('%d/%m/%Y')}",
            "",
            "",
            "Le Président du REMEHBS",
        ]
        y = h - 210
        for line in lines:
            c.drawString(72, y, line)
            y -= 20

        c.showPage()
        c.save()
        buf.seek(0)

        response = HttpResponse(buf.read(), content_type="application/pdf")
        response["Content-Disposition"] = (
            f'attachment; filename="attestation_{member.numero_membre}_{year}.pdf"'
        )
        return response


class NotificationListView(generics.ListAPIView):
    """GET /api/members/notifications/ — Notifications du membre connecté"""
    serializer_class   = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.member_profile.notifications.all()[:50]


class NotificationCountView(generics.GenericAPIView):
    """GET /api/members/notifications/count/ — Nombre de notifications non lues"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = request.user.member_profile.notifications.filter(lue=False).count()
        return Response({"non_lues": count})


class NotificationMarkReadView(generics.GenericAPIView):
    """POST /api/members/notifications/marquer-lues/ — Marquer toutes les notifications comme lues"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        ids = request.data.get("ids", [])
        qs = request.user.member_profile.notifications.filter(lue=False)
        if ids:
            qs = qs.filter(id__in=ids)
        updated = qs.update(lue=True)
        return Response({"message": f"{updated} notification(s) marquée(s) comme lue(s)."})
