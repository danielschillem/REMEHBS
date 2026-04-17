from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Member, Cotisation


class CotisationSerializer(serializers.ModelSerializer):
    statut_display       = serializers.CharField(source="get_statut_display", read_only=True)
    mode_paiement_display = serializers.CharField(source="get_mode_paiement_display", read_only=True)
    membre_nom           = serializers.SerializerMethodField()

    class Meta:
        model  = Cotisation
        fields = ["id", "annee", "montant", "statut", "statut_display",
                  "mode_paiement", "mode_paiement_display", "reference",
                  "recu_envoye", "paid_at", "created_at", "membre_nom"]
        read_only_fields = ["id", "created_at"]

    def get_membre_nom(self, obj):
        return f"{obj.member.prenom} {obj.member.nom}" if obj.member else ""


class MemberSerializer(serializers.ModelSerializer):
    cotisations    = CotisationSerializer(many=True, read_only=True)
    est_a_jour     = serializers.BooleanField(read_only=True)
    nom_complet    = serializers.CharField(read_only=True)
    montant_adhesion = serializers.IntegerField(read_only=True)
    statut_display   = serializers.CharField(source="get_statut_display", read_only=True)
    categorie_display = serializers.CharField(source="get_categorie_display", read_only=True)
    is_staff         = serializers.SerializerMethodField()

    class Meta:
        model  = Member
        fields = [
            "id", "numero_membre", "nom", "prenom", "nom_complet",
            "email", "telephone", "date_naissance",
            "profession", "specialite", "structure", "ville", "province",
            "categorie", "categorie_display", "statut", "statut_display",
            "date_adhesion", "message", "montant_adhesion",
            "est_a_jour", "cotisations", "created_at", "updated_at",
            "is_staff",
        ]
        read_only_fields = ["id", "numero_membre", "created_at", "updated_at"]

    def get_is_staff(self, obj):
        return obj.user.is_staff if obj.user else False


class MemberPublicSerializer(serializers.ModelSerializer):
    """Sérialiseur public (sans données sensibles)"""
    nom_complet       = serializers.CharField(read_only=True)
    categorie_display = serializers.CharField(source="get_categorie_display", read_only=True)

    class Meta:
        model  = Member
        fields = ["numero_membre", "nom_complet", "profession",
                  "specialite", "structure", "categorie_display"]


class AdhesionSerializer(serializers.ModelSerializer):
    """Formulaire d'adhésion public"""
    password  = serializers.CharField(write_only=True, required=False)
    password2 = serializers.CharField(write_only=True, required=False)

    class Meta:
        model  = Member
        fields = [
            "nom", "prenom", "email", "telephone", "date_naissance",
            "profession", "specialite", "structure", "ville", "province",
            "categorie", "message", "password", "password2",
        ]

    def validate(self, data):
        pw  = data.get("password")
        pw2 = data.get("password2")
        if pw and pw != pw2:
            raise serializers.ValidationError({"password2": "Les mots de passe ne correspondent pas."})
        return data

    def create(self, validated_data):
        password  = validated_data.pop("password", None)
        validated_data.pop("password2", None)

        # Créer le compte User si mot de passe fourni
        user = None
        if password:
            user = User.objects.create_user(
                username=validated_data["email"],
                email=validated_data["email"],
                password=password,
                first_name=validated_data.get("prenom", ""),
                last_name=validated_data.get("nom", ""),
            )

        member = Member.objects.create(user=user, **validated_data)
        return member
