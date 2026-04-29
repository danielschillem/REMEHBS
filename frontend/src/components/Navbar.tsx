import { Link } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
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
  Microscope,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { canAccessAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navItems: [string, string, ReactNode][] = [
    ["/", "Accueil", <Home key="h" size={14} />],
    ["/#about", "Le Réseau", <Info key="i" size={14} />],
    ["/#missions", "Missions", <Target key="t" size={14} />],
    ["/evenements", "Événements", <CalendarDays key="c" size={14} />],
    [
      "/espace-scientifique",
      "Recherche",
      <Microscope key="es" size={14} />,
    ],
    ["/#contact", "Contact", <MessageSquare key="m" size={14} />],
  ];

  return (
    <>
      {/* ── Topbar ── */}
      <div
        className="topbar"
        style={{
          background: "#0B1140",
          padding: "9px 0",
          fontSize: ".78rem",
          color: "rgba(255,255,255,.78)",
          borderBottom: "1px solid rgba(31,157,156,.18)",
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
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            {[
              [<Mail key="m" size={12} />, "secretariat@remehbs-bf.org"],
              [<Phone key="p" size={12} />, "+226 70 24 48 27"],
              [<MapPin key="mp" size={12} />, "Bobo-Dioulasso, Burkina Faso"],
            ].map(([icon, text], i) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  letterSpacing: ".01em",
                }}
              >
                <span style={{ color: "#7FD1CF" }}>{icon}</span>
                {text}
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
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "rgba(31,157,156,.18)",
                  color: "#BFE9E7",
                  border: "1px solid rgba(31,157,156,.28)",
                }}
              >
                <Icon size={12} />
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
          background: "rgba(255,252,247,.92)",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          borderBottom: "1px solid #ECE6DA",
          boxShadow: "0 1px 2px rgba(11,17,64,.04)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 76,
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
            <div style={{ position: "relative" }}>
              <img
                src="/logo-remehbs.png"
                alt="REMEHBS"
                loading="lazy"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "1.5px solid #ECE6DA",
                }}
              />
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#1F9D9C",
                  border: "2px solid #FFFCF7",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.15,
              }}
            >
              <strong
                style={{
                  fontFamily: "'IBM Plex Serif',Georgia,serif",
                  fontSize: "1.18rem",
                  fontWeight: 700,
                  color: "#0B1140",
                  letterSpacing: "-0.005em",
                }}
              >
                REMEHBS
              </strong>
              <span
                style={{
                  fontSize: ".66rem",
                  color: "#5C5F73",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Réseau Mère Enfant · Hauts-Bassins
              </span>
            </div>
          </Link>

          <nav
            className="nav-links"
            style={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            {navItems.map(([to, label, icon]) => (
              <a
                key={to}
                href={to}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 13px",
                  borderRadius: 10,
                  fontSize: ".85rem",
                  fontWeight: 500,
                  color: "#1A1B25",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "background .15s ease, color .15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F1ECE3";
                  e.currentTarget.style.color = "#0B6A6A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#1A1B25";
                }}
              >
                <span style={{ color: "#0E7C7B" }}>{icon}</span> {label}
              </a>
            ))}
          </nav>

          <div
            className="nav-actions"
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
              className="nav-cta-adherer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 100,
                fontSize: ".85rem",
                fontWeight: 600,
                background: "#1B1464",
                color: "#fff",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(11,17,64,.16)",
                whiteSpace: "nowrap",
              }}
            >
              <UserPlus size={15} /> Adhérer
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
                  fontSize: ".85rem",
                  fontWeight: 600,
                  background: "#D4694F",
                  color: "#fff",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                <Shield size={13} /> Admin
              </Link>
            )}

            {/* ── Burger mobile ── */}
            <button
              type="button"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              className="nav-burger"
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                display: "none",
                width: 42,
                height: 42,
                borderRadius: 12,
                border: "1px solid #ECE6DA",
                background: "#fff",
                color: "#1A1B25",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Drawer mobile ── */}
      {menuOpen && (
        <>
          <div
            aria-hidden
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 880,
              background: "rgba(7,10,46,.55)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />
          <div
            role="dialog"
            aria-label="Menu de navigation"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 890,
              width: "min(360px, 88vw)",
              background: "#fff",
              boxShadow: "-12px 0 40px rgba(11,17,64,.18)",
              padding: "84px 24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              overflowY: "auto",
            }}
          >
            {navItems.map(([to, label, icon]) => (
              <a
                key={to}
                href={to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 12,
                  fontSize: ".95rem",
                  fontWeight: 500,
                  color: "#1A1B25",
                  textDecoration: "none",
                  border: "1px solid transparent",
                  transition: "background .15s ease, border-color .15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F1ECE3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "#E6F2F1",
                    color: "#0B6A6A",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </span>
                {label}
              </a>
            ))}

            <div
              style={{
                marginTop: 18,
                paddingTop: 18,
                borderTop: "1px solid #ECE6DA",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Link
                to="/adhesion"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "14px 22px",
                  borderRadius: 100,
                  fontSize: ".92rem",
                  fontWeight: 600,
                  background: "#1B1464",
                  color: "#fff",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(11,17,64,.16)",
                }}
              >
                <UserPlus size={16} /> Rejoindre le réseau
              </Link>
              {canAccessAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 22px",
                    borderRadius: 100,
                    fontSize: ".88rem",
                    fontWeight: 600,
                    background: "#D4694F",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  <Shield size={14} /> Espace admin
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
