import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, type DashboardStats } from "../../api/admin";
import {
  Users,
  UserCheck,
  Clock,
  CreditCard,
  ChevronRight,
  CalendarDays,
  FileText,
  LayoutDashboard,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .stats()
      .then((r) => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div style={{ padding: 80, textAlign: "center", color: "#6b7280" }}>
        Chargement…
      </div>
    );

  const cards = [
    {
      label: "Total membres",
      value: stats?.total_membres ?? 0,
      icon: Users,
      color: "#1B1464",
      bg: "#FFF0F5",
    },
    {
      label: "Membres actifs",
      value: stats?.membres_actifs ?? 0,
      icon: UserCheck,
      color: "#00b96b",
      bg: "#e6f9f0",
    },
    {
      label: "En attente",
      value: stats?.en_attente_validation ?? 0,
      icon: Clock,
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      label: "Cotisations payées",
      value: stats?.cotisations_payees_cette_annee ?? 0,
      icon: CreditCard,
      color: "#1B1464",
      bg: "#FFE0E8",
    },
  ];

  const links = [
    {
      to: "/admin/membres",
      label: "Gestion des membres",
      desc: "Valider, suspendre, consulter les profils",
      icon: Users,
    },
    {
      to: "/admin/cotisations",
      label: "Suivi des cotisations",
      desc: "Consulter et marquer les paiements",
      icon: CreditCard,
    },
    {
      to: "/admin/evenements",
      label: "Gestion des événements",
      desc: "Créer, modifier, supprimer les événements",
      icon: CalendarDays,
    },
  ];

  return (
    <div
      style={{ minHeight: "80vh", background: "#f2f3f6", padding: "60px 0" }}
    >
      <div className="container" style={{ maxWidth: 1060 }}>
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "1.75rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <LayoutDashboard size={26} color="#1B1464" /> Tableau de bord
          </h1>
          <p style={{ color: "#6b7280", marginTop: 4 }}>
            Administration REMEHBS — Vue d'ensemble
          </p>
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 36,
          }}
        >
          {cards.map((c) => (
            <div
              key={c.label}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px 20px",
                boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: c.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <c.icon size={22} color={c.color} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: c.color,
                  }}
                >
                  {c.value}
                </div>
                <div style={{ fontSize: ".8rem", color: "#6b7280" }}>
                  {c.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <h2
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FileText size={18} color="#1B1464" /> Accès rapides
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "18px 22px",
                boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#1B1464",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <l.icon size={18} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: ".95rem" }}>
                  {l.label}
                </div>
                <div style={{ fontSize: ".8rem", color: "#6b7280" }}>
                  {l.desc}
                </div>
              </div>
              <ChevronRight size={18} color="#6b7280" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
