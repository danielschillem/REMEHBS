/**
 * Programme scientifique des 8èmes Journées Scientifiques de Périnatalité (JSP 2025)
 * Données extraites des PDF officiels (Communication/COMMUNICATION REMEHBS/).
 * Le manifest brut est généré par scripts/build-jsp2025-catalog.ps1.
 */

import manifest from "./programme-jsp-2025.manifest.json";

export type SessionKind = "conference" | "panel" | "symposium";

export interface PlenaryItem {
  kind: SessionKind;
  code: string;
  rawTitle: string;
  /** Titre nettoyé pour l'affichage (sans préfixe redondant). */
  displayTitle: string;
  /** Étiquette courte (« Conférence 1 », « Panel 3 », « Symposium »). */
  label: string;
  file: string;
  fileName: string;
  sizeBytes: number;
}

export interface OralCommunication {
  /** Code normalisé (ex. « CO1 », « CO42 »). Vide pour les rares fichiers sans code. */
  code: string;
  rawTitle: string;
  /** Titre nettoyé pour l'affichage. */
  displayTitle: string;
  file: string;
  fileName: string;
  sizeBytes: number;
  /** Lien remontant vers la session/salle pour le filtrage. */
  sessionNumber: number;
  sessionSlug: string;
  roomName: string;
  roomSlug: string;
}

export interface Session {
  name: string;
  number: number;
  slug: string;
  communications: OralCommunication[];
}

export interface Room {
  name: string;
  slug: string;
  sessions: Session[];
}

export interface Programme {
  edition: string;
  abbreviation: string;
  year: number;
  city: string;
  country: string;
  organizer: string;
  conferences: PlenaryItem[];
  panels: PlenaryItem[];
  symposiums: PlenaryItem[];
  rooms: Room[];
}

/* ──────────────────────────────────────────────────────────────────────────
   Helpers de nettoyage des titres (les noms de fichiers sont parfois bruts)
   ────────────────────────────────────────────────────────────────────────── */

const CO_RE = /^C\s*[0O]\s*(\d+)\b[\s\-_:]*/i;

function normaliseCode(raw: string): string {
  const m = raw.match(/^(C\s*[0O]\s*\d+)/i);
  if (!m) return "";
  return m[1].replace(/\s+/g, "").replace(/^C0/i, "CO").toUpperCase();
}

function cleanTitle(raw: string): string {
  let t = raw.trim();
  // Supprimer le préfixe « CO12 », « CO 14 », « C016 » et son séparateur
  t = t.replace(CO_RE, "");
  // Coller un espace après les chiffres si soudé au texte (« CO28Evaluation »)
  t = t.replace(/^(\d+)([A-Za-zÀ-ÿ])/, "$1 $2");
  // Nettoyer les espaces, doubles tirets, soulignages collés
  t = t
    .replace(/\s+/g, " ")
    .replace(/^[\-_:·\s]+/, "")
    .trim();
  return t;
}

function plenaryLabel(item: { kind: SessionKind; rawTitle: string }): string {
  const t = item.rawTitle;
  const confMatch = t.match(/^Conf[eé]rence\s*([\d.]+)/i);
  if (confMatch) return `Conférence ${confMatch[1]}`;
  const panelMatch = t.match(/^PANEL\s*(\d+)/i);
  if (panelMatch) return `Panel ${panelMatch[1]}`;
  if (/^Symposium/i.test(t)) return "Symposium";
  if (item.kind === "symposium") return "Symposium";
  if (item.kind === "panel") return "Panel";
  return "Conférence";
}

function plenaryDisplayTitle(rawTitle: string): string {
  let t = rawTitle.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  // Retirer le préfixe « Conférence 3 », « PANEL 4 »
  t = t.replace(/^(Conf[eé]rence|Conference|PANEL|Symposium)\s*[\d.]*\s*[-:_]?\s*/i, "");
  // Nettoyer mention "VFinale", "VF" et compagnie en fin
  t = t.replace(/\b(VFinale|VF|- Copie)\b/gi, "").trim();
  return t || rawTitle;
}

/* ──────────────────────────────────────────────────────────────────────────
   Adaptation du manifest brut → structures typées + helpers
   ────────────────────────────────────────────────────────────────────────── */

interface RawPlenary {
  kind: string;
  code: string;
  rawTitle: string;
  file: string;
  fileName: string;
  sizeBytes: number;
}

interface RawComm {
  code: string;
  rawTitle: string;
  title: string;
  file: string;
  fileName: string;
  sizeBytes: number;
}

interface RawSession {
  name: string;
  number: number;
  slug: string;
  communications: RawComm[];
}

interface RawRoom {
  name: string;
  slug: string;
  sessions: RawSession[];
}

interface RawManifest {
  edition: string;
  abbreviation: string;
  year: number;
  city: string;
  country: string;
  organizer: string;
  conferences: RawPlenary[];
  panels: RawPlenary[];
  symposiums: RawPlenary[];
  rooms: RawRoom[];
}

const raw = manifest as RawManifest;

function adaptPlenary(p: RawPlenary): PlenaryItem {
  const kind = p.kind as SessionKind;
  return {
    kind,
    code: p.code,
    rawTitle: p.rawTitle,
    displayTitle: plenaryDisplayTitle(p.rawTitle),
    label: plenaryLabel({ kind, rawTitle: p.rawTitle }),
    file: p.file,
    fileName: p.fileName,
    sizeBytes: p.sizeBytes,
  };
}

const rooms: Room[] = raw.rooms.map((r) => ({
  name: r.name,
  slug: r.slug,
  sessions: r.sessions.map((s) => ({
    name: s.name,
    number: s.number,
    slug: s.slug,
    communications: s.communications.map((c) => ({
      code: c.code || normaliseCode(c.rawTitle),
      rawTitle: c.rawTitle,
      displayTitle: cleanTitle(c.title || c.rawTitle),
      file: c.file,
      fileName: c.fileName,
      sizeBytes: c.sizeBytes,
      sessionNumber: s.number,
      sessionSlug: s.slug,
      roomName: r.name,
      roomSlug: r.slug,
    })),
  })),
}));

export const programme: Programme = {
  edition: raw.edition,
  abbreviation: raw.abbreviation,
  year: raw.year,
  city: raw.city,
  country: raw.country,
  organizer: raw.organizer,
  conferences: raw.conferences.map(adaptPlenary),
  panels: raw.panels.map(adaptPlenary),
  symposiums: raw.symposiums.map(adaptPlenary),
  rooms,
};

/* ──────────────────────────────────────────────────────────────────────────
   Vues dérivées utilisées par la page
   ────────────────────────────────────────────────────────────────────────── */

export const allOralCommunications: OralCommunication[] = rooms.flatMap((r) =>
  r.sessions.flatMap((s) => s.communications),
);

export const plenarySessions: PlenaryItem[] = [
  ...programme.conferences,
  ...programme.symposiums,
  ...programme.panels,
];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function programmeStats() {
  const oralCount = allOralCommunications.length;
  const sessionCount = rooms.reduce((acc, r) => acc + r.sessions.length, 0);
  return {
    conferences: programme.conferences.length,
    panels: programme.panels.length,
    symposiums: programme.symposiums.length,
    plenaryTotal: plenarySessions.length,
    oralCount,
    sessionCount,
    roomCount: rooms.length,
  };
}
