from django.urls import path
from . import views

urlpatterns = [
    path("initier/",  views.InitierPaiementView.as_view(), name="initier-paiement"),
    path("webhook/",  views.WebhookCinetPayView.as_view(), name="cinetpay-webhook"),
]
