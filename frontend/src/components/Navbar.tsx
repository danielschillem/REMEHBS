import { Link } from "react-router-dom";
import {
  UserPlus,
  Home,
  Info,
  Target,
  CalendarDays,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
  Link2,
  Camera,
  Shield,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { canAccessAdmin } = useAuth();

  return (
    <>
      {/* ── Topbar ── */}
      <div
        className="topbar"
        style={{
          background: "#141050",
          padding: "9px 0",
          fontSize: ".8125rem",
          color: "rgba(255,255,255,.8)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {[
              [<Mail key="m" size={13} />, "secretariat@remehbs-bf.org"],
              [<Phone key="p" size={13} />, "+226 70 24 48 27"],
              [<MapPin key="mp" size={13} />, "Bobo-Dioulasso, Burkina Faso"],
            ].map(([icon, text], i) => (
              <span
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                {icon} {text}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {[Globe, MessageCircle, Link2, Camera].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={Icon.displayName}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 27,
                  height: 27,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.14)",
                  color: "#fff",
                }}
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 900,
          background: "#fff",
          borderBottom: "1px solid rgba(27,20,100,.09)",
          boxShadow: "0 2px 8px rgba(0,0,0,.07)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
            gap: 16,
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <img
              src="/logo-remehbs.png"
              alt="REMEHBS"
              loading="lazy"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.15,
              }}
            >
              <strong
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 800,
                  color: "#1B1464",
                }}
              >
                REMEHBS
              </strong>
              <span
                style={{
                  fontSize: ".6875rem",
                  color: "#6b7280",
                  letterSpacing: ".02em",
                }}
              >
                Réseau Mère Enfant des Hauts-Bassins
              </span>
            </div>
          </Link>

          <nav
            className="nav-links"
            style={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            {[
              ["/", "Accueil", <Home key="h" size={14} />],
              ["/#about", "Le Réseau", <Info key="i" size={14} />],
              ["/#missions", "Missions", <Target key="t" size={14} />],
              ["/evenements", "Événements", <CalendarDays key="c" size={14} />],
              [
                "/espace-scientifique",
                "Espace Scientifique",
                <BookOpen key="es" size={14} />,
              ],
              ["/adhesion", "Adhésion", <UserPlus key="u" size={14} />],
              ["/#contact", "Contact", <MessageSquare key="m" size={14} />],
            ].map(([to, label, icon]) => (
              <a
                key={to as string}
                href={to as string}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "8px 13px",
                  borderRadius: 8,
                  fontSize: ".875rem",
                  fontWeight: 500,
                  color: "#1d1e20",
                  textDecoration: "none",
                }}
              >
                {icon} {label}
              </a>
            ))}
          </nav>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <NotificationBell />
            <Link
              to="/adhesion"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 100,
                fontSize: ".875rem",
                fontWeight: 600,
                background: "#1B1464",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              <UserPlus size={16} /> Adhérer
            </Link>
            {canAccessAdmin && (
              <Link
                to="/admin"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 16px",
                  borderRadius: 100,
                  fontSize: ".875rem",
                  fontWeight: 600,
                  background: "linear-gradient(135deg,#1B1464,#D4849A)",
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                <Shield size={14} /> Admin
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
