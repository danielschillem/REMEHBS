"""
REMEHBS — Service d'envoi d'e-mails via Resend
"""
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


def send_email(*, to: list[str], subject: str, html: str) -> bool:
    """Envoyer un email via Resend. Retourne True si succès."""
    api_key = getattr(settings, "RESEND_API_KEY", "")
    if not api_key:
        logger.warning("RESEND_API_KEY non configurée — email non envoyé à %s", to)
        return False

    import resend
    resend.api_key = api_key

    try:
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": to,
            "subject": subject,
            "html": html,
        })
        logger.info("Email envoyé à %s : %s", to, subject)
        return True
    except Exception:
        logger.exception("Erreur envoi email à %s", to)
        return False
