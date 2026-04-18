"""
REMEHBS — Templates HTML d'e-mails
"""

HEADER = """
<div style="max-width:560px;margin:0 auto;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#1d1e20">
  <div style="background:linear-gradient(135deg,#1B1464,#D4849A);padding:28px 24px;border-radius:14px 14px 0 0;text-align:center">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:.03em">REMEHBS</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,.85);font-size:12px">Réseau Mère Enfant des Hauts-Bassins</p>
  </div>
  <div style="padding:28px 24px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 14px 14px">
"""

FOOTER = """
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 16px">
    <p style="font-size:12px;color:#6b7280;text-align:center;margin:0">
      REMEHBS — Bobo-Dioulasso, Burkina Faso<br>
      <a href="mailto:secretariat@remehbs-bf.org" style="color:#1B1464">secretariat@remehbs-bf.org</a>
    </p>
  </div>
</div>
"""


def confirmation_adhesion(membre_nom: str, numero_membre: str) -> tuple[str, str]:
    """Retourne (subject, html) pour la confirmation d'adhésion."""
    subject = f"REMEHBS — Confirmation de votre adhésion ({numero_membre})"
    html = f"""
{HEADER}
    <h2 style="margin:0 0 12px;font-size:18px;color:#1B1464">Bienvenue, {membre_nom} !</h2>
    <p style="line-height:1.6">
      Votre demande d'adhésion au <strong>Réseau Mère Enfant des Hauts-Bassins</strong>
      a bien été enregistrée.
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr>
        <td style="padding:8px 12px;background:#FFF0F5;border-radius:8px 0 0 8px;font-weight:600;font-size:13px;color:#374151">
          N° membre
        </td>
        <td style="padding:8px 12px;background:#FFF0F5;border-radius:0 8px 8px 0;font-size:13px;color:#1B1464;font-weight:700">
          {numero_membre}
        </td>
      </tr>
    </table>
    <p style="line-height:1.6">
      Votre dossier est en cours de validation par notre bureau. Vous recevrez
      un e-mail dès que votre adhésion sera confirmée.
    </p>
    <p style="line-height:1.6;color:#6b7280;font-size:13px">
      En attendant, conservez votre numéro de membre pour toute correspondance.
    </p>
{FOOTER}
"""
    return subject, html


def confirmation_paiement(
    membre_nom: str,
    numero_membre: str,
    montant: int,
    annee: int,
    reference: str,
) -> tuple[str, str]:
    """Retourne (subject, html) pour la confirmation de paiement."""
    subject = f"REMEHBS — Paiement reçu ({montant} FCFA — {annee})"
    html = f"""
{HEADER}
    <h2 style="margin:0 0 12px;font-size:18px;color:#1B1464">Paiement confirmé</h2>
    <p style="line-height:1.6">
      Bonjour <strong>{membre_nom}</strong>,<br>
      Nous confirmons la réception de votre paiement pour la cotisation REMEHBS.
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">
      <tr>
        <td style="padding:8px 12px;background:#e6f9f0;border-radius:8px 0 0 0;font-weight:600;color:#374151">Montant</td>
        <td style="padding:8px 12px;background:#e6f9f0;border-radius:0 8px 0 0;color:#00b96b;font-weight:700">{montant} FCFA</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;background:#FFF0F5;font-weight:600;color:#374151">Année</td>
        <td style="padding:8px 12px;background:#FFF0F5;color:#1B1464;font-weight:700">{annee}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;background:#e6f9f0;border-radius:0 0 0 8px;font-weight:600;color:#374151">Référence</td>
        <td style="padding:8px 12px;background:#e6f9f0;border-radius:0 0 8px 0;color:#374151">{reference}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;background:#FFF0F5;border-radius:0 0 0 8px;font-weight:600;color:#374151">N° membre</td>
        <td style="padding:8px 12px;background:#FFF0F5;border-radius:0 0 8px 0;color:#1B1464;font-weight:700">{numero_membre}</td>
      </tr>
    </table>
    <p style="line-height:1.6">
      Vous pouvez télécharger votre attestation d'adhésion depuis votre espace membre.
    </p>
{FOOTER}
"""
    return subject, html


def rappel_cotisation(
    membre_nom: str,
    numero_membre: str,
    annee: int,
    montant: int,
    frontend_url: str,
) -> tuple[str, str]:
    """Retourne (subject, html) pour le rappel de cotisation."""
    subject = f"REMEHBS — Rappel de cotisation {annee}"
    html = f"""
{HEADER}
    <h2 style="margin:0 0 12px;font-size:18px;color:#f59e0b">Rappel de cotisation</h2>
    <p style="line-height:1.6">
      Bonjour <strong>{membre_nom}</strong>,<br>
      Nous vous rappelons que votre cotisation REMEHBS pour l'année <strong>{annee}</strong>
      n'a pas encore été réglée.
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">
      <tr>
        <td style="padding:8px 12px;background:#fffbeb;border-radius:8px 0 0 8px;font-weight:600;color:#374151">Montant dû</td>
        <td style="padding:8px 12px;background:#fffbeb;border-radius:0 8px 8px 0;color:#f59e0b;font-weight:700">{montant} FCFA</td>
      </tr>
    </table>
    <div style="text-align:center;margin:24px 0">
      <a href="{frontend_url}/espace-membre/cotisations"
         style="display:inline-block;padding:12px 28px;border-radius:10px;background:#1B1464;color:#fff;text-decoration:none;font-weight:700;font-size:14px">
        Régler ma cotisation
      </a>
    </div>
    <p style="line-height:1.6;color:#6b7280;font-size:13px">
      Si vous avez déjà effectué le paiement, veuillez ignorer ce message.
    </p>
{FOOTER}
"""
    return subject, html


def confirmation_inscription_evenement(
    participant_nom: str,
    event_titre: str,
    date_debut: str,
    lieu: str,
) -> tuple[str, str]:
    """Retourne (subject, html) pour confirmation d'inscription événement."""
    subject = f"REMEHBS — Inscription confirmée: {event_titre}"
    html = f"""
{HEADER}
    <h2 style="margin:0 0 12px;font-size:18px;color:#1B1464">Inscription enregistrée</h2>
    <p style="line-height:1.6">
      Bonjour <strong>{participant_nom}</strong>,<br>
      Votre inscription à l'événement suivant a bien été enregistrée.
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">
      <tr>
        <td style="padding:8px 12px;background:#FFF0F5;border-radius:8px 0 0 0;font-weight:600;color:#374151">Événement</td>
        <td style="padding:8px 12px;background:#FFF0F5;border-radius:0 8px 0 0;color:#1B1464;font-weight:700">{event_titre}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;background:#f9fafb;font-weight:600;color:#374151">Date</td>
        <td style="padding:8px 12px;background:#f9fafb;color:#374151">{date_debut}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;background:#FFF0F5;border-radius:0 0 0 8px;font-weight:600;color:#374151">Lieu</td>
        <td style="padding:8px 12px;background:#FFF0F5;border-radius:0 0 8px 0;color:#374151">{lieu}</td>
      </tr>
    </table>
    <p style="line-height:1.6;color:#6b7280;font-size:13px">
      Nous vous contacterons si des informations complémentaires sont nécessaires.
    </p>
{FOOTER}
"""
    return subject, html


def confirmation_soumission_abstract(
    auteur_nom: str,
    event_titre: str,
    abstract_titre: str,
) -> tuple[str, str]:
    """Retourne (subject, html) pour confirmation soumission abstract."""
    subject = f"REMEHBS — Résumé soumis: {event_titre}"
    html = f"""
{HEADER}
    <h2 style="margin:0 0 12px;font-size:18px;color:#1B1464">Résumé bien reçu</h2>
    <p style="line-height:1.6">
      Bonjour <strong>{auteur_nom}</strong>,<br>
      Votre résumé a bien été soumis au comité scientifique.
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">
      <tr>
        <td style="padding:8px 12px;background:#FFF0F5;border-radius:8px 0 0 0;font-weight:600;color:#374151">Événement</td>
        <td style="padding:8px 12px;background:#FFF0F5;border-radius:0 8px 0 0;color:#1B1464;font-weight:700">{event_titre}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;background:#f9fafb;border-radius:0 0 0 8px;font-weight:600;color:#374151">Titre</td>
        <td style="padding:8px 12px;background:#f9fafb;border-radius:0 0 8px 0;color:#374151">{abstract_titre}</td>
      </tr>
    </table>
    <p style="line-height:1.6;color:#6b7280;font-size:13px">
      Le statut sera mis à jour après évaluation (accepté, refusé ou révision).
    </p>
{FOOTER}
"""
    return subject, html
