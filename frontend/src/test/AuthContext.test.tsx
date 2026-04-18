import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Mock the API modules
vi.mock("../api/members", () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn().mockResolvedValue({}),
    requestReset: vi.fn(),
    confirmReset: vi.fn(),
  },
  adhesionApi: {
    soumettre: vi.fn(),
    monProfil: vi.fn(),
    updateProfil: vi.fn(),
    mesCotisations: vi.fn(),
    annuaire: vi.fn(),
    attestation: vi.fn(),
  },
  paymentApi: {
    initierPaiement: vi.fn(),
  },
}));

vi.mock("../api/client", () => ({
  default: {
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    defaults: { baseURL: "http://localhost:8000/api" },
  },
}));

function AuthConsumer() {
  const { user, loading, isAuthenticated, isAdmin, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="admin">{String(isAdmin)}</span>
      <span data-testid="user">{user ? user.nom : "null"}</span>
      <button onClick={() => login("test@t.com", "pass")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("starts unauthenticated when no token", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("authenticated").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("null");
  });

  it("loads profile when token exists", async () => {
    localStorage.setItem("access_token", "fake-token");
    const { adhesionApi } = await import("../api/members");
    vi.mocked(adhesionApi.monProfil).mockResolvedValueOnce({
      data: { id: 1, nom: "Dupont", prenom: "Jean", is_staff: false } as any,
    } as any);

    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("authenticated").textContent).toBe("true");
    expect(screen.getByTestId("user").textContent).toBe("Dupont");
  });

  it("clears state on failed profile fetch", async () => {
    localStorage.setItem("access_token", "bad-token");
    const { adhesionApi } = await import("../api/members");
    vi.mocked(adhesionApi.monProfil).mockRejectedValueOnce(new Error("401"));

    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("authenticated").textContent).toBe("false");
    expect(localStorage.getItem("access_token")).toBeNull();
  });

  it("login stores tokens and loads profile", async () => {
    const { authApi, adhesionApi } = await import("../api/members");
    vi.mocked(authApi.login).mockResolvedValueOnce({
      data: { access: "new-access", refresh: "new-refresh" },
    } as any);
    vi.mocked(adhesionApi.monProfil).mockResolvedValueOnce({
      data: { id: 1, nom: "Martin", prenom: "Luc", is_staff: true } as any,
    } as any);

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("authenticated").textContent).toBe("true");
    });
    expect(screen.getByTestId("user").textContent).toBe("Martin");
    expect(screen.getByTestId("admin").textContent).toBe("true");
    expect(localStorage.getItem("access_token")).toBe("new-access");
  });

  it("logout clears everything", async () => {
    localStorage.setItem("access_token", "tok");
    localStorage.setItem("refresh_token", "ref");
    const { adhesionApi } = await import("../api/members");
    vi.mocked(adhesionApi.monProfil).mockResolvedValueOnce({
      data: { id: 1, nom: "X", prenom: "Y", is_staff: false } as any,
    } as any);

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("authenticated").textContent).toBe("true");
    });

    await user.click(screen.getByText("Logout"));

    expect(screen.getByTestId("authenticated").textContent).toBe("false");
    expect(localStorage.getItem("access_token")).toBeNull();
  });
});
