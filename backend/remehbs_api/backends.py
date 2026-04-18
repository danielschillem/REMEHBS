"""
Backend d'authentification par email pour REMEHBS.
Permet la connexion avec l'adresse email en lieu et place du username.
"""
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailBackend(ModelBackend):
    """Authentifie un utilisateur via son adresse email (insensible à la casse)."""

    def authenticate(self, request, username=None, password=None, **kwargs):
        if not username or not password:
            return None
        try:
            user = User.objects.get(email__iexact=username)
        except User.DoesNotExist:
            return None
        except User.MultipleObjectsReturned:
            # En cas de doublons, on prend le compte le plus récent
            user = User.objects.filter(email__iexact=username).order_by("-date_joined").first()

        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
