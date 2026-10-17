import { Link } from "react-router-dom";

export default function Logo({ size = "md", showSub = true, linkTo = "/", className = "" }) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const markSize = isSm ? 32 : isLg ? 46 : 38;
  const fontSize = isSm ? "1rem" : isLg ? "1.45rem" : "1.2rem";
  const subSize = isSm ? "0.6rem" : isLg ? "0.75rem" : "0.68rem";

  const Content = (
    <div className={`lumina-brand-logo ${className}`} style={{ display: "inline-flex", alignItems: "center", gap: isSm ? "0.6rem" : "0.8rem", textDecoration: "none" }}>
      {/* Brand Icon SVG */}
      <div
        className="brand-logo-icon-wrap"
        style={{
          width: markSize,
          height: markSize,
          borderRadius: isSm ? "8px" : "12px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #d97706 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(15, 23, 42, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <svg
          width={markSize * 0.58}
          height={markSize * 0.58}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Radiant Lumina geometric prism */}
          <polygon
            points="12,2 22,9 18,22 6,22 2,9"
            stroke="url(#luminaGrad)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <polygon
            points="12,6 18,10.5 15.5,18.5 8.5,18.5 6,10.5"
            fill="url(#luminaGlow)"
            opacity="0.35"
          />
          <circle cx="12" cy="13" r="2.5" fill="#f59e0b" />
          <defs>
            <linearGradient id="luminaGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fbbf24" />
              <stop offset="0.6" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="luminaGlow" x1="6" y1="6" x2="18" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" />
              <stop offset="1" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
        <span
          className="brand-logo-text"
          style={{
            fontFamily: "var(--font-heading, 'Outfit', sans-serif)",
            fontWeight: 800,
            letterSpacing: "0.14em",
            fontSize,
            color: "var(--text-primary, #0f172a)",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          LUMINA
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "var(--accent, #d97706)",
              boxShadow: "0 0 8px rgba(217, 119, 6, 0.8)",
            }}
          />
        </span>
        {showSub && (
          <span
            className="brand-logo-sub"
            style={{
              fontSize: subSize,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-muted, #64748b)",
              fontWeight: 600,
            }}
          >
            Living &amp; Audio Studio
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo} style={{ textDecoration: "none" }}>{Content}</Link>;
  }

  return Content;
}
