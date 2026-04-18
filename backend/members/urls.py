from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("list",        views.MemberViewSet,     basename="member")
router.register("cotisations", views.CotisationViewSet, basename="cotisation")

urlpatterns = [
    path("adhesion/",        views.AdhesionView.as_view(),       name="adhesion"),
    path("moi/",             views.MonProfilView.as_view(),       name="mon-profil"),
    path("mes-cotisations/", views.MesCotisationsView.as_view(), name="mes-cotisations"),
    path("annuaire/",        views.AnnuaireView.as_view(),       name="annuaire"),
    path("attestation/",     views.AttestationView.as_view(),    name="attestation"),
    path("notifications/",           views.NotificationListView.as_view(),     name="notifications"),
    path("notifications/count/",     views.NotificationCountView.as_view(),    name="notifications-count"),
    path("notifications/marquer-lues/", views.NotificationMarkReadView.as_view(), name="notifications-mark-read"),
    path("",                 include(router.urls)),
]
