import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventsApi, type EventSummary } from "../api/events";
import { CalendarDays, MapPin, Users, ArrowRight } from "lucide-react";

export default function EvenementsPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi
      .list()
      .then((r) => setEvents(r.data))
      .finally(() => setLoading(false));
  }, []);

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

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
            Chargement…
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
      </div>
    </div>
  );
}
