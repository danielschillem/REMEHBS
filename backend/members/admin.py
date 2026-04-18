from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import Member, Cotisation, Notification


class CotisationInline(admin.TabularInline):
    model       = Cotisation
    extra       = 0
    fields      = ["annee", "montant", "statut", "mode_paiement", "reference", "paid_at"]
    readonly_fields = ["paid_at"]
    can_delete  = False


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display    = ["numero_membre", "nom_complet_display", "categorie", "role",
                       "statut_badge", "est_a_jour_display", "structure", "created_at"]
    list_filter     = ["categorie", "role", "statut", "ville", "created_at"]
    search_fields   = ["nom", "prenom", "email", "numero_membre", "structure", "telephone"]
    readonly_fields = ["numero_membre", "created_at", "updated_at"]
    ordering        = ["-created_at"]
    inlines         = [CotisationInline]
    actions         = ["valider_membres", "suspendre_membres"]

    fieldsets = (
        ("Identification", {
            "fields": ("numero_membre", "user", "role", "statut", "date_adhesion")
        }),
        ("Identité", {
            "fields": (("nom", "prenom"), "email", "telephone", "date_naissance")
        }),
        ("Profil professionnel", {
            "fields": ("profession", "specialite", "structure", ("ville", "province"))
        }),
        ("Adhésion", {
            "fields": ("categorie", "message")
        }),
        ("Métadonnées", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )

    def nom_complet_display(self, obj):
        return obj.nom_complet
    nom_complet_display.short_description = "Nom complet"

    def statut_badge(self, obj):
        colors = {
            "actif":      "#28a745",
            "en_attente": "#ffc107",
            "suspendu":   "#fd7e14",
            "radie":      "#dc3545",
        }
        color = colors.get(obj.statut, "#6c757d")
        return format_html(
            '<span style="background:{};color:#fff;padding:3px 10px;'
            'border-radius:12px;font-size:12px;font-weight:600;">{}</span>',
            color, obj.get_statut_display()
        )
    statut_badge.short_description = "Statut"

    def est_a_jour_display(self, obj):
        if obj.est_a_jour:
            return format_html('<span style="color:#28a745;font-weight:700;">✓ À jour</span>')
        return format_html('<span style="color:#dc3545;font-weight:700;">✗ Impayé</span>')
    est_a_jour_display.short_description = f"Cotisation {timezone.now().year}"

    @admin.action(description="Valider les membres sélectionnés")
    def valider_membres(self, request, queryset):
        count = 0
        for member in queryset.filter(statut="en_attente"):
            member.statut        = Member.Statut.ACTIF
            member.date_adhesion = timezone.now().date()
            member.save()
            Cotisation.objects.get_or_create(
                member=member, annee=timezone.now().year,
                defaults={"montant": member.montant_adhesion}
            )
            count += 1
        self.message_user(request, f"{count} membre(s) validé(s) avec succès.")

    @admin.action(description="Suspendre les membres sélectionnés")
    def suspendre_membres(self, request, queryset):
        updated = queryset.filter(statut="actif").update(statut=Member.Statut.SUSPENDU)
        self.message_user(request, f"{updated} membre(s) suspendu(s).")


@admin.register(Cotisation)
class CotisationAdmin(admin.ModelAdmin):
    list_display  = ["member", "annee", "montant_display", "statut_badge",
                     "mode_paiement", "reference", "paid_at"]
    list_filter   = ["statut", "annee", "mode_paiement"]
    search_fields = ["member__nom", "member__prenom", "member__numero_membre", "reference"]
    ordering      = ["-annee", "member__nom"]
    actions       = ["marquer_paye"]

    def montant_display(self, obj):
        return f"{obj.montant:,} FCFA"
    montant_display.short_description = "Montant"

    def statut_badge(self, obj):
        colors = {
            "paye":       "#28a745",
            "en_attente": "#ffc107",
            "impaye":     "#dc3545",
            "annule":     "#6c757d",
        }
        color = colors.get(obj.statut, "#6c757d")
        return format_html(
            '<span style="background:{};color:#fff;padding:3px 10px;'
            'border-radius:12px;font-size:12px;font-weight:600;">{}</span>',
            color, obj.get_statut_display()
        )
    statut_badge.short_description = "Statut"

    @admin.action(description="Marquer comme payé (espèces)")
    def marquer_paye(self, request, queryset):
        updated = queryset.exclude(statut="paye").update(
            statut=Cotisation.Statut.PAYE,
            mode_paiement=Cotisation.ModePaiement.ESPECES,
            paid_at=timezone.now()
        )
        self.message_user(request, f"{updated} cotisation(s) marquée(s) comme payée(s).")


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display  = ["member", "type", "titre", "lue", "created_at"]
    list_filter   = ["type", "lue", "created_at"]
    search_fields = ["titre", "message", "member__nom", "member__prenom"]
    ordering      = ["-created_at"]
    readonly_fields = ["created_at"]
