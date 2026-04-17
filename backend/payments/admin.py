from django.contrib import admin
from django.utils.html import format_html
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display  = ["transaction_id", "member", "montant_display",
                     "statut_badge", "objet", "created_at"]
    list_filter   = ["statut", "annee_cotisation", "created_at"]
    search_fields = ["transaction_id", "member__nom", "member__prenom", "member__numero_membre"]
    readonly_fields = ["transaction_id", "cinetpay_payment_token", "payload_cinetpay",
                       "payment_url", "created_at", "updated_at"]
    ordering = ["-created_at"]

    def montant_display(self, obj):
        return f"{obj.montant:,} FCFA"
    montant_display.short_description = "Montant"

    def statut_badge(self, obj):
        colors = {
            "succes":  "#28a745",
            "initie":  "#007bff",
            "attente": "#ffc107",
            "echec":   "#dc3545",
            "annule":  "#6c757d",
        }
        color = colors.get(obj.statut, "#6c757d")
        return format_html(
            '<span style="background:{};color:#fff;padding:3px 10px;'
            'border-radius:12px;font-size:12px;font-weight:600;">{}</span>',
            color, obj.get_statut_display()
        )
    statut_badge.short_description = "Statut"
