import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../api/members";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.requestReset(email);
      setSent(true);
    } catch {
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        background: "#f2f3f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "40px 32px",
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 2px 8px rgba(0,0,0,.07)",
        }}
      >
        {sent ? (
          <div style={{ textAlign: "center" }}>
            <CheckCircle
              size={48}
              color="#00b96b"
              style={{ marginBottom: 16 }}
            />
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "1.5rem",
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              E-mail envoyé
            </h2>
            <p style={{ color: "#6b7280", fontSize: ".9rem", lineHeight: 1.6 }}>
              Si un compte existe avec l'adresse <strong>{email}</strong>, vous
              recevrez un lien de réinitialisation.
            </p>
            <Link
              to="/connexion"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 24,
                color: "#1B1464",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={16} /> Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "1.5rem",
                fontWeight: 800,
                marginBottom: 8,
              }}
            >
              Mot de passe oublié
            </h2>
            <p
              style={{
                color: "#6b7280",
                fontSize: ".875rem",
                marginBottom: 24,
              }}
            >
              Entrez votre adresse e-mail pour recevoir un lien de
              réinitialisation.
            </p>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: ".8rem",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  <Mail size={14} /> Adresse e-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1.5px solid #e5e7eb",
                    fontSize: ".9rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: 100,
                  border: "none",
                  background: "linear-gradient(135deg,#1B1464,#D4849A)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: ".9rem",
                  cursor: "pointer",
                }}
              >
                {loading ? "Envoi…" : "Envoyer le lien"}
              </button>
            </form>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Link
                to="/connexion"
                style={{
                  color: "#1B1464",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: ".875rem",
                }}
              >
                <ArrowLeft
                  size={14}
                  style={{ verticalAlign: "middle", marginRight: 4 }}
                />
                Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
