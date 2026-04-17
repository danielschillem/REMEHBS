import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authApi } from "../api/members";
import { Lock, CheckCircle, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== password2) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      await authApi.confirmReset(uid, token, password);
      setDone(true);
    } catch {
      setError("Lien invalide ou expiré. Veuillez refaire une demande.");
    } finally {
      setLoading(false);
    }
  };

  if (!uid || !token) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f2f3f6",
        }}
      >
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          <p>Lien invalide.</p>
          <Link
            to="/mot-de-passe-oublie"
            style={{
              color: "#1B1464",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Demander un nouveau lien
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
        {done ? (
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
              Mot de passe réinitialisé
            </h2>
            <p style={{ color: "#6b7280", fontSize: ".9rem" }}>
              Vous pouvez maintenant vous connecter avec votre nouveau mot de
              passe.
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
              <ArrowLeft size={16} /> Se connecter
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
              Nouveau mot de passe
            </h2>
            <p
              style={{
                color: "#6b7280",
                fontSize: ".875rem",
                marginBottom: 24,
              }}
            >
              Choisissez un nouveau mot de passe sécurisé.
            </p>
            {error && (
              <div
                style={{
                  background: "#fff0f5",
                  color: "#fc5185",
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontSize: ".85rem",
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
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
                  <Lock size={14} /> Nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  <Lock size={14} /> Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
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
                {loading
                  ? "Réinitialisation…"
                  : "Réinitialiser le mot de passe"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
