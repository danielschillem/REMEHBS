import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adhesionApi, paymentApi, type Cotisation } from "../api/members";
import {
  ShieldCheck,
  CreditCard,
  Clock,
  Download,
  LogOut,
  User,
  CheckCircle,
  Pencil,
  X,
  Camera,
  FileText,
} from "lucide-react";

export default function EspaceMembrePage() {
  const { user, logout, isAuthenticated, loading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [paying, setPaying] = useState(false);
  const paymentSuccess = searchParams.get("success") === "1";
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    telephone: "",
    profession: "",
    specialite: "",
    structure: "",
    ville: "",
    province: "",
  });
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/connexion");
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      adhesionApi
        .mesCotisations()
        .then((r) => setCotisations(r.data))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handlePayer = async (annee: number) => {
    setPaying(true);
    try {
      const { data } = await paymentApi.initierPaiement(annee);
      window.location.href = data.payment_url;
    } catch {
      alert("Erreur lors de l'initiation du paiement.");
    } finally {
      setPaying(false);
    }
  };

  const handleEdit = () => {
    setEditForm({
      telephone: user?.telephone || "",
      profession: user?.profession || "",
      specialite: user?.specialite || "",
      structure: user?.structure || "",
      ville: user?.ville || "",
      province: user?.province || "",
    });
    setEditing(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await adhesionApi.updateProfil(editForm);
      await refreshUser();
      setEditing(false);
    } catch {
      alert("Erreur lors de la mise à jour du profil.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("La photo ne doit pas dépasser 5 Mo.");
      return;
    }
    setUploadingPhoto(true);
    try {
      await adhesionApi.uploadPhoto(file);
      await refreshUser();
    } catch {
      alert("Erreur lors de l'envoi de la photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAttestation = async () => {
    setDownloading(true);
    try {
      const { data } = await adhesionApi.attestation();
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `attestation_${user?.numero_membre}_${new Date().getFullYear()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert(
        "Impossible de télécharger l'attestation. Vérifiez que votre cotisation est à jour.",
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleRecuPDF = async (cotisationId: number) => {
    try {
      const { data } = await paymentApi.recuPaiement(cotisationId);
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `recu_cotisation_${cotisationId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Impossible de télécharger le reçu.");
    }
  };

  if (loading)
    return (
      <div style={{ padding: 80, textAlign: "center", color: "#6b7280" }}>
        Chargement…
      </div>
    );
  if (!user) return null;

  const statutColor: Record<string, string> = {
    paye: "#00b96b",
    en_attente: "#f59e0b",
    impaye: "#fc5185",
    annule: "#6b7280",
  };

  return (
    <div
      style={{ minHeight: "80vh", background: "#f2f3f6", padding: "60px 0" }}
    >
      <div className="container" style={{ maxWidth: 960 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "1.875rem",
                fontWeight: 800,
                marginBottom: 4,
              }}
            >
              Bonjour, {user.prenom} {user.nom}
            </h1>
            <p style={{ color: "#6b7280" }}>
              Espace membre REMEHBS · {user.numero_membre}
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 100,
              border: "1.5px solid #f2f3f6",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              color: "#6b7280",
            }}
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>

        <div
          className="grid-membre"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}
        >
          {/* Bandeau succès paiement */}
          {paymentSuccess && (
            <div
              style={{
                gridColumn: "1/-1",
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#e6f9f0",
                border: "1px solid #00b96b",
                borderRadius: 14,
                padding: "16px 20px",
              }}
            >
              <CheckCircle size={22} color="#00b96b" />
              <div>
                <div style={{ fontWeight: 700, color: "#00b96b" }}>
                  Paiement réussi !
                </div>
                <div style={{ fontSize: ".8rem", color: "#6b7280" }}>
                  Votre cotisation a été enregistrée. Le statut sera mis à jour
                  sous peu.
                </div>
              </div>
              <button
                onClick={() => setSearchParams({})}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: "1.25rem",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* Carte profil */}
          <div style={card}>
            <h3 style={cardTitle}>
              <User size={20} color="#1B1464" /> Mon profil
              <button
                onClick={handleEdit}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#1B1464",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: ".8rem",
                  fontWeight: 600,
                }}
              >
                <Pencil size={14} /> Modifier
              </button>
            </h3>
            <div
              style={{
                background: "#f2f3f6",
                borderRadius: 12,
                padding: "16px",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => photoInputRef.current?.click()}
                title="Changer ma photo"
              >
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt="Photo de profil"
                    loading="lazy"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #1B1464",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#1B1464,#D4849A)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <User size={24} color="#fff" />
                  </div>
                )}
                <div
                  style={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    background: "#1B1464",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Camera size={11} color="#fff" />
                </div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                />
              </div>
              {uploadingPhoto && (
                <span style={{ fontSize: ".75rem", color: "#6b7280" }}>
                  Envoi…
                </span>
              )}
              <div>
                <div style={{ fontWeight: 700 }}>{user.nom_complet}</div>
                <div style={{ fontSize: ".8125rem", color: "#6b7280" }}>
                  {user.categorie_display} · {user.profession}
                </div>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  background: user.est_a_jour ? "#e6f9f0" : "#fff0f5",
                  color: user.est_a_jour ? "#00b96b" : "#fc5185",
                  padding: "5px 12px",
                  borderRadius: 100,
                  fontSize: ".8rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <ShieldCheck size={13} />{" "}
                {user.est_a_jour ? "À jour" : "Impayé"}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column" as const,
                gap: 10,
              }}
            >
              {[
                ["E-mail", user.email],
                ["Téléphone", user.telephone || "—"],
                ["Structure", user.structure || "—"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: ".875rem",
                  }}
                >
                  <span style={{ color: "#6b7280" }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cotisations */}
          <div style={card}>
            <h3 style={cardTitle}>
              <CreditCard size={20} color="#1B1464" /> Mes cotisations
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column" as const,
                gap: 10,
                marginBottom: 20,
              }}
            >
              {cotisations.length === 0 && (
                <p style={{ color: "#6b7280", fontSize: ".875rem" }}>
                  Aucune cotisation enregistrée.
                </p>
              )}
              {cotisations.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: "#f2f3f6",
                    borderRadius: 10,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: c.statut === "paye" ? 8 : 0,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <Clock size={16} color="#6b7280" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: ".875rem" }}>
                          Cotisation {c.annee}
                        </div>
                        <div style={{ fontSize: ".75rem", color: "#6b7280" }}>
                          {c.mode_paiement_display || "Non défini"}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span style={{ fontWeight: 700 }}>
                        {c.montant.toLocaleString()} FCFA
                      </span>
                      <span
                        style={{
                          background:
                            (statutColor[c.statut] || "#6b7280") + "22",
                          color: statutColor[c.statut] || "#6b7280",
                          padding: "3px 10px",
                          borderRadius: 100,
                          fontSize: ".75rem",
                          fontWeight: 700,
                        }}
                      >
                        {c.statut_display}
                      </span>
                      {c.statut !== "paye" && (
                        <button
                          onClick={() => handlePayer(c.annee)}
                          disabled={paying}
                          style={{
                            padding: "5px 14px",
                            borderRadius: 100,
                            border: "none",
                            background: "#1B1464",
                            color: "#fff",
                            fontSize: ".8rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Payer
                        </button>
                      )}
                    </div>
                  </div>
                  {c.statut === "paye" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: ".75rem",
                        color: "#6b7280",
                        borderTop: "1px solid #e5e7eb",
                        paddingTop: 8,
                      }}
                    >
                      <span>
                        Payé le{" "}
                        {c.paid_at
                          ? new Date(c.paid_at).toLocaleDateString("fr-FR")
                          : "—"}
                        {c.reference && ` · Réf: ${c.reference}`}
                      </span>
                      <button
                        onClick={() => handleRecuPDF(c.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#1B1464",
                          fontWeight: 600,
                          fontSize: ".75rem",
                        }}
                      >
                        <FileText size={13} /> Reçu PDF
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={handleAttestation}
              disabled={downloading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 100,
                border: "1.5px solid #f2f3f6",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontWeight: 600,
                cursor: "pointer",
                color: "#1B1464",
              }}
            >
              <Download size={16} />{" "}
              {downloading ? "Téléchargement…" : "Télécharger attestation 2025"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal édition profil */}
      {editing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "32px 28px",
              width: "100%",
              maxWidth: 420,
              position: "relative",
            }}
          >
            <button
              onClick={() => setEditing(false)}
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
              Modifier mon profil
            </h3>
            {(
              [
                ["telephone", "Téléphone"],
                ["profession", "Profession"],
                ["specialite", "Spécialité"],
                ["structure", "Structure / Établissement"],
                ["ville", "Ville"],
                ["province", "Province"],
              ] as const
            ).map(([field, label]) => (
              <div key={field} style={{ marginBottom: 14 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: ".8rem",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  {label}
                </label>
                <input
                  value={editForm[field]}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, [field]: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1.5px solid #e5e7eb",
                    fontSize: ".875rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 100,
                border: "none",
                background: "linear-gradient(135deg,#1B1464,#D4849A)",
                color: "#fff",
                fontWeight: 700,
                fontSize: ".9rem",
                cursor: "pointer",
                marginTop: 10,
              }}
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  padding: "32px 28px",
  boxShadow: "0 2px 8px rgba(0,0,0,.07)",
};
const cardTitle: React.CSSProperties = {
  fontSize: "1.125rem",
  fontWeight: 700,
  color: "#1d1e20",
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 20,
};
