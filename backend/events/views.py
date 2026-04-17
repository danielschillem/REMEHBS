from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Event, EventRegistration, Abstract
from .serializers import (
    EventListSerializer,
    EventDetailSerializer,
    EventRegistrationSerializer,
    AbstractSerializer,
)


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
    permission_classes = [permissions.IsAdminUser]
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
    http_method_names  = ["post", "get", "head", "options"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reg = serializer.save()
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
    http_method_names  = ["post", "get", "head", "options"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        abstract = serializer.save()
        return Response({
            "message": "Votre résumé a été soumis avec succès. Le comité scientifique l'examinera.",
            "id": abstract.id,
        }, status=status.HTTP_201_CREATED)
