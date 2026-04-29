import { useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  Download,
  FileText,
  Presentation,
  GraduationCap,
  Mic,
  X,
  ChevronDown,
  ChevronUp,
  Building2,
  Users,
  ExternalLink,
  Layers,
  ArrowDown,
} from "lucide-react";
import {
  programme,
  plenarySessions,
  allOralCommunications,
  programmeStats,
  formatFileSize,
  type PlenaryItem,
  type OralCommunication,
  type Room,
} from "../data/programmeJsp2025";

const INK = "#1B1464";
const INK_DARK = "#0B1140";
const TEAL = "#0E7C7B";
const CORAL = "#D4694F";
const SAND = "#FAF7F2";
const LINE = "#ECE6DA";

type TabId = "all" | "plenaries" | "oral";

const KIND_META: Record<
  PlenaryItem["kind"],
  { label: string; color: string; icon: React.ReactNode }
> = {
  conference: {
    label: "Conférence",
    color: INK,
    icon: <GraduationCap size={13} />,
  },
  panel: {
    label: "Panel",
    color: CORAL,
    icon: <Users size={13} />,
  },
  symposium: {
    label: "Symposium",
    color: TEAL,
    icon: <Mic size={13} />,
  },
};

function matchesQuery(haystack: string, needle: string): boolean {
  if (!needle) return true;
  return haystack.toLocaleLowerCase("fr").includes(needle.toLocaleLowerCase("fr"));
}

function StatCard({
  value,
  label,
  icon,
  color,
}: {
  value: number | string;
  label: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(255,255,255,.08)",
        border: "1px solid rgba(255,255,255,.15)",
        borderRadius: 12,
        padding: "14px 18px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'IBM Plex Serif',serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            lineHeight: 1,
            color: "#fff",
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: ".72rem",
            letterSpacing: ".04em",
            color: "rgba(255,255,255,.7)",
            marginTop: 4,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function PdfActions({
  file,
  fileName,
  sizeBytes,
}: {
  file: string;
  fileName: string;
  sizeBytes: number;
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <a
        href={file}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: ".78rem",
          fontWeight: 600,
          color: TEAL,
          background: "#E6F2F1",
          border: "1px solid rgba(14,124,123,.22)",
          padding: "6px 12px",
          borderRadius: 100,
          textDecoration: "none",
        }}
      >
        <ExternalLink size={13} /> Lire en ligne
      </a>
      <a
        href={file}
        download={fileName}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: ".78rem",
          fontWeight: 600,
          color: INK,
          background: "#EEEDF7",
          border: "1px solid rgba(27,20,100,.18)",
          padding: "6px 12px",
          borderRadius: 100,
          textDecoration: "none",
        }}
      >
        <Download size={13} /> PDF · {formatFileSize(sizeBytes)}
      </a>
    </div>
  );
}

function PlenaryCard({ item }: { item: PlenaryItem }) {
  const meta = KIND_META[item.kind];
  return (
    <article
      style={{
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 14,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 1px 2px rgba(11,17,64,.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: ".68rem",
            fontWeight: 700,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: meta.color,
            background: meta.color + "15",
            padding: "4px 10px",
            borderRadius: 100,
          }}
        >
          {meta.icon} {item.label}
        </span>
        <span style={{ fontSize: ".75rem", color: "#8A8DA0" }}>
          {formatFileSize(item.sizeBytes)}
        </span>
      </div>
      <h3
        style={{
          fontFamily: "'IBM Plex Serif',serif",
          fontSize: "1rem",
          fontWeight: 600,
          lineHeight: 1.4,
          color: "#1A1B25",
          margin: 0,
        }}
      >
        {item.displayTitle}
      </h3>
      <PdfActions file={item.file} fileName={item.fileName} sizeBytes={item.sizeBytes} />
    </article>
  );
}

function CommunicationRow({ comm }: { comm: OralCommunication }) {
  return (
    <article
      style={{
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 12,
        padding: "16px 20px",
        display: "grid",
        gridTemplateColumns: "minmax(70px,80px) minmax(0,1fr) auto",
        gap: 18,
        alignItems: "start",
      }}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Mono',monospace",
          fontSize: ".82rem",
          fontWeight: 700,
          color: INK,
          background: "#EEEDF7",
          borderRadius: 8,
          padding: "8px 6px",
          textAlign: "center",
          letterSpacing: ".02em",
          alignSelf: "center",
        }}
      >
        {comm.code || "—"}
      </div>
      <div style={{ minWidth: 0 }}>
        <h4
          style={{
            fontFamily: "'IBM Plex Serif',serif",
            fontSize: ".95rem",
            fontWeight: 600,
            lineHeight: 1.45,
            color: "#1A1B25",
            margin: "0 0 8px",
            wordBreak: "break-word",
          }}
        >
          {comm.displayTitle}
        </h4>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: ".72rem", color: "#5C5F73", marginBottom: 10 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Building2 size={11} /> {comm.roomName}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Layers size={11} /> Session {comm.sessionNumber}
          </span>
        </div>
        <PdfActions file={comm.file} fileName={comm.fileName} sizeBytes={comm.sizeBytes} />
      </div>
      <div style={{ alignSelf: "center" }}>
        <a
          href={comm.file}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ouvrir ${comm.code} en PDF`}
          title="Ouvrir le PDF"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: SAND,
            border: `1px solid ${LINE}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: INK,
            textDecoration: "none",
          }}
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </article>
  );
}

function SessionGroup({
  room,
  searchQuery,
  initiallyOpen,
}: {
  room: Room;
  searchQuery: string;
  initiallyOpen: boolean;
}) {
  const [openSessions, setOpenSessions] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(room.sessions.map((s) => [s.slug, initiallyOpen])),
  );
  const filteredSessions = room.sessions
    .map((s) => ({
      ...s,
      communications: s.communications.filter((c) =>
        matchesQuery(`${c.code} ${c.displayTitle}`, searchQuery),
      ),
    }))
    .filter((s) => s.communications.length > 0);

  if (filteredSessions.length === 0) return null;

  const totalComm = filteredSessions.reduce(
    (acc, s) => acc + s.communications.length,
    0,
  );

  return (
    <section
      style={{
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      <header
        style={{
          background: INK_DARK,
          color: "#fff",
          padding: "16px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: TEAL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Building2 size={18} />
          </div>
          <div>
            <h2
              style={{
                fontFamily: "'IBM Plex Serif',serif",
                fontSize: "1.15rem",
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {room.name}
            </h2>
            <span
              style={{
                fontSize: ".74rem",
                color: "rgba(255,255,255,.7)",
                letterSpacing: ".02em",
              }}
            >
              {filteredSessions.length} session
              {filteredSessions.length > 1 ? "s" : ""} · {totalComm} communication
              {totalComm > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </header>

      <div style={{ padding: "8px 12px 12px" }}>
        {filteredSessions.map((session) => {
          const open = openSessions[session.slug];
          return (
            <div
              key={session.slug}
              style={{
                borderBottom: `1px solid ${LINE}`,
                paddingBottom: open ? 16 : 0,
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenSessions((m) => ({ ...m, [session.slug]: !m[session.slug] }))
                }
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "14px 12px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: INK_DARK,
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Serif',serif",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {session.name}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: ".74rem",
                    color: "#5C5F73",
                  }}
                >
                  <span>
                    {session.communications.length} comm.
                  </span>
                  {open ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </span>
              </button>
              {open && (
                <div
                  style={{
                    display: "grid",
                    gap: 10,
                    padding: "0 4px",
                  }}
                >
                  {session.communications.map((c) => (
                    <CommunicationRow key={c.file} comm={c} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function EspaceScientifiquePage() {
  const stats = useMemo(programmeStats, []);
  const [tab, setTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<"" | PlenaryItem["kind"]>("");
  const [roomFilter, setRoomFilter] = useState<string>("");

  const filteredPlenaries = useMemo(
    () =>
      plenarySessions.filter(
        (p) =>
          (!kindFilter || p.kind === kindFilter) &&
          matchesQuery(`${p.label} ${p.displayTitle} ${p.rawTitle}`, search),
      ),
    [kindFilter, search],
  );

  const filteredRooms = useMemo(() => {
    return programme.rooms
      .filter((r) => !roomFilter || r.slug === roomFilter)
      .filter((r) =>
        r.sessions.some((s) =>
          s.communications.some((c) =>
            matchesQuery(`${c.code} ${c.displayTitle}`, search),
          ),
        ),
      );
  }, [roomFilter, search]);

  const totalOralFiltered = useMemo(
    () =>
      allOralCommunications.filter(
        (c) =>
          (!roomFilter || c.roomSlug === roomFilter) &&
          matchesQuery(`${c.code} ${c.displayTitle}`, search),
      ).length,
    [roomFilter, search],
  );

  const showPlenaries = tab === "all" || tab === "plenaries";
  const showOral = tab === "all" || tab === "oral";

  return (
    <div style={{ background: SAND, minHeight: "100vh", paddingBottom: 60 }}>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div style={{ background: INK, color: "#fff", padding: "60px 0 48px" }}>
        <div className="container">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,.12)",
              border: "1px solid rgba(255,255,255,.2)",
              borderRadius: 100,
              padding: "6px 14px",
              fontSize: ".74rem",
              fontWeight: 700,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            <BookOpen size={13} /> Espace scientifique
          </span>
          <h1
            style={{
              fontFamily: "'IBM Plex Serif',serif",
              fontSize: "clamp(1.85rem,4.2vw,2.85rem)",
              fontWeight: 700,
              margin: "0 0 12px",
              letterSpacing: "-0.005em",
            }}
          >
            {programme.edition}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,.78)",
              maxWidth: 720,
              margin: "0 0 28px",
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
          >
            Programme officiel des {programme.abbreviation} ·{" "}
            {programme.city}, {programme.country}. {programme.organizer}.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: 14,
              maxWidth: 920,
            }}
          >
            <StatCard
              value={stats.plenaryTotal}
              label="Conférences, panels & symposiums"
              icon={<GraduationCap size={18} />}
              color={CORAL}
            />
            <StatCard
              value={stats.oralCount}
              label="Communications orales"
              icon={<Presentation size={18} />}
              color={TEAL}
            />
            <StatCard
              value={stats.sessionCount}
              label={`Sessions · ${stats.roomCount} salles`}
              icon={<Layers size={18} />}
              color="#4F4DA6"
            />
            <StatCard
              value={programme.year}
              label="Édition"
              icon={<FileText size={18} />}
              color="#0E8E5C"
            />
          </div>

          <a
            href="#programme"
            style={{
              marginTop: 26,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 100,
              background: "#fff",
              color: INK,
              fontSize: ".88rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <ArrowDown size={15} /> Parcourir le programme
          </a>
        </div>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div
        id="programme"
        style={{
          background: "#fff",
          borderBottom: `1px solid ${LINE}`,
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 1px 2px rgba(11,17,64,.04)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            gap: 16,
            padding: "16px 0",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Tabs */}
          <div
            role="tablist"
            style={{
              display: "inline-flex",
              background: SAND,
              borderRadius: 100,
              padding: 4,
              border: `1px solid ${LINE}`,
            }}
          >
            {(
              [
                { id: "all", label: "Tout" },
                { id: "plenaries", label: "Conférences & panels" },
                { id: "oral", label: "Communications orales" },
              ] as { id: TabId; label: string }[]
            ).map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active ? "true" : "false"}
                  onClick={() => setTab(t.id)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 100,
                    fontSize: ".84rem",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background: active ? INK : "transparent",
                    color: active ? "#fff" : "#3D3F52",
                    transition: "background .15s",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div
            style={{
              flex: 1,
              minWidth: 240,
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: SAND,
              border: `1px solid ${LINE}`,
              borderRadius: 100,
              padding: "8px 14px",
            }}
          >
            <Search size={15} color="#8A8DA0" />
            <input
              type="search"
              placeholder="Rechercher un titre, un code (CO12)…"
              aria-label="Rechercher dans le programme"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: ".88rem",
                color: "#1A1B25",
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
                title="Effacer"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8A8DA0",
                  padding: 0,
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filters per tab */}
          {showPlenaries && (
            <select
              aria-label="Filtrer par type"
              title="Filtrer par type"
              value={kindFilter}
              onChange={(e) =>
                setKindFilter(e.target.value as "" | PlenaryItem["kind"])
              }
              style={{
                padding: "8px 12px",
                border: `1px solid ${LINE}`,
                borderRadius: 100,
                background: "#fff",
                fontSize: ".84rem",
                color: "#1A1B25",
                cursor: "pointer",
              }}
            >
              <option value="">Tous types</option>
              <option value="conference">Conférences</option>
              <option value="symposium">Symposiums</option>
              <option value="panel">Panels</option>
            </select>
          )}

          {showOral && (
            <select
              aria-label="Filtrer par salle"
              title="Filtrer par salle"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                border: `1px solid ${LINE}`,
                borderRadius: 100,
                background: "#fff",
                fontSize: ".84rem",
                color: "#1A1B25",
                cursor: "pointer",
              }}
            >
              <option value="">Toutes les salles</option>
              {programme.rooms.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="container" style={{ paddingTop: 32 }}>
        {showPlenaries && (
          <section style={{ marginBottom: 48 }}>
            <header
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                marginBottom: 18,
                flexWrap: "wrap",
              }}
            >
              <h2
                style={{
                  fontFamily: "'IBM Plex Serif',serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: INK_DARK,
                  margin: 0,
                }}
              >
                Conférences plénières, symposiums & panels
              </h2>
              <span style={{ fontSize: ".82rem", color: "#5C5F73" }}>
                {filteredPlenaries.length} sur {plenarySessions.length}
              </span>
            </header>
            {filteredPlenaries.length === 0 ? (
              <EmptyState message="Aucun résultat pour cette recherche." />
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: 16,
                  gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
                }}
              >
                {filteredPlenaries.map((p) => (
                  <PlenaryCard key={p.file} item={p} />
                ))}
              </div>
            )}
          </section>
        )}

        {showOral && (
          <section>
            <header
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                marginBottom: 18,
                flexWrap: "wrap",
              }}
            >
              <h2
                style={{
                  fontFamily: "'IBM Plex Serif',serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: INK_DARK,
                  margin: 0,
                }}
              >
                Communications orales
              </h2>
              <span style={{ fontSize: ".82rem", color: "#5C5F73" }}>
                {totalOralFiltered} sur {stats.oralCount}
              </span>
            </header>

            {filteredRooms.length === 0 ? (
              <EmptyState message="Aucune communication ne correspond à votre recherche." />
            ) : (
              filteredRooms.map((r) => (
                <SessionGroup
                  key={r.slug}
                  room={r}
                  searchQuery={search}
                  initiallyOpen={Boolean(search)}
                />
              ))
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px dashed ${LINE}`,
        borderRadius: 16,
        padding: "40px 24px",
        textAlign: "center",
        color: "#5C5F73",
      }}
    >
      <BookOpen size={28} color="#B9B8D8" style={{ marginBottom: 10 }} />
      <p style={{ margin: 0, fontSize: ".92rem" }}>{message}</p>
    </div>
  );
}
