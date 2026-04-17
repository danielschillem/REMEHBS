import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading)
    return (
      <div style={{ padding: 80, textAlign: "center", color: "#6b7280" }}>
        Chargement…
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/connexion" replace />;
  if (!isAdmin) return <Navigate to="/espace-membre" replace />;

  return <>{children}</>;
}
