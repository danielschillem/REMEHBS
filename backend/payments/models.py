from django.db import models
from members.models import Member


class Payment(models.Model):
    """Log brut de chaque transaction CinetPay"""

    class Statut(models.TextChoices):
        INITIE  = "initie",  "Initié"
        SUCCES  = "succes",  "Succès"
        ECHEC   = "echec",   "Échec"
        ANNULE  = "annule",  "Annulé"
        ATTENTE = "attente", "En attente"

    member              = models.ForeignKey(Member, on_delete=models.SET_NULL,
                                            null=True, related_name="payments", verbose_name="Membre")
    transaction_id      = models.CharField(max_length=100, unique=True, verbose_name="ID Transaction")
    cinetpay_payment_token = models.CharField(max_length=200, blank=True)
    montant             = models.IntegerField(verbose_name="Montant (FCFA)")
    statut              = models.CharField(max_length=20, choices=Statut.choices,
                                           default=Statut.INITIE, verbose_name="Statut")
    objet               = models.CharField(max_length=200, verbose_name="Objet du paiement")
    annee_cotisation    = models.IntegerField(null=True, blank=True, verbose_name="Année cotisation")
    payload_cinetpay    = models.JSONField(default=dict, blank=True, verbose_name="Réponse CinetPay")
    payment_url         = models.URLField(blank=True, verbose_name="URL de paiement")
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = "Paiement"
        verbose_name_plural = "Paiements"
        ordering            = ["-created_at"]

    def __str__(self):
        return f"{self.transaction_id} — {self.montant} FCFA — {self.get_statut_display()}"
