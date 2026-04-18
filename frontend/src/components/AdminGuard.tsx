import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Array<"bureau" | "tresorier" | "comite_scientifique">;
}) {
  const { isAuthenticated, isAdmin, loading, user, canAccessAdmin } = useAuth();

  if (loading)
    return (
      <div style={{ padding: 80, textAlign: "center", color: "#6b7280" }}>
        Chargement…
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/connexion" replace />;
  if (!canAccessAdmin) return <Navigate to="/espace-membre" replace />;

  const currentRole = user?.role ?? "membre";
  if (
    !isAdmin &&
    allowedRoles &&
    (currentRole === "membre" || !allowedRoles.includes(currentRole))
  ) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
