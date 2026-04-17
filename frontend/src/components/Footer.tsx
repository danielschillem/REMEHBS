import {
  Globe,
  MessageCircle,
  Camera,
  Link2,
  Video,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: "#0F0B3E", padding: "80px 0 0" }}>
      <div className="container">
        <div
          className="grid-footer"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            paddingBottom: 60,
            borderBottom: "1px solid rgba(255,255,255,.07)",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 0 }}>
              <img
                src="/logo-remehbs.png"
                alt="REMEHBS"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>
            <p
              style={{
                fontSize: ".9rem",
                color: "rgba(255,255,255,.62)",
                lineHeight: 1.75,
                margin: "18px 0 22px",
              }}
            >
              Le REMEHBS œuvre depuis 2005 à l'amélioration de la santé
              maternelle, périnatale et infantile dans la région des
              Hauts-Bassins, Burkina Faso.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[Globe, MessageCircle, Camera, Link2, Video].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={Icon.displayName}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={15} color="rgba(255,255,255,.65)" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontSize: ".9375rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 18,
              }}
            >
              Navigation
            </h4>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                listStyle: "none",
              }}
            >
              {[
                ["/", "Accueil"],
                ["/#about", "Le Réseau"],
                ["/#missions", "Nos Missions"],
                ["/#evenements", "Journées 2025"],
                ["/#equipe", "Notre Équipe"],
                ["/#contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <a
                    href={to}
                    style={{
                      fontSize: ".875rem",
                      color: "rgba(255,255,255,.6)",
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      textDecoration: "none",
                    }}
                  >
                    <ChevronRight size={12} /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Membres */}
          <div>
            <h4
              style={{
                fontSize: ".9375rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 18,
              }}
            >
              Membres
            </h4>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                listStyle: "none",
              }}
            >
              {[
                ["/adhesion", "Adhérer au réseau"],
                ["/espace-membre", "Espace membre"],
                ["/#adhesion", "Payer ma cotisation"],
                ["/#", "Attestation d'adhésion"],
                ["/#", "Annuaire des membres"],
              ].map(([to, label]) => (
                <li key={label}>
                  <Link
                    to={to}
                    style={{
                      fontSize: ".875rem",
                      color: "rgba(255,255,255,.6)",
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      textDecoration: "none",
                    }}
                  >
                    <ChevronRight size={12} /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4
              style={{
                fontSize: ".9375rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 18,
              }}
            >
              Ressources
            </h4>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                listStyle: "none",
              }}
            >
              {[
                "Programme JSP 2025",
                "Guide communication",
                "Rédiger un résumé",
                "Journées précédentes",
                "Publications",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    style={{
                      fontSize: ".875rem",
                      color: "rgba(255,255,255,.6)",
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      textDecoration: "none",
                    }}
                  >
                    <ChevronRight size={12} /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            padding: "22px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            fontSize: ".8125rem",
            color: "rgba(255,255,255,.4)",
          }}
        >
          <span>
            &copy; 2025 REMEHBS — Réseau Mère Enfant des Hauts-Bassins. Tous
            droits réservés.
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            <a
              href="#"
              style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}
            >
              Mentions légales
            </a>
            <a
              href="#"
              style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}
            >
              Confidentialité
            </a>
            <a
              href="#"
              style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}
            >
              Plan du site
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
