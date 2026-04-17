import api from "./client";

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
  created_at: string;
}

export const eventsApi = {
  list: () => api.get<EventSummary[]>("/events/"),

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
