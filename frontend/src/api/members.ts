import api from "./client";

/* ── Réponse paginée DRF ── */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AdhesionData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  profession: string;
  specialite?: string;
  structure?: string;
  ville?: string;
  province?: string;
  categorie: "etudiant" | "professionnel" | "institution";
  message?: string;
  password?: string;
  password2?: string;
}

export interface Member {
  id: number;
  numero_membre: string;
  nom: string;
  prenom: string;
  nom_complet: string;
  email: string;
  telephone: string;
  profession: string;
  specialite: string;
  structure: string;
  ville: string;
  province: string;
  categorie: string;
  categorie_display: string;
  statut: string;
  statut_display: string;
  role: "membre" | "bureau" | "tresorier" | "comite_scientifique";
  role_display?: string;
  est_a_jour: boolean;
  montant_adhesion: number;
  cotisations: Cotisation[];
  is_staff: boolean;
  photo: string | null;
}

export interface Cotisation {
  id: number;
  annee: number;
  montant: number;
  statut: string;
  statut_display: string;
  mode_paiement: string;
  mode_paiement_display: string;
  reference: string;
  paid_at: string | null;
  membre_nom?: string;
}

export interface MemberPublic {
  numero_membre: string;
  nom_complet: string;
  profession: string;
  specialite: string;
  structure: string;
  categorie_display: string;
}

export const adhesionApi = {
  soumettre: (data: AdhesionData) => api.post("/members/adhesion/", data),

  monProfil: () => api.get<Member>("/members/moi/"),

  updateProfil: (data: Partial<Member>) =>
    api.patch<Member>("/members/moi/", data),

  uploadPhoto: (file: File) => {
    const form = new FormData();
    form.append("photo", file);
    return api.patch<Member>("/members/moi/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  mesCotisations: () => api.get<Cotisation[]>("/members/mes-cotisations/"),

  annuaire: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<MemberPublic>>("/members/annuaire/", { params }),

  attestation: () => api.get("/members/attestation/", { responseType: "blob" }),
};

export const paymentApi = {
  initierPaiement: (annee: number) =>
    api.post<{ payment_url: string; transaction_id: string }>(
      "/payments/initier/",
      { annee },
    ),

  recuPaiement: (cotisationId: number) =>
    api.get(`/payments/recu/${cotisationId}/`, { responseType: "blob" }),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ access: string; refresh: string }>("/auth/login/", {
      email,
      password,
    }),

  requestReset: (email: string) => api.post("/auth/password-reset/", { email }),

  confirmReset: (uid: string, token: string, password: string) =>
    api.post("/auth/password-reset-confirm/", { uid, token, password }),

  logout: (refresh: string) => api.post("/auth/logout/", { refresh }),
};

export interface AppNotification {
  id: number;
  type: string;
  type_display: string;
  titre: string;
  message: string;
  lue: boolean;
  lien: string;
  created_at: string;
}

export const notificationApi = {
  list: () => api.get<AppNotification[]>("/members/notifications/"),

  count: () => api.get<{ non_lues: number }>("/members/notifications/count/"),

  markRead: (ids?: number[]) =>
    api.post("/members/notifications/marquer-lues/", { ids: ids || [] }),
};
