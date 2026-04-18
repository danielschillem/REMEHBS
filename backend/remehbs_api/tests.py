"""
REMEHBS — Tests d'intégration Auth (JWT login, logout, password reset)
"""
from unittest.mock import patch

from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.cache import cache
from rest_framework.test import APITestCase
from rest_framework import status

from members.models import Member


class JWTLoginFlowTest(APITestCase):
    """Tests d'intégration pour le flux complet JWT"""

    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            username="login@test.com", email="login@test.com",
            password="SecurePass123!",
        )
        self.member = Member.objects.create(
            user=self.user, nom="Login", prenom="Test",
            email="login@test.com", profession="Médecin",
            statut=Member.Statut.ACTIF,
        )

    def test_login_success(self):
        resp = self.client.post("/api/auth/login/", {
            "username": "login@test.com", "password": "SecurePass123!",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)
        self.assertIn("refresh", resp.data)

    def test_login_wrong_password(self):
        resp = self.client.post("/api/auth/login/", {
            "username": "login@test.com", "password": "WrongPass!",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_nonexistent_user(self):
        resp = self.client.post("/api/auth/login/", {
            "username": "nobody@test.com", "password": "Whatever!",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_access_protected_endpoint_with_token(self):
        # Login
        login_resp = self.client.post("/api/auth/login/", {
            "username": "login@test.com", "password": "SecurePass123!",
        }, format="json")
        token = login_resp.data["access"]

        # Access protected endpoint
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        resp = self.client.get("/api/members/moi/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["email"], "login@test.com")

    def test_access_protected_without_token(self):
        resp = self.client.get("/api/members/moi/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_token(self):
        login_resp = self.client.post("/api/auth/login/", {
            "username": "login@test.com", "password": "SecurePass123!",
        }, format="json")
        refresh = login_resp.data["refresh"]

        resp = self.client.post("/api/auth/refresh/", {
            "refresh": refresh,
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)

    def test_refresh_with_invalid_token(self):
        resp = self.client.post("/api/auth/refresh/", {
            "refresh": "invalid-token",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class LogoutTest(APITestCase):

    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            username="logout@test.com", email="logout@test.com",
            password="Pass123!",
        )
        Member.objects.create(
            user=self.user, nom="Logout", prenom="Test",
            email="logout@test.com", profession="Test",
        )

    def test_logout_success(self):
        # Login first
        login_resp = self.client.post("/api/auth/login/", {
            "username": "logout@test.com", "password": "Pass123!",
        }, format="json")
        access = login_resp.data["access"]
        refresh = login_resp.data["refresh"]

        # Logout
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        resp = self.client.post("/api/auth/logout/", {
            "refresh": refresh,
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Refresh should now fail (token blacklisted)
        resp2 = self.client.post("/api/auth/refresh/", {
            "refresh": refresh,
        }, format="json")
        self.assertEqual(resp2.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_unauthenticated(self):
        resp = self.client.post("/api/auth/logout/", {
            "refresh": "some-token",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class PasswordResetFlowTest(APITestCase):
    """Tests d'intégration pour le flux reset mot de passe"""

    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            username="reset@test.com", email="reset@test.com",
            password="OldPass123!",
        )

    def test_request_reset_existing_email(self):
        resp = self.client.post("/api/auth/password-reset/", {
            "email": "reset@test.com",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("message", resp.data)

    def test_request_reset_nonexistent_email(self):
        """Ne doit pas révéler si l'email existe (anti-enumeration)"""
        resp = self.client.post("/api/auth/password-reset/", {
            "email": "nonexistent@test.com",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("message", resp.data)

    def test_confirm_reset_success(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)

        resp = self.client.post("/api/auth/password-reset-confirm/", {
            "uid": uid, "token": token, "password": "NewSecure123!",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Login with new password
        login_resp = self.client.post("/api/auth/login/", {
            "username": "reset@test.com", "password": "NewSecure123!",
        }, format="json")
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)

    def test_confirm_reset_invalid_uid(self):
        resp = self.client.post("/api/auth/password-reset-confirm/", {
            "uid": "invalid", "token": "invalid", "password": "NewPass123!",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_confirm_reset_invalid_token(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        resp = self.client.post("/api/auth/password-reset-confirm/", {
            "uid": uid, "token": "bad-token", "password": "NewPass123!",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_confirm_reset_password_too_short(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        resp = self.client.post("/api/auth/password-reset-confirm/", {
            "uid": uid, "token": token, "password": "short",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class FullAdhesionToLoginFlowTest(APITestCase):
    """Test d'intégration end-to-end: adhésion → login → profil"""

    def setUp(self):
        cache.clear()

    @patch("members.tasks.envoyer_email_confirmation_adhesion.delay")
    def test_full_flow(self, mock_email):
        # 1. Adhésion
        adhesion_resp = self.client.post("/api/members/adhesion/", {
            "nom": "Traoré", "prenom": "Issa",
            "email": "issa@test.com", "telephone": "70123456",
            "profession": "Sage-femme", "categorie": "professionnel",
            "password": "IssaSecure123!", "password2": "IssaSecure123!",
        }, format="json")
        self.assertEqual(adhesion_resp.status_code, status.HTTP_201_CREATED)
        numero = adhesion_resp.data["numero_membre"]

        # 2. Login
        login_resp = self.client.post("/api/auth/login/", {
            "username": "issa@test.com", "password": "IssaSecure123!",
        }, format="json")
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)
        token = login_resp.data["access"]

        # 3. Access profil
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        profil_resp = self.client.get("/api/members/moi/")
        self.assertEqual(profil_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(profil_resp.data["numero_membre"], numero)
        self.assertEqual(profil_resp.data["nom"], "Traoré")


class AuthThrottleTest(APITestCase):

    def setUp(self):
        cache.clear()
        User.objects.create_user(
            username="throttle@test.com",
            email="throttle@test.com",
            password="SecurePass123!",
        )

    def test_login_is_throttled(self):
        payload = {"username": "throttle@test.com", "password": "WrongPass!"}
        for _ in range(15):
            self.client.post("/api/auth/login/", payload, format="json")
        resp = self.client.post("/api/auth/login/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_password_reset_is_throttled(self):
        payload = {"email": "throttle@test.com"}
        for _ in range(6):
            self.client.post("/api/auth/password-reset/", payload, format="json")
        resp = self.client.post("/api/auth/password-reset/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
