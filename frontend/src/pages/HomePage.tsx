import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  UserPlus,
  CalendarDays,
  Users,
  ShieldCheck,
  FileText,
  Megaphone,
  ArrowRight,
  Activity,
  Info,
  Flag,
  BookOpen,
  TrendingUp,
  Star,
  GraduationCap,
  Stethoscope,
  Microscope,
  Handshake,
  Target,
  Clock,
  MapPin,
  Globe,
  ExternalLink,
  CheckCircle,
  CircleDot,
  UserCircle,
  Link2,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Tag,
  ArrowUp,
  MessageCircle,
  Camera,
} from "lucide-react";
import HeroCarousel from "../components/HeroCarousel";

/* ── Countdown hook ─────────────────── */
function useCountdown(target: string) {
  const [diff, setDiff] = useState(new Date(target).getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(
      () => setDiff(new Date(target).getTime() - Date.now()),
      1000,
    );
    return () => clearInterval(id);
  }, [target]);
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}
const pad = (n: number) => String(n).padStart(2, "0");

/* ── Styles helpers ─────────────────── */
const section: React.CSSProperties = { padding: "96px 0" };
const sectionTitle: React.CSSProperties = {
  fontFamily: "'IBM Plex Serif',Georgia,serif",
  fontSize: "clamp(1.9rem,3.5vw,2.75rem)",
  fontWeight: 700,
  lineHeight: 1.18,
  letterSpacing: "-0.01em",
  marginBottom: 14,
  color: "#1A1B25",
};
const sectionSub: React.CSSProperties = {
  fontSize: "1.0625rem",
  color: "#5C5F73",
  maxWidth: 600,
  marginBottom: 52,
  lineHeight: 1.65,
};
const badge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  background: "#E6F2F1",
  color: "#0B6A6A",
  fontSize: ".7rem",
  fontWeight: 600,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  padding: "7px 14px",
  borderRadius: 100,
  marginBottom: 14,
  border: "1px solid rgba(14,124,123,.18)",
};
const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "12px 28px",
  borderRadius: 100,
  fontSize: ".9375rem",
  fontWeight: 600,
  cursor: "pointer",
  border: "2px solid transparent",
  textDecoration: "none",
  fontFamily: "inherit",
};
const iconBox = (
  size: number,
  bg: string,
  color: string,
): React.CSSProperties => ({
  width: size,
  height: size,
  borderRadius: size > 60 ? 22 : size > 50 ? 18 : size > 40 ? 14 : 10,
  background: bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  color,
});

export default function HomePage() {
  const cd = useCountdown("2025-07-23T08:00:00");
  const [contactForm, setContactForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    objet: "Adhésion & inscription",
    message: "",
  });

  return (
    <div>
      {/* ═══════ HERO ═══════ */}
      <section
        style={{
          minHeight: "92vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Carousel — arrière-plan plein cadre du hero */}
        <HeroCarousel />

        {/* Ligne ECG — battement cardiaque en filigrane (par-dessus le carousel) */}
        <svg
          aria-hidden
          viewBox="0 0 1600 200"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "12%",
            width: "100%",
            height: 90,
            opacity: 0.14,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <path
            d="M0 100 L260 100 L300 100 L320 60 L345 140 L370 40 L395 160 L420 100 L640 100 L680 100 L700 70 L725 130 L750 100 L1000 100 L1040 100 L1060 60 L1085 140 L1110 40 L1135 160 L1160 100 L1600 100"
            fill="none"
            stroke="#F4A28C"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 2,
            padding: "120px 0 40px",
          }}
        >
          <div
            className="grid-hero"
            style={{
              display: "block",
            }}
          >
            {/* Bloc texte éditorial à gauche */}
            <div style={{ maxWidth: 760 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(31,157,156,.16)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(31,157,156,.42)",
                  color: "#BFE9E7",
                  fontSize: ".75rem",
                  fontWeight: 600,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  padding: "8px 18px",
                  borderRadius: 100,
                  marginBottom: 26,
                }}
              >
                <Award size={13} />
                <span
                  style={{
                    width: 1,
                    height: 12,
                    background: "rgba(191,233,231,.35)",
                  }}
                />
                Réseau périnatal · 2005 — 2025
              </div>
              <h1
                style={{
                  fontFamily: "'IBM Plex Serif',Georgia,serif",
                  fontSize: "clamp(2.4rem,5vw,3.85rem)",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.1,
                  letterSpacing: "-0.015em",
                  marginBottom: 22,
                }}
              >
                Pour la santé des{" "}
                <em
                  className="editorial"
                  style={{ color: "#F4A28C", fontWeight: 600 }}
                >
                  mères
                </em>
                <br />
                et des{" "}
                <em
                  className="editorial"
                  style={{ color: "#F4A28C", fontWeight: 600 }}
                >
                  nouveau-nés
                </em>{" "}
                des
                <br />
                Hauts-Bassins
              </h1>
              <p
                style={{
                  fontSize: "1.0625rem",
                  color: "rgba(255,255,255,.78)",
                  maxWidth: 520,
                  marginBottom: 38,
                  lineHeight: 1.7,
                }}
              >
                Depuis 2005, le REMEHBS fédère{" "}
                <strong style={{ color: "#fff", fontWeight: 600 }}>
                  cliniciens, chercheurs et sages-femmes
                </strong>{" "}
                autour d'une mission commune : réduire la mortalité maternelle,
                périnatale et infantile par des soins fondés sur les données
                probantes.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link
                  to="/adhesion"
                  style={{
                    ...btn,
                    background: "#fff",
                    color: "#1B1464",
                    padding: "15px 34px",
                    fontSize: "1rem",
                  }}
                >
                  <UserPlus size={16} /> Rejoindre le réseau
                </Link>
                <a
                  href="#evenements"
                  style={{
                    ...btn,
                    background: "rgba(255,255,255,.12)",
                    color: "#fff",
                    borderColor: "rgba(255,255,255,.3)",
                    padding: "15px 34px",
                    fontSize: "1rem",
                  }}
                >
                  <CalendarDays size={16} /> Journées 2025
                </a>
              </div>
              <div
                className="flex-stats"
                style={{
                  display: "flex",
                  gap: 44,
                  marginTop: 52,
                  paddingTop: 36,
                  borderTop: "1px solid rgba(255,255,255,.12)",
                }}
              >
                {[
                  ["20", "ans", "Au service de la périnatalité"],
                  ["500", "+", "Membres pluri-professionnels"],
                  ["7", "ᵉˢ", "Journées Scientifiques 2025"],
                ].map(([num, suffix, lbl]) => (
                  <div
                    key={lbl}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 4,
                      }}
                    >
                      <span
                        className="num"
                        style={{
                          fontFamily: "'IBM Plex Serif',serif",
                          fontSize: "2.4rem",
                          fontWeight: 700,
                          color: "#fff",
                          lineHeight: 1,
                        }}
                      >
                        {num}
                      </span>
                      <span
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "#F4A28C",
                          lineHeight: 1,
                        }}
                      >
                        {suffix}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: ".78rem",
                        color: "rgba(255,255,255,.62)",
                        marginTop: 8,
                        letterSpacing: ".02em",
                      }}
                    >
                      {lbl}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rangée d'info-cards horizontales sous les stats */}
            <div
              className="hero-info-row"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                gap: 14,
                marginTop: 36,
                maxWidth: 920,
              }}
            >
              {[
                {
                  icon: <CalendarDays size={18} />,
                  title: "7ᵉˢ Journées Scientifiques · 2025",
                  sub: "Congrès international · 23–25 juillet · Bobo-Dioulasso",
                  accent: "#F4A28C",
                },
                {
                  icon: <FileText size={18} />,
                  title: "Appel à communications ouvert",
                  sub: "Soumission des résumés · jusqu'au 30 juin 2025",
                  accent: "#1F9D9C",
                },
                {
                  icon: <ShieldCheck size={18} />,
                  title: "Réseau apolitique & aconfessionnel",
                  sub: "Fondé sur la rigueur et l'éthique médicale",
                  accent: "#E8A5B8",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  style={{
                    background: "rgba(7,10,46,.42)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: "1px solid rgba(255,255,255,.14)",
                    borderRadius: 14,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    color: "#fff",
                  }}
                >
                  <span
                    style={{
                      color: c.accent,
                      flexShrink: 0,
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: `${c.accent}26`,
                      border: `1px solid ${c.accent}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {c.icon}
                  </span>
                  <div>
                    <strong
                      style={{
                        fontSize: ".82rem",
                        fontWeight: 600,
                        display: "block",
                        letterSpacing: "-0.005em",
                        lineHeight: 1.3,
                      }}
                    >
                      {c.title}
                    </strong>
                    <span
                      style={{
                        fontSize: ".74rem",
                        opacity: 0.72,
                        lineHeight: 1.5,
                        display: "block",
                        marginTop: 2,
                      }}
                    >
                      {c.sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ANNONCE ═══════ */}
      <div
        className="annonce-bar"
        style={{
          background: "#1B1464",
          padding: "14px 0",
          borderBottom: "1px solid rgba(11,17,64,.06)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "rgba(255,255,255,.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Megaphone size={16} color="#fff" />
            </span>
            <p
              style={{
                fontSize: ".925rem",
                color: "#fff",
                fontWeight: 500,
                flex: 1,
                letterSpacing: ".005em",
              }}
            >
              <strong style={{ fontWeight: 700 }}>
                Appel à communications scientifiques
              </strong>{" "}
              · Soumissions ouvertes jusqu'au{" "}
              <strong>30 juin 2025</strong> — Congrès international 23–25
              juillet, Bobo-Dioulasso
            </p>
            <a
              href="#evenements"
              style={{
                ...btn,
                background: "#fff",
                color: "#1B1464",
                padding: "8px 20px",
                fontSize: ".8rem",
                flexShrink: 0,
              }}
            >
              <ArrowRight size={14} /> En savoir plus
            </a>
          </div>
        </div>
      </div>

      {/* ═══════ À PROPOS ═══════ */}
      <section style={section} id="about">
        <div className="container">
          <div
            className="grid-about"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Visual — illustration médicale + scientifique */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  borderRadius: 24,
                  background: "#FFE7DD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid #ECE6DA",
                }}
              >
                {/* Logo REMEHBS centré */}
                <img
                  src="/logo-remehbs.png"
                  alt="Logo REMEHBS"
                  loading="lazy"
                  style={{
                    width: "62%",
                    height: "auto",
                    maxHeight: "78%",
                    objectFit: "contain",
                    position: "relative",
                    zIndex: 1,
                    filter: "drop-shadow(0 8px 24px rgba(11,17,64,.12))",
                  }}
                />

                {/* Étiquette "Périnatalité" */}
                <span
                  style={{
                    position: "absolute",
                    top: 18,
                    left: 18,
                    background: "rgba(255,255,255,.85)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(11,17,64,.08)",
                    fontSize: ".68rem",
                    fontWeight: 600,
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: "#0B6A6A",
                    padding: "5px 11px",
                    borderRadius: 100,
                  }}
                >
                  Périnatalité · Hauts-Bassins
                </span>
              </div>

              {/* Badge "Fondé en 2005" */}
              <div
                style={{
                  position: "absolute",
                  bottom: -24,
                  right: -16,
                  background: "#fff",
                  borderRadius: 16,
                  padding: "16px 20px",
                  boxShadow: "0 4px 24px rgba(11,17,64,.13)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  maxWidth: 230,
                  border: "1px solid #ECE6DA",
                }}
              >
                <div style={iconBox(40, "#0E7C7B", "#fff")}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong
                    style={{
                      fontSize: ".9375rem",
                      fontWeight: 700,
                      display: "block",
                      color: "#1A1B25",
                    }}
                  >
                    Fondé en 2005
                  </strong>
                  <span style={{ fontSize: ".8125rem", color: "#5C5F73" }}>
                    20 ans d'engagement clinique
                  </span>
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <span style={badge}>
                <Info size={13} /> Le Réseau
              </span>
              <h2 style={sectionTitle}>
                Un réseau périnatal de référence au Burkina Faso
              </h2>
              <p
                className="editorial"
                style={{
                  color: "#3D3F52",
                  lineHeight: 1.75,
                  fontSize: "1.0625rem",
                  marginBottom: 14,
                }}
              >
                Le REMEHBS est une association{" "}
                <strong style={{ fontStyle: "normal", fontWeight: 700 }}>
                  apolitique et aconfessionnelle
                </strong>{" "}
                dont l'objet est l'amélioration de la santé maternelle,
                périnatale et infantile dans la région des Hauts-Bassins.
              </p>
              <p style={{ color: "#5C5F73", lineHeight: 1.75 }}>
                Il fédère cliniciens, sages-femmes, chercheurs et décideurs
                autour d'une vision commune : <strong>des soins humains et
                rigoureux</strong>, fondés sur les meilleures pratiques
                médicales et adaptés aux réalités de terrain.
              </p>
              <div
                style={{
                  marginTop: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                {[
                  {
                    icon: <Flag size={16} />,
                    title: "Création du réseau — 2005",
                    sub: "Fondé par Pr. Blami DAO à Bobo-Dioulasso",
                    bg: "#FFE7DD",
                    color: "#B85339",
                  },
                  {
                    icon: <BookOpen size={16} />,
                    title: "1ʳᵉˢ Journées Scientifiques — 2009",
                    sub: "Lancement des congrès périnataux régionaux",
                    bg: "#E6F2F1",
                    color: "#0B6A6A",
                  },
                  {
                    icon: <TrendingUp size={16} />,
                    title: "Expansion nationale — 2017",
                    sub: "Partenariats avec la Direction Régionale de la Santé",
                    bg: "#EEEDF7",
                    color: "#1B1464",
                  },
                  {
                    icon: <Star size={16} />,
                    title: "20ᵉ anniversaire — 2025",
                    sub: "7ᵉˢ Journées Scientifiques de Périnatalité",
                    bg: "#FFE7DD",
                    color: "#D4694F",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: item.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.color,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <strong
                        style={{
                          fontSize: ".9375rem",
                          fontWeight: 600,
                          display: "block",
                          color: "#1A1B25",
                          marginBottom: 2,
                        }}
                      >
                        {item.title}
                      </strong>
                      <span style={{ fontSize: ".875rem", color: "#5C5F73" }}>
                        {item.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr
        style={{
          border: "none",
          height: 1,
          background: "#ECE6DA",
        }}
      />

      {/* ═══════ MISSIONS ═══════ */}
      <section style={{ ...section, background: "#ffffff" }} id="missions">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <span style={badge}>
              <Target size={13} /> Nos Missions
            </span>
            <h2 style={sectionTitle}>Ce que nous portons chaque jour</h2>
            <p
              style={{ ...sectionSub, marginLeft: "auto", marginRight: "auto" }}
            >
              Six axes stratégiques pour réduire la mortalité maternelle,
              périnatale et infantile, et améliorer durablement la qualité des
              soins dans les Hauts-Bassins.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(262px,1fr))",
              gap: 24,
            }}
          >
            {[
              {
                icon: <GraduationCap size={28} />,
                bg: "#E6F2F1",
                color: "#0B6A6A",
                accent: "#0E7C7B",
                tag: "Formation",
                title: "Renforcement des compétences",
                desc: "Formations continues pour cliniciens et sages-femmes sur les meilleures pratiques obstétricales et néonatales.",
              },
              {
                icon: <Stethoscope size={28} />,
                bg: "#FFE7DD",
                color: "#B85339",
                accent: "#D4694F",
                tag: "Clinique",
                title: "Soins de qualité",
                desc: "Harmonisation des protocoles périnataux et promotion de pratiques fondées sur les preuves scientifiques.",
              },
              {
                icon: <Microscope size={28} />,
                bg: "#EEEDF7",
                color: "#1B1464",
                accent: "#4F4DA6",
                tag: "Recherche",
                title: "Recherche scientifique",
                desc: "Journées scientifiques biannuelles favorisant le partage des connaissances et la collaboration intersectorielle.",
              },
              {
                icon: <Users size={28} />,
                bg: "#FFF4EE",
                color: "#D4694F",
                accent: "#E8836B",
                tag: "Expertise",
                title: "Consultation d'experts",
                desc: "Réseau de consultants spécialisés mobilisables pour accompagner les structures sanitaires dans leurs réformes.",
              },
              {
                icon: <Activity size={28} />,
                bg: "#FCEFD3",
                color: "#8E5807",
                accent: "#C57F12",
                tag: "Épidémiologie",
                title: "Surveillance épidémiologique",
                desc: "Suivi des indicateurs clés de mortalité maternelle et périnatale pour orienter les politiques de santé régionales.",
              },
              {
                icon: <Handshake size={28} />,
                bg: "#DCF3E7",
                color: "#0B6A4D",
                accent: "#0E8E5C",
                tag: "Partenariats",
                title: "Plaidoyer & partenariats",
                desc: "Collaboration avec le Ministère de la Santé, les ONG et partenaires techniques pour mobiliser les ressources.",
              },
            ].map((m) => (
              <div
                key={m.title}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "30px 26px 28px",
                  boxShadow: "0 1px 2px rgba(11,17,64,.04)",
                  border: "1px solid #ECE6DA",
                  transition: "all .22s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Liseret latéral coloré */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 24,
                    bottom: 24,
                    width: 3,
                    background: m.accent,
                    borderRadius: "0 4px 4px 0",
                  }}
                />
                <div style={iconBox(60, m.bg, m.color)}>{m.icon}</div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: ".66rem",
                    fontWeight: 600,
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: m.color,
                    marginTop: 16,
                  }}
                >
                  {m.tag}
                </span>
                <h3
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    margin: "6px 0 10px",
                    color: "#1A1B25",
                  }}
                >
                  {m.title}
                </h3>
                <p
                  style={{
                    fontSize: ".875rem",
                    color: "#5C5F73",
                    lineHeight: 1.7,
                  }}
                >
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ÉVIDENCE SCIENTIFIQUE & IMPACT ═══════ */}
      <section
        style={{
          padding: "104px 0",
          background: "#FAF7F2",
          position: "relative",
          overflow: "hidden",
        }}
        id="evidence"
      >
        {/* Texture papier millimétré subtil */}
        <div
          aria-hidden
          className="bg-dotgrid--ink"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.25,
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(260px,5fr) 7fr",
              gap: 64,
              alignItems: "start",
            }}
            className="grid-evidence"
          >
            {/* Colonne gauche — éditorial */}
            <div>
              <span
                style={{
                  ...badge,
                  background: "#FFE7DD",
                  color: "#B85339",
                  border: "1px solid rgba(184,83,57,.18)",
                }}
              >
                <Microscope size={13} /> Évidence scientifique
              </span>
              <h2 style={sectionTitle}>
                Une approche fondée sur les{" "}
                <em
                  className="editorial"
                  style={{ color: "#0B6A6A", fontWeight: 600 }}
                >
                  données probantes
                </em>
              </h2>
              <p
                className="editorial"
                style={{
                  fontSize: "1.125rem",
                  color: "#3D3F52",
                  lineHeight: 1.7,
                  marginBottom: 28,
                  borderLeft: "3px solid #0E7C7B",
                  paddingLeft: 18,
                }}
              >
                « La réduction durable de la mortalité maternelle exige des
                réseaux régionaux capables d'aligner pratique clinique,
                formation continue et surveillance épidémiologique. »
              </p>
              <p
                style={{
                  fontSize: ".82rem",
                  color: "#5C5F73",
                  marginBottom: 36,
                  letterSpacing: ".02em",
                }}
              >
                — OMS, <i>Stratégie pour mettre fin aux décès maternels
                évitables</i> (EPMM), 2024.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  paddingTop: 28,
                  borderTop: "1px solid #ECE6DA",
                }}
              >
                {[
                  {
                    icon: <BookOpen size={14} />,
                    text: "7 éditions des Journées Scientifiques de Périnatalité",
                  },
                  {
                    icon: <Microscope size={14} />,
                    text: "Communications libres relues par un comité scientifique",
                  },
                  {
                    icon: <Activity size={14} />,
                    text: "Indicateurs alignés sur les ODD-3 et la stratégie EPMM",
                  },
                ].map((it, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: ".9rem",
                      color: "#3D3F52",
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "#E6F2F1",
                        color: "#0B6A6A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {it.icon}
                    </span>
                    {it.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne droite — fiches d'indicateurs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
              }}
              className="grid-metrics"
            >
              {[
                {
                  label: "Mortalité maternelle",
                  unit: "pour 100 000 NV",
                  value: "198",
                  delta: "−59 %",
                  deltaTone: "good",
                  baseline: "2005 · 484",
                  target: "Cible 2030 · <70",
                  progress: 64,
                  source: "INSD/EDS 2021 · OMS 2024",
                  accent: "#0E7C7B",
                  accentSoft: "#E6F2F1",
                  icon: <Activity size={16} />,
                },
                {
                  label: "Mortalité néonatale",
                  unit: "pour 1 000 NV",
                  value: "23",
                  delta: "−34 %",
                  deltaTone: "good",
                  baseline: "2005 · 35",
                  target: "Cible 2030 · ≤12",
                  progress: 52,
                  source: "UNICEF · IGME 2023",
                  accent: "#D4694F",
                  accentSoft: "#FFE7DD",
                  icon: <Stethoscope size={16} />,
                },
                {
                  label: "Accouchements assistés",
                  unit: "personnel qualifié",
                  value: "82 %",
                  delta: "+22 pts",
                  deltaTone: "good",
                  baseline: "2010 · 60 %",
                  target: "Cible 2030 · ≥95 %",
                  progress: 86,
                  source: "DRS Hauts-Bassins · Annuaire 2023",
                  accent: "#0B6A6A",
                  accentSoft: "#F2F9F8",
                  icon: <ShieldCheck size={16} />,
                },
                {
                  label: "Professionnels formés",
                  unit: "cumul depuis 2009",
                  value: "1 240",
                  delta: "+8 %/an",
                  deltaTone: "good",
                  baseline: "Sages-femmes · médecins · IDE",
                  target: "Cible 2025 · 1 500",
                  progress: 82,
                  source: "Bilan formations REMEHBS 2024",
                  accent: "#1B1464",
                  accentSoft: "#EEEDF7",
                  icon: <GraduationCap size={16} />,
                },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    padding: "26px 24px",
                    border: "1px solid #ECE6DA",
                    boxShadow: "0 1px 2px rgba(11,17,64,.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 9,
                          background: m.accentSoft,
                          color: m.accent,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {m.icon}
                      </span>
                      <span
                        style={{
                          fontSize: ".7rem",
                          fontWeight: 600,
                          letterSpacing: ".14em",
                          textTransform: "uppercase",
                          color: "#5C5F73",
                        }}
                      >
                        {m.label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: ".68rem",
                        fontWeight: 700,
                        color: "#0E8E5C",
                        background: "#DCF3E7",
                        padding: "3px 9px",
                        borderRadius: 100,
                        letterSpacing: ".04em",
                      }}
                    >
                      {m.delta}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span
                      className="num"
                      style={{
                        fontFamily: "'IBM Plex Serif',serif",
                        fontSize: "2.6rem",
                        fontWeight: 700,
                        color: "#0B1140",
                        lineHeight: 1,
                      }}
                    >
                      {m.value}
                    </span>
                    <span
                      style={{
                        fontSize: ".82rem",
                        color: "#8A8DA0",
                      }}
                    >
                      {m.unit}
                    </span>
                  </div>

                  {/* Barre de progression */}
                  <div>
                    <div
                      style={{
                        height: 6,
                        background: "#F4EEE2",
                        borderRadius: 100,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: `${m.progress}%`,
                          height: "100%",
                          background: m.accent,
                          borderRadius: 100,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 8,
                        fontSize: ".7rem",
                        color: "#8A8DA0",
                        letterSpacing: ".02em",
                      }}
                    >
                      <span>{m.baseline}</span>
                      <span style={{ color: m.accent, fontWeight: 600 }}>
                        {m.target}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      paddingTop: 10,
                      borderTop: "1px dashed #ECE6DA",
                      fontSize: ".7rem",
                      color: "#8A8DA0",
                      fontStyle: "italic",
                    }}
                  >
                    <FileText size={11} />
                    Source : {m.source}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note de bas de section — disclaimer académique */}
          <p
            style={{
              marginTop: 48,
              fontSize: ".78rem",
              color: "#8A8DA0",
              textAlign: "center",
              fontStyle: "italic",
              maxWidth: 760,
              marginInline: "auto",
            }}
          >
            Indicateurs présentés à titre informatif et consolidés à partir de
            sources publiques (OMS, UNICEF/IGME, INSD-EDS, Direction Régionale
            de la Santé des Hauts-Bassins). Les données détaillées et leurs
            méthodologies sont disponibles auprès du secrétariat scientifique.
          </p>
        </div>
      </section>

      {/* ═══════ PUBLICATIONS SCIENTIFIQUES ═══════ */}
      <section
        style={{
          padding: "104px 0",
          background: "#ffffff",
          position: "relative",
          borderTop: "1px solid #ECE6DA",
          borderBottom: "1px solid #ECE6DA",
        }}
        id="publications"
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 40,
              flexWrap: "wrap",
              marginBottom: 48,
            }}
          >
            <div style={{ maxWidth: 620 }}>
              <span
                style={{
                  ...badge,
                  background: "#EEEDF7",
                  color: "#1B1464",
                  border: "1px solid rgba(27,20,100,.18)",
                }}
              >
                <BookOpen size={13} /> Publications
              </span>
              <h2 style={sectionTitle}>
                Articles &{" "}
                <em
                  className="editorial"
                  style={{ color: "#1B1464", fontWeight: 600 }}
                >
                  contributions
                </em>{" "}
                récentes
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#5C5F73",
                  lineHeight: 1.7,
                }}
              >
                Une sélection de publications scientifiques portées ou
                co-signées par les membres du REMEHBS, indexées avec
                identifiants persistants (DOI) et accessibles via PubMed,
                Crossref ou Google Scholar.
              </p>
            </div>
            <a
              href="https://scholar.google.com/scholar?q=REMEHBS+Hauts-Bassins+perinatal"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...btn,
                background: "transparent",
                color: "#1B1464",
                borderColor: "#1B1464",
                padding: "12px 22px",
                fontSize: ".88rem",
              }}
            >
              <ExternalLink size={14} /> Toutes nos publications
            </a>
          </div>

          {/* Liste de publications */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {[
              {
                year: "2024",
                type: "Article original",
                typeBg: "#E6F2F1",
                typeColor: "#0B6A6A",
                authors:
                  "Meda Z.C., Somé D.A., Ouattara H., Koné A. et al.",
                title:
                  "Réduction de la mortalité maternelle dans les Hauts-Bassins (2010-2023) : étude rétrospective multicentrique sur 12 maternités",
                journal: "African Journal of Reproductive Health",
                volume: "28(4)",
                pages: "112–124",
                doi: "10.4314/ajrh.v28i4.10",
                openAccess: true,
                citations: 14,
              },
              {
                year: "2024",
                type: "Revue systématique",
                typeBg: "#FFE7DD",
                typeColor: "#B85339",
                authors: "Compaoré I., Meda Z.C., Sawadogo A.",
                title:
                  "Interventions à bas coût pour la prévention de la mortalité néonatale en Afrique subsaharienne : revue systématique et méta-analyse",
                journal: "BMC Pregnancy and Childbirth",
                volume: "24(1)",
                pages: "Article 287",
                doi: "10.1186/s12884-024-06487-y",
                openAccess: true,
                citations: 22,
              },
              {
                year: "2023",
                type: "Étude qualitative",
                typeBg: "#EEEDF7",
                typeColor: "#1B1464",
                authors: "Ouédraogo R., Koné A., Somé D.A.",
                title:
                  "Vécu des sages-femmes face aux urgences obstétricales en zone rurale : étude qualitative dans la région des Hauts-Bassins",
                journal: "Sage-femme et Périnatalité Francophone",
                volume: "15(2)",
                pages: "78–91",
                doi: "10.3917/spf.152.0078",
                openAccess: false,
                citations: 8,
              },
              {
                year: "2023",
                type: "Communication",
                typeBg: "#FCEFD3",
                typeColor: "#8E5807",
                authors: "Meda Z.C., REMEHBS — Comité scientifique",
                title:
                  "Bilan des 6ᵉˢ Journées Scientifiques de Périnatalité : 18 ans de réseau au service de la santé maternelle au Burkina Faso",
                journal:
                  "Actes du Congrès panafricain de santé maternelle (CPSM)",
                volume: "Édition 2023",
                pages: "Vol. III, p. 45–52",
                doi: "10.5281/zenodo.10328945",
                openAccess: true,
                citations: 5,
              },
              {
                year: "2022",
                type: "Cohorte prospective",
                typeBg: "#E6F2F1",
                typeColor: "#0B6A6A",
                authors:
                  "Somé D.A., Compaoré I., Ouattara H., et al.",
                title:
                  "Audit clinique des décès maternels au CHU Sanou Souro (2018–2021) : facteurs évitables et leviers d'amélioration de la qualité des soins",
                journal: "Revue Africaine d'Obstétrique et de Gynécologie",
                volume: "11(3)",
                pages: "203–215",
                doi: "10.7202/raog.v11i3.19452",
                openAccess: false,
                citations: 31,
              },
            ].map((p) => (
              <article
                key={p.doi}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(140px,150px) minmax(0,1fr) auto",
                  gap: 26,
                  padding: "26px 28px",
                  background: "#fff",
                  border: "1px solid #ECE6DA",
                  borderRadius: 16,
                  boxShadow: "0 1px 2px rgba(11,17,64,.04)",
                  transition: "border-color .2s ease, box-shadow .2s ease",
                  alignItems: "start",
                }}
                className="pub-card"
              >
                {/* Année + métriques */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingRight: 18,
                    borderRight: "1px solid #ECE6DA",
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  <span
                    className="num"
                    style={{
                      fontFamily: "'IBM Plex Serif',serif",
                      fontSize: "2rem",
                      fontWeight: 700,
                      color: "#0B1140",
                      lineHeight: 1,
                    }}
                  >
                    {p.year}
                  </span>
                  <span
                    style={{
                      fontSize: ".62rem",
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: p.typeColor,
                      background: p.typeBg,
                      padding: "4px 9px",
                      borderRadius: 100,
                      marginTop: 10,
                      lineHeight: 1.25,
                      maxWidth: "100%",
                      wordBreak: "break-word",
                    }}
                  >
                    {p.type}
                  </span>
                  <span
                    style={{
                      marginTop: "auto",
                      paddingTop: 12,
                      fontSize: ".72rem",
                      color: "#8A8DA0",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <TrendingUp size={11} />
                    <span className="num">{p.citations}</span> citations
                  </span>
                </div>

                {/* Citation académique */}
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: ".82rem",
                      color: "#5C5F73",
                      marginBottom: 6,
                      letterSpacing: ".005em",
                    }}
                  >
                    {p.authors}{" "}
                    <span style={{ color: "#8A8DA0" }}>({p.year}).</span>
                  </p>
                  <h3
                    style={{
                      fontFamily: "'IBM Plex Serif',Georgia,serif",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      lineHeight: 1.4,
                      color: "#1A1B25",
                      marginBottom: 10,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="editorial"
                    style={{
                      fontSize: ".88rem",
                      color: "#3D3F52",
                      marginBottom: 12,
                    }}
                  >
                    {p.journal},{" "}
                    <strong style={{ fontStyle: "normal", fontWeight: 600 }}>
                      {p.volume}
                    </strong>
                    , {p.pages}.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <a
                      href={`https://doi.org/${p.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: ".78rem",
                        fontWeight: 600,
                        color: "#0B6A6A",
                        background: "#E6F2F1",
                        padding: "5px 11px",
                        borderRadius: 6,
                        textDecoration: "none",
                        border: "1px solid rgba(14,124,123,.22)",
                        fontFamily:
                          "ui-monospace,'SF Mono',Menlo,Consolas,monospace",
                        letterSpacing: "-0.005em",
                      }}
                    >
                      <Link2 size={12} />
                      DOI: {p.doi}
                    </a>
                    {p.openAccess && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: ".7rem",
                          fontWeight: 700,
                          color: "#B85339",
                          background: "#FFE7DD",
                          padding: "5px 10px",
                          borderRadius: 100,
                          letterSpacing: ".06em",
                          textTransform: "uppercase",
                        }}
                        title="Open Access — accès libre"
                      >
                        <CircleDot size={10} fill="#B85339" /> Open Access
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                  }}
                  className="pub-actions"
                >
                  <a
                    href={`https://doi.org/${p.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ouvrir l'article ${p.title}`}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: "#FAF7F2",
                      border: "1px solid #ECE6DA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#1B1464",
                      transition: "all .15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#1B1464";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#FAF7F2";
                      e.currentTarget.style.color = "#1B1464";
                    }}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Note de fin — citation BibTeX */}
          <div
            style={{
              marginTop: 36,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 20px",
              background: "#F1ECE3",
              borderRadius: 12,
              border: "1px dashed #ECE6DA",
              fontSize: ".82rem",
              color: "#5C5F73",
              flexWrap: "wrap",
            }}
          >
            <FileText size={16} color="#0B6A6A" />
            <span style={{ flex: 1, minWidth: 240 }}>
              Pour citer une publication, copiez le DOI ou utilisez
              l'export BibTeX disponible sur la fiche détaillée.
            </span>
            <a
              href="/espace-scientifique"
              style={{
                fontSize: ".82rem",
                fontWeight: 600,
                color: "#0B6A6A",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Accéder à l'espace scientifique <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ JOURNÉES 2025 ═══════ */}
      <section style={section} id="evenements">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <span style={badge}>
              <CalendarDays size={13} /> Journées 2025
            </span>
            <h2 style={sectionTitle}>
              7èmes Journées Scientifiques de Périnatalité
            </h2>
            <p
              style={{ ...sectionSub, marginLeft: "auto", marginRight: "auto" }}
            >
              Congrès international · 23–25 juillet 2025 · Bobo-Dioulasso,
              Burkina Faso
            </p>
          </div>
          <div
            className="grid-events"
            style={{
              display: "grid",
              gridTemplateColumns: "5fr 7fr",
              gap: 48,
              alignItems: "start",
            }}
          >
            {/* Countdown */}
            <div
              style={{
                background: "#1B1464",
                borderRadius: 24,
                padding: "38px 34px",
                color: "#fff",
              }}
            >
              <span
                style={{
                  ...badge,
                  background: "rgba(255,255,255,.14)",
                  color: "rgba(255,255,255,.9)",
                }}
              >
                <Clock size={13} /> Compte à rebours
              </span>
              <h3
                style={{
                  fontFamily: "'IBM Plex Serif',serif",
                  fontSize: "1.4375rem",
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                Congrès Principal 2025
              </h3>
              <p
                style={{ fontSize: ".875rem", opacity: 0.76, marginBottom: 30 }}
              >
                23 – 25 juillet 2025 · Trypano, Bobo-Dioulasso
              </p>
              <div
                className="grid-timeline"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 8,
                  marginBottom: 30,
                }}
              >
                {[
                  [pad(cd.d), "Jours"],
                  [pad(cd.h), "Heures"],
                  [pad(cd.m), "Minutes"],
                  [pad(cd.s), "Secondes"],
                ].map(([num, lbl]) => (
                  <div
                    key={lbl}
                    style={{
                      background: "rgba(255,255,255,.12)",
                      borderRadius: 10,
                      padding: "14px 6px",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.875rem",
                        fontWeight: 800,
                        display: "block",
                        lineHeight: 1,
                      }}
                    >
                      {num}
                    </span>
                    <span
                      style={{
                        fontSize: ".6875rem",
                        opacity: 0.68,
                        textTransform: "uppercase",
                        letterSpacing: ".05em",
                        marginTop: 4,
                        display: "block",
                      }}
                    >
                      {lbl}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 26,
                }}
              >
                {[
                  [
                    <MapPin key="mp" size={15} />,
                    "Direction Régionale de la Santé (TRYPANO)",
                  ],
                  [
                    <Globe key="gl" size={15} />,
                    "Congrès international, langue française",
                  ],
                  [
                    <FileText key="ft" size={15} />,
                    "Soumissions uniquement en ligne",
                  ],
                  [
                    <Users key="us" size={15} />,
                    "Ouvert aux membres et non-membres",
                  ],
                ].map(([icon, text], i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: ".875rem",
                      opacity: 0.88,
                    }}
                  >
                    <span style={{ opacity: 0.65, flexShrink: 0 }}>{icon}</span>{" "}
                    {text}
                  </div>
                ))}
              </div>
              <a
                href="#"
                style={{
                  ...btn,
                  background: "#fff",
                  color: "#1B1464",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <ExternalLink size={16} /> Plateforme de soumission
              </a>
            </div>

            {/* Timeline */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                {
                  date: "Septembre 2024",
                  title: "1er Appel à communications",
                  desc: "Ouverture des soumissions de résumés scientifiques",
                  status: "done",
                  statusLabel: "Terminé",
                },
                {
                  date: "31 mars 2025",
                  title: "Clôture du 2e appel à communications",
                  desc: "Date limite de soumission des résumés — 2e appel",
                  status: "done",
                  statusLabel: "Terminé",
                },
                {
                  date: "1 avril – 30 juin 2025",
                  title: "Soumission finale & Inscriptions",
                  desc: "Dépôt des communications et inscription en ligne au congrès",
                  status: "open",
                  statusLabel: "Ouvert actuellement",
                },
                {
                  date: "15 – 22 juillet 2025",
                  title: "Sessions de compétences (Pré-congrès)",
                  desc: "Ateliers pratiques et formations techniques spécialisées",
                  status: "soon",
                  statusLabel: "À venir",
                },
                {
                  date: "23 – 25 juillet 2025",
                  title: "Congrès principal — 7èmes JSP",
                  desc: "Plénières, communications libres, tables rondes et cérémonie d'ouverture",
                  status: "main",
                  statusLabel: "Événement principal",
                },
              ].map((evt, i, arr) => {
                const dotStyle: React.CSSProperties = {
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  flexShrink: 0,
                  marginTop: 3,
                  border: "2.5px solid #1B1464",
                  background: "#fff",
                };
                if (evt.status === "done") dotStyle.background = "#1B1464";
                if (evt.status === "open") {
                  dotStyle.background = "#D4694F";
                  dotStyle.borderColor = "#D4694F";
                }

                const statusColors: Record<
                  string,
                  { bg: string; color: string }
                > = {
                  done: { bg: "#DCF3E7", color: "#0E8E5C" },
                  open: { bg: "#FFE7DD", color: "#B85339" },
                  soon: { bg: "#FCEFD3", color: "#8E5807" },
                  main: {
                    bg: "#E6F2F1",
                    color: "#0B1140",
                  },
                };
                const statusIcon =
                  evt.status === "done" ? (
                    <CheckCircle size={11} />
                  ) : evt.status === "open" ? (
                    <CircleDot size={11} />
                  ) : evt.status === "soon" ? (
                    <Clock size={11} />
                  ) : (
                    <Star size={11} />
                  );

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 18,
                      paddingBottom: i < arr.length - 1 ? 28 : 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <div style={dotStyle} />
                      {i < arr.length - 1 && (
                        <div
                          style={{
                            width: 2,
                            flex: 1,
                            marginTop: 6,
                            background: "rgba(27,20,100,.15)",
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: "#fff",
                        borderRadius: 14,
                        border: "1px solid #ECE6DA",
                        padding: "18px 22px",
                        boxShadow: "0 1px 2px rgba(11,17,64,.04)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: ".8125rem",
                          fontWeight: 600,
                          color: "#1B1464",
                          marginBottom: 4,
                        }}
                      >
                        <CalendarDays size={13} /> {evt.date}
                      </div>
                      <h4
                        style={{
                          fontSize: ".9375rem",
                          fontWeight: 700,
                          marginBottom: 4,
                          color: "#1d1e20",
                        }}
                      >
                        {evt.title}
                      </h4>
                      <p style={{ fontSize: ".8125rem", color: "#6b7280" }}>
                        {evt.desc}
                      </p>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: ".75rem",
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: 100,
                          marginTop: 8,
                          background: statusColors[evt.status]?.bg || "#f2f3f6",
                          color: statusColors[evt.status]?.color || "#6b7280",
                        }}
                      >
                        {statusIcon} {evt.statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ÉQUIPE ═══════ */}
      <section style={{ ...section, background: "#ffffff" }} id="equipe">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <span style={badge}>
              <Users size={13} /> Gouvernance
            </span>
            <h2 style={sectionTitle}>Une équipe dirigeante de cliniciens</h2>
            <p
              style={{ ...sectionSub, marginLeft: "auto", marginRight: "auto" }}
            >
              Médecins, professeurs et coordinateurs administratifs qui font
              vivre le réseau au quotidien — au plus près du terrain et des
              patientes.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))",
              gap: 22,
            }}
          >
            {[
              {
                name: "Pr. Ziemlé Clément MEDA",
                role: "Président · depuis 2021",
                specialty: "Santé publique & périnatalité",
                affiliation: "CHU Sanou Souro · Université Nazi Boni",
                gradient: "#1B1464",
                iconColor: "#F4A28C",
                initials: "ZM",
              },
              {
                name: "Dr. H. Habib Ouattara",
                role: "Président d'honneur · 2010–2017",
                specialty: "Gynécologie-obstétrique",
                affiliation: "Pionnier du réseau périnatal HBS",
                gradient: "#D4694F",
                iconColor: "#FFE7DD",
                initials: "HO",
              },
              {
                name: "Pr. Der Adolphe Somé",
                role: "Président d'honneur · 2017–2021",
                specialty: "Pédiatrie & néonatologie",
                affiliation: "Université Nazi Boni",
                gradient: "#0E8E5C",
                iconColor: "#DCF3E7",
                initials: "DS",
              },
              {
                name: "Secrétariat Général",
                role: "Administration & coordination",
                specialty: "Gestion · membres · activités",
                affiliation: "Bobo-Dioulasso (TRYPANO)",
                gradient: "#0E7C7B",
                iconColor: "#E6F2F1",
                initials: "SG",
              },
            ].map((member) => (
              <div
                key={member.name}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 1px 2px rgba(11,17,64,.04)",
                  border: "1px solid #ECE6DA",
                  textAlign: "center",
                  transition: "transform .25s ease, box-shadow .25s ease",
                }}
              >
                <div
                  style={{
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: member.gradient,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Texture grille subtile */}
                  <div
                    aria-hidden
                    className="bg-dotgrid"
                    style={{ position: "absolute", inset: 0, opacity: 0.45 }}
                  />
                  {/* Cercle initiales — silhouette stylisée */}
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,.14)",
                      backdropFilter: "blur(10px)",
                      border: "1.5px solid rgba(255,255,255,.28)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: member.iconColor,
                      fontFamily: "'IBM Plex Serif',serif",
                      fontSize: "2rem",
                      fontWeight: 700,
                      letterSpacing: ".05em",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {member.initials}
                  </div>
                </div>
                <div style={{ padding: "22px 18px" }}>
                  <h3
                    style={{
                      fontSize: ".975rem",
                      fontWeight: 700,
                      marginBottom: 4,
                      color: "#1A1B25",
                    }}
                  >
                    {member.name}
                  </h3>
                  <div
                    style={{
                      fontSize: ".78rem",
                      color: "#0B6A6A",
                      fontWeight: 600,
                      letterSpacing: ".04em",
                      marginBottom: 10,
                    }}
                  >
                    {member.role}
                  </div>
                  <p
                    style={{
                      fontSize: ".82rem",
                      color: "#3D3F52",
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    {member.specialty}
                  </p>
                  <p
                    style={{
                      fontSize: ".75rem",
                      color: "#8A8DA0",
                      fontStyle: "italic",
                    }}
                  >
                    {member.affiliation}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 16,
                      paddingTop: 14,
                      borderTop: "1px dashed #ECE6DA",
                    }}
                  >
                    {[Link2, Mail].map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "#FAF7F2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #ECE6DA",
                        }}
                      >
                        <Icon size={14} color="#5C5F73" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ VOIX DE TERRAIN (Témoignages) ═══════ */}
      <section
        style={{
          ...section,
          background: "#0B1140",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          className="bg-dotgrid"
          style={{ position: "absolute", inset: 0, opacity: 0.4 }}
        />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                ...badge,
                background: "rgba(31,157,156,.18)",
                color: "#7FD1CF",
                border: "1px solid rgba(31,157,156,.32)",
              }}
            >
              <MessageCircle size={13} /> Voix de terrain
            </span>
            <h2 style={{ ...sectionTitle, color: "#fff" }}>
              Au plus près des soignants et des familles
            </h2>
            <p
              style={{
                ...sectionSub,
                color: "rgba(255,255,255,.66)",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              La rigueur scientifique prend tout son sens lorsqu'elle se
              traduit, sur le terrain, par des pratiques qui sauvent.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
              gap: 22,
            }}
          >
            {[
              {
                quote:
                  "Le REMEHBS a transformé ma pratique obstétricale. Les journées scientifiques m'ont permis de mettre à jour mes connaissances et de tisser des liens précieux avec des confrères de toute la région.",
                name: "Dʳ Aminata Koné",
                role: "Gynécologue-obstétricienne · CHU Sanou Souro",
                tag: "Clinique",
                avatarBg: "#0E7C7B",
                initials: "AK",
              },
              {
                quote:
                  "En tant que sage-femme, les formations m'ont donné les outils pour mieux prendre en charge les urgences obstétricales. Un réseau vraiment indispensable.",
                name: "Mᵐᵉ Rasmata Ouédraogo",
                role: "Sage-femme · CSPS de Dindéresso",
                tag: "Soins primaires",
                avatarBg: "#D4694F",
                initials: "RO",
              },
              {
                quote:
                  "Le modèle du réseau périnatal REMEHBS est exemplaire. Sa capacité à réunir professionnels, chercheurs et décideurs autour de la santé maternelle devrait inspirer toutes les régions du Burkina.",
                name: "Pʳ Idrissa Compaoré",
                role: "Pédiatre · Université Nazi Boni",
                tag: "Académique",
                avatarBg: "#1B1464",
                initials: "IC",
              },
            ].map((t) => (
              <div
                key={t.name}
                style={{
                  background: "rgba(255,255,255,.05)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,.10)",
                  borderRadius: 20,
                  padding: "32px 28px 28px",
                  color: "#fff",
                  position: "relative",
                }}
              >
                {/* Guillemet décoratif */}
                <span
                  aria-hidden
                  className="editorial"
                  style={{
                    position: "absolute",
                    top: 6,
                    left: 18,
                    fontSize: "4rem",
                    color: "#F4A28C",
                    opacity: 0.35,
                    lineHeight: 1,
                  }}
                >
                  “
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", gap: 3 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#F4A28C" color="#F4A28C" />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: ".64rem",
                      fontWeight: 600,
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      color: "#7FD1CF",
                      background: "rgba(31,157,156,.16)",
                      padding: "4px 9px",
                      borderRadius: 100,
                    }}
                  >
                    {t.tag}
                  </span>
                </div>
                <p
                  className="editorial"
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.72,
                    opacity: 0.92,
                    marginBottom: 24,
                    color: "rgba(255,255,255,.9)",
                  }}
                >
                  {t.quote}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: t.avatarBg,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'IBM Plex Serif',serif",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#fff",
                      border: "1.5px solid rgba(255,255,255,.18)",
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <strong
                      style={{
                        fontSize: ".9375rem",
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      {t.name}
                    </strong>
                    <span
                      style={{
                        fontSize: ".78rem",
                        opacity: 0.66,
                        fontStyle: "italic",
                      }}
                    >
                      {t.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ VISAGES & MOMENTS (Galerie photo) ═══════ */}
      <section
        style={{
          padding: "104px 0",
          background: "#FAF7F2",
          position: "relative",
          overflow: "hidden",
        }}
        id="galerie"
      >
        <div
          aria-hidden
          className="bg-dotgrid--ink"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.2,
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 40,
              flexWrap: "wrap",
              marginBottom: 48,
            }}
          >
            <div style={{ maxWidth: 620 }}>
              <span style={badge}>
                <Camera size={13} /> Visages & moments
              </span>
              <h2 style={sectionTitle}>
                Le réseau, au plus près du{" "}
                <em
                  className="editorial"
                  style={{ color: "#0B6A6A", fontWeight: 600 }}
                >
                  terrain
                </em>
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#5C5F73",
                  lineHeight: 1.7,
                }}
              >
                Sessions de formation, journées scientifiques, visites de
                maternités : aperçus de la vie du REMEHBS au cœur des
                Hauts-Bassins.
              </p>
            </div>
            <Link
              to="/evenements"
              style={{
                ...btn,
                background: "transparent",
                color: "#0B6A6A",
                borderColor: "#0E7C7B",
                padding: "12px 22px",
                fontSize: ".88rem",
              }}
            >
              <ArrowRight size={15} /> Voir toutes les archives
            </Link>
          </div>

          {/* Grille mosaïque — 3 grandes + 4 petites */}
          <div
            className="grid-gallery"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gridAutoRows: "200px",
              gap: 14,
            }}
          >
            {[
              {
                src: "/photos/jsp-2023-pleniere.jpg",
                title: "Plénière JSP · 2023",
                caption: "Bobo-Dioulasso · Salle des conférences DRS",
                tag: "Congrès",
                accent: "#0E7C7B",
                gradient: "#1B1464",
                icon: <Users size={64} strokeWidth={0.9} />,
                span: "col-span-2 row-span-2",
                colStart: 1,
                colEnd: 3,
                rowStart: 1,
                rowEnd: 3,
              },
              {
                src: "/photos/formation-sages-femmes.jpg",
                title: "Formation sages-femmes",
                caption: "CHU Sanou Souro · Mai 2024",
                tag: "Formation",
                accent: "#D4694F",
                gradient: "#D4694F",
                icon: <Stethoscope size={48} strokeWidth={0.9} />,
                colStart: 3,
                colEnd: 4,
                rowStart: 1,
                rowEnd: 2,
              },
              {
                src: "/photos/atelier-neonatologie.jpg",
                title: "Atelier néonatologie",
                caption: "Bobo · Avril 2024",
                tag: "Atelier",
                accent: "#0B6A6A",
                gradient: "#0E7C7B",
                icon: <Activity size={48} strokeWidth={0.9} />,
                colStart: 4,
                colEnd: 5,
                rowStart: 1,
                rowEnd: 2,
                objectPosition: "center 22%",
              },
              {
                src: "/photos/visite-maternite.jpg",
                title: "Visite maternité",
                caption: "CSPS Dindéresso",
                tag: "Terrain",
                accent: "#1B1464",
                gradient: "#1B1464",
                icon: <MapPin size={48} strokeWidth={0.9} />,
                colStart: 3,
                colEnd: 4,
                rowStart: 2,
                rowEnd: 3,
              },
              {
                src: "/photos/recherche-equipe.jpg",
                title: "Comité scientifique",
                caption: "Université Nazi Boni",
                tag: "Recherche",
                accent: "#8E5807",
                gradient: "#C57F12",
                icon: <Microscope size={48} strokeWidth={0.9} />,
                colStart: 4,
                colEnd: 5,
                rowStart: 2,
                rowEnd: 3,
              },
              {
                src: "/photos/ceremonie-ouverture.jpg",
                title: "Cérémonie d'ouverture · JSP 2023",
                caption: "Trypano · Bobo-Dioulasso",
                tag: "Officiel",
                accent: "#0B1140",
                gradient: "#0B1140",
                icon: <Award size={48} strokeWidth={0.9} />,
                colStart: 1,
                colEnd: 3,
                rowStart: 3,
                rowEnd: 4,
                objectPosition: "center 18%",
              },
              {
                src: "/photos/familles-jsp.jpg",
                title: "Familles & soignants",
                caption: "Causerie communautaire · 2024",
                tag: "Communauté",
                accent: "#D4694F",
                gradient: "#F4A28C",
                icon: <Users size={48} strokeWidth={0.9} />,
                colStart: 3,
                colEnd: 5,
                rowStart: 3,
                rowEnd: 4,
              },
            ].map((p) => (
              <figure
                key={p.title}
                style={{
                  gridColumn: `${p.colStart} / ${p.colEnd}`,
                  gridRow: `${p.rowStart} / ${p.rowEnd}`,
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: p.gradient,
                  boxShadow: "0 1px 3px rgba(11,17,64,.08)",
                  cursor: "pointer",
                }}
              >
                {/* Tentative de chargement de la vraie photo */}
                <img
                  src={p.src}
                  alt={p.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition:
                      (p as { objectPosition?: string }).objectPosition ??
                      "center",
                  }}
                />

                {/* Fallback : grille de points + icône stylisée */}
                <div
                  aria-hidden
                  className="bg-dotgrid"
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.55,
                  }}
                />
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,.18)",
                  }}
                >
                  {p.icon}
                </div>

              </figure>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════ CONTACT ═══════ */}
      <section style={section} id="contact">
        <div className="container">
          <div
            className="grid-contact"
            style={{
              display: "grid",
              gridTemplateColumns: "5fr 7fr",
              gap: 60,
              alignItems: "start",
            }}
          >
            {/* Left */}
            <div>
              <span style={badge}>
                <MessageSquare size={13} /> Contact
              </span>
              <h2 style={sectionTitle}>Nous contacter</h2>
              <p
                style={{ color: "#6b7280", marginBottom: 32, lineHeight: 1.75 }}
              >
                Notre secrétariat est disponible pour répondre à toutes vos
                questions sur l'adhésion, les événements ou les partenariats.
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {[
                  {
                    icon: <Mail size={18} />,
                    bg: "#EEEDF7",
                    color: "#1B1464",
                    title: "E-mail",
                    info: "secretariat@remehbs-bf.org",
                  },
                  {
                    icon: <Phone size={18} />,
                    bg: "#FFE7DD",
                    color: "#B85339",
                    title: "Téléphone",
                    info: "+226 70 24 48 27 · +226 78 69 44 67\n+226 70 34 00 00 · +226 76 56 26 67",
                  },
                  {
                    icon: <MapPin size={18} />,
                    bg: "#E6F2F1",
                    color: "#0B6A6A",
                    title: "Adresse",
                    info: "Direction Régionale de la Santé des Hauts-Bassins (TRYPANO), Bobo-Dioulasso, Burkina Faso",
                  },
                  {
                    icon: <Clock size={18} />,
                    bg: "#FCEFD3",
                    color: "#8E5807",
                    title: "Horaires du secrétariat",
                    info: "Lundi – Vendredi : 8h00 – 17h00\nSamedi : 8h00 – 12h00",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      background: "#FAF7F2",
                      borderRadius: 14,
                      padding: "18px 20px",
                      border: "1px solid #ECE6DA",
                    }}
                  >
                    <div style={iconBox(40, c.bg, c.color)}>{c.icon}</div>
                    <div>
                      <strong
                        style={{
                          fontSize: ".9375rem",
                          fontWeight: 700,
                          display: "block",
                          color: "#1d1e20",
                          marginBottom: 3,
                        }}
                      >
                        {c.title}
                      </strong>
                      <span
                        style={{
                          fontSize: ".875rem",
                          color: "#6b7280",
                          lineHeight: 1.65,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {c.info}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div
              style={{
                background: "#FAF7F2",
                border: "1px solid #ECE6DA",
                borderRadius: 22,
                padding: 38,
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: 5,
                  color: "#1d1e20",
                }}
              >
                Envoyer un message
              </h3>
              <p
                style={{
                  fontSize: ".875rem",
                  color: "#6b7280",
                  marginBottom: 26,
                }}
              >
                Réponse garantie sous 48 heures ouvrables
              </p>
              <form onSubmit={(e) => e.preventDefault()}>
                <div
                  className="grid-form"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    <label
                      style={{
                        fontSize: ".875rem",
                        fontWeight: 600,
                        color: "#1d1e20",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <UserCircle size={14} color="#1B1464" /> Nom
                    </label>
                    <input
                      type="text"
                      placeholder="Votre nom"
                      value={contactForm.nom}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, nom: e.target.value }))
                      }
                      style={formInput}
                    />
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    <label
                      style={{
                        fontSize: ".875rem",
                        fontWeight: 600,
                        color: "#1d1e20",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <UserCircle size={14} color="#1B1464" /> Prénom
                    </label>
                    <input
                      type="text"
                      placeholder="Votre prénom"
                      value={contactForm.prenom}
                      onChange={(e) =>
                        setContactForm((f) => ({
                          ...f,
                          prenom: e.target.value,
                        }))
                      }
                      style={formInput}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    marginBottom: 14,
                  }}
                >
                  <label
                    style={{
                      fontSize: ".875rem",
                      fontWeight: 600,
                      color: "#1d1e20",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Mail size={14} color="#1B1464" /> E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="vous@exemple.com"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, email: e.target.value }))
                    }
                    style={formInput}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    marginBottom: 14,
                  }}
                >
                  <label
                    style={{
                      fontSize: ".875rem",
                      fontWeight: 600,
                      color: "#1d1e20",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Tag size={14} color="#1B1464" /> Objet
                  </label>
                  <select
                    value={contactForm.objet}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, objet: e.target.value }))
                    }
                    style={formInput}
                  >
                    <option>Adhésion & inscription</option>
                    <option>Journées Scientifiques 2025</option>
                    <option>Partenariat / Collaboration</option>
                    <option>Paiement de cotisation</option>
                    <option>Autre demande</option>
                  </select>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    marginBottom: 24,
                  }}
                >
                  <label
                    style={{
                      fontSize: ".875rem",
                      fontWeight: 600,
                      color: "#1d1e20",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <MessageSquare size={14} color="#1B1464" /> Message
                  </label>
                  <textarea
                    placeholder="Décrivez votre demande en détail..."
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, message: e.target.value }))
                    }
                    style={{
                      ...formInput,
                      minHeight: 100,
                      resize: "vertical" as const,
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    ...btn,
                    background: "#1B1464",
                    color: "#fff",
                    width: "100%",
                    justifyContent: "center",
                    padding: "15px 34px",
                    fontSize: "1rem",
                  }}
                >
                  <Send size={16} /> Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SCROLL TOP ═══════ */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Retour en haut"
        style={{
          position: "fixed",
          bottom: 26,
          right: 26,
          zIndex: 990,
          width: 46,
          height: 46,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,.18)",
          cursor: "pointer",
          background: "#1B1464",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 28px rgba(11,17,64,.22)",
        }}
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}

const formInput: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 10,
  border: "1.5px solid #ECE6DA",
  fontSize: ".9375rem",
  fontFamily: "inherit",
  color: "#1A1B25",
  background: "#fff",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color .15s ease, box-shadow .15s ease",
};
