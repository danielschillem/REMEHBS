import { useEffect, useState, useCallback } from "react";
import {
  BookOpen,
  Search,
  Download,
  FileText,
  Presentation,
  GraduationCap,
  Filter,
  X,
  Grid3x3,
  List,
  Eye,
} from "lucide-react";
import { publicationsApi, THEMES, type Publication } from "../api/events";

const TYPE_LABELS: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  communication: {
    label: "Communication orale",
    color: "#1B1464",
    icon: <Presentation size={13} />,
  },
  poster: {
    label: "Poster",
    color: "#D4849A",
    icon: <FileText size={13} />,
  },
  conference: {
    label: "Conférence / Panel",
    color: "#00b96b",
    icon: <GraduationCap size={13} />,
  },
};

const SORT_OPTIONS = [
  { value: "ordre", label: "Ordre de présentation" },
  { value: "titre", label: "Titre (A-Z)" },
  { value: "auteur", label: "Auteur (A-Z)" },
  { value: "type", label: "Type" },
];

function TypeBadge({ type }: { type: string }) {
  const info = TYPE_LABELS[type] ?? {
    label: type,
    color: "#6b7280",
    icon: null,
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: ".70rem",
        fontWeight: 700,
        padding: "4px 10px",
        borderRadius: 100,
        background: info.color + "15",
        color: info.color,
        flexShrink: 0,
      }}
    >
      {info.icon}
      {info.label}
    </span>
  );
}

function PublicationModal({
  pub,
  onClose,
}: {
  pub: Publication | null;
  onClose: () => void;
}) {
  if (!pub) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          maxWidth: 500,
          width: "100%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: 20,
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                margin: "0 0 10px",
                color: "#1d1e20",
                lineHeight: 1.4,
              }}
            >
              {pub.titre}
            </h2>
            <div
              style={{ fontSize: ".85rem", color: "#6b7280", fontWeight: 600 }}
            >
              {pub.auteur}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#6b7280",
              padding: 0,
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 20,
            paddingBottom: 20,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <TypeBadge type={pub.type_presentation} />
          <div
            style={{
              fontSize: ".73rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 100,
              background: "#f0f2ff",
              color: "#1B1464",
            }}
          >
            {pub.theme_display}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: ".8rem",
              fontWeight: 600,
              color: "#6b7280",
              marginBottom: 4,
            }}
          >
            Congrès
          </div>
          <div style={{ fontSize: ".9rem", color: "#1d1e20" }}>
            {pub.congres}
          </div>
        </div>

        {pub.date_soumission && (
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: ".8rem",
                fontWeight: 600,
                color: "#6b7280",
                marginBottom: 4,
              }}
            >
              Date de soumission
            </div>
            <div style={{ fontSize: ".9rem", color: "#1d1e20" }}>
              {new Date(pub.date_soumission).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        )}

        {pub.fichier_url && (
          <a
            href={pub.fichier_url}
            target="_blank"
            rel="noopener noreferrer"
            download
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 100,
              background: "linear-gradient(135deg,#1B1464,#2d2080)",
              color: "#fff",
              fontSize: ".9rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <Download size={16} /> Télécharger le PDF
          </a>
        )}
      </div>
    </div>
  );
}

function PublicationCard({
  pub,
  onView,
}: {
  pub: Publication;
  onView: () => void;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 16,
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        height: "100%",
        transition: "all 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 12px rgba(0,0,0,.1)";
        (e.currentTarget as HTMLElement).style.borderColor = "#d4849a";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
      }}
    >
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <TypeBadge type={pub.type_presentation} />
      </div>

      <h3
        style={{
          fontSize: ".9rem",
          fontWeight: 700,
          margin: 0,
          color: "#1d1e20",
          lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {pub.titre}
      </h3>

      <div
        style={{
          fontSize: ".8rem",
          color: "#6b7280",
          fontWeight: 500,
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {pub.auteur}
      </div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: 12,
          borderTop: "1px solid #f0f2ff",
        }}
      >
        <button
          onClick={onView}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #1B1464",
            background: "transparent",
            color: "#1B1464",
            fontSize: ".8rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <Eye size={14} /> Voir détails
        </button>
      </div>
    </div>
  );
}

export default function EspaceScientifiquePage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [theme, setTheme] = useState("");
  const [typePresentation, setTypePresentation] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("ordre");
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchPublications = useCallback(() => {
    setLoading(true);
    setError("");
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (theme) params.theme = theme;
    if (typePresentation) params.type_presentation = typePresentation;

    publicationsApi
      .list(params)
      .then((r) => setPublications(r.data))
      .catch(() => setError("Impossible de charger les communications."))
      .finally(() => setLoading(false));
  }, [debouncedSearch, theme, typePresentation]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  // Compter par thème
  const themeCounts = publications.reduce(
    (acc, p) => {
      acc[p.theme] = (acc[p.theme] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Trier les publications
  let sorted = [...publications];
  switch (sortBy) {
    case "titre":
      sorted.sort((a, b) => a.titre.localeCompare(b.titre));
      break;
    case "auteur":
      sorted.sort((a, b) => a.auteur.localeCompare(b.auteur));
      break;
    case "type":
      sorted.sort((a, b) =>
        a.type_presentation.localeCompare(b.type_presentation),
      );
      break;
    default:
      sorted.sort((a, b) => a.ordre - b.ordre);
  }

  const grouped = theme
    ? { [theme]: sorted }
    : sorted.reduce<Record<string, Publication[]>>((acc, p) => {
        if (!acc[p.theme]) acc[p.theme] = [];
        acc[p.theme].push(p);
        return acc;
      }, {});

  const themeLabels = Object.fromEntries(THEMES.map((t) => [t.value, t.label]));
  const activeFilters = [
    theme ? THEMES.find((t) => t.value === theme)?.label : null,
    typePresentation ? TYPE_LABELS[typePresentation]?.label : null,
  ].filter(Boolean);

  return (
    <div
      style={{ background: "#f4f6fb", minHeight: "100vh", paddingBottom: 40 }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(140deg,#0f1538 0%,#1B1464 55%,#2d2080 100%)",
          padding: "52px 0 40px",
          color: "#fff",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,.12)",
              border: "1px solid rgba(255,255,255,.2)",
              borderRadius: 100,
              padding: "6px 14px",
              fontSize: ".78rem",
              fontWeight: 700,
              letterSpacing: ".05em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            <BookOpen size={13} /> Bibliothèque Scientifique
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(1.75rem,4vw,2.75rem)",
              fontWeight: 800,
              margin: "0 0 10px",
            }}
          >
            Espace Scientifique REMEHBS
          </h1>
          <p
            style={{ color: "rgba(255,255,255,.78)", maxWidth: 600, margin: 0 }}
          >
            {publications.length} communications scientifiques approuvées •
            7èmes JSP REMEHBS 2025
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 300px)" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: sidebarOpen ? 280 : 0,
            background: "#fff",
            borderRight: "1px solid #e5e7eb",
            transition: "width 0.3s",
            overflow: "hidden",
            overflowY: "auto",
          }}
        >
          <div style={{ padding: 20 }}>
            {/* Search */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#f4f6fb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <Search size={16} color="#6b7280" />
                <input
                  type="text"
                  placeholder="Rechercher…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: ".9rem",
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6b7280",
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Type Filter */}
            <div style={{ marginBottom: 24 }}>
              <h3
                style={{
                  fontSize: ".8rem",
                  fontWeight: 700,
                  color: "#1d1e20",
                  margin: "0 0 12px",
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                }}
              >
                Type de présentation
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["communication", "poster", "conference"].map((type) => (
                  <label
                    key={type}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                      fontSize: ".9rem",
                    }}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={typePresentation === type}
                      onChange={(e) => setTypePresentation(e.target.value)}
                      style={{ cursor: "pointer" }}
                    />
                    <span>
                      {TYPE_LABELS[type as keyof typeof TYPE_LABELS].label}
                    </span>
                  </label>
                ))}
                {typePresentation && (
                  <button
                    onClick={() => setTypePresentation("")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#D4849A",
                      fontSize: ".8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      padding: "4px 0",
                    }}
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>

            {/* Theme Categories */}
            <div>
              <h3
                style={{
                  fontSize: ".8rem",
                  fontWeight: 700,
                  color: "#1d1e20",
                  margin: "0 0 12px",
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                }}
              >
                Catégories ({Object.keys(themeCounts).length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {THEMES.filter((t) => t.value).map((t) => {
                  const count = themeCounts[t.value] ?? 0;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTheme(theme === t.value ? "" : t.value)}
                      style={{
                        background:
                          theme === t.value ? "#f0f2ff" : "transparent",
                        border:
                          theme === t.value
                            ? "1px solid #1B1464"
                            : "1px solid #e5e7eb",
                        padding: "10px 12px",
                        borderRadius: 8,
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: ".85rem",
                        fontWeight: theme === t.value ? 700 : 500,
                        color: theme === t.value ? "#1B1464" : "#1d1e20",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <span>{t.label}</span>
                      <span
                        style={{
                          fontSize: ".75rem",
                          fontWeight: 600,
                          background: theme === t.value ? "#1B1464" : "#e5e7eb",
                          color: theme === t.value ? "#fff" : "#6b7280",
                          borderRadius: 100,
                          padding: "2px 8px",
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Controls Bar */}
          <div
            style={{
              background: "#fff",
              borderBottom: "1px solid #e5e7eb",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  background: "#f4f6fb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: ".8rem",
                  fontWeight: 600,
                }}
              >
                <Filter size={14} /> Filtres {sidebarOpen ? "−" : "+"}
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: "#f4f6fb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: ".85rem",
                  fontWeight: 500,
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle & Active Filters */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {activeFilters.length > 0 && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {activeFilters.map((f) => (
                    <span
                      key={f}
                      style={{
                        fontSize: ".75rem",
                        background: "#D4849A",
                        color: "#fff",
                        padding: "4px 12px",
                        borderRadius: 100,
                        fontWeight: 600,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      setTheme("");
                      setTypePresentation("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#D4849A",
                      cursor: "pointer",
                      fontSize: ".8rem",
                      fontWeight: 600,
                    }}
                  >
                    <>
                      <X size={14} /> Réinitialiser
                    </>
                  </button>
                </div>
              )}

              {/* View Mode Toggle */}
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  background: "#f4f6fb",
                  borderRadius: 8,
                  padding: 4,
                }}
              >
                <button
                  onClick={() => setViewMode("grid")}
                  style={{
                    background: viewMode === "grid" ? "#1B1464" : "transparent",
                    color: viewMode === "grid" ? "#fff" : "#6b7280",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  style={{
                    background: viewMode === "list" ? "#1B1464" : "transparent",
                    color: viewMode === "list" ? "#fff" : "#6b7280",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
            {loading && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#6b7280",
                }}
              >
                Chargement…
              </div>
            )}

            {error && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#ef4444",
                  background: "#fee2e2",
                  borderRadius: 12,
                }}
              >
                {error}
              </div>
            )}

            {!loading && !error && sorted.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#6b7280",
                }}
              >
                <BookOpen
                  size={40}
                  color="#e5e7eb"
                  style={{ marginBottom: 12, display: "block" }}
                />
                <p style={{ fontWeight: 600, marginBottom: 8 }}>
                  Aucune communication trouvée.
                </p>
                <p style={{ fontSize: ".9rem" }}>
                  Essayez d'autres mots-clés ou réinitialisez les filtres.
                </p>
              </div>
            )}

            {!loading && !error && sorted.length > 0 && viewMode === "grid" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 32 }}
              >
                {Object.entries(grouped).map(([themeKey, items]) => (
                  <div key={themeKey}>
                    {!theme && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 16,
                          paddingBottom: 12,
                          borderBottom: "2px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            width: 4,
                            height: 24,
                            borderRadius: 2,
                            background:
                              "linear-gradient(180deg,#1B1464,#D4849A)",
                          }}
                        />
                        <h2
                          style={{
                            fontSize: ".95rem",
                            fontWeight: 800,
                            margin: 0,
                            color: "#1B1464",
                          }}
                        >
                          {themeLabels[themeKey] || themeKey}
                        </h2>
                        <span
                          style={{
                            fontSize: ".75rem",
                            color: "#6b7280",
                            background: "#f2f3f6",
                            borderRadius: 100,
                            padding: "3px 12px",
                            fontWeight: 700,
                            marginLeft: "auto",
                          }}
                        >
                          {items.length} communication
                          {items.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 16,
                      }}
                    >
                      {items.map((pub) => (
                        <PublicationCard
                          key={pub.id}
                          pub={pub}
                          onView={() => setSelectedPub(pub)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && sorted.length > 0 && viewMode === "list" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {sorted.map((pub) => (
                  <div
                    key={pub.id}
                    style={{
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: 16,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontSize: ".9rem",
                          fontWeight: 700,
                          margin: "0 0 6px",
                          color: "#1d1e20",
                        }}
                      >
                        {pub.titre}
                      </h3>
                      <div
                        style={{
                          fontSize: ".8rem",
                          color: "#6b7280",
                          marginBottom: 8,
                        }}
                      >
                        {pub.auteur}
                      </div>
                      <div
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        <TypeBadge type={pub.type_presentation} />
                        <div
                          style={{
                            fontSize: ".73rem",
                            fontWeight: 700,
                            padding: "4px 10px",
                            borderRadius: 100,
                            background: "#f0f2ff",
                            color: "#1B1464",
                          }}
                        >
                          {pub.theme_display}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <button
                        onClick={() => setSelectedPub(pub)}
                        style={{
                          background: "none",
                          border: "1px solid #1B1464",
                          borderRadius: 8,
                          padding: "6px 12px",
                          cursor: "pointer",
                          color: "#1B1464",
                          fontSize: ".75rem",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Eye size={13} /> Voir
                      </button>
                      {pub.fichier_url && (
                        <a
                          href={pub.fichier_url}
                          download
                          style={{
                            background: "#1B1464",
                            borderRadius: 8,
                            padding: "6px 12px",
                            cursor: "pointer",
                            color: "#fff",
                            fontSize: ".75rem",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            textDecoration: "none",
                          }}
                        >
                          <Download size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <PublicationModal
        pub={selectedPub}
        onClose={() => setSelectedPub(null)}
      />
    </div>
  );
}
