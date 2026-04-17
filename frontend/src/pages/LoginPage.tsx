import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/espace-membre");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f2f3f6",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "48px 40px",
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 4px 24px rgba(27,20,100,.12)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img
            src="/logo-remehbs.png"
            alt="REMEHBS"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              objectFit: "cover",
              margin: "0 auto 16px",
              display: "block",
            }}
          />
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#1d1e20",
              marginBottom: 6,
            }}
          >
            Connexion membre
          </h1>
          <p style={{ color: "#6b7280", fontSize: ".875rem" }}>
            Accédez à votre espace REMEHBS
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fff0f5",
              border: "1px solid #fc5185",
              borderRadius: 10,
              padding: "12px 16px",
              color: "#dc3545",
              fontSize: ".875rem",
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: ".875rem",
                fontWeight: 600,
                color: "#1d1e20",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <Mail size={14} color="#1B1464" /> Adresse e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vous@exemple.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: "1.5px solid #f2f3f6",
                fontSize: ".9375rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                fontSize: ".875rem",
                fontWeight: 600,
                color: "#1d1e20",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <Lock size={14} color="#1B1464" /> Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: "1.5px solid #f2f3f6",
                fontSize: ".9375rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 100,
              border: "none",
              background: "#1B1464",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <LogIn size={18} /> {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: ".875rem",
            color: "#6b7280",
          }}
        >
          Pas encore membre ?{" "}
          <Link to="/adhesion" style={{ color: "#1B1464", fontWeight: 600 }}>
            Adhérer maintenant
          </Link>
        </p>
        <p style={{ textAlign: "center", marginTop: 10, fontSize: ".875rem" }}>
          <Link
            to="/mot-de-passe-oublie"
            style={{
              color: "#1B1464",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Mot de passe oublié ?
          </Link>
        </p>
      </div>
    </div>
  );
}
