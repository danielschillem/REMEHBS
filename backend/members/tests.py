"""
REMEHBS — Tests Members (models, serializers, views)
"""
from unittest.mock import patch

from django.test import TestCase
from django.test import override_settings
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Member, Cotisation
from .serializers import (
    MemberSerializer, AdhesionSerializer,
    CotisationSerializer, MemberPublicSerializer,
)


# ═══════════════════════════════════════════════
#  TESTS MODELS
# ═══════════════════════════════════════════════

class MemberModelTest(TestCase):
    """Tests unitaires pour le modèle Member"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="jean@test.com", email="jean@test.com", password="TestPass123!"
        )
        self.member = Member.objects.create(
            user=self.user,
            nom="Dupont",
            prenom="Jean",
            email="jean@test.com",
            telephone="0612345678",
            profession="Médecin",
            categorie=Member.Categorie.PROFESSIONNEL,
            statut=Member.Statut.ACTIF,
        )

    def test_numero_membre_auto_genere(self):
        """Le numéro membre est auto-généré au format RMB-YYYY-XXXX"""
        self.assertTrue(self.member.numero_membre.startswith("RMB-"))
        year = timezone.now().year
        self.assertIn(str(year), self.member.numero_membre)

    def test_numero_membre_unique(self):
        m2 = Member.objects.create(
            nom="Martin", prenom="Paul", email="paul@test.com",
            profession="Infirmier", categorie=Member.Categorie.PROFESSIONNEL,
        )
        self.assertNotEqual(self.member.numero_membre, m2.numero_membre)

    def test_nom_complet(self):
        self.assertEqual(self.member.nom_complet, "Jean Dupont")

    def test_montant_adhesion_professionnel(self):
        self.assertEqual(self.member.montant_adhesion, 5000)

    def test_montant_adhesion_etudiant(self):
        self.member.categorie = Member.Categorie.ETUDIANT
        self.assertEqual(self.member.montant_adhesion, 2000)

    def test_montant_adhesion_institution(self):
        self.member.categorie = Member.Categorie.INSTITUTION
        self.assertEqual(self.member.montant_adhesion, 25000)

    def test_est_a_jour_sans_cotisation(self):
        self.assertFalse(self.member.est_a_jour)

    def test_est_a_jour_avec_cotisation_payee(self):
        Cotisation.objects.create(
            member=self.member, annee=timezone.now().year,
            montant=5000, statut=Cotisation.Statut.PAYE,
        )
        self.assertTrue(self.member.est_a_jour)

    def test_est_a_jour_cotisation_impayee(self):
        Cotisation.objects.create(
            member=self.member, annee=timezone.now().year,
            montant=5000, statut=Cotisation.Statut.IMPAYE,
        )
        self.assertFalse(self.member.est_a_jour)

    def test_cotisation_courante(self):
        cotis = Cotisation.objects.create(
            member=self.member, annee=timezone.now().year, montant=5000,
        )
        self.assertEqual(self.member.cotisation_courante, cotis)

    def test_cotisation_courante_none(self):
        self.assertIsNone(self.member.cotisation_courante)

    def test_str_representation(self):
        self.assertIn(self.member.numero_membre, str(self.member))
        self.assertIn("Dupont", str(self.member))

    def test_ordering_created_at_desc(self):
        m2 = Member.objects.create(
            nom="Zeta", prenom="Alpha", email="zeta@test.com",
            profession="Pharmacien", categorie=Member.Categorie.PROFESSIONNEL,
        )
        members = list(Member.objects.all())
        self.assertEqual(members[0], m2)

    def test_statut_default_en_attente(self):
        m = Member.objects.create(
            nom="Test", prenom="User", email="default@test.com",
            profession="Test",
        )
        self.assertEqual(m.statut, Member.Statut.EN_ATTENTE)

    def test_user_nullable(self):
        m = Member.objects.create(
            nom="NoUser", prenom="Test", email="nouser@test.com",
            profession="Test",
        )
        self.assertIsNone(m.user)

    def test_role_default_membre(self):
        m = Member.objects.create(
            nom="Role", prenom="Default", email="role-default@test.com",
            profession="Test",
        )
        self.assertEqual(m.role, Member.Role.MEMBRE)


class CotisationModelTest(TestCase):
    """Tests unitaires pour le modèle Cotisation"""

    def setUp(self):
        self.member = Member.objects.create(
            nom="Dupont", prenom="Jean", email="jean@test.com",
            profession="Médecin", categorie=Member.Categorie.PROFESSIONNEL,
        )
        self.cotisation = Cotisation.objects.create(
            member=self.member, annee=2026, montant=5000,
        )

    def test_str_representation(self):
        s = str(self.cotisation)
        self.assertIn(self.member.numero_membre, s)
        self.assertIn("2026", s)

    def test_unique_together_member_annee(self):
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            Cotisation.objects.create(member=self.member, annee=2026, montant=5000)

    def test_statut_default(self):
        self.assertEqual(self.cotisation.statut, Cotisation.Statut.EN_ATTENTE)

    def test_ordering_annee_desc(self):
        Cotisation.objects.create(member=self.member, annee=2025, montant=5000)
        cotisations = list(self.member.cotisations.all())
        self.assertEqual(cotisations[0].annee, 2026)
        self.assertEqual(cotisations[1].annee, 2025)


# ═══════════════════════════════════════════════
#  TESTS SERIALIZERS
# ═══════════════════════════════════════════════

class AdhesionSerializerTest(TestCase):

    def test_valid_data_sans_password(self):
        data = {
            "nom": "Dupont", "prenom": "Jean", "email": "jean@test.com",
            "telephone": "0612345678", "profession": "Médecin",
            "categorie": "professionnel",
        }
        s = AdhesionSerializer(data=data)
        self.assertTrue(s.is_valid(), s.errors)

    def test_valid_data_avec_password(self):
        data = {
            "nom": "Dupont", "prenom": "Jean", "email": "pwd@test.com",
            "telephone": "0612345678", "profession": "Médecin",
            "categorie": "professionnel",
            "password": "SecurePass1!", "password2": "SecurePass1!",
        }
        s = AdhesionSerializer(data=data)
        self.assertTrue(s.is_valid(), s.errors)

    def test_passwords_mismatch(self):
        data = {
            "nom": "Dupont", "prenom": "Jean", "email": "mis@test.com",
            "telephone": "0612345678", "profession": "Médecin",
            "categorie": "professionnel",
            "password": "Pass1!", "password2": "Different!",
        }
        s = AdhesionSerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn("password2", s.errors)

    def test_create_member_sans_user(self):
        data = {
            "nom": "Solo", "prenom": "Member", "email": "solo@test.com",
            "profession": "Pharmacien", "categorie": "etudiant",
        }
        s = AdhesionSerializer(data=data)
        s.is_valid(raise_exception=True)
        member = s.save()
        self.assertIsNotNone(member.numero_membre)
        self.assertIsNone(member.user)

    def test_create_member_avec_user(self):
        data = {
            "nom": "Avec", "prenom": "User", "email": "avecuser@test.com",
            "profession": "Infirmier", "categorie": "professionnel",
            "password": "TestPass123!", "password2": "TestPass123!",
        }
        s = AdhesionSerializer(data=data)
        s.is_valid(raise_exception=True)
        member = s.save()
        self.assertIsNotNone(member.user)
        self.assertEqual(member.user.email, "avecuser@test.com")

    def test_email_obligatoire(self):
        data = {"nom": "Test", "prenom": "No", "profession": "Test", "categorie": "etudiant"}
        s = AdhesionSerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn("email", s.errors)


class MemberSerializerTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="serial@test.com", email="serial@test.com",
            password="Pass123!", is_staff=True,
        )
        self.member = Member.objects.create(
            user=self.user, nom="Serializer", prenom="Test",
            email="serial@test.com", profession="Test",
            categorie=Member.Categorie.PROFESSIONNEL,
            statut=Member.Statut.ACTIF,
        )

    def test_fields_present(self):
        s = MemberSerializer(self.member)
        for field in ("numero_membre", "nom_complet", "est_a_jour",
                      "montant_adhesion", "cotisations", "is_staff"):
            self.assertIn(field, s.data)

    def test_is_staff_true(self):
        s = MemberSerializer(self.member)
        self.assertTrue(s.data["is_staff"])

    def test_is_staff_false_sans_user(self):
        m = Member.objects.create(
            nom="NoStaff", prenom="Test", email="nostaff@test.com",
            profession="Test",
        )
        s = MemberSerializer(m)
        self.assertFalse(s.data["is_staff"])


class CotisationSerializerTest(TestCase):

    def setUp(self):
        self.member = Member.objects.create(
            nom="CotisTest", prenom="User", email="cotis@test.com",
            profession="Test",
        )
        self.cotisation = Cotisation.objects.create(
            member=self.member, annee=2026, montant=5000,
            statut=Cotisation.Statut.PAYE,
            mode_paiement=Cotisation.ModePaiement.ORANGE_MONEY,
        )

    def test_membre_nom(self):
        s = CotisationSerializer(self.cotisation)
        self.assertEqual(s.data["membre_nom"], "User CotisTest")

    def test_statut_display(self):
        s = CotisationSerializer(self.cotisation)
        self.assertEqual(s.data["statut_display"], "Payé")

    def test_mode_paiement_display(self):
        s = CotisationSerializer(self.cotisation)
        self.assertEqual(s.data["mode_paiement_display"], "Orange Money")


class MemberPublicSerializerTest(TestCase):

    def test_no_sensitive_fields(self):
        m = Member.objects.create(
            nom="Public", prenom="View", email="public@test.com",
            profession="Médecin", specialite="Pédiatrie",
        )
        s = MemberPublicSerializer(m)
        self.assertNotIn("email", s.data)
        self.assertNotIn("telephone", s.data)
        self.assertNotIn("statut", s.data)
        self.assertIn("nom_complet", s.data)


# ═══════════════════════════════════════════════
#  TESTS VIEWS (API)
# ═══════════════════════════════════════════════

class AdhesionViewTest(APITestCase):

    def setUp(self):
        cache.clear()

    @patch("members.tasks.envoyer_email_confirmation_adhesion.delay")
    def test_adhesion_success(self, mock_email):
        data = {
            "nom": "Dupont", "prenom": "Jean", "email": "adhesion@test.com",
            "telephone": "0612345678", "profession": "Médecin",
            "categorie": "professionnel",
            "password": "SecurePass1!", "password2": "SecurePass1!",
        }
        resp = self.client.post("/api/members/adhesion/", data, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn("numero_membre", resp.data)
        mock_email.assert_called_once()

    @patch("members.tasks.envoyer_email_confirmation_adhesion.delay")
    def test_adhesion_duplicate_email(self, mock_email):
        Member.objects.create(
            nom="Exists", prenom="Already", email="dup@test.com",
            profession="Test",
        )
        data = {
            "nom": "New", "prenom": "User", "email": "dup@test.com",
            "profession": "Test", "categorie": "etudiant",
        }
        resp = self.client.post("/api/members/adhesion/", data, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_adhesion_missing_fields(self):
        resp = self.client.post("/api/members/adhesion/", {}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


@override_settings(MAX_PROFILE_PHOTO_SIZE=1024)
class MemberSerializerPhotoValidationTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="photo@test.com",
            email="photo@test.com",
            password="Pass123!",
        )
        self.member = Member.objects.create(
            user=self.user,
            nom="Photo",
            prenom="Test",
            email="photo@test.com",
            profession="Médecin",
        )

    def test_rejects_too_large_photo(self):
        photo = SimpleUploadedFile("avatar.jpg", b"a" * 2048, content_type="image/jpeg")
        serializer = MemberSerializer(instance=self.member, data={"photo": photo}, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertIn("photo", serializer.errors)

    def test_rejects_unsupported_photo_extension(self):
        photo = SimpleUploadedFile("avatar.gif", b"abc", content_type="image/gif")
        serializer = MemberSerializer(instance=self.member, data={"photo": photo}, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertIn("photo", serializer.errors)


class AdhesionThrottleTest(APITestCase):

    def setUp(self):
        cache.clear()

    @patch("members.tasks.envoyer_email_confirmation_adhesion.delay")
    def test_adhesion_is_throttled(self, _mock_email):
        for idx in range(10):
            payload = {
                "nom": f"N{idx}",
                "prenom": f"P{idx}",
                "email": f"adhesion{idx}@test.com",
                "telephone": f"700000{idx:02d}",
                "profession": "Médecin",
                "categorie": "professionnel",
            }
            self.client.post("/api/members/adhesion/", payload, format="json")

        resp = self.client.post(
            "/api/members/adhesion/",
            {
                "nom": "N10",
                "prenom": "P10",
                "email": "adhesion10@test.com",
                "telephone": "70000110",
                "profession": "Médecin",
                "categorie": "professionnel",
            },
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_429_TOO_MANY_REQUESTS)


class MonProfilViewTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="profil@test.com", email="profil@test.com", password="Pass123!",
        )
        self.member = Member.objects.create(
            user=self.user, nom="Profil", prenom="Test",
            email="profil@test.com", profession="Médecin",
            statut=Member.Statut.ACTIF,
        )
        self.client.force_authenticate(user=self.user)

    def test_get_profil(self):
        resp = self.client.get("/api/members/moi/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["nom"], "Profil")

    def test_patch_profil(self):
        resp = self.client.patch(
            "/api/members/moi/", {"telephone": "0699999999"}, format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.member.refresh_from_db()
        self.assertEqual(self.member.telephone, "0699999999")

    def test_profil_unauthenticated(self):
        self.client.force_authenticate(user=None)
        resp = self.client.get("/api/members/moi/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class MemberViewSetTest(APITestCase):

    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="admin@test.com", email="admin@test.com", password="Admin123!",
        )
        self.member = Member.objects.create(
            nom="Target", prenom="Member", email="target@test.com",
            profession="Infirmier", statut=Member.Statut.EN_ATTENTE,
        )
        self.client.force_authenticate(user=self.admin)

    def test_list_members(self):
        resp = self.client.get("/api/members/list/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_non_admin_forbidden(self):
        user = User.objects.create_user(
            username="nonadmin@test.com", email="nonadmin@test.com",
            password="Pass123!",
        )
        self.client.force_authenticate(user=user)
        resp = self.client.get("/api/members/list/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_bureau_role_can_list_members(self):
        user = User.objects.create_user(
            username="bureau-list@test.com",
            email="bureau-list@test.com",
            password="Pass123!",
        )
        Member.objects.create(
            user=user,
            nom="Bureau",
            prenom="Liste",
            email="bureau-list@test.com",
            profession="Médecin",
            role=Member.Role.BUREAU,
        )
        self.client.force_authenticate(user=user)
        resp = self.client.get("/api/members/list/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_valider_membre(self):
        resp = self.client.post(f"/api/members/list/{self.member.pk}/valider/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.member.refresh_from_db()
        self.assertEqual(self.member.statut, Member.Statut.ACTIF)
        self.assertIsNotNone(self.member.date_adhesion)
        self.assertTrue(
            self.member.cotisations.filter(annee=timezone.now().year).exists()
        )

    def test_valider_membre_deja_actif(self):
        self.member.statut = Member.Statut.ACTIF
        self.member.save()
        resp = self.client.post(f"/api/members/list/{self.member.pk}/valider/")
        self.assertEqual(resp.status_code, 400)

    def test_suspendre_membre(self):
        self.member.statut = Member.Statut.ACTIF
        self.member.save()
        resp = self.client.post(f"/api/members/list/{self.member.pk}/suspendre/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.member.refresh_from_db()
        self.assertEqual(self.member.statut, Member.Statut.SUSPENDU)

    def test_suspendre_deja_suspendu(self):
        self.member.statut = Member.Statut.SUSPENDU
        self.member.save()
        resp = self.client.post(f"/api/members/list/{self.member.pk}/suspendre/")
        self.assertEqual(resp.status_code, 400)

    def test_reactiver_membre(self):
        self.member.statut = Member.Statut.SUSPENDU
        self.member.save()
        resp = self.client.post(f"/api/members/list/{self.member.pk}/reactiver/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.member.refresh_from_db()
        self.assertEqual(self.member.statut, Member.Statut.ACTIF)

    def test_reactiver_non_suspendu(self):
        self.member.statut = Member.Statut.ACTIF
        self.member.save()
        resp = self.client.post(f"/api/members/list/{self.member.pk}/reactiver/")
        self.assertEqual(resp.status_code, 400)

    def test_stats(self):
        resp = self.client.get("/api/members/list/stats/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        for key in ("total_membres", "membres_actifs",
                     "en_attente_validation", "cotisations_payees_cette_annee"):
            self.assertIn(key, resp.data)

    def test_export_members_csv(self):
        resp = self.client.get("/api/members/list/export/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp["Content-Type"], "text/csv")
        self.assertIn("attachment; filename=", resp["Content-Disposition"])
        self.assertIn("numero_membre,nom,prenom,email", resp.content.decode("utf-8"))


class CotisationViewSetTest(APITestCase):

    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="cotisadmin@test.com", email="cotisadmin@test.com",
            password="Admin123!",
        )
        self.member = Member.objects.create(
            nom="CotisView", prenom="Test", email="cotisview@test.com",
            profession="Pharmacien",
        )
        self.cotisation = Cotisation.objects.create(
            member=self.member, annee=2026, montant=5000,
        )
        self.client.force_authenticate(user=self.admin)

    def test_list_cotisations(self):
        resp = self.client.get("/api/members/cotisations/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_marquer_paye(self):
        resp = self.client.post(
            f"/api/members/cotisations/{self.cotisation.pk}/marquer-paye/",
            {"mode_paiement": "especes", "reference": "REF-001"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.cotisation.refresh_from_db()
        self.assertEqual(self.cotisation.statut, Cotisation.Statut.PAYE)
        self.assertIsNotNone(self.cotisation.paid_at)
        self.assertEqual(self.cotisation.reference, "REF-001")

    def test_tresorier_role_can_access_cotisations(self):
        user = User.objects.create_user(
            username="tresorier@test.com",
            email="tresorier@test.com",
            password="Pass123!",
        )
        Member.objects.create(
            user=user,
            nom="Tresorier",
            prenom="Role",
            email="tresorier@test.com",
            profession="Comptable",
            role=Member.Role.TRESORIER,
        )
        self.client.force_authenticate(user=user)
        resp = self.client.get("/api/members/cotisations/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_export_cotisations_csv(self):
        resp = self.client.get("/api/members/cotisations/export/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp["Content-Type"], "text/csv")
        self.assertIn("attachment; filename=", resp["Content-Disposition"])
        self.assertIn("member_numero,member_nom,member_prenom", resp.content.decode("utf-8"))


class AnnuaireViewTest(APITestCase):

    def test_annuaire_only_actifs(self):
        Member.objects.create(
            nom="Visible", prenom="Member", email="visible@test.com",
            profession="Médecin", statut=Member.Statut.ACTIF,
        )
        Member.objects.create(
            nom="Hidden", prenom="Member", email="hidden@test.com",
            profession="Infirmier", statut=Member.Statut.EN_ATTENTE,
        )
        resp = self.client.get("/api/members/annuaire/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        noms = [m["nom_complet"] for m in resp.data["results"]]
        self.assertIn("Member Visible", noms)
        self.assertNotIn("Member Hidden", noms)


class MesCotisationsViewTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="mescotis@test.com", email="mescotis@test.com",
            password="Pass123!",
        )
        self.member = Member.objects.create(
            user=self.user, nom="MesCotis", prenom="Test",
            email="mescotis@test.com", profession="Test",
        )
        Cotisation.objects.create(member=self.member, annee=2026, montant=5000)
        self.client.force_authenticate(user=self.user)

    def test_list_mes_cotisations(self):
        resp = self.client.get("/api/members/mes-cotisations/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_unauthenticated(self):
        self.client.force_authenticate(user=None)
        resp = self.client.get("/api/members/mes-cotisations/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
