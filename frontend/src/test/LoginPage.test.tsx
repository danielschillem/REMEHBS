import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// Mock auth context
const mockLogin = vi.fn();
const mockLogout = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    isAdmin: false,
    login: mockLogin,
    logout: mockLogout,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("../api/members", () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
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
  paymentApi: { initierPaiement: vi.fn() },
}));

vi.mock("../api/client", () => ({
  default: {
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    defaults: { baseURL: "http://localhost:8000/api" },
  },
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form", async () => {
    const LoginPage = (await import("../pages/LoginPage")).default;
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Connexion membre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("vous@exemple.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByText("Se connecter")).toBeInTheDocument();
  });

  it("calls login on form submit", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    const LoginPage = (await import("../pages/LoginPage")).default;
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByPlaceholderText("vous@exemple.com"),
      "test@mail.com",
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "mypassword");
    await user.click(screen.getByText("Se connecter"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@mail.com", "mypassword");
    });
  });

  it("shows error on login failure", async () => {
    mockLogin.mockRejectedValueOnce(new Error("fail"));
    const LoginPage = (await import("../pages/LoginPage")).default;
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByPlaceholderText("vous@exemple.com"),
      "bad@mail.com",
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "wrong");
    await user.click(screen.getByText("Se connecter"));

    await waitFor(() => {
      expect(
        screen.getByText("Email ou mot de passe incorrect."),
      ).toBeInTheDocument();
    });
  });

  it("has link to adhesion page", async () => {
    const LoginPage = (await import("../pages/LoginPage")).default;
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Adhérer maintenant")).toBeInTheDocument();
  });
});
