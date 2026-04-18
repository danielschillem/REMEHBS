import uuid
import base64
import hashlib
import hmac
import json
import requests
from django.conf import settings
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import ScopedRateThrottle
from django.http import HttpResponse
from members.models import Member, Cotisation
from .models import Payment


def _extract_signature(request):
    return (
        request.headers.get("X-CinetPay-Signature")
        or request.headers.get("X-Signature")
        or request.data.get("signature")
        or request.data.get("cpm_signature")
    )


def _build_signature_candidates(payload, secret):
    payload_without_signature = {
        key: value
        for key, value in payload.items()
        if key not in {"signature", "cpm_signature"}
    }
    canonical_payload = json.dumps(
        payload_without_signature,
        separators=(",", ":"),
        sort_keys=True,
        ensure_ascii=False,
    ).encode("utf-8")
    digest = hmac.new(secret.encode("utf-8"), canonical_payload, hashlib.sha256).digest()

    trans_id = str(payload_without_signature.get("cpm_trans_id", ""))
    result = str(payload_without_signature.get("cpm_result", ""))
    site_id = str(payload_without_signature.get("cpm_site_id", ""))
    compact = f"{trans_id}|{result}|{site_id}".encode("utf-8")
    compact_digest = hmac.new(secret.encode("utf-8"), compact, hashlib.sha256).digest()

    return {
        digest.hex(),
        base64.b64encode(digest).decode("utf-8"),
        compact_digest.hex(),
        base64.b64encode(compact_digest).decode("utf-8"),
    }


def verify_cinetpay_signature(request):
    secret = (settings.CINETPAY_SECRET_KEY or "").strip()
    if not secret:
        return True

    signature = _extract_signature(request)
    if not signature:
        return False

    expected_values = _build_signature_candidates(dict(request.data), secret)
    provided = signature.strip()
    for candidate in expected_values:
        if hmac.compare_digest(provided, candidate):
            return True
    return False


class InitierPaiementView(APIView):
    """POST /api/payments/initier/ — Créer une session de paiement CinetPay"""
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "payment_init"

    def post(self, request):
        member = getattr(request.user, "member_profile", None)
        if not member:
            return Response({"error": "Profil membre introuvable."}, status=400)

        annee   = request.data.get("annee", timezone.now().year)
        montant = member.montant_adhesion

        # Générer un ID de transaction unique
        transaction_id = f"RMB-{uuid.uuid4().hex[:12].upper()}"

        # Appel API CinetPay
        payload = {
            "apikey":         settings.CINETPAY_API_KEY,
            "site_id":        settings.CINETPAY_SITE_ID,
            "transaction_id": transaction_id,
            "amount":         montant,
            "currency":       "XOF",
            "description":    f"Cotisation REMEHBS {annee} — {member.numero_membre}",
            "return_url":     f"{settings.FRONTEND_URL}/espace-membre/cotisations?success=1",
            "notify_url":     f"{request.build_absolute_uri('/api/payments/webhook/')}",
            "cancel_url":     f"{settings.FRONTEND_URL}/espace-membre/cotisations?cancelled=1",
            "customer_name":  member.nom,
            "customer_surname": member.prenom,
            "customer_email": member.email,
            "customer_phone_number": member.telephone,
            "customer_address": member.ville,
            "customer_city":   member.ville,
            "customer_country": "BF",
            "customer_state":  "BF",
            "customer_zip_code": "00000",
            "channels":       "ALL",
            "lang":           "fr",
        }

        try:
            resp = requests.post(
                f"{settings.CINETPAY_BASE_URL}/payment",
                json=payload, timeout=15
            )
            data = resp.json()
        except Exception as e:
            return Response({"error": f"Erreur CinetPay : {str(e)}"}, status=502)

        if data.get("code") != "201":
            return Response({"error": data.get("message", "Erreur inconnue")}, status=400)

        payment_url = data["data"]["payment_url"]

        # Enregistrer le paiement initié
        payment = Payment.objects.create(
            member=member,
            transaction_id=transaction_id,
            cinetpay_payment_token=data["data"].get("payment_token", ""),
            montant=montant,
            objet=f"Cotisation REMEHBS {annee}",
            annee_cotisation=annee,
            payment_url=payment_url,
            payload_cinetpay=data,
        )

        # Créer/mettre à jour la cotisation en attente
        cotisation, _ = Cotisation.objects.get_or_create(
            member=member, annee=annee,
            defaults={"montant": montant}
        )

        return Response({
            "payment_url":    payment_url,
            "transaction_id": transaction_id,
        })


class WebhookCinetPayView(APIView):
    """POST /api/payments/webhook/ — Callback CinetPay après paiement"""
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "payment_webhook"

    def post(self, request):
        if not verify_cinetpay_signature(request):
            return Response({"error": "Signature webhook invalide."}, status=403)

        transaction_id = request.data.get("cpm_trans_id")
        statut         = request.data.get("cpm_result")    # "00" = succès
        site_id        = request.data.get("cpm_site_id")

        if not transaction_id:
            return Response({"error": "transaction_id manquant"}, status=400)

        try:
            payment = Payment.objects.get(transaction_id=transaction_id)
        except Payment.DoesNotExist:
            return Response({"error": "Transaction introuvable"}, status=404)

        # Vérifier le statut auprès de CinetPay (double check)
        try:
            check_resp = requests.post(
                f"{settings.CINETPAY_BASE_URL}/payment/check",
                json={
                    "apikey":  settings.CINETPAY_API_KEY,
                    "site_id": settings.CINETPAY_SITE_ID,
                    "transaction_id": transaction_id,
                },
                timeout=10
            )
            check_data = check_resp.json()
        except Exception:
            check_data = {}

        payment.payload_cinetpay = {**payment.payload_cinetpay, "webhook": request.data, "check": check_data}

        if statut == "00" or check_data.get("data", {}).get("status") == "ACCEPTED":
            payment.statut = Payment.Statut.SUCCES
            payment.save()

            # Mettre à jour la cotisation
            if payment.member and payment.annee_cotisation:
                Cotisation.objects.filter(
                    member=payment.member, annee=payment.annee_cotisation
                ).update(
                    statut=Cotisation.Statut.PAYE,
                    mode_paiement="orange_money",
                    reference=transaction_id,
                    paid_at=timezone.now(),
                )
                # Envoyer confirmation par email (Celery)
                from members.tasks import envoyer_email_confirmation_paiement
                envoyer_email_confirmation_paiement.delay(
                    payment.member.id,
                    payment.montant,
                    payment.annee_cotisation,
                    transaction_id,
                )
        else:
            payment.statut = Payment.Statut.ECHEC
            payment.save()

        return Response({"status": "ok"})


class RecuPaiementView(APIView):
    """GET /api/payments/recu/<cotisation_id>/ — Génère un reçu PDF pour une cotisation payée"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, cotisation_id):
        member = request.user.member_profile

        try:
            cotisation = Cotisation.objects.get(pk=cotisation_id, member=member)
        except Cotisation.DoesNotExist:
            return Response({"error": "Cotisation introuvable."}, status=status.HTTP_404_NOT_FOUND)

        if cotisation.statut != Cotisation.Statut.PAYE:
            return Response(
                {"error": "Le reçu n'est disponible que pour les cotisations payées."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from reportlab.lib.pagesizes import A4
        from reportlab.lib.units import mm
        from reportlab.pdfgen import canvas as pdf_canvas
        from io import BytesIO

        buf = BytesIO()
        c = pdf_canvas.Canvas(buf, pagesize=A4)
        w, h = A4

        # ── En-tête ──
        c.setFont("Helvetica-Bold", 22)
        c.drawCentredString(w / 2, h - 60, "REMEHBS")
        c.setFont("Helvetica", 10)
        c.drawCentredString(w / 2, h - 78, "Réseau Mère Enfant des Hauts-Bassins")
        c.drawCentredString(w / 2, h - 92, "Bobo-Dioulasso, Burkina Faso")

        # ── Titre ──
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredString(w / 2, h - 130, "REÇU DE PAIEMENT")

        # ── Numéro reçu ──
        c.setFont("Helvetica", 10)
        recu_num = f"RECU-{cotisation.annee}-{cotisation.id:05d}"
        c.drawString(72, h - 160, f"N° Reçu : {recu_num}")
        date_emission = timezone.now().strftime("%d/%m/%Y")
        c.drawRightString(w - 72, h - 160, f"Date : {date_emission}")

        # ── Ligne séparatrice ──
        c.setStrokeColorRGB(0.1, 0.08, 0.39)  # #1B1464
        c.setLineWidth(1.5)
        c.line(72, h - 175, w - 72, h - 175)

        # ── Informations membre ──
        c.setFont("Helvetica-Bold", 11)
        c.drawString(72, h - 200, "INFORMATIONS DU MEMBRE")

        c.setFont("Helvetica", 10)
        y = h - 220
        infos = [
            ("Nom complet", member.nom_complet),
            ("N° membre", member.numero_membre),
            ("Catégorie", member.get_categorie_display()),
            ("E-mail", member.email),
            ("Téléphone", member.telephone or "—"),
        ]
        for label, val in infos:
            c.drawString(90, y, f"{label} :")
            c.drawString(220, y, str(val))
            y -= 18

        # ── Détails paiement ──
        y -= 15
        c.setFont("Helvetica-Bold", 11)
        c.drawString(72, y, "DÉTAILS DU PAIEMENT")

        c.setFont("Helvetica", 10)
        y -= 20
        paiement_infos = [
            ("Objet", f"Cotisation annuelle {cotisation.annee}"),
            ("Montant", f"{cotisation.montant:,} FCFA"),
            ("Mode de paiement", cotisation.get_mode_paiement_display() or "—"),
            ("Référence", cotisation.reference or "—"),
            ("Date de paiement",
             cotisation.paid_at.strftime("%d/%m/%Y à %H:%M") if cotisation.paid_at else "—"),
            ("Statut", "PAYÉ ✓"),
        ]
        for label, val in paiement_infos:
            c.drawString(90, y, f"{label} :")
            c.drawString(220, y, str(val))
            y -= 18

        # ── Cachet ──
        y -= 30
        c.setStrokeColorRGB(0.1, 0.08, 0.39)
        c.setLineWidth(0.5)
        c.line(72, y, w - 72, y)

        y -= 30
        c.setFont("Helvetica", 10)
        c.drawString(72, y, f"Bobo-Dioulasso, le {date_emission}")
        y -= 30
        c.drawString(72, y, "Le Trésorier du REMEHBS")

        # ── Pied de page ──
        c.setFont("Helvetica", 8)
        c.setFillColorRGB(0.42, 0.45, 0.5)
        c.drawCentredString(w / 2, 40, "Ce reçu est généré automatiquement et fait foi de paiement.")
        c.drawCentredString(w / 2, 28, "REMEHBS — secretariat@remehbs-bf.org — +226 70 24 48 27")

        c.showPage()
        c.save()
        buf.seek(0)

        response = HttpResponse(buf.read(), content_type="application/pdf")
        response["Content-Disposition"] = (
            f'attachment; filename="recu_{recu_num}.pdf"'
        )
        return response
