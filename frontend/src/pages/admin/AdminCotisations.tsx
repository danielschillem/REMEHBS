import { useEffect, useState, useCallback } from "react";
import { adminApi } from "../../api/admin";
import type { Cotisation } from "../../api/members";
import {
  CreditCard,
  ArrowLeft,
  Search,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const STATUT_COLORS: Record<string, { bg: string; color: string }> = {
  paye: { bg: "#e6f9f0", color: "#00b96b" },
  en_attente: { bg: "#fffbeb", color: "#f59e0b" },
  impaye: { bg: "#fee2e2", color: "#ef4444" },
  annule: { bg: "#f3f4f6", color: "#6b7280" },
};

export default function AdminCotisations() {
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  /* Modal paiement */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCotId, setModalCotId] = useState<number | null>(null);
  const [modePaiement, setModePaiement] = useState("virement");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const loadCotisations = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page) };
    if (filtreStatut) params.statut = filtreStatut;
    if (debouncedSearch) params.search = debouncedSearch;
    adminApi
      .cotisations(params)
      .then((r) => {
        setCotisations(r.data.results);
        setTotalCount(r.data.count);
      })
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, filtreStatut]);

  useEffect(() => {
    loadCotisations();
  }, [loadCotisations]);

  useEffect(() => {
    setPage(1);
  }, [filtreStatut]);

  const openMarquerPaye = (id: number) => {
    setModalCotId(id);
    setModePaiement("virement");
    setReference("");
    setModalOpen(true);
  };

  const handleMarquerPaye = async () => {
    if (!modalCotId) return;
    setActionLoading(modalCotId);
    try {
      await adminApi.marquerPayeCotisation(modalCotId, {
        mode_paiement: modePaiement,
        reference,
      });
      setModalOpen(false);
      loadCotisations();
    } catch {
      alert("Erreur lors du marquage.");
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

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
          <CreditCard size={24} color="#1B1464" /> Suivi des cotisations
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
              placeholder="Rechercher membre, année…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
            <option value="paye">Payé</option>
            <option value="impaye">Impayé</option>
            <option value="annule">Annulé</option>
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
          ) : cotisations.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
              Aucune cotisation trouvée.
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
                  <th style={th}>Membre</th>
                  <th style={th}>Année</th>
                  <th style={th}>Montant</th>
                  <th style={th}>Statut</th>
                  <th style={{ ...th, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cotisations.map((c) => {
                  const s = STATUT_COLORS[c.statut] ?? STATUT_COLORS.en_attente;
                  return (
                    <tr
                      key={c.id}
                      style={{ borderBottom: "1px solid #f3f4f6" }}
                    >
                      <td style={td}>{c.membre_nom ?? "—"}</td>
                      <td style={td}>{c.annee}</td>
                      <td style={td}>{c.montant} FCFA</td>
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
                          {c.statut.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ ...td, textAlign: "center" }}>
                        {(c.statut === "en_attente" ||
                          c.statut === "impaye") && (
                          <button
                            disabled={actionLoading === c.id}
                            onClick={() => openMarquerPaye(c.id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "5px 10px",
                              borderRadius: 8,
                              border: "1px solid #00b96b",
                              background: "#fff",
                              color: "#00b96b",
                              fontWeight: 600,
                              fontSize: ".78rem",
                              cursor:
                                actionLoading === c.id ? "wait" : "pointer",
                              opacity: actionLoading === c.id ? 0.6 : 1,
                            }}
                          >
                            <CheckCircle size={14} /> Marquer payé
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 24,
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={paginationBtnStyle}
            >
              <ChevronLeft size={16} /> Précédent
            </button>
            <span style={{ fontSize: ".875rem", color: "#6b7280" }}>
              Page {page} / {totalPages} — {totalCount} cotisations
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={paginationBtnStyle}
            >
              Suivant <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Modal marquer payé */}
        {modalOpen && (
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
            onClick={() => setModalOpen(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 28,
                width: 380,
                maxWidth: "90vw",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ margin: "0 0 18px", fontWeight: 700 }}>
                Marquer la cotisation comme payée
              </h3>
              <label
                style={{
                  fontSize: ".85rem",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Mode de paiement
              </label>
              <select
                value={modePaiement}
                onChange={(e) => setModePaiement(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  marginBottom: 14,
                  fontSize: ".9rem",
                }}
              >
                <option value="virement">Virement</option>
                <option value="especes">Espèces</option>
                <option value="cheque">Chèque</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
              <label
                style={{
                  fontSize: ".85rem",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Référence (optionnel)
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="N° transaction, chèque…"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  marginBottom: 20,
                  fontSize: ".9rem",
                  boxSizing: "border-box",
                }}
              />
              <div
                style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
              >
                <button
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: ".85rem",
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleMarquerPaye}
                  disabled={actionLoading !== null}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    border: "none",
                    background: "#00b96b",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: actionLoading !== null ? "wait" : "pointer",
                    fontSize: ".85rem",
                  }}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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

const paginationBtnStyle: React.CSSProperties = {
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
