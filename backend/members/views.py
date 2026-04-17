from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.http import HttpResponse
from .models import Member, Cotisation
from .serializers import MemberSerializer, AdhesionSerializer, CotisationSerializer, MemberPublicSerializer


class AdhesionView(generics.CreateAPIView):
    """POST /api/members/adhesion/ — Soumettre une demande d'adhésion"""
    serializer_class   = AdhesionSerializer
    permission_classes = [permissions.AllowAny]

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

    def get_object(self):
        return self.request.user.member_profile


class MemberViewSet(viewsets.ModelViewSet):
    """CRUD complet membres — réservé admin"""
    queryset           = Member.objects.select_related("user").prefetch_related("cotisations")
    serializer_class   = MemberSerializer
    permission_classes = [permissions.IsAdminUser]
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


class CotisationViewSet(viewsets.ModelViewSet):
    """Gestion des cotisations"""
    queryset           = Cotisation.objects.select_related("member")
    serializer_class   = CotisationSerializer
    permission_classes = [permissions.IsAdminUser]
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
