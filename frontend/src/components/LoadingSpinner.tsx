import { Loader2 } from "lucide-react";

interface Props {
  message?: string;
}

export default function LoadingSpinner({ message = "Chargement…" }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 16,
        color: "#6b7280",
      }}
    >
      <Loader2
        size={36}
        color="#1B1464"
        style={{ animation: "spin 1s linear infinite" }}
      />
      <p style={{ fontSize: ".9rem" }}>{message}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
