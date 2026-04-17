from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from .auth_views import PasswordResetRequestView, PasswordResetConfirmView, LogoutView

# ── Personnalisation de l'admin Django ──────────
admin.site.site_header  = "REMEHBS — Administration"
admin.site.site_title   = "REMEHBS Admin"
admin.site.index_title  = "Tableau de bord"

urlpatterns = [
    # Admin Django
    path("admin/", admin.site.urls),

    # Auth JWT
    path("api/auth/login/",   TokenObtainPairView.as_view(),  name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(),     name="token_refresh"),
    path("api/auth/logout/",  LogoutView.as_view(),           name="token_logout"),

    # Password reset
    path("api/auth/password-reset/",         PasswordResetRequestView.as_view(), name="password_reset"),
    path("api/auth/password-reset-confirm/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),

    # Apps REMEHBS
    path("api/members/",  include("members.urls")),
    path("api/payments/", include("payments.urls")),
    path("api/events/",   include("events.urls")),

    # Swagger / OpenAPI
    path("api/schema/",       SpectacularAPIView.as_view(),        name="schema"),
    path("api/docs/",         SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
