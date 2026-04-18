from rest_framework import serializers
from django.conf import settings
from .models import Event, EventRegistration, Abstract, CommunicationScientifique


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


class AdminEventRegistrationSerializer(serializers.ModelSerializer):
    event_titre = serializers.CharField(source="event.titre", read_only=True)
    type_participation_display = serializers.CharField(source="get_type_participation_display", read_only=True)
    statut_display = serializers.CharField(source="get_statut_display", read_only=True)

    class Meta:
        model = EventRegistration
        fields = [
            "id", "event", "event_titre", "nom", "prenom", "email", "telephone",
            "institution", "type_participation", "type_participation_display",
            "titre_communication", "statut", "statut_display", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class AbstractSerializer(serializers.ModelSerializer):
    event_titre = serializers.CharField(source="event.titre", read_only=True)

    class Meta:
        model  = Abstract
        fields = ["id", "event", "event_titre", "auteur_nom", "auteur_email",
                  "co_auteurs", "titre", "type_soumission", "resume_texte",
                  "fichier", "mots_cles", "statut", "created_at"]
        read_only_fields = ["id", "statut", "created_at"]

    def validate_fichier(self, value):
        if not value:
            return value

        max_size = getattr(settings, "MAX_ABSTRACT_FILE_SIZE", 10 * 1024 * 1024)
        if value.size > max_size:
            raise serializers.ValidationError(
                f"Le fichier dépasse la taille maximale autorisée ({max_size // (1024 * 1024)} Mo)."
            )

        file_name = (value.name or "").lower()
        if not file_name.endswith(".pdf"):
            raise serializers.ValidationError("Seuls les fichiers PDF sont autorisés.")

        return value


class AdminAbstractSerializer(serializers.ModelSerializer):
    event_titre = serializers.CharField(source="event.titre", read_only=True)
    type_soumission_display = serializers.CharField(source="get_type_soumission_display", read_only=True)
    statut_display = serializers.CharField(source="get_statut_display", read_only=True)

    class Meta:
        model = Abstract
        fields = [
            "id", "event", "event_titre", "auteur_nom", "auteur_email", "co_auteurs",
            "titre", "type_soumission", "type_soumission_display", "resume_texte", "fichier",
            "mots_cles", "statut", "statut_display", "commentaire_comite", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class CommunicationScientifiqueSerializer(serializers.ModelSerializer):
    type_presentation_display = serializers.CharField(
        source="get_type_presentation_display", read_only=True
    )
    theme_display = serializers.CharField(source="get_theme_display", read_only=True)
    fichier_url = serializers.SerializerMethodField()

    annee_congres_display = serializers.CharField(
        source="get_annee_congres_display", read_only=True
    )

    class Meta:
        model = CommunicationScientifique
        fields = [
            "id", "titre", "auteur", "type_presentation", "type_presentation_display",
            "theme", "theme_display", "fichier_url", "date_soumission", "congres",
            "annee_congres", "annee_congres_display", "ordre",
        ]

    def get_fichier_url(self, obj):
        if not obj.fichier:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.fichier.url)
        return obj.fichier.url
