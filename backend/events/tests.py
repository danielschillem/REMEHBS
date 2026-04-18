"""
REMEHBS — Tests Events (models, serializers, views)
"""
from unittest.mock import patch

from django.test import TestCase
from django.test import override_settings
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Event, EventRegistration, Abstract
from members.models import Member
from .serializers import (
    EventListSerializer, EventDetailSerializer,
    EventRegistrationSerializer, AbstractSerializer,
)


# ═══════════════════════════════════════════════
#  TESTS MODELS
# ═══════════════════════════════════════════════

class EventModelTest(TestCase):

    def setUp(self):
        self.event = Event.objects.create(
            titre="Congrès REMEHBS 2026",
            description="Congrès annuel",
            lieu="Bobo-Dioulasso",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(days=2),
            programme="Jour 1\nJour 2",
            intervenants="Dr A\nDr B",
        )

    def test_str_representation(self):
        self.assertEqual(str(self.event), "Congrès REMEHBS 2026")

    def test_est_actif_default_true(self):
        self.assertTrue(self.event.est_actif)

    def test_ordering_date_debut_desc(self):
        e2 = Event.objects.create(
            titre="Atelier",
            description="Atelier pratique",
            lieu="Ouaga",
            date_debut=timezone.now() + timezone.timedelta(days=10),
            date_fin=timezone.now() + timezone.timedelta(days=11),
        )
        events = list(Event.objects.all())
        self.assertEqual(events[0], e2)  # Plus récent en premier


class EventRegistrationModelTest(TestCase):

    def setUp(self):
        self.event = Event.objects.create(
            titre="Test Event", description="Desc", lieu="Lieu",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(hours=4),
        )
        self.reg = EventRegistration.objects.create(
            event=self.event,
            nom="Konaté", prenom="Ali",
            email="ali@test.com",
        )

    def test_str_representation(self):
        s = str(self.reg)
        self.assertIn("Konaté", s)
        self.assertIn("Test Event", s)

    def test_statut_default_en_attente(self):
        self.assertEqual(self.reg.statut, EventRegistration.Statut.EN_ATTENTE)

    def test_type_participation_default(self):
        self.assertEqual(
            self.reg.type_participation,
            EventRegistration.TypeParticipation.PARTICIPANT,
        )


class AbstractModelTest(TestCase):

    def setUp(self):
        self.event = Event.objects.create(
            titre="Congrès", description="Desc", lieu="Lieu",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(hours=8),
        )
        self.abstract = Abstract.objects.create(
            event=self.event,
            auteur_nom="Dr Traoré",
            auteur_email="traore@test.com",
            titre="Mortalité maternelle à Bobo",
            resume_texte="Résumé...",
        )

    def test_str_representation(self):
        s = str(self.abstract)
        self.assertIn("Mortalité maternelle", s)
        self.assertIn("Dr Traoré", s)

    def test_statut_default_soumis(self):
        self.assertEqual(self.abstract.statut, Abstract.Statut.SOUMIS)

    def test_type_soumission_default(self):
        self.assertEqual(
            self.abstract.type_soumission,
            Abstract.TypeSoumission.COMMUNICATION_ORALE,
        )


# ═══════════════════════════════════════════════
#  TESTS SERIALIZERS
# ═══════════════════════════════════════════════

class EventListSerializerTest(TestCase):

    def test_nb_inscrits(self):
        event = Event.objects.create(
            titre="Ev", description="D", lieu="L",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(hours=2),
        )
        EventRegistration.objects.create(
            event=event, nom="A", prenom="B", email="a@t.com",
        )
        EventRegistration.objects.create(
            event=event, nom="C", prenom="D", email="c@t.com",
        )
        s = EventListSerializer(event)
        self.assertEqual(s.data["nb_inscrits"], 2)


class EventDetailSerializerTest(TestCase):

    def test_intervenants_list(self):
        event = Event.objects.create(
            titre="Ev", description="D", lieu="L",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(hours=2),
            intervenants="Dr Alpha\nDr Beta\n\nDr Gamma",
        )
        s = EventDetailSerializer(event)
        self.assertEqual(s.data["intervenants_list"], ["Dr Alpha", "Dr Beta", "Dr Gamma"])

    def test_intervenants_list_empty(self):
        event = Event.objects.create(
            titre="Ev", description="D", lieu="L",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(hours=2),
        )
        s = EventDetailSerializer(event)
        self.assertEqual(s.data["intervenants_list"], [])


class EventRegistrationSerializerTest(TestCase):

    def test_event_titre_read_only(self):
        event = Event.objects.create(
            titre="Formation", description="D", lieu="L",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(hours=2),
        )
        reg = EventRegistration.objects.create(
            event=event, nom="Test", prenom="User", email="t@t.com",
        )
        s = EventRegistrationSerializer(reg)
        self.assertEqual(s.data["event_titre"], "Formation")


# ═══════════════════════════════════════════════
#  TESTS VIEWS
# ═══════════════════════════════════════════════

class EventViewSetTest(APITestCase):

    def setUp(self):
        self.active = Event.objects.create(
            titre="Actif", description="Desc", lieu="Bobo",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(days=1),
            est_actif=True,
        )
        self.inactive = Event.objects.create(
            titre="Inactif", description="Desc", lieu="Bobo",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(days=1),
            est_actif=False,
        )

    def test_list_only_active(self):
        resp = self.client.get("/api/events/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        titres = [e["titre"] for e in resp.data["results"]]
        self.assertIn("Actif", titres)
        self.assertNotIn("Inactif", titres)

    def test_detail_active(self):
        resp = self.client.get(f"/api/events/{self.active.pk}/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["titre"], "Actif")

    def test_detail_inactive_404(self):
        resp = self.client.get(f"/api/events/{self.inactive.pk}/")
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_public_no_auth_required(self):
        resp = self.client.get("/api/events/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)


class AdminEventViewSetTest(APITestCase):

    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="admin@test.com", email="admin@test.com",
            password="Admin123!",
        )
        self.client.force_authenticate(user=self.admin)
        self.event = Event.objects.create(
            titre="Admin Event", description="Desc", lieu="Bobo",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(days=1),
        )

    def test_admin_list_all(self):
        Event.objects.create(
            titre="Inactive", description="D", lieu="L",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(days=1),
            est_actif=False,
        )
        resp = self.client.get("/api/events/admin/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        titres = [e["titre"] for e in resp.data["results"]]
        self.assertIn("Inactive", titres)

    def test_admin_create_event(self):
        data = {
            "titre": "Nouvel Événement", "description": "Super event",
            "lieu": "Ouagadougou",
            "date_debut": "2026-12-01T09:00:00Z",
            "date_fin": "2026-12-02T17:00:00Z",
        }
        resp = self.client.post("/api/events/admin/", data, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_admin_update_event(self):
        resp = self.client.patch(
            f"/api/events/admin/{self.event.pk}/",
            {"titre": "Updated"}, format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.event.refresh_from_db()
        self.assertEqual(self.event.titre, "Updated")

    def test_admin_delete_event(self):
        resp = self.client.delete(f"/api/events/admin/{self.event.pk}/")
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Event.objects.filter(pk=self.event.pk).exists())

    def test_non_admin_forbidden(self):
        user = User.objects.create_user(
            username="user@test.com", email="user@test.com", password="Pass123!",
        )
        self.client.force_authenticate(user=user)
        resp = self.client.get("/api/events/admin/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_bureau_role_can_access_admin_events(self):
        user = User.objects.create_user(
            username="bureau@test.com", email="bureau@test.com", password="Pass123!",
        )
        Member.objects.create(
            user=user,
            nom="Bureau",
            prenom="Role",
            email="bureau@test.com",
            profession="Médecin",
            role=Member.Role.BUREAU,
        )
        self.client.force_authenticate(user=user)
        resp = self.client.get("/api/events/admin/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)


class EventRegistrationViewSetTest(APITestCase):

    def setUp(self):
        self.event = Event.objects.create(
            titre="Formation", description="D", lieu="Bobo",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(days=1),
        )

    @patch("events.tasks.envoyer_email_confirmation_inscription_event.delay")
    def test_inscription_success(self, mock_email):
        data = {
            "event": self.event.pk,
            "nom": "Konaté", "prenom": "Ali",
            "email": "ali@test.com",
        }
        resp = self.client.post("/api/events/inscriptions/", data, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn("id", resp.data)
        mock_email.assert_called_once()

    def test_inscription_missing_event(self):
        data = {"nom": "Test", "prenom": "User", "email": "t@t.com"}
        resp = self.client.post("/api/events/inscriptions/", data, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class AbstractViewSetTest(APITestCase):

    def setUp(self):
        self.event = Event.objects.create(
            titre="Congrès", description="D", lieu="L",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(days=2),
        )

    @patch("events.tasks.envoyer_email_confirmation_abstract.delay")
    def test_soumission_abstract_success(self, mock_email):
        data = {
            "event": self.event.pk,
            "auteur_nom": "Dr Traoré",
            "auteur_email": "traore@test.com",
            "titre": "Impact de la malnutrition",
            "resume_texte": "Notre étude montre...",
        }
        resp = self.client.post("/api/events/abstracts/", data, format="multipart")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn("id", resp.data)
        mock_email.assert_called_once()

    def test_soumission_missing_resume(self):
        data = {
            "event": self.event.pk,
            "auteur_nom": "Dr X", "auteur_email": "x@t.com",
            "titre": "Titre",
        }
        resp = self.client.post("/api/events/abstracts/", data, format="multipart")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_soumission_rejects_non_pdf_file(self):
        data = {
            "event": self.event.pk,
            "auteur_nom": "Dr Traoré",
            "auteur_email": "traore@test.com",
            "titre": "Impact de la malnutrition",
            "resume_texte": "Notre étude montre...",
            "fichier": SimpleUploadedFile("resume.docx", b"content", content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
        }
        resp = self.client.post("/api/events/abstracts/", data, format="multipart")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("fichier", resp.data)

    @override_settings(MAX_ABSTRACT_FILE_SIZE=1024)
    def test_soumission_rejects_too_large_file(self):
        data = {
            "event": self.event.pk,
            "auteur_nom": "Dr Traoré",
            "auteur_email": "traore@test.com",
            "titre": "Impact de la malnutrition",
            "resume_texte": "Notre étude montre...",
            "fichier": SimpleUploadedFile("resume.pdf", b"a" * 2048, content_type="application/pdf"),
        }
        resp = self.client.post("/api/events/abstracts/", data, format="multipart")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("fichier", resp.data)


class AdminEventRegistrationModerationTest(APITestCase):

    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="admin-reg@test.com", email="admin-reg@test.com", password="Admin123!"
        )
        self.event = Event.objects.create(
            titre="Congres", description="D", lieu="Bobo",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(days=1),
        )
        self.registration = EventRegistration.objects.create(
            event=self.event,
            nom="Diallo",
            prenom="Mina",
            email="mina@test.com",
        )
        self.client.force_authenticate(user=self.admin)

    def test_list_admin_inscriptions(self):
        resp = self.client.get("/api/events/admin-inscriptions/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["count"], 1)

    def test_confirmer_inscription(self):
        resp = self.client.post(f"/api/events/admin-inscriptions/{self.registration.pk}/confirmer/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.registration.refresh_from_db()
        self.assertEqual(self.registration.statut, EventRegistration.Statut.CONFIRME)

    def test_annuler_inscription(self):
        resp = self.client.post(f"/api/events/admin-inscriptions/{self.registration.pk}/annuler/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.registration.refresh_from_db()
        self.assertEqual(self.registration.statut, EventRegistration.Statut.ANNULE)

    def test_export_inscriptions_csv(self):
        resp = self.client.get("/api/events/admin-inscriptions/export/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp["Content-Type"], "text/csv")
        self.assertIn("attachment; filename=", resp["Content-Disposition"])
        self.assertIn("id,event,nom,prenom,email", resp.content.decode("utf-8"))


class AdminAbstractModerationTest(APITestCase):

    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="admin-abs@test.com", email="admin-abs@test.com", password="Admin123!"
        )
        self.event = Event.objects.create(
            titre="Congres", description="D", lieu="Bobo",
            date_debut=timezone.now(),
            date_fin=timezone.now() + timezone.timedelta(days=1),
        )
        self.abstract = Abstract.objects.create(
            event=self.event,
            auteur_nom="Dr X",
            auteur_email="x@test.com",
            titre="Titre",
            resume_texte="Texte",
        )
        self.client.force_authenticate(user=self.admin)

    def test_list_admin_abstracts(self):
        resp = self.client.get("/api/events/admin-abstracts/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["count"], 1)

    def test_update_abstract_status(self):
        resp = self.client.post(
            f"/api/events/admin-abstracts/{self.abstract.pk}/statut/",
            {"statut": "accepte", "commentaire_comite": "Excellent"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.abstract.refresh_from_db()
        self.assertEqual(self.abstract.statut, Abstract.Statut.ACCEPTE)
        self.assertEqual(self.abstract.commentaire_comite, "Excellent")

    def test_update_abstract_status_invalid(self):
        resp = self.client.post(
            f"/api/events/admin-abstracts/{self.abstract.pk}/statut/",
            {"statut": "invalide"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_comite_scientifique_role_can_moderate(self):
        user = User.objects.create_user(
            username="comite@test.com", email="comite@test.com", password="Pass123!",
        )
        Member.objects.create(
            user=user,
            nom="Comite",
            prenom="Role",
            email="comite@test.com",
            profession="Chercheur",
            role=Member.Role.COMITE_SCIENTIFIQUE,
        )
        self.client.force_authenticate(user=user)
        resp = self.client.post(
            f"/api/events/admin-abstracts/{self.abstract.pk}/statut/",
            {"statut": "accepte", "commentaire_comite": "Valide"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
