from django.db import models
from django.contrib.auth.models import User


class Member(models.Model):
    """Membre du réseau REMEHBS"""

    class Categorie(models.TextChoices):
        ETUDIANT      = "etudiant",      "Étudiant / Stagiaire"
        PROFESSIONNEL = "professionnel", "Professionnel de Santé"
        INSTITUTION   = "institution",   "Institution / Structure"

    class Statut(models.TextChoices):
        EN_ATTENTE = "en_attente", "En attente de validation"
        ACTIF      = "actif",      "Actif"
        SUSPENDU   = "suspendu",   "Suspendu"
        RADIE      = "radie",      "Radié"

    user            = models.OneToOneField(User, on_delete=models.SET_NULL,
                                           null=True, blank=True, related_name="member_profile")
    numero_membre   = models.CharField(max_length=20, unique=True, editable=False)

    # Identité
    nom             = models.CharField(max_length=100, verbose_name="Nom")
    prenom          = models.CharField(max_length=100, verbose_name="Prénom(s)")
    email           = models.EmailField(unique=True, verbose_name="E-mail")
    telephone       = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    date_naissance  = models.DateField(null=True, blank=True, verbose_name="Date de naissance")

    # Profil professionnel
    profession      = models.CharField(max_length=150, verbose_name="Profession")
    specialite      = models.CharField(max_length=150, blank=True, verbose_name="Spécialité")
    structure       = models.CharField(max_length=200, blank=True, verbose_name="Structure / Établissement")
    ville           = models.CharField(max_length=100, blank=True, verbose_name="Ville")
    province        = models.CharField(max_length=100, blank=True, verbose_name="Province")

    # Adhésion
    categorie       = models.CharField(max_length=20, choices=Categorie.choices,
                                        default=Categorie.PROFESSIONNEL, verbose_name="Catégorie")
    statut          = models.CharField(max_length=20, choices=Statut.choices,
                                        default=Statut.EN_ATTENTE, verbose_name="Statut")
    date_adhesion   = models.DateField(null=True, blank=True, verbose_name="Date d'adhésion")
    message         = models.TextField(blank=True, verbose_name="Message / Motivations")

    created_at      = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at      = models.DateTimeField(auto_now=True, verbose_name="Modifié le")

    class Meta:
        verbose_name        = "Membre"
        verbose_name_plural = "Membres"
        ordering            = ["-created_at"]

    def __str__(self):
        return f"{self.numero_membre} — {self.nom} {self.prenom}"

    def save(self, *args, **kwargs):
        if not self.numero_membre:
            from django.utils import timezone
            year  = timezone.now().year
            count = Member.objects.filter(created_at__year=year).count() + 1
            self.numero_membre = f"RMB-{year}-{count:04d}"
        super().save(*args, **kwargs)

    @property
    def nom_complet(self):
        return f"{self.prenom} {self.nom}"

    @property
    def cotisation_courante(self):
        from django.utils import timezone
        return self.cotisations.filter(annee=timezone.now().year).first()

    @property
    def est_a_jour(self):
        c = self.cotisation_courante
        return c is not None and c.statut == Cotisation.Statut.PAYE

    @property
    def montant_adhesion(self):
        return {
            self.Categorie.ETUDIANT:      2000,
            self.Categorie.PROFESSIONNEL: 5000,
            self.Categorie.INSTITUTION:   25000,
        }.get(self.categorie, 5000)


class Cotisation(models.Model):
    """Cotisation annuelle d'un membre"""

    class Statut(models.TextChoices):
        EN_ATTENTE = "en_attente", "En attente"
        PAYE       = "paye",       "Payé"
        IMPAYE     = "impaye",     "Impayé"
        ANNULE     = "annule",     "Annulé"

    class ModePaiement(models.TextChoices):
        ORANGE_MONEY = "orange_money", "Orange Money"
        MOOV_MONEY   = "moov_money",   "Moov Money"
        WAVE         = "wave",         "Wave"
        VIREMENT     = "virement",     "Virement bancaire"
        ESPECES      = "especes",      "Espèces"

    member        = models.ForeignKey(Member, on_delete=models.CASCADE,
                                      related_name="cotisations", verbose_name="Membre")
    annee         = models.IntegerField(verbose_name="Année")
    montant       = models.IntegerField(verbose_name="Montant (FCFA)")
    statut        = models.CharField(max_length=20, choices=Statut.choices,
                                     default=Statut.EN_ATTENTE, verbose_name="Statut")
    mode_paiement = models.CharField(max_length=20, choices=ModePaiement.choices,
                                     blank=True, verbose_name="Mode de paiement")
    reference     = models.CharField(max_length=100, blank=True, verbose_name="Référence transaction")
    recu_envoye   = models.BooleanField(default=False, verbose_name="Reçu envoyé")
    paid_at       = models.DateTimeField(null=True, blank=True, verbose_name="Payé le")
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = "Cotisation"
        verbose_name_plural = "Cotisations"
        unique_together     = [("member", "annee")]
        ordering            = ["-annee"]

    def __str__(self):
        return f"{self.member.numero_membre} — {self.annee} — {self.get_statut_display()}"
