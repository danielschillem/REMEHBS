import { describe, it, expect, vi, beforeEach } from "vitest";

// We test the API module by mocking axios
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

describe("API client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("creates an axios instance", async () => {
    const { default: api } = await import("../api/client");
    expect(api).toBeDefined();
    expect(api.interceptors.request.use).toHaveBeenCalled();
    expect(api.interceptors.response.use).toHaveBeenCalled();
  });
});

describe("members API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adhesionApi.soumettre calls POST /members/adhesion/", async () => {
    const { default: api } = await import("../api/client");
    const { adhesionApi } = await import("../api/members");
    const mockData = {
      nom: "Test",
      prenom: "User",
      email: "test@t.com",
      telephone: "123",
      profession: "Dr",
      categorie: "professionnel" as const,
    };

    vi.mocked(api.post).mockResolvedValueOnce({
      data: { numero_membre: "RMB-2025-0001" },
    });
    await adhesionApi.soumettre(mockData as any);
    expect(api.post).toHaveBeenCalledWith("/members/adhesion/", mockData);
  });

  it("adhesionApi.monProfil calls GET /members/moi/", async () => {
    const { default: api } = await import("../api/client");
    const { adhesionApi } = await import("../api/members");

    vi.mocked(api.get).mockResolvedValueOnce({ data: { id: 1, nom: "Test" } });
    await adhesionApi.monProfil();
    expect(api.get).toHaveBeenCalledWith("/members/moi/");
  });

  it("authApi.login calls POST /auth/login/", async () => {
    const { default: api } = await import("../api/client");
    const { authApi } = await import("../api/members");

    vi.mocked(api.post).mockResolvedValueOnce({
      data: { access: "tok", refresh: "ref" },
    });
    await authApi.login("user@test.com", "pass");
    expect(api.post).toHaveBeenCalledWith("/auth/login/", {
      username: "user@test.com",
      password: "pass",
    });
  });

  it("authApi.logout calls POST /auth/logout/", async () => {
    const { default: api } = await import("../api/client");
    const { authApi } = await import("../api/members");

    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    await authApi.logout("refresh-tok");
    expect(api.post).toHaveBeenCalledWith("/auth/logout/", {
      refresh: "refresh-tok",
    });
  });

  it("paymentApi.initierPaiement calls POST /payments/initier/", async () => {
    const { default: api } = await import("../api/client");
    const { paymentApi } = await import("../api/members");

    vi.mocked(api.post).mockResolvedValueOnce({
      data: { payment_url: "https://pay.test", transaction_id: "TXN1" },
    });
    await paymentApi.initierPaiement(2025);
    expect(api.post).toHaveBeenCalledWith("/payments/initier/", {
      annee: 2025,
    });
  });
});
