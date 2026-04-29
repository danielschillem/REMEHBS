import { useEffect, useState, useCallback } from "react";
import { adhesionApi, type MemberPublic } from "../api/members";
import { Users, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function AnnuairePage() {
  const [members, setMembers] = useState<MemberPublic[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const pageSize = 20;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchMembers = useCallback(() => {
    setLoading(true);
    setError("");
    const params: Record<string, string> = { page: String(page) };
    if (debouncedSearch) params.search = debouncedSearch;
    adhesionApi
      .annuaire(params)
      .then((r) => {
        setMembers(r.data.results);
        setTotalCount(r.data.count);
      })
      .catch(() => setError("Impossible de charger l'annuaire."))
      .finally(() => setLoading(false));
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div
      style={{ minHeight: "80vh", background: "#f2f3f6", padding: "60px 0" }}
    >
      <div className="container" style={{ maxWidth: 960 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            <Users
              size={28}
              style={{
                verticalAlign: "middle",
                marginRight: 10,
                color: "#1B1464",
              }}
            />
            Annuaire des membres
          </h1>
          <p style={{ color: "#6b7280" }}>
            Répertoire public des membres actifs du REMEHBS
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            borderRadius: 12,
            padding: "10px 16px",
            marginBottom: 28,
            boxShadow: "0 1px 4px rgba(0,0,0,.06)",
          }}
        >
          <Search size={18} color="#6b7280" />
          <input
            type="text"
            placeholder="Rechercher par nom, profession, structure…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: ".9rem",
              background: "transparent",
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
            Chargement…
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: 40, color: "#ef4444" }}>
            {error}
          </div>
        ) : members.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
            Aucun membre trouvé.
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {members.map((m) => (
                <div
                  key={m.numero_membre}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: "20px",
                    boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#1B1464",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: ".85rem",
                      }}
                    >
                      {m.nom_complet.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: ".95rem" }}>
                        {m.nom_complet}
                      </div>
                      <div style={{ fontSize: ".75rem", color: "#6b7280" }}>
                        {m.numero_membre}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      fontSize: ".8rem",
                    }}
                  >
                    {m.profession && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ color: "#6b7280" }}>Profession</span>
                        <span style={{ fontWeight: 500 }}>{m.profession}</span>
                      </div>
                    )}
                    {m.specialite && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ color: "#6b7280" }}>Spécialité</span>
                        <span style={{ fontWeight: 500 }}>{m.specialite}</span>
                      </div>
                    )}
                    {m.structure && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ color: "#6b7280" }}>Structure</span>
                        <span style={{ fontWeight: 500 }}>{m.structure}</span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#6b7280" }}>Catégorie</span>
                      <span
                        style={{
                          background: "#1B146422",
                          color: "#1B1464",
                          padding: "2px 8px",
                          borderRadius: 100,
                          fontWeight: 600,
                          fontSize: ".7rem",
                        }}
                      >
                        {m.categorie_display}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 32,
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  style={paginationBtn}
                >
                  <ChevronLeft size={16} /> Précédent
                </button>
                <span style={{ fontSize: ".875rem", color: "#6b7280" }}>
                  Page {page} / {totalPages} — {totalCount} membres
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  style={paginationBtn}
                >
                  Suivant <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const paginationBtn: React.CSSProperties = {
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
