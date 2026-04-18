import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/admin";
import type { EventDetail, AbstractItem } from "../../api/events";
import {
  CalendarDays,
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

const EMPTY_FORM: Partial<EventDetail> = {
  titre: "",
  description: "",
  lieu: "",
  date_debut: "",
  date_fin: "",
  programme: "",
  intervenants: "",
  est_actif: true,
};

export default function AdminEvenements() {
  const queryClient = useQueryClient();
  const [isNarrowScreen, setIsNarrowScreen] = useState(
    () => window.innerWidth < 980,
  );
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  /* Modal */
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<EventDetail>>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  /* Delete confirm */
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [abstractModalId, setAbstractModalId] = useState<number | null>(null);
  const [abstractStatus, setAbstractStatus] = useState("soumis");
  const [abstractComment, setAbstractComment] = useState("");
  const [savingAbstractStatus, setSavingAbstractStatus] = useState(false);

  const eventsQuery = useQuery({
    queryKey: ["admin", "events"],
    queryFn: () => adminApi.evenements(),
  });

  const inscriptionsQuery = useQuery({
    queryKey: ["admin", "event-registrations"],
    queryFn: () => adminApi.inscriptionsEvenements({ ordering: "-created_at" }),
  });

  const abstractsQuery = useQuery({
    queryKey: ["admin", "event-abstracts"],
    queryFn: () => adminApi.abstractsEvenements({ ordering: "-created_at" }),
  });

  const events = eventsQuery.data?.data.results ?? [];
  const inscriptions = inscriptionsQuery.data?.data.results ?? [];
  const abstracts = abstractsQuery.data?.data.results ?? [];

  useEffect(() => {
    const onResize = () => setIsNarrowScreen(window.innerWidth < 980);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const refreshEvents = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
  const refreshInscriptions = () =>
    queryClient.invalidateQueries({
      queryKey: ["admin", "event-registrations"],
    });
  const refreshAbstracts = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "event-abstracts"] });

  const confirmerInscriptionMutation = useMutation({
    mutationFn: (id: number) => adminApi.confirmerInscriptionEvenement(id),
    onSuccess: refreshInscriptions,
  });

  const annulerInscriptionMutation = useMutation({
    mutationFn: (id: number) => adminApi.annulerInscriptionEvenement(id),
    onSuccess: refreshInscriptions,
  });

  const saveAbstractMutation = useMutation({
    mutationFn: (payload: {
      id: number;
      data: { statut: string; commentaire_comite?: string };
    }) => adminApi.majStatutAbstract(payload.id, payload.data),
    onSuccess: refreshAbstracts,
  });

  const saveEventMutation = useMutation({
    mutationFn: (payload: {
      id?: number | null;
      data: Partial<EventDetail>;
    }) =>
      payload.id
        ? adminApi.modifierEvenement(payload.id, payload.data)
        : adminApi.creerEvenement(payload.data),
    onSuccess: refreshEvents,
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => adminApi.supprimerEvenement(id),
    onSuccess: refreshEvents,
  });

  const handleConfirmerInscription = async (id: number) => {
    setActionLoadingId(id);
    try {
      await confirmerInscriptionMutation.mutateAsync(id);
    } catch {
      alert("Erreur lors de la confirmation.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAnnulerInscription = async (id: number) => {
    setActionLoadingId(id);
    try {
      await annulerInscriptionMutation.mutateAsync(id);
    } catch {
      alert("Erreur lors de l'annulation.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openAbstractModal = (item: AbstractItem) => {
    setAbstractModalId(item.id);
    setAbstractStatus(item.statut);
    setAbstractComment(item.commentaire_comite ?? "");
  };

  const saveAbstractStatus = async () => {
    if (!abstractModalId) return;
    setSavingAbstractStatus(true);
    try {
      await saveAbstractMutation.mutateAsync({
        id: abstractModalId,
        data: {
          statut: abstractStatus,
          commentaire_comite: abstractComment,
        },
      });
      setAbstractModalId(null);
    } catch {
      alert("Erreur lors de la mise a jour du statut.");
    } finally {
      setSavingAbstractStatus(false);
    }
  };

  const openNew = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  };

  const openEdit = async (id: number) => {
    const r = await adminApi.evenement(id);
    setEditId(id);
    setForm({
      titre: r.data.titre,
      description: r.data.description,
      lieu: r.data.lieu,
      date_debut: r.data.date_debut?.slice(0, 16) ?? "",
      date_fin: r.data.date_fin?.slice(0, 16) ?? "",
      programme: r.data.programme,
      intervenants: r.data.intervenants,
      est_actif: r.data.est_actif,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveEventMutation.mutateAsync({ id: editId, data: form });
      setModalOpen(false);
    } catch {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteEventMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  };

  const setField = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "1.5rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 10,
              margin: 0,
            }}
          >
            <CalendarDays size={24} color="#1B1464" /> Gestion des événements
          </h1>
          <button
            onClick={openNew}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg,#1B1464,#D4849A)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: ".9rem",
            }}
          >
            <Plus size={16} /> Nouvel événement
          </button>
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
          {eventsQuery.isLoading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
              Chargement…
            </div>
          ) : events.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
              Aucun événement.
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
                  <th style={th}>Titre</th>
                  <th style={th}>Lieu</th>
                  <th style={th}>Date</th>
                  <th style={th}>Inscrits</th>
                  <th style={th}>Actif</th>
                  <th style={{ ...th, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={td}>{ev.titre}</td>
                    <td style={td}>{ev.lieu}</td>
                    <td style={td}>
                      {ev.date_debut
                        ? new Date(ev.date_debut).toLocaleDateString("fr-FR")
                        : "—"}
                    </td>
                    <td style={td}>{ev.nb_inscrits}</td>
                    <td style={td}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontWeight: 600,
                          fontSize: ".8rem",
                          background: ev.est_actif ? "#e6f9f0" : "#f3f4f6",
                          color: ev.est_actif ? "#00b96b" : "#6b7280",
                        }}
                      >
                        {ev.est_actif ? "Oui" : "Non"}
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
                        <button
                          onClick={() => openEdit(ev.id)}
                          title="Modifier"
                          style={iconBtn}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(ev.id)}
                          title="Supprimer"
                          style={{
                            ...iconBtn,
                            color: "#ef4444",
                            borderColor: "#ef4444",
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: isNarrowScreen ? "1fr" : "1fr 1fr",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 1px 4px rgba(0,0,0,.06)",
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid #f3f4f6",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <CheckCircle2 size={16} color="#1B1464" /> Inscriptions recentes
            </div>
            {inscriptionsQuery.isLoading ? (
              <div style={{ padding: 16, color: "#6b7280" }}>Chargement...</div>
            ) : inscriptions.length === 0 ? (
              <div style={{ padding: 16, color: "#6b7280" }}>
                Aucune inscription.
              </div>
            ) : (
              <div style={{ maxHeight: 360, overflowY: "auto" }}>
                {inscriptions.map((ins) => (
                  <div
                    key={ins.id}
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #f8f9fa",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: ".88rem" }}>
                      {ins.prenom} {ins.nom} - {ins.event_titre}
                    </div>
                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: ".78rem",
                        marginTop: 2,
                      }}
                    >
                      {ins.email} -{" "}
                      {ins.type_participation_display ?? ins.type_participation}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button
                        onClick={() => handleConfirmerInscription(ins.id)}
                        disabled={
                          actionLoadingId === ins.id ||
                          ins.statut === "confirme"
                        }
                        style={smallActionBtn}
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => handleAnnulerInscription(ins.id)}
                        disabled={
                          actionLoadingId === ins.id || ins.statut === "annule"
                        }
                        style={{
                          ...smallActionBtn,
                          background: "#fff",
                          color: "#ef4444",
                          border: "1px solid #ef4444",
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 1px 4px rgba(0,0,0,.06)",
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid #f3f4f6",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FileText size={16} color="#1B1464" /> Abstracts recents
            </div>
            {abstractsQuery.isLoading ? (
              <div style={{ padding: 16, color: "#6b7280" }}>Chargement...</div>
            ) : abstracts.length === 0 ? (
              <div style={{ padding: 16, color: "#6b7280" }}>
                Aucun abstract.
              </div>
            ) : (
              <div style={{ maxHeight: 360, overflowY: "auto" }}>
                {abstracts.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #f8f9fa",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: ".88rem" }}>
                      {item.titre}
                    </div>
                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: ".78rem",
                        marginTop: 2,
                      }}
                    >
                      {item.auteur_nom} - {item.event_titre}
                    </div>
                    <div style={{ marginTop: 6, fontSize: ".78rem" }}>
                      Statut:{" "}
                      <strong>{item.statut_display ?? item.statut}</strong>
                    </div>
                    <button
                      onClick={() => openAbstractModal(item)}
                      style={{ ...smallActionBtn, marginTop: 8 }}
                    >
                      Moderer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create / Edit Modal */}
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
                width: 520,
                maxWidth: "92vw",
                maxHeight: "85vh",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <h3 style={{ margin: 0, fontWeight: 700 }}>
                  {editId ? "Modifier l'événement" : "Nouvel événement"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <X size={18} color="#6b7280" />
                </button>
              </div>

              <Field label="Titre">
                <input
                  value={form.titre ?? ""}
                  onChange={(e) => setField("titre", e.target.value)}
                  style={inputStyle}
                />
              </Field>
              <Field label="Description">
                <textarea
                  rows={3}
                  value={form.description ?? ""}
                  onChange={(e) => setField("description", e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </Field>
              <Field label="Lieu">
                <input
                  value={form.lieu ?? ""}
                  onChange={(e) => setField("lieu", e.target.value)}
                  style={inputStyle}
                />
              </Field>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isNarrowScreen ? "1fr" : "1fr 1fr",
                  gap: 12,
                }}
              >
                <Field label="Date début">
                  <input
                    type="datetime-local"
                    value={form.date_debut ?? ""}
                    onChange={(e) => setField("date_debut", e.target.value)}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Date fin">
                  <input
                    type="datetime-local"
                    value={form.date_fin ?? ""}
                    onChange={(e) => setField("date_fin", e.target.value)}
                    style={inputStyle}
                  />
                </Field>
              </div>
              <Field label="Programme">
                <textarea
                  rows={3}
                  value={form.programme ?? ""}
                  onChange={(e) => setField("programme", e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </Field>
              <Field label="Intervenants (un par ligne)">
                <textarea
                  rows={3}
                  value={form.intervenants ?? ""}
                  onChange={(e) => setField("intervenants", e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </Field>
              <Field label="">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.est_actif ?? true}
                    onChange={(e) => setField("est_actif", e.target.checked)}
                  />
                  <span style={{ fontSize: ".9rem", fontWeight: 600 }}>
                    Événement actif
                  </span>
                </label>
              </Field>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                  marginTop: 10,
                }}
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
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: "8px 22px",
                    borderRadius: 8,
                    border: "none",
                    background: "linear-gradient(135deg,#1B1464,#D4849A)",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: saving ? "wait" : "pointer",
                    fontSize: ".85rem",
                  }}
                >
                  {saving ? "Enregistrement…" : editId ? "Modifier" : "Créer"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete confirmation */}
        {deleteId && (
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
            onClick={() => setDeleteId(null)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 28,
                width: 380,
                maxWidth: "90vw",
                textAlign: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 size={32} color="#ef4444" style={{ marginBottom: 12 }} />
              <h3 style={{ marginBottom: 8, fontWeight: 700 }}>
                Supprimer cet événement ?
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: ".9rem",
                  marginBottom: 20,
                }}
              >
                Cette action est irréversible.
              </p>
              <div
                style={{ display: "flex", gap: 10, justifyContent: "center" }}
              >
                <button
                  onClick={() => setDeleteId(null)}
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
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    padding: "8px 22px",
                    borderRadius: 8,
                    border: "none",
                    background: "#ef4444",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: deleting ? "wait" : "pointer",
                    fontSize: ".85rem",
                  }}
                >
                  {deleting ? "Suppression…" : "Supprimer"}
                </button>
              </div>
            </div>
          </div>
        )}

        {abstractModalId && (
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
            onClick={() => setAbstractModalId(null)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 24,
                width: 480,
                maxWidth: "92vw",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ marginTop: 0, marginBottom: 12, fontWeight: 700 }}>
                Moderation du resume
              </h3>
              <Field label="Statut">
                <select
                  value={abstractStatus}
                  onChange={(e) => setAbstractStatus(e.target.value)}
                  style={inputStyle}
                >
                  <option value="soumis">Soumis</option>
                  <option value="accepte">Accepte</option>
                  <option value="refuse">Refuse</option>
                  <option value="revision">Revision</option>
                </select>
              </Field>
              <Field label="Commentaire du comite">
                <textarea
                  rows={4}
                  value={abstractComment}
                  onChange={(e) => setAbstractComment(e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </Field>
              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
              >
                <button
                  onClick={() => setAbstractModalId(null)}
                  style={{
                    ...smallActionBtn,
                    background: "#fff",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                  }}
                >
                  Fermer
                </button>
                <button
                  onClick={saveAbstractStatus}
                  disabled={savingAbstractStatus}
                  style={smallActionBtn}
                >
                  {savingAbstractStatus ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        )}
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

const iconBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: 8,
  border: "1px solid #1B1464",
  background: "#fff",
  color: "#1B1464",
  cursor: "pointer",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontSize: ".9rem",
  boxSizing: "border-box",
};

const smallActionBtn: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "none",
  background: "#1B1464",
  color: "#fff",
  fontSize: ".76rem",
  fontWeight: 600,
  cursor: "pointer",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label
          style={{
            fontSize: ".85rem",
            fontWeight: 600,
            display: "block",
            marginBottom: 5,
          }}
        >
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
