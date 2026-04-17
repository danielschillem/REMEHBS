import api from "./client";

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
  structure: string;
  categorie: string;
  categorie_display: string;
  statut: string;
  statut_display: string;
  est_a_jour: boolean;
  montant_adhesion: number;
  cotisations: Cotisation[];
  is_staff: boolean;
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

  mesCotisations: () => api.get<Cotisation[]>("/members/mes-cotisations/"),

  annuaire: () => api.get<MemberPublic[]>("/members/annuaire/"),

  attestation: () => api.get("/members/attestation/", { responseType: "blob" }),
};

export const paymentApi = {
  initierPaiement: (annee: number) =>
    api.post<{ payment_url: string; transaction_id: string }>(
      "/payments/initier/",
      { annee },
    ),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ access: string; refresh: string }>("/auth/login/", {
      username: email,
      password,
    }),

  requestReset: (email: string) => api.post("/auth/password-reset/", { email }),

  confirmReset: (uid: string, token: string, password: string) =>
    api.post("/auth/password-reset-confirm/", { uid, token, password }),

  logout: (refresh: string) => api.post("/auth/logout/", { refresh }),
};
