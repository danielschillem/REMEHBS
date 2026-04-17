from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("inscriptions", views.EventRegistrationViewSet, basename="event-registration")
router.register("abstracts",    views.AbstractViewSet,           basename="abstract")
router.register("admin",        views.AdminEventViewSet,         basename="admin-event")
router.register("",             views.EventViewSet,              basename="event")

urlpatterns = [path("", include(router.urls))]
