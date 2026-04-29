import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            padding: 40,
            textAlign: "center",
          }}
        >
          <AlertTriangle size={48} color="#f59e0b" />
          <h2
            style={{
              fontFamily: "'IBM Plex Serif',serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              margin: "20px 0 10px",
              color: "#1d1e20",
            }}
          >
            Une erreur est survenue
          </h2>
          <p style={{ color: "#6b7280", marginBottom: 24, maxWidth: 400 }}>
            Nous sommes désolés, quelque chose s'est mal passé. Veuillez
            réessayer.
          </p>
          {this.state.error && (
            <pre
              style={{
                fontSize: ".7rem",
                color: "#ef4444",
                background: "#fef2f2",
                padding: 12,
                borderRadius: 8,
                maxWidth: 500,
                overflow: "auto",
                textAlign: "left",
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleRetry}
            style={{
              padding: "10px 28px",
              borderRadius: 100,
              border: "none",
              background: "#1B1464",
              color: "#fff",
              fontWeight: 700,
              fontSize: ".9rem",
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
