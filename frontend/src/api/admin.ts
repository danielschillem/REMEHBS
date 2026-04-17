import api from "./client";
import type { Member, Cotisation } from "./members";
import type { EventSummary, EventDetail } from "./events";

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
    api.get<Member[]>("/members/list/", { params }),

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
    api.get<Cotisation[]>("/members/cotisations/", { params }),

  marquerPayeCotisation: (
    id: number,
    data: { mode_paiement?: string; reference?: string },
  ) =>
    api.post<{ message: string }>(
      `/members/cotisations/${id}/marquer-paye/`,
      data,
    ),

  /* Événements */
  evenements: () => api.get<EventSummary[]>("/events/admin/"),

  evenement: (id: number) => api.get<EventDetail>(`/events/admin/${id}/`),

  creerEvenement: (data: Partial<EventDetail>) =>
    api.post<EventDetail>("/events/admin/", data),

  modifierEvenement: (id: number, data: Partial<EventDetail>) =>
    api.patch<EventDetail>(`/events/admin/${id}/`, data),

  supprimerEvenement: (id: number) => api.delete(`/events/admin/${id}/`),
};
