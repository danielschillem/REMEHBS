from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from django.http import HttpResponse
from django.utils import timezone
import csv
from .models import Event, EventRegistration, Abstract, CommunicationScientifique
from .serializers import (
    EventListSerializer,
    EventDetailSerializer,
    EventRegistrationSerializer,
    AdminEventRegistrationSerializer,
    AbstractSerializer,
    AdminAbstractSerializer,
    CommunicationScientifiqueSerializer,
)
from members.models import Member
from members.permissions import IsStaffOrMemberRole


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/events/ — Liste + détail des événements actifs (public)"""
    queryset           = Event.objects.filter(est_actif=True)
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return EventDetailSerializer
        return EventListSerializer


class AdminEventViewSet(viewsets.ModelViewSet):
    """CRUD complet événements — réservé admin"""
    queryset           = Event.objects.all()
    permission_classes = [IsStaffOrMemberRole]
    allowed_member_roles = [Member.Role.BUREAU]
    filterset_fields   = ["est_actif"]
    search_fields      = ["titre", "lieu"]

    def get_serializer_class(self):
        if self.action in ("list",):
            return EventListSerializer
        return EventDetailSerializer


class EventRegistrationViewSet(viewsets.ModelViewSet):
    """POST /api/events/inscriptions/ — Inscription à un événement"""
    queryset           = EventRegistration.objects.all()
    serializer_class   = EventRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names  = ["post", "head", "options"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reg = serializer.save()
        from .tasks import envoyer_email_confirmation_inscription_event
        envoyer_email_confirmation_inscription_event.delay(reg.id)
        return Response({
            "message": "Inscription enregistrée. Vous recevrez une confirmation par e-mail.",
            "id": reg.id,
        }, status=status.HTTP_201_CREATED)


class AbstractViewSet(viewsets.ModelViewSet):
    """POST /api/events/abstracts/ — Soumission de résumé/communication"""
    queryset           = Abstract.objects.all()
    serializer_class   = AbstractSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes     = [MultiPartParser, FormParser]
    http_method_names  = ["post", "head", "options"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        abstract = serializer.save()
        from .tasks import envoyer_email_confirmation_abstract
        envoyer_email_confirmation_abstract.delay(abstract.id)
        return Response({
            "message": "Votre résumé a été soumis avec succès. Le comité scientifique l'examinera.",
            "id": abstract.id,
        }, status=status.HTTP_201_CREATED)


class AdminEventRegistrationViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin: consultation + validation des inscriptions."""
    queryset = EventRegistration.objects.select_related("event")
    serializer_class = AdminEventRegistrationSerializer
    permission_classes = [IsStaffOrMemberRole]
    allowed_member_roles = [Member.Role.BUREAU, Member.Role.COMITE_SCIENTIFIQUE]
    filterset_fields = ["statut", "event", "type_participation"]
    search_fields = ["nom", "prenom", "email", "institution", "event__titre"]
    ordering_fields = ["created_at", "event__date_debut"]

    @action(detail=True, methods=["post"], url_path="confirmer")
    def confirmer(self, request, pk=None):
        registration = self.get_object()
        registration.statut = EventRegistration.Statut.CONFIRME
        registration.save(update_fields=["statut"])
        return Response({"message": "Inscription confirmée."})

    @action(detail=True, methods=["post"], url_path="annuler")
    def annuler(self, request, pk=None):
        registration = self.get_object()
        registration.statut = EventRegistration.Statut.ANNULE
        registration.save(update_fields=["statut"])
        return Response({"message": "Inscription annulée."})

    @action(detail=False, methods=["get"], url_path="export")
    def export_csv(self, request):
        rows = self.filter_queryset(self.get_queryset())
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = (
            f'attachment; filename="inscriptions_evenements_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        )

        writer = csv.writer(response)
        writer.writerow([
            "id", "event", "nom", "prenom", "email", "telephone",
            "institution", "type_participation", "statut", "created_at",
        ])
        for registration in rows:
            writer.writerow([
                registration.id,
                registration.event.titre,
                registration.nom,
                registration.prenom,
                registration.email,
                registration.telephone,
                registration.institution,
                registration.type_participation,
                registration.statut,
                registration.created_at,
            ])
        return response


class AdminAbstractViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin: consultation + modération des abstracts."""
    queryset = Abstract.objects.select_related("event")
    serializer_class = AdminAbstractSerializer
    permission_classes = [IsStaffOrMemberRole]
    allowed_member_roles = [Member.Role.BUREAU, Member.Role.COMITE_SCIENTIFIQUE]
    filterset_fields = ["statut", "event", "type_soumission"]
    search_fields = ["titre", "auteur_nom", "auteur_email", "event__titre", "mots_cles"]
    ordering_fields = ["created_at", "event__date_debut"]

    @action(detail=True, methods=["post"], url_path="statut")
    def statut(self, request, pk=None):
        abstract = self.get_object()
        new_status = request.data.get("statut")
        commentaire = request.data.get("commentaire_comite", "")

        allowed = {
            Abstract.Statut.SOUMIS,
            Abstract.Statut.ACCEPTE,
            Abstract.Statut.REFUSE,
            Abstract.Statut.REVISION,
        }
        if new_status not in allowed:
            return Response({"error": "Statut invalide."}, status=400)

        abstract.statut = new_status
        abstract.commentaire_comite = commentaire
        abstract.save(update_fields=["statut", "commentaire_comite"])
        return Response({"message": "Statut du résumé mis à jour."})


class CommunicationScientifiqueViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/events/publications/ — Bibliothèque des communications scientifiques approuvées."""
    queryset = CommunicationScientifique.objects.all()
    serializer_class = CommunicationScientifiqueSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None  # retourne tout d'un coup (74 items max)

    def get_queryset(self):
        qs = super().get_queryset()
        theme = self.request.query_params.get("theme")
        type_p = self.request.query_params.get("type_presentation")
        search = self.request.query_params.get("search")
        if theme:
            qs = qs.filter(theme=theme)
        if type_p:
            qs = qs.filter(type_presentation=type_p)
        if search:
            from django.db.models import Q
            qs = qs.filter(Q(titre__icontains=search) | Q(auteur__icontains=search))
        return qs
