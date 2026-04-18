import api from "./client";
import type { PaginatedResponse } from "./members";

export interface EventSummary {
  id: number;
  titre: string;
  description: string;
  lieu: string;
  date_debut: string;
  date_fin: string;
  est_actif: boolean;
  nb_inscrits: number;
}

export interface EventDetail extends EventSummary {
  programme: string;
  intervenants: string;
  intervenants_list: string[];
}

export interface EventRegistration {
  id: number;
  event: number;
  event_titre: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  institution: string;
  type_participation: string;
  titre_communication: string;
  statut: string;
  created_at: string;
  type_participation_display?: string;
  statut_display?: string;
}

export interface RegistrationData {
  event: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  institution?: string;
  type_participation: "participant" | "communicant" | "atelier";
  titre_communication?: string;
}

export interface AbstractData {
  event: number;
  auteur_nom: string;
  auteur_email: string;
  co_auteurs?: string;
  titre: string;
  type_soumission: "orale" | "poster" | "atelier";
  resume_texte: string;
  fichier?: File;
  mots_cles?: string;
}

export interface AbstractItem {
  id: number;
  event: number;
  event_titre: string;
  auteur_nom: string;
  auteur_email: string;
  co_auteurs: string;
  titre: string;
  type_soumission: string;
  resume_texte: string;
  fichier: string | null;
  mots_cles: string;
  statut: string;
  statut_display?: string;
  commentaire_comite?: string;
  type_soumission_display?: string;
  created_at: string;
}

export const eventsApi = {
  list: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<EventSummary>>("/events/", { params }),

  detail: (id: number) => api.get<EventDetail>(`/events/${id}/`),

  inscrire: (data: RegistrationData) =>
    api.post<{ message: string; id: number }>("/events/inscriptions/", data),

  soumettreAbstract: (data: AbstractData) => {
    const formData = new FormData();
    formData.append("event", String(data.event));
    formData.append("auteur_nom", data.auteur_nom);
    formData.append("auteur_email", data.auteur_email);
    formData.append("titre", data.titre);
    formData.append("type_soumission", data.type_soumission);
    formData.append("resume_texte", data.resume_texte);
    if (data.co_auteurs) formData.append("co_auteurs", data.co_auteurs);
    if (data.fichier) formData.append("fichier", data.fichier);
    if (data.mots_cles) formData.append("mots_cles", data.mots_cles);
    return api.post<{ message: string; id: number }>(
      "/events/abstracts/",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },
};

/* ── Espace scientifique ── */
export interface Publication {
  id: number;
  titre: string;
  auteur: string;
  type_presentation: "communication" | "poster" | "conference";
  type_presentation_display: string;
  theme: string;
  theme_display: string;
  fichier_url: string | null;
  date_soumission: string | null;
  congres: string;
  ordre: number;
}

export const THEMES: { value: string; label: string }[] = [
  { value: "", label: "Tous les thèmes" },
  { value: "communication_libre", label: "Communication libre" },
  {
    value: "disponibilite_accessibilite",
    label: "Disponibilité et accessibilité",
  },
  { value: "ethique_qualite", label: "Éthique et qualité des soins" },
  { value: "gestion_structures", label: "Gestion des structures" },
  { value: "numerique_sante", label: "Numérique et santé" },
  { value: "nutrition", label: "Nutrition maternelle et infantile" },
  { value: "planification_familiale", label: "Planification familiale" },
  { value: "sante_mentale", label: "Santé mentale" },
  { value: "soins_nouveau_ne", label: "Soins au nouveau-né" },
  { value: "soins_obstetricaux_sonu", label: "SONU" },
  { value: "vaccination", label: "Vaccination" },
];

export const publicationsApi = {
  list: (params?: Record<string, string>) =>
    api.get<Publication[]>("/events/publications/", {
      params,
    }),
};
