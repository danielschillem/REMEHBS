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
