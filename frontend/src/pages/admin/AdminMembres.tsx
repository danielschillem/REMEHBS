import { useEffect, useState } from "react";
import { adminApi } from "../../api/admin";
import type { Member } from "../../api/members";
import {
  Users,
  Search,
  CheckCircle,
  Pause,
  Play,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const STATUT_COLORS: Record<string, { bg: string; color: string }> = {
  actif: { bg: "#e6f9f0", color: "#00b96b" },
  en_attente: { bg: "#fffbeb", color: "#f59e0b" },
  suspendu: { bg: "#fee2e2", color: "#ef4444" },
  inactif: { bg: "#f3f4f6", color: "#6b7280" },
};

export default function AdminMembres() {
  const [membres, setMembres] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadMembres = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (filtreStatut) params.statut = filtreStatut;
    adminApi
      .membres(params)
      .then((r) => setMembres(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMembres();
  }, [filtreStatut]);

  const doAction = async (fn: () => Promise<unknown>, id: number) => {
    setActionLoading(id);
    try {
      await fn();
      loadMembres();
    } catch {
      alert("Erreur lors de l'action.");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = membres.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.nom.toLowerCase().includes(q) ||
      m.prenom.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.specialite.toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{ minHeight: "80vh", background: "#f2f3f6", padding: "60px 0" }}
    >
      <div className="container" style={{ maxWidth: 1100 }}>
        <Link
          to="/admin"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#1B1464",
            textDecoration: "none",
            marginBottom: 18,
            fontWeight: 600,
            fontSize: ".9rem",
          }}
        >
          <ArrowLeft size={16} /> Retour au tableau de bord
        </Link>

        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.5rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <Users size={24} color="#1B1464" /> Gestion des membres
        </h1>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 220,
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 10,
              padding: "0 14px",
              border: "1px solid #e5e7eb",
            }}
          >
            <Search size={16} color="#6b7280" />
            <input
              type="text"
              placeholder="Rechercher nom, email, spécialité…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadMembres()}
              style={{
                border: "none",
                outline: "none",
                padding: "10px 8px",
                flex: 1,
                fontSize: ".9rem",
              }}
            />
          </div>
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              fontSize: ".9rem",
              background: "#fff",
            }}
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="actif">Actif</option>
            <option value="suspendu">Suspendu</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            overflow: "auto",
            boxShadow: "0 1px 4px rgba(0,0,0,.06)",
          }}
        >
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
              Chargement…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
              Aucun membre trouvé.
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: ".88rem",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <th style={th}>Nom</th>
                  <th style={th}>Email</th>
                  <th style={th}>Spécialité</th>
                  <th style={th}>Statut</th>
                  <th style={{ ...th, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const s = STATUT_COLORS[m.statut] ?? STATUT_COLORS.inactif;
                  return (
                    <tr
                      key={m.id}
                      style={{ borderBottom: "1px solid #f3f4f6" }}
                    >
                      <td style={td}>
                        {m.prenom} {m.nom}
                      </td>
                      <td style={td}>{m.email}</td>
                      <td style={td}>{m.specialite}</td>
                      <td style={td}>
                        <span
                          style={{
                            background: s.bg,
                            color: s.color,
                            padding: "3px 10px",
                            borderRadius: 20,
                            fontWeight: 600,
                            fontSize: ".8rem",
                            textTransform: "capitalize",
                          }}
                        >
                          {m.statut.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ ...td, textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            justifyContent: "center",
                          }}
                        >
                          {m.statut === "en_attente" && (
                            <ActionBtn
                              icon={<CheckCircle size={14} />}
                              label="Valider"
                              color="#00b96b"
                              loading={actionLoading === m.id}
                              onClick={() =>
                                doAction(
                                  () => adminApi.validerMembre(m.id),
                                  m.id,
                                )
                              }
                            />
                          )}
                          {m.statut === "actif" && (
                            <ActionBtn
                              icon={<Pause size={14} />}
                              label="Suspendre"
                              color="#f59e0b"
                              loading={actionLoading === m.id}
                              onClick={() =>
                                doAction(
                                  () => adminApi.suspendreMembre(m.id),
                                  m.id,
                                )
                              }
                            />
                          )}
                          {m.statut === "suspendu" && (
                            <ActionBtn
                              icon={<Play size={14} />}
                              label="Réactiver"
                              color="#1B1464"
                              loading={actionLoading === m.id}
                              onClick={() =>
                                doAction(
                                  () => adminApi.reactiverMembre(m.id),
                                  m.id,
                                )
                              }
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */
const th: React.CSSProperties = {
  padding: "12px 14px",
  textAlign: "left",
  fontWeight: 700,
  fontSize: ".82rem",
  color: "#374151",
};

const td: React.CSSProperties = {
  padding: "10px 14px",
};

function ActionBtn({
  icon,
  label,
  color,
  loading,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "5px 10px",
        borderRadius: 8,
        border: `1px solid ${color}`,
        background: "#fff",
        color,
        fontWeight: 600,
        fontSize: ".78rem",
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {icon} {label}
    </button>
  );
}
