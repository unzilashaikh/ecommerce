import { useToast } from "../../context/ToastContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="toast-container"
      style={{
        position: "fixed",
        bottom: "95px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        alignItems: "center",
        pointerEvents: "none",
        width: "90%",
        maxWidth: "420px",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item toast-${toast.type}`}
          style={{
            pointerEvents: "auto",
            background: "#0f172a",
            color: "#ffffff",
            padding: "0.85rem 1.25rem",
            borderRadius: "999px",
            fontSize: "0.88rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            animation: "toastSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            width: "fit-content",
            maxWidth: "100%",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>
            {toast.icon || (toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ")}
          </span>
          <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {toast.message}
          </span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: "0 0.2rem",
              fontSize: "1rem",
              lineHeight: 1,
            }}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
