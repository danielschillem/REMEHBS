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
  RotateCcw,
  ChevronRight,
  ArrowUp,
  Building2,
  Check,
  X,
  MessageCircle,
} from "lucide-react";

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
const sectionSm: React.CSSProperties = { padding: "64px 0" };
const sectionTitle: React.CSSProperties = {
  fontFamily: "'Playfair Display',serif",
  fontSize: "clamp(1.9rem,3.5vw,2.75rem)",
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: 14,
};
const sectionSub: React.CSSProperties = {
  fontSize: "1rem",
  color: "#6b7280",
  maxWidth: 560,
  marginBottom: 52,
};
const badge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "#FFF0F5",
  color: "#1B1464",
  fontSize: ".75rem",
  fontWeight: 600,
  letterSpacing: ".06em",
  textTransform: "uppercase",
  padding: "6px 14px",
  borderRadius: 100,
  marginBottom: 14,
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
          minHeight: "90vh",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(140deg,#0D0830 0%,#1B1464 45%,#2A1A6E 100%)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 55% 65% at 72% 55%,rgba(27,20,100,.4) 0%,transparent 68%),radial-gradient(ellipse 38% 42% at 18% 22%,rgba(212,132,154,.28) 0%,transparent 58%),radial-gradient(ellipse 30% 30% at 85% 10%,rgba(232,165,184,.2) 0%,transparent 55%)",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            className="grid-hero"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
              alignItems: "center",
              padding: "80px 0",
            }}
          >
            {/* Left */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,.1)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,.18)",
                  color: "rgba(255,255,255,.9)",
                  fontSize: ".8125rem",
                  fontWeight: 600,
                  letterSpacing: ".07em",
                  textTransform: "uppercase",
                  padding: "8px 18px",
                  borderRadius: 100,
                  marginBottom: 26,
                }}
              >
                <Award size={14} /> 20 ans au service de la santé maternelle
              </div>
              <h1
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "clamp(2.4rem,5vw,3.75rem)",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.14,
                  marginBottom: 22,
                }}
              >
                Santé des{" "}
                <em style={{ fontStyle: "normal", color: "#E8A5B8" }}>Mères</em>
                <br />
                et des{" "}
                <em style={{ fontStyle: "normal", color: "#E8A5B8" }}>
                  Enfants
                </em>
                <br />
                au cœur de nos priorités
              </h1>
              <p
                style={{
                  fontSize: "1.0625rem",
                  color: "rgba(255,255,255,.78)",
                  maxWidth: 480,
                  marginBottom: 38,
                }}
              >
                Le REMEHBS fédère depuis 2005 les professionnels de santé
                périnatale des Hauts-Bassins pour réduire la mortalité
                maternelle, périnatale et infantile au Burkina Faso.
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
                  gap: 36,
                  marginTop: 52,
                  paddingTop: 36,
                  borderTop: "1px solid rgba(255,255,255,.12)",
                }}
              >
                {[
                  ["20+", "Années d'existence"],
                  ["500+", "Membres actifs"],
                  ["7", "Journées scientifiques"],
                ].map(([num, lbl]) => (
                  <div
                    key={lbl}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <span
                      style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {num}
                    </span>
                    <span
                      style={{
                        fontSize: ".8125rem",
                        color: "rgba(255,255,255,.6)",
                        marginTop: 4,
                      }}
                    >
                      {lbl}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating cards */}
            <div
              className="hero-right"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,.08)",
                  backdropFilter: "blur(18px)",
                  border: "1px solid rgba(255,255,255,.14)",
                  borderRadius: 20,
                  padding: "26px 28px",
                  color: "#fff",
                  width: "100%",
                  maxWidth: 380,
                }}
              >
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{ ...iconBox(52, "rgba(255,255,255,.18)", "#fff") }}
                  >
                    <CalendarDays size={24} />
                  </div>
                </div>
                <h3
                  style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 6 }}
                >
                  7èmes Journées Scientifiques 2025
                </h3>
                <p style={{ fontSize: ".875rem", opacity: 0.72 }}>
                  Congrès principal · 23–25 juillet 2025 · Bobo-Dioulasso
                </p>
              </div>
              {[
                {
                  icon: <Users size={20} />,
                  title: "Adhésion en ligne",
                  sub: "Rejoignez le réseau en 5 minutes",
                },
                {
                  icon: <ShieldCheck size={20} />,
                  title: "Réseau apolitique & aconfessionnel",
                  sub: "Fondé sur l'excellence médicale",
                },
                {
                  icon: <FileText size={20} />,
                  title: "Appel à communications ouvert",
                  sub: "Soumettez avant le 30 juin 2025",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  style={{
                    background: "rgba(255,255,255,.06)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 14,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    color: "#fff",
                    maxWidth: 340,
                    width: "100%",
                  }}
                >
                  <span style={{ color: "#E8A5B8", flexShrink: 0 }}>
                    {c.icon}
                  </span>
                  <div>
                    <strong
                      style={{
                        fontSize: ".9rem",
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      {c.title}
                    </strong>
                    <span style={{ fontSize: ".8125rem", opacity: 0.7 }}>
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
        style={{
          background: "linear-gradient(90deg,#1B1464 0%,#D4849A 100%)",
          padding: "16px 0",
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
            <Megaphone size={20} color="#fff" />
            <p
              style={{
                fontSize: ".9375rem",
                color: "#fff",
                fontWeight: 500,
                flex: 1,
              }}
            >
              <strong>Appel à communications :</strong> Soumettez vos résumés
              scientifiques avant le 30 juin 2025 — Congrès 23–25 juillet,
              Bobo-Dioulasso
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
            {/* Visual */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  borderRadius: 24,
                  background: "linear-gradient(135deg,#FFF0F5,#FFE0E8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Activity
                  size={110}
                  color="#E8A5B8"
                  style={{ opacity: 0.35 }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: -20,
                  right: -20,
                  background: "#fff",
                  borderRadius: 16,
                  padding: "16px 20px",
                  boxShadow: "0 4px 24px rgba(27,20,100,.13)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  maxWidth: 220,
                }}
              >
                <div style={iconBox(40, "#00b96b", "#fff")}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong
                    style={{
                      fontSize: ".9375rem",
                      fontWeight: 700,
                      display: "block",
                      color: "#1d1e20",
                    }}
                  >
                    Fondé en 2005
                  </strong>
                  <span style={{ fontSize: ".8125rem", color: "#6b7280" }}>
                    20 ans d'impact médical
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
              <p style={{ color: "#6b7280", lineHeight: 1.75 }}>
                Le REMEHBS est une association apolitique et aconfessionnelle
                dont l'objet est l'amélioration de la santé maternelle,
                périnatale et infantile dans la région des Hauts-Bassins. Il
                fédère professionnels de santé, chercheurs et décideurs autour
                d'une vision commune.
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
                  },
                  {
                    icon: <BookOpen size={16} />,
                    title: "1ères Journées Scientifiques — 2009",
                    sub: "Lancement des congrès périnataux régionaux",
                  },
                  {
                    icon: <TrendingUp size={16} />,
                    title: "Expansion nationale — 2017",
                    sub: "Partenariats avec la Direction Régionale de la Santé",
                  },
                  {
                    icon: <Star size={16} />,
                    title: "20ème anniversaire — 2025",
                    sub: "7èmes Journées Scientifiques de Périnatalité",
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
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: "#FFF0F5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#1B1464",
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
                          color: "#1d1e20",
                          marginBottom: 2,
                        }}
                      >
                        {item.title}
                      </strong>
                      <span style={{ fontSize: ".875rem", color: "#6b7280" }}>
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
          background: "linear-gradient(90deg,transparent,#f2f3f6,transparent)",
        }}
      />

      {/* ═══════ MISSIONS ═══════ */}
      <section style={{ ...section, background: "#f2f3f6" }} id="missions">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <span style={badge}>
              <Target size={13} /> Nos Missions
            </span>
            <h2 style={sectionTitle}>Ce que nous portons chaque jour</h2>
            <p
              style={{ ...sectionSub, marginLeft: "auto", marginRight: "auto" }}
            >
              Quatre axes stratégiques pour réduire la mortalité maternelle,
              périnatale et infantile dans les Hauts-Bassins.
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
                bg: "#FFF0F5",
                color: "#1B1464",
                title: "Renforcement des compétences",
                desc: "Formations continues pour les professionnels de santé sur les meilleures pratiques obstétricales et néonatales.",
              },
              {
                icon: <Stethoscope size={28} />,
                bg: "#FFF0F5",
                color: "#D4849A",
                title: "Soins de qualité",
                desc: "Harmonisation des protocoles de soins périnataux et promotion de pratiques fondées sur les preuves scientifiques.",
              },
              {
                icon: <Microscope size={28} />,
                bg: "#e6f9f0",
                color: "#00b96b",
                title: "Recherche scientifique",
                desc: "Organisation de journées scientifiques biannuelles favorisant le partage des connaissances et la collaboration.",
              },
              {
                icon: <Users size={28} />,
                bg: "#fff0f5",
                color: "#fc5185",
                title: "Consultation d'experts",
                desc: "Réseau de consultants spécialisés mobilisables pour accompagner les structures dans l'amélioration de leur offre de soins.",
              },
              {
                icon: <Activity size={28} />,
                bg: "#fff5e6",
                color: "#f59e0b",
                title: "Surveillance épidémiologique",
                desc: "Suivi des indicateurs clés de mortalité maternelle et périnatale pour orienter les politiques de santé régionales.",
              },
              {
                icon: <Handshake size={28} />,
                bg: "#FFF0F5",
                color: "#1B1464",
                title: "Plaidoyer & Partenariats",
                desc: "Collaboration avec le Ministère de la Santé, les ONG et partenaires techniques pour mobiliser les ressources nécessaires.",
              },
            ].map((m) => (
              <div
                key={m.title}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "32px 28px",
                  boxShadow: "0 2px 8px rgba(0,0,0,.07)",
                  border: "1.5px solid transparent",
                  transition: "all .22s ease",
                }}
              >
                <div style={iconBox(64, m.bg, m.color)}>{m.icon}</div>
                <h3
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    margin: "18px 0 10px",
                    color: "#1d1e20",
                  }}
                >
                  {m.title}
                </h3>
                <p
                  style={{
                    fontSize: ".875rem",
                    color: "#6b7280",
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
                background: "linear-gradient(145deg,#141050,#1B1464)",
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
                  fontFamily: "'Playfair Display',serif",
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
                  dotStyle.background = "#f59e0b";
                  dotStyle.borderColor = "#f59e0b";
                }

                const statusColors: Record<
                  string,
                  { bg: string; color: string }
                > = {
                  done: { bg: "#e6f9f0", color: "#00b96b" },
                  open: { bg: "#FFF0F5", color: "#1B1464" },
                  soon: { bg: "#fff5e6", color: "#f59e0b" },
                  main: {
                    bg: "linear-gradient(90deg,#FFF0F5,#FFF0F5)",
                    color: "#141050",
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
                            background:
                              "linear-gradient(to bottom,rgba(27,20,100,.25),rgba(27,20,100,.05))",
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: "#fff",
                        borderRadius: 12,
                        border: "1.5px solid #f2f3f6",
                        padding: "18px 22px",
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
      <section style={{ ...section, background: "#f2f3f6" }} id="equipe">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <span style={badge}>
              <Users size={13} /> Leadership
            </span>
            <h2 style={sectionTitle}>Notre équipe dirigeante</h2>
            <p
              style={{ ...sectionSub, marginLeft: "auto", marginRight: "auto" }}
            >
              Des professionnels de santé engagés au service de la santé
              maternelle et périnatale depuis 20 ans.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
              gap: 24,
            }}
          >
            {[
              {
                name: "Pr. Ziemlé Clément MEDA",
                role: "Président depuis 2021",
                desc: "Professeur, expert en santé publique et périnatalité, CHU Sanou Souro",
                gradient: "linear-gradient(135deg,#FFF0F5,#FFE0E8)",
                iconColor: "#E8A5B8",
              },
              {
                name: "Dr. H. Habib Ouattara",
                role: "Président d'honneur (2010–2017)",
                desc: "Gynécologue-obstétricien, pionnier du réseau périnatal des Hauts-Bassins",
                gradient: "linear-gradient(135deg,#FFF0F5,#FFD6E0)",
                iconColor: "#D4849A",
              },
              {
                name: "Pr. Der Adolphe Somé",
                role: "Président d'honneur (2017–2021)",
                desc: "Professeur de pédiatrie et néonatologie, Université Nazi Boni",
                gradient: "linear-gradient(135deg,#e6f9f0,#ccf2e0)",
                iconColor: "#00b96b",
              },
              {
                name: "Secrétariat Général",
                role: "Administration & Coordination",
                desc: "Gestion administrative, coordination des membres et suivi des activités",
                gradient: "linear-gradient(135deg,#fff0f5,#ffd6e5)",
                iconColor: "#fc5185",
              },
            ].map((member) => (
              <div
                key={member.name}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,.07)",
                  textAlign: "center",
                  transition: "all .22s ease",
                }}
              >
                <div
                  style={{
                    height: 176,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: member.gradient,
                  }}
                >
                  <UserCircle
                    size={70}
                    color={member.iconColor}
                    style={{ opacity: 0.55 }}
                  />
                </div>
                <div style={{ padding: "20px 16px" }}>
                  <h3
                    style={{
                      fontSize: ".9375rem",
                      fontWeight: 700,
                      marginBottom: 4,
                      color: "#1d1e20",
                    }}
                  >
                    {member.name}
                  </h3>
                  <div
                    style={{
                      fontSize: ".8125rem",
                      color: "#1B1464",
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    {member.role}
                  </div>
                  <p style={{ fontSize: ".8rem", color: "#6b7280" }}>
                    {member.desc}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 14,
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
                          background: "#f2f3f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={14} color="#6b7280" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ADHÉSION — PLANS ═══════ */}
      <section style={section} id="adhesion">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <span style={badge}>
              <UserPlus size={13} /> Adhésion
            </span>
            <h2 style={sectionTitle}>Rejoignez le REMEHBS</h2>
            <p
              style={{ ...sectionSub, marginLeft: "auto", marginRight: "auto" }}
            >
              Choisissez la catégorie correspondant à votre profil et contribuez
              à l'amélioration de la santé maternelle.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: 28,
            }}
          >
            {[
              {
                icon: <BookOpen size={28} />,
                ibBg: "#FFF0F5",
                ibColor: "#D4849A",
                title: "Étudiant / Stagiaire",
                desc: "Pour les étudiants en sciences de la santé et stagiaires en formation initiale",
                price: "2 000",
                featured: false,
                features: [
                  { text: "Accès aux journées scientifiques", ok: true },
                  { text: "Documentation & ressources pédagogiques", ok: true },
                  { text: "Réductions sur les formations", ok: true },
                  { text: "Droit de vote en assemblée générale", ok: false },
                  { text: "Accès aux commissions thématiques", ok: false },
                ],
              },
              {
                icon: <Stethoscope size={28} />,
                ibBg: "#FFF0F5",
                ibColor: "#1B1464",
                title: "Professionnel de Santé",
                desc: "Pour les médecins, sages-femmes, infirmiers et autres professionnels diplômés",
                price: "5 000",
                featured: true,
                features: [
                  { text: "Accès aux journées scientifiques", ok: true },
                  { text: "Documentation & ressources avancées", ok: true },
                  { text: "Tarif préférentiel formations & congrès", ok: true },
                  { text: "Droit de vote en assemblée générale", ok: true },
                  { text: "Accès aux commissions thématiques", ok: true },
                ],
              },
              {
                icon: <Building2 size={28} />,
                ibBg: "#e6f9f0",
                ibColor: "#00b96b",
                title: "Institution / Structure",
                desc: "Pour les hôpitaux, cliniques, ONG et structures sanitaires",
                price: "25 000",
                featured: false,
                features: [
                  { text: "Accès pour 5 membres de la structure", ok: true },
                  { text: "Visibilité dans l'annuaire du réseau", ok: true },
                  {
                    text: "Partenariat et co-organisation d'événements",
                    ok: true,
                  },
                  { text: "Rapport annuel d'activités REMEHBS", ok: true },
                  { text: "1 stand lors des journées scientifiques", ok: true },
                ],
              },
            ].map((plan) => (
              <div
                key={plan.title}
                style={{
                  background: plan.featured
                    ? "linear-gradient(160deg,#faf8ff 0%,#fff 100%)"
                    : "#fff",
                  borderRadius: 20,
                  padding: "36px 32px",
                  boxShadow: "0 2px 8px rgba(0,0,0,.07)",
                  border: `2px solid ${plan.featured ? "#1B1464" : "#f2f3f6"}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {plan.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      background: "#1B1464",
                      color: "#fff",
                      fontSize: ".75rem",
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 100,
                    }}
                  >
                    Populaire
                  </div>
                )}
                <div style={iconBox(64, plan.ibBg, plan.ibColor)}>
                  {plan.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    margin: "18px 0 4px",
                    color: "#1d1e20",
                  }}
                >
                  {plan.title}
                </h3>
                <p
                  style={{
                    fontSize: ".875rem",
                    color: "#6b7280",
                    marginBottom: 22,
                  }}
                >
                  {plan.desc}
                </p>
                <div style={{ marginBottom: 26 }}>
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      verticalAlign: "super",
                      marginRight: 2,
                    }}
                  >
                    FCFA
                  </span>
                  <span
                    style={{
                      fontSize: "2.375rem",
                      fontWeight: 800,
                      color: "#1d1e20",
                    }}
                  >
                    {plan.price}
                  </span>
                  <span style={{ fontSize: ".875rem", color: "#6b7280" }}>
                    {" "}
                    / an
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 11,
                    marginBottom: 28,
                  }}
                >
                  {plan.features.map((f) => (
                    <div
                      key={f.text}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: ".875rem",
                        color: f.ok ? "#1d1e20" : "#9ca3af",
                      }}
                    >
                      {f.ok ? (
                        <Check size={16} color="#00b96b" />
                      ) : (
                        <X size={16} color="#d1d5db" />
                      )}
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/adhesion"
                  style={{
                    ...btn,
                    width: "100%",
                    justifyContent: "center",
                    background: plan.featured ? "#1B1464" : "transparent",
                    color: plan.featured ? "#fff" : "#1B1464",
                    borderColor: plan.featured ? "transparent" : "#1B1464",
                  }}
                >
                  <ArrowRight size={16} /> Choisir ce plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TÉMOIGNAGES ═══════ */}
      <section style={{ ...section, background: "#0F0B3E" }}>
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                ...badge,
                background: "rgba(255,255,255,.12)",
                color: "rgba(255,255,255,.88)",
              }}
            >
              <MessageCircle size={13} /> Témoignages
            </span>
            <h2 style={{ ...sectionTitle, color: "#fff" }}>
              Ce que disent nos membres
            </h2>
            <p
              style={{
                ...sectionSub,
                color: "rgba(255,255,255,.6)",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              La voix de ceux qui font vivre le REMEHBS au quotidien.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: 22,
            }}
          >
            {[
              {
                quote:
                  "Le REMEHBS a transformé ma pratique obstétricale. Les journées scientifiques m'ont permis de mettre à jour mes connaissances et de tisser des liens précieux avec des confrères de toute la région.",
                name: "Dr. Aminata Koné",
                role: "Gynécologue-Obstétricienne · CHU de Bobo",
                avatarBg: "linear-gradient(135deg,#E8A5B8,#D4849A)",
              },
              {
                quote:
                  "En tant que sage-femme, les formations organisées par le réseau m'ont donné les outils pour mieux prendre en charge les urgences obstétricales. Un réseau vraiment indispensable.",
                name: "Mme Rasmata Ouédraogo",
                role: "Sage-femme · CSPS de Dindéresso",
                avatarBg: "linear-gradient(135deg,#fc5185,#ff8fa3)",
              },
              {
                quote:
                  "Le modèle du réseau périnatal REMEHBS est exemplaire. Sa capacité à réunir professionnels, chercheurs et décideurs autour de la santé maternelle devrait inspirer toutes les régions du Burkina.",
                name: "Pr. Idrissa Compaoré",
                role: "Pédiatre · Université Nazi Boni",
                avatarBg: "linear-gradient(135deg,#00b96b,#34d399)",
              },
            ].map((t) => (
              <div
                key={t.name}
                style={{
                  background: "rgba(255,255,255,.07)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,.11)",
                  borderRadius: 20,
                  padding: "30px 26px",
                  color: "#fff",
                }}
              >
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: ".9375rem",
                    lineHeight: 1.72,
                    opacity: 0.82,
                    marginBottom: 22,
                  }}
                >
                  &laquo; {t.quote} &raquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: t.avatarBg,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <UserCircle size={18} color="#fff" />
                  </div>
                  <div>
                    <strong
                      style={{
                        fontSize: ".9375rem",
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      {t.name}
                    </strong>
                    <span style={{ fontSize: ".8rem", opacity: 0.62 }}>
                      {t.role}
                    </span>
                  </div>
                </div>
              </div>
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
                    bg: "#FFF0F5",
                    color: "#1B1464",
                    title: "E-mail",
                    info: "secretariat@remehbs-bf.org",
                  },
                  {
                    icon: <Phone size={18} />,
                    bg: "#FFF0F5",
                    color: "#D4849A",
                    title: "Téléphone",
                    info: "+226 70 24 48 27 · +226 78 69 44 67\n+226 70 34 00 00 · +226 76 56 26 67",
                  },
                  {
                    icon: <MapPin size={18} />,
                    bg: "#e6f9f0",
                    color: "#00b96b",
                    title: "Adresse",
                    info: "Direction Régionale de la Santé des Hauts-Bassins (TRYPANO), Bobo-Dioulasso, Burkina Faso",
                  },
                  {
                    icon: <Clock size={18} />,
                    bg: "#fff5e6",
                    color: "#f59e0b",
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
                      background: "#f2f3f6",
                      borderRadius: 14,
                      padding: "18px 20px",
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
              style={{ background: "#f2f3f6", borderRadius: 22, padding: 38 }}
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
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "#1B1464",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(27,20,100,.13)",
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
  border: "1.5px solid #e5e7eb",
  fontSize: ".9375rem",
  fontFamily: "inherit",
  color: "#1d1e20",
  background: "#fff",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
