import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const mockSoumettre = vi.fn();

vi.mock("../api/members", () => ({
  adhesionApi: {
    soumettre: (...args: any[]) => mockSoumettre(...args),
    monProfil: vi.fn(),
    updateProfil: vi.fn(),
    mesCotisations: vi.fn(),
    annuaire: vi.fn(),
    attestation: vi.fn(),
  },
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
    requestReset: vi.fn(),
    confirmReset: vi.fn(),
  },
  paymentApi: { initierPaiement: vi.fn() },
}));

vi.mock("../api/client", () => ({
  default: {
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    defaults: { baseURL: "http://localhost:8000/api" },
  },
}));

describe("AdhesionPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders step 1 form", async () => {
    const AdhesionPage = (await import("../pages/AdhesionPage")).default;
    render(
      <MemoryRouter>
        <AdhesionPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Dossier d'adhésion")).toBeInTheDocument();
    // Step 1 should have name fields
    expect(screen.getByPlaceholderText("Nom de famille")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Prénom")).toBeInTheDocument();
  });

  it("shows validation error when required fields empty", async () => {
    const AdhesionPage = (await import("../pages/AdhesionPage")).default;
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdhesionPage />
      </MemoryRouter>,
    );

    // Try to go to step 2 without filling required fields
    await user.click(screen.getByText("Suivant"));

    await waitFor(() => {
      expect(
        screen.getByText("Veuillez remplir tous les champs obligatoires."),
      ).toBeInTheDocument();
    });
  });

  it("navigates through steps when fields are filled", async () => {
    const AdhesionPage = (await import("../pages/AdhesionPage")).default;
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdhesionPage />
      </MemoryRouter>,
    );

    // Fill step 1
    await user.type(screen.getByPlaceholderText("Nom de famille"), "Dupont");
    await user.type(screen.getByPlaceholderText("Prénom"), "Jean");
    await user.type(screen.getByPlaceholderText("vous@exemple.com"), "j@t.com");

    // Select profession
    const profSelect = screen.getByDisplayValue("Sélectionnez");
    await user.selectOptions(profSelect, "Médecin gynécologue-obstétricien");

    await user.click(screen.getByText("Suivant"));

    // Should be on step 2 now - check for category selection
    await waitFor(() => {
      expect(screen.getByText("Professionnel de Santé")).toBeInTheDocument();
    });
  });

  it("shows success after submission", async () => {
    mockSoumettre.mockResolvedValueOnce({
      data: { numero_membre: "RMB-2025-0001" },
    });
    const AdhesionPage = (await import("../pages/AdhesionPage")).default;
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdhesionPage />
      </MemoryRouter>,
    );

    // Fill step 1
    await user.type(screen.getByPlaceholderText("Nom de famille"), "Dupont");
    await user.type(screen.getByPlaceholderText("Prénom"), "Jean");
    await user.type(screen.getByPlaceholderText("vous@exemple.com"), "j@t.com");
    const profSelect = screen.getByDisplayValue("Sélectionnez");
    await user.selectOptions(profSelect, "Médecin gynécologue-obstétricien");
    await user.click(screen.getByText("Suivant"));

    // Step 2: just click next (default category is professionnel)
    await waitFor(() => {
      expect(screen.getByText("Professionnel de Santé")).toBeInTheDocument();
    });
    await user.click(screen.getByText("Suivant"));

    // Step 3: submit
    await waitFor(() => {
      expect(screen.getByText("Soumettre ma demande")).toBeInTheDocument();
    });
    await user.click(screen.getByText("Soumettre ma demande"));

    await waitFor(() => {
      expect(screen.getByText("Demande enregistrée !")).toBeInTheDocument();
      expect(screen.getByText(/RMB-2025-0001/)).toBeInTheDocument();
    });
  });
});
