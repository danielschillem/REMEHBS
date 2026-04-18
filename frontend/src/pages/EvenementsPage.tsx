import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { eventsApi, type EventSummary } from "../api/events";
import {
  CalendarDays,
  MapPin,
  Users,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function EvenementsPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const pageSize = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchEvents = useCallback(() => {
    setLoading(true);
    setError("");
    const params: Record<string, string> = { page: String(page) };
    if (debouncedSearch) params.search = debouncedSearch;
    eventsApi
      .list(params)
      .then((r) => {
        setEvents(r.data.results);
        setTotalCount(r.data.count);
      })
      .catch(() => setError("Impossible de charger les événements."))
      .finally(() => setLoading(false));
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div
      style={{
        minHeight: "80vh",
        background: "#f2f3f6",
        padding: "60px 0",
      }}
    >
      <div className="container" style={{ maxWidth: 960 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            <CalendarDays
              size={28}
              style={{
                verticalAlign: "middle",
                marginRight: 10,
                color: "#1B1464",
              }}
            />
            Événements REMEHBS
          </h1>
          <p style={{ color: "#6b7280" }}>
            Découvrez nos journées scientifiques, ateliers et formations
          </p>
        </div>

        {/* Barre de recherche */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            borderRadius: 12,
            padding: "10px 16px",
            marginBottom: 28,
            boxShadow: "0 1px 4px rgba(0,0,0,.06)",
          }}
        >
          <Search size={18} color="#6b7280" />
          <input
            type="text"
            placeholder="Rechercher un événement…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: ".9rem",
              background: "transparent",
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
            Chargement…
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: 40, color: "#ef4444" }}>
            {error}
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
            Aucun événement à venir pour le moment.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {events.map((ev) => {
              const debut = new Date(ev.date_debut);
              const isPast = debut.getTime() < Date.now();
              return (
                <Link
                  key={ev.id}
                  to={`/evenements/${ev.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: "24px 28px",
                      boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                      display: "flex",
                      gap: 20,
                      alignItems: "center",
                      opacity: isPast ? 0.7 : 1,
                      transition: "box-shadow .2s",
                    }}
                  >
                    {/* Date badge */}
                    <div
                      style={{
                        minWidth: 70,
                        textAlign: "center",
                        background: "linear-gradient(135deg,#1B1464,#D4849A)",
                        borderRadius: 14,
                        padding: "14px 10px",
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 800,
                          lineHeight: 1,
                        }}
                      >
                        {debut.getDate()}
                      </div>
                      <div
                        style={{
                          fontSize: ".7rem",
                          textTransform: "uppercase",
                          letterSpacing: ".05em",
                          marginTop: 4,
                        }}
                      >
                        {debut.toLocaleDateString("fr-FR", {
                          month: "short",
                        })}
                      </div>
                      <div style={{ fontSize: ".7rem" }}>
                        {debut.getFullYear()}
                      </div>
                    </div>

                    {/* Infos */}
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          marginBottom: 6,
                        }}
                      >
                        {ev.titre}
                      </h3>
                      <p
                        style={{
                          color: "#6b7280",
                          fontSize: ".85rem",
                          marginBottom: 10,
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {ev.description}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          fontSize: ".8rem",
                          color: "#6b7280",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <MapPin size={13} /> {ev.lieu}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <CalendarDays size={13} /> {fmt(ev.date_debut)} —{" "}
                          {fmt(ev.date_fin)}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Users size={13} /> {ev.nb_inscrits} inscrits
                        </span>
                      </div>
                    </div>

                    <ArrowRight
                      size={20}
                      color="#1B1464"
                      style={{ flexShrink: 0 }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (() => {
          const totalPages = Math.ceil(totalCount / pageSize);
          return totalPages > 1 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 32,
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={paginationBtn}
              >
                <ChevronLeft size={16} /> Précédent
              </button>
              <span style={{ fontSize: ".875rem", color: "#6b7280" }}>
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                style={paginationBtn}
              >
                Suivant <ChevronRight size={16} />
              </button>
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}

const paginationBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "8px 16px",
  borderRadius: 100,
  border: "1.5px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: ".8rem",
  color: "#1B1464",
};
