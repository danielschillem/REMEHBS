import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CreditCard, Calendar, CheckCircle } from "lucide-react";
import { notificationApi, type AppNotification } from "../api/members";
import { useAuth } from "../context/AuthContext";

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch count on mount + every 60s
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchCount = () => {
      notificationApi
        .count()
        .then((r) => setCount(r.data.non_lues))
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = async () => {
    if (open) {
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await notificationApi.list();
      setNotifications(data);
    } catch {
      /* ignore */
    }
    setLoading(false);
    setOpen(true);
  };

  const handleMarkAllRead = async () => {
    await notificationApi.markRead();
    setCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, lue: true })));
  };

  const handleClick = (n: AppNotification) => {
    if (!n.lue) {
      notificationApi.markRead([n.id]);
      setCount((c) => Math.max(0, c - 1));
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, lue: true } : x)),
      );
    }
    if (n.lien) navigate(n.lien);
    setOpen(false);
  };

  if (!isAuthenticated) return null;

  const getTypeIcon = (type: string) => {
    const iconProps = { size: 16, strokeWidth: 2 };
    const iconStyle = { display: "block" };

    switch (type) {
      case "cotisation":
        return <CreditCard {...iconProps} style={iconStyle} />;
      case "evenement":
        return <Calendar {...iconProps} style={iconStyle} />;
      case "adhesion":
        return <CheckCircle {...iconProps} style={iconStyle} />;
      case "systeme":
        return <Bell {...iconProps} style={iconStyle} />;
      default:
        return <Bell {...iconProps} style={iconStyle} />;
    }
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          position: "relative",
          padding: 6,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Bell size={20} color="#1d1e20" />
        {count > 0 && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "#fc5185",
              color: "#fff",
              borderRadius: "50%",
              width: 18,
              height: 18,
              fontSize: ".7rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            width: 360,
            maxHeight: 420,
            overflowY: "auto",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,.15)",
            zIndex: 1000,
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px 10px",
              borderBottom: "1px solid #f2f3f6",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: ".9375rem" }}>
              Notifications
            </span>
            {count > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#1B1464",
                  fontSize: ".8rem",
                  fontWeight: 600,
                }}
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {loading && (
            <div style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>
              Chargement…
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>
              Aucune notification
            </div>
          )}

          {!loading &&
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #f8f9fa",
                  cursor: n.lien ? "pointer" : "default",
                  background: n.lue ? "#fff" : "#f0f4ff",
                  display: "flex",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontSize: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    color: "#1B1464",
                  }}
                >
                  {getTypeIcon(n.type)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: n.lue ? 500 : 700,
                      fontSize: ".8125rem",
                      marginBottom: 2,
                    }}
                  >
                    {n.titre}
                  </div>
                  <div
                    style={{
                      fontSize: ".75rem",
                      color: "#6b7280",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {n.message}
                  </div>
                  <div
                    style={{
                      fontSize: ".7rem",
                      color: "#9ca3af",
                      marginTop: 3,
                    }}
                  >
                    {new Date(n.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {!n.lue && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#1B1464",
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
