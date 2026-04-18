import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("axios", () => {
  const mockAxios: any = {
    create: vi.fn(() => mockAxios),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    defaults: { baseURL: "http://localhost:8000/api" },
  };
  return { default: mockAxios };
});

describe("eventsApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("list calls GET /events/", async () => {
    const { default: api } = await import("../api/client");
    const { eventsApi } = await import("../api/events");

    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
    await eventsApi.list();
    expect(api.get).toHaveBeenCalledWith("/events/", { params: undefined });
  });

  it("detail calls GET /events/:id/", async () => {
    const { default: api } = await import("../api/client");
    const { eventsApi } = await import("../api/events");

    vi.mocked(api.get).mockResolvedValueOnce({ data: { id: 1 } });
    await eventsApi.detail(1);
    expect(api.get).toHaveBeenCalledWith("/events/1/");
  });

  it("inscrire calls POST /events/inscriptions/", async () => {
    const { default: api } = await import("../api/client");
    const { eventsApi } = await import("../api/events");

    vi.mocked(api.post).mockResolvedValueOnce({ data: { id: 1 } });
    await eventsApi.inscrire({
      event: 1,
      nom: "A",
      prenom: "B",
      email: "a@b.com",
      type_participation: "participant",
    });
    expect(api.post).toHaveBeenCalledWith(
      "/events/inscriptions/",
      expect.objectContaining({ event: 1 }),
    );
  });

  it("soumettreAbstract sends FormData", async () => {
    const { default: api } = await import("../api/client");
    const { eventsApi } = await import("../api/events");

    vi.mocked(api.post).mockResolvedValueOnce({ data: { id: 1 } });
    await eventsApi.soumettreAbstract({
      event: 1,
      auteur_nom: "Dr X",
      auteur_email: "x@t.com",
      titre: "Test",
      type_soumission: "orale",
      resume_texte: "Résumé",
      co_auteurs: "Y, Z",
      mots_cles: "clé1, clé2",
    });
    expect(api.post).toHaveBeenCalledWith(
      "/events/abstracts/",
      expect.any(FormData),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  });
});

describe("adminApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stats calls GET /members/list/stats/", async () => {
    const { default: api } = await import("../api/client");
    const { adminApi } = await import("../api/admin");

    vi.mocked(api.get).mockResolvedValueOnce({ data: {} });
    await adminApi.stats();
    expect(api.get).toHaveBeenCalledWith("/members/list/stats/");
  });

  it("membres calls GET /members/list/", async () => {
    const { default: api } = await import("../api/client");
    const { adminApi } = await import("../api/admin");

    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
    await adminApi.membres({ statut: "actif" });
    expect(api.get).toHaveBeenCalledWith("/members/list/", {
      params: { statut: "actif" },
    });
  });

  it("validerMembre calls POST /members/list/:id/valider/", async () => {
    const { default: api } = await import("../api/client");
    const { adminApi } = await import("../api/admin");

    vi.mocked(api.post).mockResolvedValueOnce({ data: { message: "ok" } });
    await adminApi.validerMembre(5);
    expect(api.post).toHaveBeenCalledWith("/members/list/5/valider/");
  });

  it("suspendreMembre calls POST", async () => {
    const { default: api } = await import("../api/client");
    const { adminApi } = await import("../api/admin");

    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    await adminApi.suspendreMembre(3);
    expect(api.post).toHaveBeenCalledWith("/members/list/3/suspendre/");
  });

  it("reactiverMembre calls POST", async () => {
    const { default: api } = await import("../api/client");
    const { adminApi } = await import("../api/admin");

    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    await adminApi.reactiverMembre(3);
    expect(api.post).toHaveBeenCalledWith("/members/list/3/reactiver/");
  });

  it("deleteMembre calls DELETE", async () => {
    const { default: api } = await import("../api/client");
    const { adminApi } = await import("../api/admin");

    vi.mocked(api.delete).mockResolvedValueOnce({ data: {} });
    await adminApi.deleteMembre(2);
    expect(api.delete).toHaveBeenCalledWith("/members/list/2/");
  });

  it("cotisations calls GET /members/cotisations/", async () => {
    const { default: api } = await import("../api/client");
    const { adminApi } = await import("../api/admin");

    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
    await adminApi.cotisations();
    expect(api.get).toHaveBeenCalledWith("/members/cotisations/", {
      params: undefined,
    });
  });

  it("marquerPayeCotisation calls POST", async () => {
    const { default: api } = await import("../api/client");
    const { adminApi } = await import("../api/admin");

    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    await adminApi.marquerPayeCotisation(1, {
      mode_paiement: "mobile_money",
      reference: "REF1",
    });
    expect(api.post).toHaveBeenCalledWith(
      "/members/cotisations/1/marquer-paye/",
      { mode_paiement: "mobile_money", reference: "REF1" },
    );
  });

  it("creerEvenement calls POST /events/admin/", async () => {
    const { default: api } = await import("../api/client");
    const { adminApi } = await import("../api/admin");

    vi.mocked(api.post).mockResolvedValueOnce({ data: { id: 1 } });
    await adminApi.creerEvenement({ titre: "Conf" } as any);
    expect(api.post).toHaveBeenCalledWith("/events/admin/", { titre: "Conf" });
  });

  it("modifierEvenement calls PATCH", async () => {
    const { default: api } = await import("../api/client");
    const { adminApi } = await import("../api/admin");

    vi.mocked(api.patch).mockResolvedValueOnce({ data: {} });
    await adminApi.modifierEvenement(1, { titre: "New" } as any);
    expect(api.patch).toHaveBeenCalledWith("/events/admin/1/", {
      titre: "New",
    });
  });

  it("supprimerEvenement calls DELETE", async () => {
    const { default: api } = await import("../api/client");
    const { adminApi } = await import("../api/admin");

    vi.mocked(api.delete).mockResolvedValueOnce({ data: {} });
    await adminApi.supprimerEvenement(1);
    expect(api.delete).toHaveBeenCalledWith("/events/admin/1/");
  });
});
