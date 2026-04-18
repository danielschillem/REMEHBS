import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { adhesionApi, type AdhesionData } from "../api/members";
import {
  UserPlus,
  CheckCircle,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  CreditCard,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Eye,
} from "lucide-react";

const PROFESSIONS = [
  "Médecin gynécologue-obstétricien",
  "Médecin pédiatre / néonatologue",
  "Sage-femme / Maïeuticien",
  "Infirmier(e) diplômé(e)",
  "Anesthésiste-réanimateur",
  "Étudiant en médecine",
  "Chercheur en santé publique",
  "Institution / Structure de santé",
  "Autre",
];

const STEP_LABELS = ["Informations", "Catégorie & Compte", "Récapitulatif"];

export default function AdhesionPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [numeroMembre, setNumeroMembre] = useState("");

  const [form, setForm] = useState<AdhesionData & { password2: string }>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    profession: "",
    specialite: "",
    structure: "",
    ville: "",
    province: "",
    categorie: "professionnel",
    message: "",
    password: "",
    password2: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canGoStep2 = form.nom && form.prenom && form.email && form.profession;
  const canGoStep3 =
    form.categorie && (!form.password || form.password === form.password2);

  const next = () => {
    setError("");
    if (step === 1 && !canGoStep2) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (step === 2) {
      if (form.password && form.password !== form.password2) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }
      if (!canGoStep3) return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };
  const prev = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await adhesionApi.soumettre(form);
      setNumeroMembre(data.numero_membre);
      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data;
      setError(
        typeof msg === "object"
          ? Object.values(msg).flat().join(" ")
          : "Une erreur est survenue.",
      );
    } finally {
      setLoading(false);
    }
  };

  const catLabel: Record<string, string> = {
    etudiant: "Étudiant / Stagiaire",
    professionnel: "Professionnel de Santé",
    institution: "Institution / Structure",
  };
  const catPrice: Record<string, string> = {
    etudiant: "2 000 FCFA",
    professionnel: "5 000 FCFA",
    institution: "25 000 FCFA",
  };

  if (success)
    return (
      <div
        style={{
          minHeight: "70vh",
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
            maxWidth: 480,
            textAlign: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,.08)",
          }}
        >
          <CheckCircle size={64} color="#00b96b" style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 10 }}>
            Demande enregistrée !
          </h2>
          <p style={{ color: "#6b7280", marginBottom: 8 }}>
            Votre dossier a bien été soumis. Vous recevrez une confirmation par
            e-mail sous 48h.
          </p>
          <p
            style={{
              fontWeight: 700,
              color: "#1B1464",
              fontSize: "1.125rem",
              marginBottom: 28,
            }}
          >
            N° provisoire : {numeroMembre}
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 32px",
              borderRadius: 100,
              background: "#1B1464",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );

  return (
    <div
      style={{ minHeight: "80vh", background: "#f2f3f6", padding: "60px 0" }}
    >
      <div className="container" style={{ maxWidth: 820 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Dossier d'adhésion
          </h1>
          <p style={{ color: "#6b7280" }}>
            Remplissez le formulaire ci-dessous. Traitement sous 48h ouvrables.
          </p>
        </div>

        {/* Steps indicator */}
        <div
          style={{
            display: "flex",
            borderRadius: 14,
            overflow: "hidden",
            border: "1.5px solid #f2f3f6",
            marginBottom: 40,
          }}
        >
          {STEP_LABELS.map((label, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "14px 8px",
                textAlign: "center",
                background:
                  step === i + 1
                    ? "#1B1464"
                    : step > i + 1
                      ? "#FFF0F5"
                      : "#f2f3f6",
                color:
                  step === i + 1
                    ? "#fff"
                    : step > i + 1
                      ? "#1B1464"
                      : "#6b7280",
                fontSize: ".8rem",
                fontWeight: 600,
                transition: "background .2s",
              }}
            >
              {i + 1}. {label}
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "40px",
            boxShadow: "0 2px 8px rgba(0,0,0,.07)",
          }}
        >
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
            {/* ═══ STEP 1 : Informations personnelles ═══ */}
            {step === 1 && (
              <div
                className="grid-form"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 18,
                }}
              >
                <div>
                  <label style={lbl}>
                    <User size={13} color="#1B1464" /> Nom *
                  </label>
                  <input
                    style={inp}
                    type="text"
                    placeholder="Nom de famille"
                    required
                    value={form.nom}
                    onChange={(e) => set("nom", e.target.value)}
                  />
                </div>
                <div>
                  <label style={lbl}>
                    <User size={13} color="#1B1464" /> Prénom(s) *
                  </label>
                  <input
                    style={inp}
                    type="text"
                    placeholder="Prénom"
                    required
                    value={form.prenom}
                    onChange={(e) => set("prenom", e.target.value)}
                  />
                </div>
                <div>
                  <label style={lbl}>
                    <Mail size={13} color="#1B1464" /> E-mail *
                  </label>
                  <input
                    style={inp}
                    type="email"
                    placeholder="vous@exemple.com"
                    required
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>
                <div>
                  <label style={lbl}>
                    <Phone size={13} color="#1B1464" /> Téléphone
                  </label>
                  <input
                    style={inp}
                    type="tel"
                    placeholder="+226 XX XX XX XX"
                    value={form.telephone}
                    onChange={(e) => set("telephone", e.target.value)}
                  />
                </div>
                <div>
                  <label style={lbl}>
                    <Briefcase size={13} color="#1B1464" /> Profession *
                  </label>
                  <select
                    style={inp}
                    required
                    value={form.profession}
                    onChange={(e) => set("profession", e.target.value)}
                  >
                    <option value="">Sélectionnez</option>
                    {PROFESSIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={lbl}>
                    <Briefcase size={13} color="#1B1464" /> Structure
                  </label>
                  <input
                    style={inp}
                    type="text"
                    placeholder="CHU, Clinique, ONG…"
                    value={form.structure}
                    onChange={(e) => set("structure", e.target.value)}
                  />
                </div>
                <div>
                  <label style={lbl}>
                    <MapPin size={13} color="#1B1464" /> Ville
                  </label>
                  <input
                    style={inp}
                    type="text"
                    placeholder="Bobo-Dioulasso"
                    value={form.ville}
                    onChange={(e) => set("ville", e.target.value)}
                  />
                </div>
                <div>
                  <label style={lbl}>
                    <MapPin size={13} color="#1B1464" /> Province
                  </label>
                  <input
                    style={inp}
                    type="text"
                    placeholder="Houet"
                    value={form.province}
                    onChange={(e) => set("province", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ═══ STEP 2 : Catégorie + Mot de passe ═══ */}
            {step === 2 && (
              <div
                className="grid-form"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 18,
                }}
              >
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>
                    <CreditCard size={13} color="#1B1464" /> Catégorie
                    d'adhésion
                  </label>
                  <div
                    className="grid-categories"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: 14,
                      marginTop: 8,
                    }}
                  >
                    {(
                      [
                        ["etudiant", "Étudiant / Stagiaire", "2 000 FCFA"],
                        [
                          "professionnel",
                          "Professionnel de Santé",
                          "5 000 FCFA",
                        ],
                        [
                          "institution",
                          "Institution / Structure",
                          "25 000 FCFA",
                        ],
                      ] as const
                    ).map(([val, label, price]) => (
                      <div
                        key={val}
                        onClick={() => set("categorie", val)}
                        style={{
                          border: `2px solid ${form.categorie === val ? "#1B1464" : "#f2f3f6"}`,
                          background:
                            form.categorie === val ? "#FFF0F5" : "#fff",
                          borderRadius: 12,
                          padding: "16px",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: ".9rem",
                            marginBottom: 4,
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            color: "#1B1464",
                            fontWeight: 800,
                            fontSize: "1.125rem",
                          }}
                        >
                          {price}
                        </div>
                        <div style={{ color: "#6b7280", fontSize: ".75rem" }}>
                          par an
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={lbl}>Mot de passe (optionnel)</label>
                  <input
                    style={inp}
                    type="password"
                    placeholder="Pour créer votre compte"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                  />
                </div>
                <div>
                  <label style={lbl}>Confirmer le mot de passe</label>
                  <input
                    style={inp}
                    type="password"
                    placeholder="Répétez le mot de passe"
                    value={form.password2}
                    onChange={(e) => set("password2", e.target.value)}
                  />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>
                    <MessageSquare size={13} color="#1B1464" /> Message /
                    Motivations
                  </label>
                  <textarea
                    style={{
                      ...inp,
                      minHeight: 90,
                      resize: "vertical" as const,
                    }}
                    placeholder="Décrivez vos motivations…"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ═══ STEP 3 : Récapitulatif ═══ */}
            {step === 3 && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 24,
                  }}
                >
                  <Eye size={20} color="#1B1464" />
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                    Vérifiez vos informations
                  </h3>
                </div>
                <div
                  className="grid-recap"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  {(
                    [
                      ["Nom", form.nom],
                      ["Prénom", form.prenom],
                      ["E-mail", form.email],
                      ["Téléphone", form.telephone || "—"],
                      ["Profession", form.profession],
                      ["Structure", form.structure || "—"],
                      ["Ville", form.ville || "—"],
                      ["Province", form.province || "—"],
                    ] as [string, string][]
                  ).map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        background: "#f2f3f6",
                        borderRadius: 10,
                        padding: "10px 14px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: ".75rem",
                          color: "#6b7280",
                          marginBottom: 2,
                        }}
                      >
                        {k}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: ".9rem" }}>
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 18,
                    background: "#FFF0F5",
                    borderRadius: 12,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: ".8rem",
                        color: "#1B1464",
                        fontWeight: 600,
                      }}
                    >
                      Catégorie
                    </div>
                    <div style={{ fontWeight: 700 }}>
                      {catLabel[form.categorie] || form.categorie}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "#1B1464",
                    }}
                  >
                    {catPrice[form.categorie] || ""} / an
                  </div>
                </div>
                {form.message && (
                  <div
                    style={{
                      marginTop: 14,
                      background: "#f2f3f6",
                      borderRadius: 10,
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: ".75rem",
                        color: "#6b7280",
                        marginBottom: 4,
                      }}
                    >
                      Message
                    </div>
                    <div style={{ fontSize: ".875rem" }}>{form.message}</div>
                  </div>
                )}
                <div
                  style={{
                    marginTop: 14,
                    color: "#6b7280",
                    fontSize: ".8rem",
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <CheckCircle size={16} color="#00b96b" />
                  <span>Un compte sera créé avec votre e-mail.</span>
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: 28,
                display: "flex",
                gap: 12,
                flexWrap: "wrap" as const,
              }}
            >
              {step > 1 && (
                <button
                  type="button"
                  onClick={prev}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 28px",
                    borderRadius: 100,
                    border: "1.5px solid #f2f3f6",
                    background: "#fff",
                    color: "#1d1e20",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <ArrowLeft size={18} /> Précédent
                </button>
              )}
              {step < 3 && (
                <button
                  type="button"
                  onClick={next}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 32px",
                    borderRadius: 100,
                    border: "none",
                    background: "#1B1464",
                    color: "#fff",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Suivant <ArrowRight size={18} />
                </button>
              )}
              {step === 3 && (
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 32px",
                    borderRadius: 100,
                    border: "none",
                    background: "#1B1464",
                    color: "#fff",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: loading ? "wait" : "pointer",
                  }}
                >
                  <UserPlus size={18} />{" "}
                  {loading ? "Envoi en cours…" : "Soumettre ma demande"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = {
  fontSize: ".875rem",
  fontWeight: 600,
  color: "#1d1e20",
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginBottom: 6,
};
const inp: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1.5px solid #f2f3f6",
  fontSize: ".9375rem",
  fontFamily: "inherit",
  color: "#1d1e20",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};
