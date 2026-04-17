import { useEffect, useState } from "react";
import { adhesionApi, type MemberPublic } from "../api/members";
import { Users, Search } from "lucide-react";

export default function AnnuairePage() {
  const [members, setMembers] = useState<MemberPublic[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adhesionApi
      .annuaire()
      .then((r) => {
        setMembers(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.nom_complet.toLowerCase().includes(q) ||
      m.profession.toLowerCase().includes(q) ||
      (m.structure || "").toLowerCase().includes(q)
    );
  });

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
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
            Aucun membre trouvé.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {filtered.map((m) => (
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
                      background: "linear-gradient(135deg,#1B1464,#D4849A)",
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
                    style={{ display: "flex", justifyContent: "space-between" }}
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
        )}
      </div>
    </div>
  );
}
