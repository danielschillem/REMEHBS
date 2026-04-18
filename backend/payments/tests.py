"""
REMEHBS — Tests Payments (models, views, webhook integration)
"""
from unittest.mock import patch, MagicMock
import hashlib
import hmac
import json

from django.test import TestCase
from django.test import override_settings
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.cache import cache
from rest_framework.test import APITestCase
from rest_framework import status

from members.models import Member, Cotisation
from .models import Payment


# ═══════════════════════════════════════════════
#  TESTS MODELS
# ═══════════════════════════════════════════════

class PaymentModelTest(TestCase):

    def setUp(self):
        self.member = Member.objects.create(
            nom="Payer", prenom="Test", email="payer@test.com",
            profession="Médecin",
        )
        self.payment = Payment.objects.create(
            member=self.member,
            transaction_id="RMB-ABC123",
            montant=5000,
            objet="Cotisation REMEHBS 2026",
            annee_cotisation=2026,
        )

    def test_str_representation(self):
        s = str(self.payment)
        self.assertIn("RMB-ABC123", s)
        self.assertIn("5000", s)

    def test_statut_default_initie(self):
        self.assertEqual(self.payment.statut, Payment.Statut.INITIE)

    def test_transaction_id_unique(self):
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            Payment.objects.create(
                member=self.member, transaction_id="RMB-ABC123",
                montant=5000, objet="Duplicate",
            )

    def test_member_nullable(self):
        p = Payment.objects.create(
            transaction_id="RMB-ORPHAN", montant=1000, objet="Test",
        )
        self.assertIsNone(p.member)

    def test_ordering_created_at_desc(self):
        p2 = Payment.objects.create(
            member=self.member, transaction_id="RMB-DEF456",
            montant=2000, objet="Autre",
        )
        payments = list(Payment.objects.all())
        self.assertEqual(payments[0], p2)


# ═══════════════════════════════════════════════
#  TESTS VIEWS — Initier Paiement
# ═══════════════════════════════════════════════

class InitierPaiementViewTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="pay@test.com", email="pay@test.com", password="Pass123!",
        )
        self.member = Member.objects.create(
            user=self.user, nom="Payeur", prenom="Test",
            email="pay@test.com", profession="Médecin",
            categorie=Member.Categorie.PROFESSIONNEL,
            statut=Member.Statut.ACTIF,
        )
        self.client.force_authenticate(user=self.user)

    @patch("payments.views.requests.post")
    def test_initier_paiement_success(self, mock_post):
        mock_post.return_value = MagicMock(
            json=lambda: {
                "code": "201",
                "data": {
                    "payment_url": "https://checkout.cinetpay.com/pay/123",
                    "payment_token": "token123",
                },
            }
        )
        resp = self.client.post(
            "/api/payments/initier/", {"annee": 2026}, format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("payment_url", resp.data)
        self.assertIn("transaction_id", resp.data)
        self.assertTrue(Payment.objects.exists())

    @patch("payments.views.requests.post")
    def test_initier_paiement_cinetpay_error(self, mock_post):
        mock_post.return_value = MagicMock(
            json=lambda: {"code": "400", "message": "Invalid request"}
        )
        resp = self.client.post(
            "/api/payments/initier/", {"annee": 2026}, format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("payments.views.requests.post")
    def test_initier_paiement_network_error(self, mock_post):
        mock_post.side_effect = Exception("Connection timeout")
        resp = self.client.post(
            "/api/payments/initier/", {"annee": 2026}, format="json",
        )
        self.assertEqual(resp.status_code, 502)

    def test_initier_paiement_unauthenticated(self):
        self.client.force_authenticate(user=None)
        resp = self.client.post(
            "/api/payments/initier/", {"annee": 2026}, format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_initier_paiement_no_profile(self):
        user2 = User.objects.create_user(
            username="noprofile@test.com", email="noprofile@test.com",
            password="Pass123!",
        )
        self.client.force_authenticate(user=user2)
        resp = self.client.post(
            "/api/payments/initier/", {"annee": 2026}, format="json",
        )
        self.assertEqual(resp.status_code, 400)


# ═══════════════════════════════════════════════
#  TESTS VIEWS — Webhook CinetPay (Intégration)
# ═══════════════════════════════════════════════

class WebhookCinetPayViewTest(APITestCase):
    """Tests d'intégration pour le webhook de paiement CinetPay"""

    def setUp(self):
        self.member = Member.objects.create(
            nom="Webhook", prenom="Test", email="webhook@test.com",
            profession="Médecin", statut=Member.Statut.ACTIF,
        )
        self.payment = Payment.objects.create(
            member=self.member,
            transaction_id="RMB-WEBHOOK001",
            montant=5000,
            objet="Cotisation REMEHBS 2026",
            annee_cotisation=2026,
        )
        Cotisation.objects.create(
            member=self.member, annee=2026, montant=5000,
        )

    @override_settings(CINETPAY_SECRET_KEY="")
    @patch("payments.views.requests.post")
    @patch("members.tasks.envoyer_email_confirmation_paiement.delay")
    def test_webhook_success_payment(self, mock_email, mock_check):
        mock_check.return_value = MagicMock(
            json=lambda: {"data": {"status": "ACCEPTED"}}
        )
        resp = self.client.post("/api/payments/webhook/", {
            "cpm_trans_id": "RMB-WEBHOOK001",
            "cpm_result": "00",
            "cpm_site_id": "test",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Payment mis à jour
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.statut, Payment.Statut.SUCCES)

        # Cotisation mise à jour
        cotis = Cotisation.objects.get(member=self.member, annee=2026)
        self.assertEqual(cotis.statut, Cotisation.Statut.PAYE)
        self.assertIsNotNone(cotis.paid_at)

        # Email envoyé
        mock_email.assert_called_once()

    @override_settings(CINETPAY_SECRET_KEY="")
    @patch("payments.views.requests.post")
    def test_webhook_failed_payment(self, mock_check):
        mock_check.return_value = MagicMock(
            json=lambda: {"data": {"status": "REFUSED"}}
        )
        resp = self.client.post("/api/payments/webhook/", {
            "cpm_trans_id": "RMB-WEBHOOK001",
            "cpm_result": "99",
            "cpm_site_id": "test",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.statut, Payment.Statut.ECHEC)

    @override_settings(CINETPAY_SECRET_KEY="")
    def test_webhook_missing_transaction_id(self):
        resp = self.client.post("/api/payments/webhook/", {}, format="json")
        self.assertEqual(resp.status_code, 400)

    @override_settings(CINETPAY_SECRET_KEY="")
    def test_webhook_unknown_transaction(self):
        resp = self.client.post("/api/payments/webhook/", {
            "cpm_trans_id": "UNKNOWN-ID",
        }, format="json")
        self.assertEqual(resp.status_code, 404)

    @override_settings(CINETPAY_SECRET_KEY="top-secret")
    def test_webhook_rejects_missing_signature_when_secret_set(self):
        resp = self.client.post(
            "/api/payments/webhook/",
            {
                "cpm_trans_id": "RMB-WEBHOOK001",
                "cpm_result": "00",
                "cpm_site_id": "test",
            },
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    @override_settings(CINETPAY_SECRET_KEY="top-secret")
    @patch("payments.views.requests.post")
    @patch("members.tasks.envoyer_email_confirmation_paiement.delay")
    def test_webhook_accepts_valid_signature(self, mock_email, mock_check):
        mock_check.return_value = MagicMock(json=lambda: {"data": {"status": "ACCEPTED"}})
        payload = {
            "cpm_trans_id": "RMB-WEBHOOK001",
            "cpm_result": "00",
            "cpm_site_id": "test",
        }
        canonical_payload = json.dumps(
            payload, separators=(",", ":"), sort_keys=True, ensure_ascii=False
        ).encode("utf-8")
        signature = hmac.new(
            b"top-secret", canonical_payload, hashlib.sha256
        ).hexdigest()

        resp = self.client.post(
            "/api/payments/webhook/",
            {**payload, "signature": signature},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        mock_email.assert_called_once()


class PaymentInitThrottleTest(APITestCase):

    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            username="paythrottle@test.com",
            email="paythrottle@test.com",
            password="Pass123!",
        )
        self.member = Member.objects.create(
            user=self.user,
            nom="Payeur",
            prenom="Throttle",
            email="paythrottle@test.com",
            profession="Médecin",
            categorie=Member.Categorie.PROFESSIONNEL,
            statut=Member.Statut.ACTIF,
        )
        self.client.force_authenticate(user=self.user)

    @patch("payments.views.requests.post")
    def test_init_payment_is_throttled(self, mock_post):
        mock_post.return_value = MagicMock(
            json=lambda: {
                "code": "201",
                "data": {
                    "payment_url": "https://checkout.cinetpay.com/pay/abc",
                    "payment_token": "tok",
                },
            }
        )
        for year in range(2026, 2056):
            self.client.post("/api/payments/initier/", {"annee": year}, format="json")
        resp = self.client.post("/api/payments/initier/", {"annee": 2056}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
