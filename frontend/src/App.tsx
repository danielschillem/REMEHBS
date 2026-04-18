import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdhesionPage from "./pages/AdhesionPage";
import EspaceMembrePage from "./pages/EspaceMembrePage";
import LoginPage from "./pages/LoginPage";
import MotDePasseOubliePage from "./pages/MotDePasseOubliePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EspaceScientifiquePage from "./pages/EspaceScientifiquePage";
import EvenementsPage from "./pages/EvenementsPage";
import EvenementDetailPage from "./pages/EvenementDetailPage";
import SoumissionAbstractPage from "./pages/SoumissionAbstractPage";
import Layout from "./components/Layout";
import AdminGuard from "./components/AdminGuard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMembres from "./pages/admin/AdminMembres";
import AdminCotisations from "./pages/admin/AdminCotisations";
import AdminEvenements from "./pages/admin/AdminEvenements";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/adhesion" element={<AdhesionPage />} />
        <Route path="/espace-membre/*" element={<EspaceMembrePage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOubliePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/espace-scientifique"
          element={<EspaceScientifiquePage />}
        />
        <Route path="/evenements" element={<EvenementsPage />} />
        <Route path="/evenements/:id" element={<EvenementDetailPage />} />
        <Route
          path="/evenements/:id/soumettre"
          element={<SoumissionAbstractPage />}
        />
        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminGuard allowedRoles={["bureau"]}>
              <AdminDashboard />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/membres"
          element={
            <AdminGuard allowedRoles={["bureau"]}>
              <AdminMembres />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/cotisations"
          element={
            <AdminGuard allowedRoles={["bureau", "tresorier"]}>
              <AdminCotisations />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/evenements"
          element={
            <AdminGuard allowedRoles={["bureau", "comite_scientifique"]}>
              <AdminEvenements />
            </AdminGuard>
          }
        />
      </Route>
    </Routes>
  );
}
