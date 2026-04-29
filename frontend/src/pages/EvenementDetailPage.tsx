import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  eventsApi,
  type EventDetail,
  type RegistrationData,
} from "../api/events";
import {
  CalendarDays,
  MapPin,
  Users,
  ArrowLeft,
  UserPlus,
  CheckCircle,
  FileText,
  Mic,
  X,
} from "lucide-react";

export default function EvenementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<RegistrationData>({
    event: Number(id),
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    institution: "",
    type_participation: "participant",
    titre_communication: "",
  });

  useEffect(() => {
    if (id) {
      eventsApi
        .detail(Number(id))
        .then((r) => setEvent(r.data))
        .catch(() => setEvent(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await eventsApi.inscrire({ ...form, event: Number(id) });
      setSuccess(true);
      setShowForm(false);
    } catch {
      alert("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const upd = (field: keyof RegistrationData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  if (loading)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
        }}
      >
        Chargement…
      </div>
    );

  if (!event)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <p style={{ color: "#6b7280" }}>Événement introuvable.</p>
        <Link
          to="/evenements"
          style={{
            color: "#1B1464",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} style={{ verticalAlign: "middle" }} /> Retour aux
          événements
        </Link>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "80vh",
        background: "#f2f3f6",
        padding: "60px 0",
      }}
    >
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Retour */}
        <Link
          to="/evenements"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#1B1464",
            fontWeight: 600,
            textDecoration: "none",
            marginBottom: 24,
          }}
        >
          <ArrowLeft size={16} /> Tous les événements
        </Link>

        {/* Header */}
        <div
          style={{
            background: "#1B1464",
            borderRadius: 20,
            padding: "40px 36px",
            color: "#fff",
            marginBottom: 28,
          }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "1.75rem",
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            {event.titre}
          </h1>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              fontSize: ".875rem",
              opacity: 0.9,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <CalendarDays size={15} /> {fmt(event.date_debut)} —{" "}
              {fmt(event.date_fin)}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <MapPin size={15} /> {event.lieu}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Users size={15} /> {event.nb_inscrits} inscrits
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 24,
          }}
        >
          {/* Colonne principale */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Description */}
            <div style={card}>
              <h3 style={cardTitle}>
                <FileText size={18} color="#1B1464" /> Description
              </h3>
              <p
                style={{
                  color: "#374151",
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                }}
              >
                {event.description}
              </p>
            </div>

            {/* Programme */}
            {event.programme && (
              <div style={card}>
                <h3 style={cardTitle}>
                  <CalendarDays size={18} color="#1B1464" /> Programme
                </h3>
                <div
                  style={{
                    color: "#374151",
                    lineHeight: 1.8,
                    whiteSpace: "pre-line",
                    fontSize: ".9rem",
                  }}
                >
                  {event.programme}
                </div>
              </div>
            )}

            {/* Intervenants */}
            {event.intervenants_list.length > 0 && (
              <div style={card}>
                <h3 style={cardTitle}>
                  <Mic size={18} color="#1B1464" /> Intervenants
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {event.intervenants_list.map((name, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "#f2f3f6",
                        borderRadius: 10,
                        padding: "10px 14px",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "#1B1464",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: ".75rem",
                          flexShrink: 0,
                        }}
                      >
                        {name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 500, fontSize: ".9rem" }}>
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Inscription CTA */}
            {success ? (
              <div
                style={{
                  ...card,
                  background: "#e6f9f0",
                  border: "1px solid #00b96b",
                  textAlign: "center",
                }}
              >
                <CheckCircle
                  size={32}
                  color="#00b96b"
                  style={{ marginBottom: 8 }}
                />
                <div style={{ fontWeight: 700, color: "#00b96b" }}>
                  Inscription enregistrée !
                </div>
                <p
                  style={{
                    fontSize: ".8rem",
                    color: "#6b7280",
                    marginTop: 6,
                  }}
                >
                  Vous recevrez une confirmation par e-mail.
                </p>
              </div>
            ) : (
              <div style={card}>
                <h4
                  style={{
                    fontWeight: 700,
                    marginBottom: 12,
                    fontSize: ".95rem",
                  }}
                >
                  <UserPlus
                    size={16}
                    color="#1B1464"
                    style={{ verticalAlign: "middle", marginRight: 6 }}
                  />
                  Inscription
                </h4>
                <p
                  style={{
                    fontSize: ".8rem",
                    color: "#6b7280",
                    marginBottom: 14,
                  }}
                >
                  Inscrivez-vous pour participer à cet événement.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 100,
                    border: "none",
                    background: "#1B1464",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: ".9rem",
                    cursor: "pointer",
                  }}
                >
                  S'inscrire
                </button>
              </div>
            )}

            {/* Lien soumission */}
            <div style={card}>
              <h4
                style={{
                  fontWeight: 700,
                  marginBottom: 8,
                  fontSize: ".95rem",
                }}
              >
                <FileText
                  size={16}
                  color="#1B1464"
                  style={{ verticalAlign: "middle", marginRight: 6 }}
                />
                Communications
              </h4>
              <p
                style={{
                  fontSize: ".8rem",
                  color: "#6b7280",
                  marginBottom: 12,
                }}
              >
                Soumettez votre résumé pour une communication orale, poster ou
                atelier.
              </p>
              <Link
                to={`/evenements/${id}/soumettre`}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px",
                  borderRadius: 100,
                  border: "1.5px solid #1B1464",
                  color: "#1B1464",
                  fontWeight: 600,
                  fontSize: ".85rem",
                  textDecoration: "none",
                }}
              >
                Soumettre un résumé
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal inscription (3.3) */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "32px 28px",
              width: "100%",
              maxWidth: 480,
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <button
              onClick={() => setShowForm(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={20} color="#6b7280" />
            </button>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 700,
                marginBottom: 20,
              }}
            >
              Inscription — {event.titre}
            </h3>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <FormField
                  label="Nom *"
                  value={form.nom}
                  onChange={(v) => upd("nom", v)}
                  required
                />
                <FormField
                  label="Prénom *"
                  value={form.prenom}
                  onChange={(v) => upd("prenom", v)}
                  required
                />
              </div>
              <FormField
                label="E-mail *"
                type="email"
                value={form.email}
                onChange={(v) => upd("email", v)}
                required
              />
              <FormField
                label="Téléphone"
                value={form.telephone || ""}
                onChange={(v) => upd("telephone", v)}
              />
              <FormField
                label="Institution"
                value={form.institution || ""}
                onChange={(v) => upd("institution", v)}
              />
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Type de participation *</label>
                <select
                  value={form.type_participation}
                  onChange={(e) => upd("type_participation", e.target.value)}
                  style={inputStyle}
                >
                  <option value="participant">Participant</option>
                  <option value="communicant">Communicant</option>
                  <option value="atelier">Atelier pratique</option>
                </select>
              </div>
              {form.type_participation === "communicant" && (
                <FormField
                  label="Titre de la communication"
                  value={form.titre_communication || ""}
                  onChange={(v) => upd("titre_communication", v)}
                />
              )}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 100,
                  border: "none",
                  background: "#1B1464",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: ".9rem",
                  cursor: "pointer",
                  marginTop: 10,
                }}
              >
                {submitting ? "Envoi…" : "Valider l'inscription"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sous-composants utilitaires ── */
function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={inputStyle}
      />
    </div>
  );
}

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: "24px 20px",
  boxShadow: "0 1px 4px rgba(0,0,0,.06)",
};
const cardTitle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 14,
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: ".8rem",
  fontWeight: 600,
  marginBottom: 4,
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1.5px solid #e5e7eb",
  fontSize: ".875rem",
  boxSizing: "border-box",
};
