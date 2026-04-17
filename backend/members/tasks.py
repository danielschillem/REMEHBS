"""
REMEHBS — Tâches Celery pour les membres
"""
import logging
from celery import shared_task
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def envoyer_email_confirmation_adhesion(self, member_id: int):
    """Envoyer un e-mail de confirmation après adhésion."""
    from members.models import Member
    from remehbs_api.email_service import send_email
    from remehbs_api.email_templates import confirmation_adhesion

    try:
        member = Member.objects.get(pk=member_id)
    except Member.DoesNotExist:
        logger.error("Member %d introuvable pour email adhésion", member_id)
        return

    subject, html = confirmation_adhesion(member.nom_complet, member.numero_membre)
    ok = send_email(to=[member.email], subject=subject, html=html)
    if not ok:
        raise self.retry(exc=Exception("Échec envoi email adhésion"))


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def envoyer_email_confirmation_paiement(self, member_id: int, montant: int, annee: int, reference: str):
    """Envoyer un e-mail de confirmation après paiement."""
    from members.models import Member
    from remehbs_api.email_service import send_email
    from remehbs_api.email_templates import confirmation_paiement

    try:
        member = Member.objects.get(pk=member_id)
    except Member.DoesNotExist:
        logger.error("Member %d introuvable pour email paiement", member_id)
        return

    subject, html = confirmation_paiement(
        member.nom_complet, member.numero_membre, montant, annee, reference,
    )
    ok = send_email(to=[member.email], subject=subject, html=html)
    if not ok:
        raise self.retry(exc=Exception("Échec envoi email paiement"))


@shared_task
def rappel_cotisations():
    """Tâche périodique : envoyer un rappel aux membres actifs dont la cotisation n'est pas payée."""
    from members.models import Member, Cotisation
    from remehbs_api.email_service import send_email
    from remehbs_api.email_templates import rappel_cotisation

    year = timezone.now().year
    membres_actifs = Member.objects.filter(statut=Member.Statut.ACTIF)
    count = 0

    for member in membres_actifs:
        cotis = member.cotisations.filter(annee=year).first()
        # Envoyer rappel si pas de cotisation ou cotisation impayée / en attente
        if cotis is None or cotis.statut in (Cotisation.Statut.EN_ATTENTE, Cotisation.Statut.IMPAYE):
            subject, html = rappel_cotisation(
                member.nom_complet,
                member.numero_membre,
                year,
                member.montant_adhesion,
                settings.FRONTEND_URL,
            )
            send_email(to=[member.email], subject=subject, html=html)
            count += 1

    logger.info("Rappels cotisation envoyés : %d", count)
    return count
