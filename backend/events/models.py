from django.db import models
from members.models import Member


class Event(models.Model):
    titre       = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    lieu        = models.CharField(max_length=200, verbose_name="Lieu")
    date_debut  = models.DateTimeField(verbose_name="Date de début")
    date_fin    = models.DateTimeField(verbose_name="Date de fin")
    est_actif   = models.BooleanField(default=True, verbose_name="Actif")
    programme   = models.TextField(blank=True, verbose_name="Programme détaillé")
    intervenants = models.TextField(blank=True, verbose_name="Intervenants (un par ligne)")
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = "Événement"
        verbose_name_plural = "Événements"
        ordering            = ["-date_debut"]

    def __str__(self):
        return self.titre


class EventRegistration(models.Model):
    class TypeParticipation(models.TextChoices):
        PARTICIPANT  = "participant",  "Participant"
        COMMUNICANT  = "communicant",  "Communicant"
        ATELIER      = "atelier",      "Atelier pratique"

    class Statut(models.TextChoices):
        EN_ATTENTE = "en_attente", "En attente"
        CONFIRME   = "confirme",   "Confirmé"
        ANNULE     = "annule",     "Annulé"

    event              = models.ForeignKey(Event, on_delete=models.CASCADE,
                                            related_name="registrations", verbose_name="Événement")
    member             = models.ForeignKey(Member, on_delete=models.CASCADE,
                                            related_name="event_registrations", verbose_name="Membre",
                                            null=True, blank=True)
    # Infos si non-membre
    nom                = models.CharField(max_length=100, verbose_name="Nom")
    prenom             = models.CharField(max_length=100, verbose_name="Prénom")
    email              = models.EmailField(verbose_name="E-mail")
    telephone          = models.CharField(max_length=20, blank=True)
    institution        = models.CharField(max_length=200, blank=True)
    type_participation = models.CharField(max_length=20, choices=TypeParticipation.choices,
                                           default=TypeParticipation.PARTICIPANT)
    titre_communication = models.CharField(max_length=300, blank=True, verbose_name="Titre communication")
    statut             = models.CharField(max_length=20, choices=Statut.choices, default=Statut.EN_ATTENTE)
    created_at         = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = "Inscription événement"
        verbose_name_plural = "Inscriptions événements"
        ordering            = ["-created_at"]

    def __str__(self):
        return f"{self.nom} {self.prenom} — {self.event.titre}"


class Abstract(models.Model):
    """Soumission de résumé / communication pour un événement."""
    class TypeSoumission(models.TextChoices):
        COMMUNICATION_ORALE = "orale",    "Communication orale"
        POSTER              = "poster",   "Poster"
        ATELIER             = "atelier",  "Atelier"

    class Statut(models.TextChoices):
        SOUMIS   = "soumis",   "Soumis"
        ACCEPTE  = "accepte",  "Accepté"
        REFUSE   = "refuse",   "Refusé"
        REVISION = "revision", "En révision"

    event       = models.ForeignKey(Event, on_delete=models.CASCADE,
                                     related_name="abstracts", verbose_name="Événement")
    auteur_nom  = models.CharField(max_length=150, verbose_name="Nom de l'auteur")
    auteur_email = models.EmailField(verbose_name="E-mail de l'auteur")
    co_auteurs  = models.TextField(blank=True, verbose_name="Co-auteurs (un par ligne)")
    titre       = models.CharField(max_length=300, verbose_name="Titre du résumé")
    type_soumission = models.CharField(max_length=20, choices=TypeSoumission.choices,
                                        default=TypeSoumission.COMMUNICATION_ORALE)
    resume_texte = models.TextField(verbose_name="Résumé (texte)")
    fichier      = models.FileField(upload_to="abstracts/%Y/", blank=True,
                                     verbose_name="Fichier (PDF)")
    mots_cles    = models.CharField(max_length=300, blank=True, verbose_name="Mots-clés")
    statut       = models.CharField(max_length=20, choices=Statut.choices, default=Statut.SOUMIS)
    commentaire_comite = models.TextField(blank=True, verbose_name="Commentaire du comité")
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = "Résumé / Communication"
        verbose_name_plural = "Résumés / Communications"
        ordering            = ["-created_at"]

    def __str__(self):
        return f"{self.titre} — {self.auteur_nom}"


class CommunicationScientifique(models.Model):
    """Communication scientifique approuvée lors d'un congrès REMEHBS."""

    class TypePresentation(models.TextChoices):
        COMMUNICATION = "communication", "Communication orale"
        POSTER        = "poster",        "Poster"
        CONFERENCE    = "conference",    "Conférence / Panel / Symposium"

    class Theme(models.TextChoices):
        COMMUNICATION_LIBRE        = "communication_libre",        "Communication libre"
        DISPONIBILITE_ACCESSIBILITE = "disponibilite_accessibilite", "Disponibilité et accessibilité de l'offre de santé"
        ETHIQUE_QUALITE            = "ethique_qualite",            "Éthique et qualité des soins"
        GESTION_STRUCTURES         = "gestion_structures",         "Gestion des structures de soins"
        NUMERIQUE_SANTE            = "numerique_sante",            "Numérique et santé maternelle et infantile"
        NUTRITION                  = "nutrition",                  "Nutrition maternelle et infantile"
        PLANIFICATION_FAMILIALE    = "planification_familiale",    "Planification familiale"
        SANTE_MENTALE              = "sante_mentale",              "Santé mentale du couple mère-enfant"
        SOINS_NOUVEAU_NE           = "soins_nouveau_ne",           "Soins au nouveau-né (SMK, SENN…)"
        SOINS_OBSTETRICAUX_SONU    = "soins_obstetricaux_sonu",    "Soins obstétricaux et néonatals d'urgence (SONU)"
        VACCINATION                = "vaccination",                "Vaccination de l'enfant et de la femme enceinte"

    titre            = models.CharField(max_length=500, verbose_name="Titre")
    auteur           = models.CharField(max_length=300, verbose_name="Auteur(s)")
    type_presentation = models.CharField(max_length=20, choices=TypePresentation.choices,
                                          default=TypePresentation.COMMUNICATION,
                                          verbose_name="Type de présentation")
    theme            = models.CharField(max_length=50, choices=Theme.choices,
                                         default=Theme.COMMUNICATION_LIBRE, verbose_name="Thème")
    fichier          = models.FileField(upload_to="publications/", blank=True,
                                         verbose_name="Fichier PDF")
    date_soumission  = models.DateField(null=True, blank=True, verbose_name="Date de soumission")
    congres          = models.CharField(max_length=200, blank=True,
                                         verbose_name="Congrès / Édition",
                                         default="7èmes JSP REMEHBS 2025")
    ordre            = models.PositiveSmallIntegerField(default=0, verbose_name="Ordre d'affichage")
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = "Communication scientifique"
        verbose_name_plural = "Communications scientifiques"
        ordering            = ["theme", "ordre", "auteur"]

    def __str__(self):
        return f"[{self.get_theme_display()}] {self.titre}"
