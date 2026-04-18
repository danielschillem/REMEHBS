from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView
import logging

logger = logging.getLogger(__name__)


class LoginView(TokenObtainPairView):
    """POST /api/auth/login/ — Génère un couple access/refresh JWT"""
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_login"


# ── Logout (blacklist refresh token) ──────────
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class LogoutView(generics.GenericAPIView):
    """POST /api/auth/logout/ — Blacklist le refresh token"""
    serializer_class = LogoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            token = RefreshToken(serializer.validated_data["refresh"])
            token.blacklist()
        except Exception:
            pass
        return Response({"message": "Déconnexion réussie."}, status=status.HTTP_200_OK)


# ── Password Reset Request ───────────────────
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetRequestView(generics.GenericAPIView):
    """POST /api/auth/password-reset/ — Envoie un lien de réinitialisation"""
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_password_reset"

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        # Always return success to prevent email enumeration
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_url = f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"

            # Try sending via Resend if configured
            if settings.RESEND_API_KEY:
                try:
                    import resend
                    resend.api_key = settings.RESEND_API_KEY
                    resend.Emails.send({
                        "from": settings.EMAIL_FROM,
                        "to": email,
                        "subject": "REMEHBS — Réinitialisation de votre mot de passe",
                        "html": (
                            f"<p>Bonjour {user.first_name},</p>"
                            f"<p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>"
                            f'<p><a href="{reset_url}">{reset_url}</a></p>'
                            f"<p>Ce lien expire dans 24 heures.</p>"
                            f"<p>— L'équipe REMEHBS</p>"
                        ),
                    })
                except Exception as e:
                    logger.warning("Email sending failed: %s", e)
            else:
                logger.info("Password reset link for %s: %s", email, reset_url)
        except User.DoesNotExist:
            pass

        return Response({
            "message": "Si un compte existe avec cet e-mail, un lien de réinitialisation a été envoyé."
        })


# ── Password Reset Confirm ───────────────────
class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(min_length=8)


class PasswordResetConfirmView(generics.GenericAPIView):
    """POST /api/auth/password-reset-confirm/ — Confirme le reset"""
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = force_str(urlsafe_base64_decode(serializer.validated_data["uid"]))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response(
                {"error": "Lien invalide ou expiré."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, serializer.validated_data["token"]):
            return Response(
                {"error": "Lien invalide ou expiré."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data["password"])
        user.save()
        return Response({"message": "Mot de passe réinitialisé avec succès."})
