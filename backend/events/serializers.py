from rest_framework import serializers
from .models import Event, EventRegistration, Abstract


class EventListSerializer(serializers.ModelSerializer):
    nb_inscrits = serializers.SerializerMethodField()

    class Meta:
        model  = Event
        fields = ["id", "titre", "description", "lieu", "date_debut", "date_fin",
                  "est_actif", "nb_inscrits"]

    def get_nb_inscrits(self, obj):
        return obj.registrations.count()


class EventDetailSerializer(serializers.ModelSerializer):
    nb_inscrits   = serializers.SerializerMethodField()
    intervenants_list = serializers.SerializerMethodField()

    class Meta:
        model  = Event
        fields = ["id", "titre", "description", "lieu", "date_debut", "date_fin",
                  "est_actif", "programme", "intervenants", "intervenants_list",
                  "nb_inscrits"]

    def get_nb_inscrits(self, obj):
        return obj.registrations.count()

    def get_intervenants_list(self, obj):
        if not obj.intervenants:
            return []
        return [l.strip() for l in obj.intervenants.splitlines() if l.strip()]


class EventRegistrationSerializer(serializers.ModelSerializer):
    event_titre = serializers.CharField(source="event.titre", read_only=True)

    class Meta:
        model  = EventRegistration
        fields = ["id", "event", "event_titre", "nom", "prenom", "email", "telephone",
                  "institution", "type_participation", "titre_communication",
                  "statut", "created_at"]
        read_only_fields = ["id", "statut", "created_at"]


class AbstractSerializer(serializers.ModelSerializer):
    event_titre = serializers.CharField(source="event.titre", read_only=True)

    class Meta:
        model  = Abstract
        fields = ["id", "event", "event_titre", "auteur_nom", "auteur_email",
                  "co_auteurs", "titre", "type_soumission", "resume_texte",
                  "fichier", "mots_cles", "statut", "created_at"]
        read_only_fields = ["id", "statut", "created_at"]
