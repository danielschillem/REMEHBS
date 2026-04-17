import uuid
import hashlib
import requests
from django.conf import settings
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from members.models import Member, Cotisation
from .models import Payment


class InitierPaiementView(APIView):
    """POST /api/payments/initier/ — Créer une session de paiement CinetPay"""
    permission_classes = [permissions.IsAuthenticated]

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

    def post(self, request):
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
