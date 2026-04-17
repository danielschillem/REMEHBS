from django.contrib import admin
from django.utils.html import format_html
from .models import Event, EventRegistration, Abstract


class EventRegistrationInline(admin.TabularInline):
    model  = EventRegistration
    extra  = 0
    fields = ["nom", "prenom", "email", "type_participation", "statut"]


class AbstractInline(admin.TabularInline):
    model  = Abstract
    extra  = 0
    fields = ["titre", "auteur_nom", "type_soumission", "statut"]


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display    = ["titre", "lieu", "date_debut", "date_fin", "nb_inscrits", "nb_abstracts", "est_actif"]
    list_filter     = ["est_actif", "date_debut"]
    search_fields   = ["titre", "lieu"]
    inlines         = [EventRegistrationInline, AbstractInline]

    def nb_inscrits(self, obj):
        return obj.registrations.filter(statut="confirme").count()
    nb_inscrits.short_description = "Inscrits confirmés"

    def nb_abstracts(self, obj):
        return obj.abstracts.count()
    nb_abstracts.short_description = "Résumés"


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display  = ["nom", "prenom", "email", "event", "type_participation", "statut_badge", "created_at"]
    list_filter   = ["statut", "type_participation", "event"]
    search_fields = ["nom", "prenom", "email", "institution"]

    def statut_badge(self, obj):
        colors = {"confirme": "#28a745", "en_attente": "#ffc107", "annule": "#dc3545"}
        color  = colors.get(obj.statut, "#6c757d")
        return format_html(
            '<span style="background:{};color:#fff;padding:3px 10px;'
            'border-radius:12px;font-size:12px;font-weight:600;">{}</span>',
            color, obj.get_statut_display()
        )
    statut_badge.short_description = "Statut"


@admin.register(Abstract)
class AbstractAdmin(admin.ModelAdmin):
    list_display  = ["titre", "auteur_nom", "event", "type_soumission", "statut", "created_at"]
    list_filter   = ["statut", "type_soumission", "event"]
    search_fields = ["titre", "auteur_nom", "auteur_email", "mots_cles"]
