import {
  Globe,
  MessageCircle,
  Camera,
  Link2,
  Video,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Send,
  Microscope,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0B1140",
        position: "relative",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      <div
        aria-hidden
        className="bg-dotgrid"
        style={{ position: "absolute", inset: 0, opacity: 0.25 }}
      />

      {/* ── Bandeau "Contact rapide" ── */}
      <div
        style={{
          position: "relative",
          borderBottom: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 28,
            padding: "32px 0",
          }}
        >
          {[
            {
              icon: <Mail size={16} />,
              label: "Secrétariat",
              info: "secretariat@remehbs-bf.org",
              accent: "#7FD1CF",
              accentBg: "rgba(31,157,156,.18)",
            },
            {
              icon: <Phone size={16} />,
              label: "Téléphone",
              info: "+226 70 24 48 27",
              accent: "#F4A28C",
              accentBg: "rgba(244,162,140,.16)",
            },
            {
              icon: <MapPin size={16} />,
              label: "Adresse",
              info: "TRYPANO · Bobo-Dioulasso",
              accent: "#BFE9E7",
              accentBg: "rgba(191,233,231,.14)",
            },
            {
              icon: <Microscope size={16} />,
              label: "Comité scientifique",
              info: "scientifique@remehbs-bf.org",
              accent: "#F4A28C",
              accentBg: "rgba(244,162,140,.14)",
            },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: c.accentBg,
                  border: `1px solid ${c.accent}40`,
                  color: c.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {c.icon}
              </span>
              <div>
                <span
                  style={{
                    fontSize: ".66rem",
                    fontWeight: 600,
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,.55)",
                    display: "block",
                    marginBottom: 2,
                  }}
                >
                  {c.label}
                </span>
                <span
                  style={{
                    fontSize: ".875rem",
                    color: "#fff",
                    fontWeight: 500,
                  }}
                >
                  {c.info}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Corps du footer ── */}
      <div
        className="container"
        style={{ position: "relative", padding: "72px 0 0" }}
      >
        <div
          className="grid-footer"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1.4fr",
            gap: 48,
            paddingBottom: 56,
            borderBottom: "1px solid rgba(255,255,255,.08)",
          }}
        >
          {/* Brand + mission */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src="/logo-remehbs.png"
                alt="REMEHBS"
                loading="lazy"
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1.5px solid rgba(255,255,255,.16)",
                }}
              />
              <div>
                <strong
                  style={{
                    display: "block",
                    fontFamily: "'IBM Plex Serif',Georgia,serif",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.005em",
                  }}
                >
                  REMEHBS
                </strong>
                <span
                  style={{
                    fontSize: ".68rem",
                    fontWeight: 600,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "#7FD1CF",
                  }}
                >
                  2005 — 2025 · 20 ans
                </span>
              </div>
            </div>
            <p
              className="editorial"
              style={{
                fontSize: ".95rem",
                color: "rgba(255,255,255,.72)",
                lineHeight: 1.7,
                margin: "20px 0 22px",
                borderLeft: "2px solid rgba(31,157,156,.45)",
                paddingLeft: 14,
              }}
            >
              Le REMEHBS œuvre depuis 2005 à l'amélioration de la santé
              maternelle, périnatale et infantile dans la région des
              Hauts-Bassins, par la recherche, la formation et la pratique
              clinique fondée sur les preuves.
            </p>
            {/* Mini formulaire newsletter */}
            <div
              style={{
                display: "flex",
                gap: 8,
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.10)",
                borderRadius: 100,
                padding: 5,
                marginBottom: 18,
                maxWidth: 360,
              }}
            >
              <input
                type="email"
                placeholder="Recevoir la lettre scientifique"
                aria-label="Email pour la lettre scientifique"
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: ".85rem",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
              <button
                type="button"
                aria-label="S'inscrire"
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "10px 14px",
                  borderRadius: 100,
                  background: "#0E7C7B",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: ".82rem",
                  fontWeight: 600,
                }}
              >
                <Send size={13} /> S'inscrire
              </button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { Icon: Globe, label: "Site web", color: "#7FD1CF" },
                { Icon: MessageCircle, label: "WhatsApp", color: "#7FD1CF" },
                { Icon: Camera, label: "Galerie", color: "#F4A28C" },
                { Icon: Link2, label: "LinkedIn", color: "#7FD1CF" },
                { Icon: Video, label: "Vidéos", color: "#F4A28C" },
              ].map(({ Icon, label, color }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontSize: ".7rem",
                fontWeight: 700,
                color: "#7FD1CF",
                marginBottom: 18,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                fontFamily: "Inter,sans-serif",
              }}
            >
              Navigation
            </h4>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 11,
                listStyle: "none",
              }}
            >
              {[
                ["/", "Accueil"],
                ["/#about", "Le Réseau"],
                ["/#missions", "Nos missions"],
                ["/#evidence", "Évidence scientifique"],
                ["/#evenements", "Journées 2025"],
                ["/#equipe", "Gouvernance"],
                ["/#contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <a
                    href={to}
                    style={{
                      fontSize: ".88rem",
                      color: "rgba(255,255,255,.65)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      textDecoration: "none",
                      transition: "color .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#7FD1CF")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,.65)")
                    }
                  >
                    <ChevronRight size={11} color="#1F9D9C" /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Membres */}
          <div>
            <h4
              style={{
                fontSize: ".7rem",
                fontWeight: 700,
                color: "#7FD1CF",
                marginBottom: 18,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                fontFamily: "Inter,sans-serif",
              }}
            >
              Membres
            </h4>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 11,
                listStyle: "none",
              }}
            >
              {[
                ["/adhesion", "Adhérer au réseau"],
                ["/espace-membre", "Espace membre"],
                ["/adhesion#cotisation", "Payer ma cotisation"],
                ["/espace-membre#attestation", "Attestation d'adhésion"],
                ["/espace-scientifique", "Espace scientifique"],
              ].map(([to, label]) => (
                <li key={label}>
                  <Link
                    to={to}
                    style={{
                      fontSize: ".88rem",
                      color: "rgba(255,255,255,.65)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      textDecoration: "none",
                      transition: "color .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#7FD1CF")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,.65)")
                    }
                  >
                    <ChevronRight size={11} color="#F4A28C" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources scientifiques */}
          <div>
            <h4
              style={{
                fontSize: ".7rem",
                fontWeight: 700,
                color: "#7FD1CF",
                marginBottom: 18,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                fontFamily: "Inter,sans-serif",
              }}
            >
              Ressources scientifiques
            </h4>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 11,
                listStyle: "none",
              }}
            >
              {[
                "Programme JSP 2025",
                "Soumettre un résumé",
                "Lignes directrices auteurs",
                "Archives des journées",
                "Publications & DOI",
                "Charte éthique",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    style={{
                      fontSize: ".88rem",
                      color: "rgba(255,255,255,.65)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      textDecoration: "none",
                      transition: "color .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#7FD1CF")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,.65)")
                    }
                  >
                    <ChevronRight size={11} color="#1F9D9C" /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            padding: "22px 0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            fontSize: ".78rem",
            color: "rgba(255,255,255,.45)",
          }}
        >
          <span>
            &copy; 2005 — 2025 REMEHBS — Réseau Mère Enfant des Hauts-Bassins ·
            Bobo-Dioulasso, Burkina Faso. Tous droits réservés.
          </span>
          <div style={{ display: "flex", gap: 22 }}>
            {[
              "Mentions légales",
              "Confidentialité",
              "Charte éditoriale",
              "Plan du site",
            ].map((label) => (
              <a
                key={label}
                href="#"
                style={{
                  color: "rgba(255,255,255,.5)",
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
