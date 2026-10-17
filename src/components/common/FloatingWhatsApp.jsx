import { useState } from "react";
import { STORE_CONFIG } from "../../data/storeConfig";
import { openWhatsApp } from "../../utils/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

export default function FloatingWhatsApp() {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    const text = encodeURIComponent(
      `Salam / Hello! I am visiting the ${STORE_CONFIG.storeName} online store and have a question regarding products / ordering.`
    );
    openWhatsApp(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`);
  };

  return (
    <div
      className="floating-whatsapp-container"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 990,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      <div
        className={`floating-whatsapp-tooltip ${hovered ? "visible" : ""}`}
        style={{
          background: "#0f172a",
          color: "#ffffff",
          padding: "0.5rem 0.9rem",
          borderRadius: "999px",
          fontSize: "0.82rem",
          fontWeight: 600,
          whiteSpace: "nowrap",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
          pointerEvents: "none",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(8px)",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e" }} />
        Order &amp; Chat on WhatsApp
      </div>

      {/* Button */}
      <button
        onClick={handleClick}
        aria-label="Chat on WhatsApp"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0, 0, 0, 0.15)",
          cursor: "pointer",
          border: "2px solid rgba(255, 255, 255, 0.35)",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease",
        }}
      >
        <WhatsAppIcon size={32} color="#ffffff" />
      </button>
    </div>
  );
}
