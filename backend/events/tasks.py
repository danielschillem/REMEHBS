from celery import shared_task

from remehbs_api.email_service import send_email
from remehbs_api.email_templates import (
    confirmation_inscription_evenement,
    confirmation_soumission_abstract,
)
from .models import EventRegistration, Abstract


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def envoyer_email_confirmation_inscription_event(self, registration_id: int):
    try:
        registration = EventRegistration.objects.select_related("event").get(pk=registration_id)
    except EventRegistration.DoesNotExist:
        return

    subject, html = confirmation_inscription_evenement(
        participant_nom=f"{registration.prenom} {registration.nom}",
        event_titre=registration.event.titre,
        date_debut=registration.event.date_debut.strftime("%d/%m/%Y %H:%M"),
        lieu=registration.event.lieu,
    )
    ok = send_email(to=[registration.email], subject=subject, html=html)
    if not ok:
        raise self.retry(exc=Exception("Echec envoi email inscription evenement"))


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def envoyer_email_confirmation_abstract(self, abstract_id: int):
    try:
        abstract = Abstract.objects.select_related("event").get(pk=abstract_id)
    except Abstract.DoesNotExist:
        return

    subject, html = confirmation_soumission_abstract(
        auteur_nom=abstract.auteur_nom,
        event_titre=abstract.event.titre,
        abstract_titre=abstract.titre,
    )
    ok = send_email(to=[abstract.auteur_email], subject=subject, html=html)
    if not ok:
        raise self.retry(exc=Exception("Echec envoi email abstract"))
