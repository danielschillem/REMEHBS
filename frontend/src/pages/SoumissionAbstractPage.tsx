import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { eventsApi, type AbstractData, type EventDetail } from "../api/events";
import { FileText, ArrowLeft, Upload, CheckCircle, X } from "lucide-react";

export default function SoumissionAbstractPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<AbstractData>({
    event: Number(id),
    auteur_nom: "",
    auteur_email: "",
    co_auteurs: "",
    titre: "",
    type_soumission: "orale",
    resume_texte: "",
    mots_cles: "",
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

  const upd = <K extends keyof AbstractData>(
    field: K,
    value: AbstractData[K],
  ) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.resume_texte.length < 100) {
      setError("Le résumé doit contenir au moins 100 caractères.");
      return;
    }
    setSubmitting(true);
    try {
      await eventsApi.soumettreAbstract({ ...form, event: Number(id) });
      setSuccess(true);
    } catch {
      setError("Erreur lors de la soumission. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

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
          <ArrowLeft size={16} style={{ verticalAlign: "middle" }} /> Retour
        </Link>
      </div>
    );

  if (success) {
    return (
      <div
        style={{
          minHeight: "80vh",
          background: "#f2f3f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "48px 40px",
            maxWidth: 500,
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,.07)",
          }}
        >
          <CheckCircle size={48} color="#00b96b" style={{ marginBottom: 16 }} />
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "1.5rem",
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            Résumé soumis avec succès
          </h2>
          <p style={{ color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>
            Votre résumé sera examiné par le comité scientifique. Vous serez
            informé par e-mail de la décision.
          </p>
          <Link
            to={`/evenements/${id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#1B1464",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} /> Retour à l'événement
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "80vh",
        background: "#f2f3f6",
        padding: "60px 0",
      }}
    >
      <div className="container" style={{ maxWidth: 640 }}>
        <Link
          to={`/evenements/${id}`}
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
          <ArrowLeft size={16} /> Retour à l'événement
        </Link>

        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "36px 32px",
            boxShadow: "0 2px 8px rgba(0,0,0,.07)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "1.375rem",
              fontWeight: 800,
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <FileText size={22} color="#1B1464" /> Soumettre un résumé
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: ".85rem",
              marginBottom: 28,
            }}
          >
            {event.titre}
          </p>

          {error && (
            <div
              style={{
                background: "#FFF0F5",
                color: "#dc3545",
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: ".85rem",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <X size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <Field
                label="Nom de l'auteur *"
                value={form.auteur_nom}
                onChange={(v) => upd("auteur_nom", v)}
                required
              />
              <Field
                label="E-mail de l'auteur *"
                type="email"
                value={form.auteur_email}
                onChange={(v) => upd("auteur_email", v)}
                required
              />
            </div>

            <Field
              label="Titre du résumé *"
              value={form.titre}
              onChange={(v) => upd("titre", v)}
              required
            />

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Type de soumission *</label>
              <select
                value={form.type_soumission}
                onChange={(e) =>
                  upd(
                    "type_soumission",
                    e.target.value as AbstractData["type_soumission"],
                  )
                }
                style={inputStyle}
              >
                <option value="orale">Communication orale</option>
                <option value="poster">Poster</option>
                <option value="atelier">Atelier</option>
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Résumé (min. 100 caractères) *</label>
              <textarea
                value={form.resume_texte}
                onChange={(e) => upd("resume_texte", e.target.value)}
                required
                rows={8}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
              <div
                style={{
                  textAlign: "right",
                  fontSize: ".7rem",
                  color: "#6b7280",
                  marginTop: 2,
                }}
              >
                {form.resume_texte.length} caractères
              </div>
            </div>

            <Field
              label="Co-auteurs (un par ligne)"
              value={form.co_auteurs || ""}
              onChange={(v) => upd("co_auteurs", v)}
              multiline
            />

            <Field
              label="Mots-clés (séparés par des virgules)"
              value={form.mots_cles || ""}
              onChange={(v) => upd("mots_cles", v)}
            />

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                <Upload
                  size={13}
                  style={{ verticalAlign: "middle", marginRight: 4 }}
                />
                Fichier PDF (optionnel)
              </label>
              <input
                type="file"
                accept=".pdf"
                ref={fileRef}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upd("fichier", f);
                }}
                style={{
                  fontSize: ".85rem",
                  color: "#6b7280",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 100,
                border: "none",
                background: "#1B1464",
                color: "#fff",
                fontWeight: 700,
                fontSize: ".9rem",
                cursor: "pointer",
              }}
            >
              {submitting ? "Envoi…" : "Soumettre le résumé"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Composant champ ── */
function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          style={{
            ...inputStyle,
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          style={inputStyle}
        />
      )}
    </div>
  );
}

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
