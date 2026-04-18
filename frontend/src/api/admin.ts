import api from "./client";
import type { Member, Cotisation, PaginatedResponse } from "./members";
import type {
  EventSummary,
  EventDetail,
  EventRegistration,
  AbstractItem,
} from "./events";

/* ── Stats ── */
export interface DashboardStats {
  total_membres: number;
  membres_actifs: number;
  en_attente_validation: number;
  cotisations_payees_cette_annee: number;
}

/* ── Admin API ── */
export const adminApi = {
  /* Stats */
  stats: () => api.get<DashboardStats>("/members/list/stats/"),

  /* Membres */
  membres: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Member>>("/members/list/", { params }),

  membre: (id: number) => api.get<Member>(`/members/list/${id}/`),

  validerMembre: (id: number) =>
    api.post<{ message: string }>(`/members/list/${id}/valider/`),

  suspendreMembre: (id: number) =>
    api.post<{ message: string }>(`/members/list/${id}/suspendre/`),

  reactiverMembre: (id: number) =>
    api.post<{ message: string }>(`/members/list/${id}/reactiver/`),

  deleteMembre: (id: number) => api.delete(`/members/list/${id}/`),

  /* Cotisations */
  cotisations: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Cotisation>>("/members/cotisations/", { params }),

  marquerPayeCotisation: (
    id: number,
    data: { mode_paiement?: string; reference?: string },
  ) =>
    api.post<{ message: string }>(
      `/members/cotisations/${id}/marquer-paye/`,
      data,
    ),

  /* Événements */
  evenements: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<EventSummary>>("/events/admin/", { params }),

  evenement: (id: number) => api.get<EventDetail>(`/events/admin/${id}/`),

  creerEvenement: (data: Partial<EventDetail>) =>
    api.post<EventDetail>("/events/admin/", data),

  modifierEvenement: (id: number, data: Partial<EventDetail>) =>
    api.patch<EventDetail>(`/events/admin/${id}/`, data),

  supprimerEvenement: (id: number) => api.delete(`/events/admin/${id}/`),

  inscriptionsEvenements: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<EventRegistration>>(
      "/events/admin-inscriptions/",
      { params },
    ),

  confirmerInscriptionEvenement: (id: number) =>
    api.post<{ message: string }>(
      `/events/admin-inscriptions/${id}/confirmer/`,
    ),

  annulerInscriptionEvenement: (id: number) =>
    api.post<{ message: string }>(`/events/admin-inscriptions/${id}/annuler/`),

  abstractsEvenements: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<AbstractItem>>("/events/admin-abstracts/", {
      params,
    }),

  majStatutAbstract: (
    id: number,
    data: { statut: string; commentaire_comite?: string },
  ) =>
    api.post<{ message: string }>(
      `/events/admin-abstracts/${id}/statut/`,
      data,
    ),
};
