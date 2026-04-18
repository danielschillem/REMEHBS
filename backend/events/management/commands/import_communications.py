"""
Commande de management Django pour importer les communications scientifiques
approuvées depuis un dossier d'export.

Usage:
    python manage.py import_communications --source /chemin/vers/dossier_export
"""
import os
import shutil
import re
from datetime import datetime
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

from events.models import CommunicationScientifique


# Correspondance dossier → code theme
FOLDER_TO_THEME = {
    "communication_libre":                             CommunicationScientifique.Theme.COMMUNICATION_LIBRE,
    "disponibilite_et_accessibilite_de_l_offre":       CommunicationScientifique.Theme.DISPONIBILITE_ACCESSIBILITE,
    "ethique_et_qualite_des_soins":                    CommunicationScientifique.Theme.ETHIQUE_QUALITE,
    "gestion_des_structures":                          CommunicationScientifique.Theme.GESTION_STRUCTURES,
    "numerique_et_sante":                              CommunicationScientifique.Theme.NUMERIQUE_SANTE,
    "nutrition_maternelle":                            CommunicationScientifique.Theme.NUTRITION,
    "planification_familiale":                         CommunicationScientifique.Theme.PLANIFICATION_FAMILIALE,
    "sante_mentale":                                   CommunicationScientifique.Theme.SANTE_MENTALE,
    "soins_au_nouveau":                                CommunicationScientifique.Theme.SOINS_NOUVEAU_NE,
    "soins_obstetricaux":                              CommunicationScientifique.Theme.SOINS_OBSTETRICAUX_SONU,
    "vaccination":                                     CommunicationScientifique.Theme.VACCINATION,
}

# Correspondance partielle dossier → theme (ordre de priorité)
FOLDER_PREFIXES = [
    ("communication_libre",                 CommunicationScientifique.Theme.COMMUNICATION_LIBRE),
    ("disponibilite",                       CommunicationScientifique.Theme.DISPONIBILITE_ACCESSIBILITE),
    ("ethique",                             CommunicationScientifique.Theme.ETHIQUE_QUALITE),
    ("gestion",                             CommunicationScientifique.Theme.GESTION_STRUCTURES),
    ("numerique",                           CommunicationScientifique.Theme.NUMERIQUE_SANTE),
    ("nutrition",                           CommunicationScientifique.Theme.NUTRITION),
    ("planification",                       CommunicationScientifique.Theme.PLANIFICATION_FAMILIALE),
    ("sante_mentale",                       CommunicationScientifique.Theme.SANTE_MENTALE),
    ("soins_au_nouveau",                    CommunicationScientifique.Theme.SOINS_NOUVEAU_NE),
    ("soins_obstetricaux",                  CommunicationScientifique.Theme.SOINS_OBSTETRICAUX_SONU),
    ("vaccination",                         CommunicationScientifique.Theme.VACCINATION),
]

TYPE_KEYWORDS = {
    "poster":    CommunicationScientifique.TypePresentation.POSTER,
    "conference": CommunicationScientifique.TypePresentation.CONFERENCE,
    "panel":      CommunicationScientifique.TypePresentation.CONFERENCE,
    "symposium":  CommunicationScientifique.TypePresentation.CONFERENCE,
}


def detect_theme(folder_name: str) -> str:
    normalized = folder_name.lower().replace("-", "_")
    for prefix, theme in FOLDER_PREFIXES:
        if normalized.startswith(prefix):
            return theme
    return CommunicationScientifique.Theme.COMMUNICATION_LIBRE


def parse_filename(filename: str) -> dict:
    """
    Parse un nom de fichier comme:
      01_Dupont_Jean_Titre_du_travail.pdf
    Retourne {"ordre": 1, "auteur_raw": "Dupont Jean", "titre_raw": "Titre du travail"}
    """
    stem = Path(filename).stem  # sans .pdf
    parts = stem.split("_")
    if not parts:
        return {"ordre": 0, "auteur": stem, "titre": stem}

    # Numéro
    ordre = 0
    if parts[0].isdigit():
        ordre = int(parts[0])
        parts = parts[1:]

    if not parts:
        return {"ordre": ordre, "auteur": "", "titre": stem}

    # Heuristique: les 1-3 premiers segments (jusqu'à un mot tout en majuscule ou fin)
    # sont le nom d'auteur, le reste est le titre
    author_parts = []
    title_parts = []
    for i, p in enumerate(parts):
        # On considère que l'auteur représente au max les 3 premiers segments
        if i < 3 and not any(c.isdigit() for c in p):
            # Si le segment suit immédiatement des segments auteur, on l'inclut
            author_parts.append(p)
        else:
            title_parts = parts[i:]
            break

    auteur = " ".join(author_parts).replace("_", " ")
    titre = " ".join(title_parts).replace("_", " ")

    # Si titre est vide, utiliser le nom complet du fichier
    if not titre:
        titre = " ".join(parts).replace("_", " ")

    return {"ordre": ordre, "auteur": auteur, "titre": titre}


class Command(BaseCommand):
    help = "Importe les communications scientifiques approuvées depuis un dossier d'export."

    def add_arguments(self, parser):
        parser.add_argument(
            "--source",
            required=True,
            help="Chemin vers le dossier d'export des soumissions approuvées.",
        )
        parser.add_argument(
            "--congres",
            default="7èmes JSP REMEHBS 2025",
            help="Libellé du congrès associé.",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Supprimer toutes les communications existantes avant l'import.",
        )
        parser.add_argument(
            "--index",
            default="INDEX_SOUMISSIONS.txt",
            help="Nom du fichier index dans le dossier source.",
        )

    def handle(self, *args, **options):
        source = Path(options["source"])
        if not source.is_dir():
            raise CommandError(f"Le dossier source n'existe pas: {source}")

        if options["clear"]:
            count_deleted = CommunicationScientifique.objects.all().count()
            CommunicationScientifique.objects.all().delete()
            self.stdout.write(self.style.WARNING(
                f"  {count_deleted} communications supprimees."
            ))

        # Destination media
        media_publications = Path(settings.MEDIA_ROOT) / "publications"
        media_publications.mkdir(parents=True, exist_ok=True)

        # On va parser l'index si disponible pour avoir auteur/titre/type exacts
        index_path = source / options["index"]
        index_data = {}  # filename_stem -> {titre, auteur, type, date_soumission}
        if index_path.exists():
            index_data = self._parse_index(index_path)
            self.stdout.write(f"Index parsé: {len(index_data)} entrées trouvées.")

        created = 0
        skipped = 0
        errors = 0

        for folder in sorted(source.iterdir()):
            if not folder.is_dir():
                continue

            theme = detect_theme(folder.name)
            self.stdout.write(f"\n[DOSSIER] {folder.name} -> theme: {theme}")

            for pdf_file in sorted(folder.glob("*.pdf")):
                try:
                    rel_dest = f"publications/{pdf_file.name}"
                    dest_path = media_publications / pdf_file.name

                    # Copie du fichier si pas déjà là
                    if not dest_path.exists():
                        shutil.copy2(pdf_file, dest_path)

                    # Chercher les métadonnées dans l'index
                    stem = pdf_file.stem
                    meta = index_data.get(stem) or index_data.get(pdf_file.name)

                    if meta:
                        titre = meta["titre"]
                        auteur = meta["auteur"]
                        type_p = meta["type_presentation"]
                        date_soumission = meta.get("date_soumission")
                        ordre = meta.get("ordre", 0)
                    else:
                        # Fallback: parser le nom de fichier
                        parsed = parse_filename(pdf_file.name)
                        titre = parsed["titre"] or pdf_file.stem
                        auteur = parsed["auteur"]
                        type_p = CommunicationScientifique.TypePresentation.COMMUNICATION
                        date_soumission = None
                        ordre = parsed["ordre"]

                    # Vérifier si déjà existant (même fichier)
                    if CommunicationScientifique.objects.filter(fichier=rel_dest).exists():
                        skipped += 1
                        self.stdout.write(f"  SKIP: {pdf_file.name}")
                        continue

                    CommunicationScientifique.objects.create(
                        titre=titre[:500],
                        auteur=auteur[:300],
                        type_presentation=type_p,
                        theme=theme,
                        fichier=rel_dest,
                        date_soumission=date_soumission,
                        congres=options["congres"],
                        ordre=ordre,
                    )
                    created += 1
                    self.stdout.write(f"  OK: {pdf_file.name}")

                except Exception as exc:
                    errors += 1
                    self.stderr.write(self.style.ERROR(f"  ERR: {pdf_file.name}: {exc}"))

        self.stdout.write(self.style.SUCCESS(
            f"\n\nImport terminé: {created} créées, {skipped} ignorées, {errors} erreurs."
        ))

    def _parse_index(self, index_path: Path) -> dict:
        """
        Parse l'INDEX_SOUMISSIONS.txt pour récupérer titre/auteur/type par thème.
        Retourne un dict indexé par le nom de fichier (sans extension) ou par numéro+auteur.
        """
        data = {}
        current_theme = CommunicationScientifique.Theme.COMMUNICATION_LIBRE
        current_ordre = 0
        current_entry = {}

        folder_theme_map = {
            "COMMUNICATION LIBRE": CommunicationScientifique.Theme.COMMUNICATION_LIBRE,
            "DISPONIB": CommunicationScientifique.Theme.DISPONIBILITE_ACCESSIBILITE,
            "ÉTHIQUE": CommunicationScientifique.Theme.ETHIQUE_QUALITE,
            "GESTION": CommunicationScientifique.Theme.GESTION_STRUCTURES,
            "NUMÉRIQUE": CommunicationScientifique.Theme.NUMERIQUE_SANTE,
            "NUTRITION": CommunicationScientifique.Theme.NUTRITION,
            "PLANIFICATION": CommunicationScientifique.Theme.PLANIFICATION_FAMILIALE,
            "SANTÉ MENTALE": CommunicationScientifique.Theme.SANTE_MENTALE,
            "SOINS AU NOUVEAU": CommunicationScientifique.Theme.SOINS_NOUVEAU_NE,
            "SOINS OBST": CommunicationScientifique.Theme.SOINS_OBSTETRICAUX_SONU,
            "VACCINATION": CommunicationScientifique.Theme.VACCINATION,
        }

        with open(index_path, encoding="utf-8", errors="replace") as f:
            lines = f.readlines()

        entries = []

        for line in lines:
            line_stripped = line.strip()

            # Détecter un en-tête de thème (ligne avec 📁 ou en majuscules entre parenthèses)
            if "📁" in line or (line_stripped.startswith("📁")):
                theme_text = line_stripped.replace("📁", "").strip().upper()
                for key, theme_val in folder_theme_map.items():
                    if key in theme_text:
                        current_theme = theme_val
                        break
                continue

            # Détecter une entrée numérotée: "01. Titre..."
            m = re.match(r'^(\d+)\.\s+(.+)$', line_stripped)
            if m:
                if current_entry:
                    entries.append(current_entry)
                current_ordre = int(m.group(1))
                current_entry = {
                    "titre": m.group(2).strip(),
                    "auteur": "",
                    "type_presentation": CommunicationScientifique.TypePresentation.COMMUNICATION,
                    "date_soumission": None,
                    "theme": current_theme,
                    "ordre": current_ordre,
                }
                continue

            if current_entry:
                if line_stripped.startswith("Auteur:"):
                    current_entry["auteur"] = line_stripped.replace("Auteur:", "").strip()
                elif line_stripped.startswith("Type:"):
                    type_raw = line_stripped.replace("Type:", "").strip().lower()
                    if "poster" in type_raw:
                        current_entry["type_presentation"] = CommunicationScientifique.TypePresentation.POSTER
                    elif any(k in type_raw for k in ["conférence", "conference", "panel", "symposium"]):
                        current_entry["type_presentation"] = CommunicationScientifique.TypePresentation.CONFERENCE
                    else:
                        current_entry["type_presentation"] = CommunicationScientifique.TypePresentation.COMMUNICATION
                elif line_stripped.startswith("Soumis le:"):
                    date_str = line_stripped.replace("Soumis le:", "").strip()
                    try:
                        current_entry["date_soumission"] = datetime.strptime(date_str, "%d/%m/%Y").date()
                    except ValueError:
                        pass

        if current_entry:
            entries.append(current_entry)

        # Indexer par (numéro+auteur normalisé) pour matcher les noms de fichiers
        # Les fichiers sont nommés: 01_Auteur_Titre.pdf
        result = {}
        for entry in entries:
            auteur_normalized = entry["auteur"].split()[0].replace("'", "").replace("é", "e").replace("è", "e").replace("ê", "e").replace("à", "a").replace("â", "a").replace("ô", "o").replace("î", "i") if entry["auteur"] else "Unknown"
            key = f"{entry['ordre']:02d}_{auteur_normalized}"
            result[key] = entry

        # Aussi indexer par entrées complètes pour recherche exacte
        for entry in entries:
            result[f"entry_{entry['theme']}_{entry['ordre']}"] = entry

        return result
