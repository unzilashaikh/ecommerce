import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";
import { STORE_CONFIG } from "../data/storeConfig";
import { openWhatsApp } from "../utils/whatsapp";
import { useToast } from "../context/ToastContext";
import WhatsAppIcon from "../components/common/WhatsAppIcon";

export default function Offers({ onCartOpen, onQuickView }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState(null);
  const [vipPhone, setVipPhone] = useState("");
  const [vipRegistered, setVipRegistered] = useState(false);

  // Black Friday countdown calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 34,
    hours: 14,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyPromo = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied to clipboard!`, "success", "🏷️");
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleVipWhatsApp = (e) => {
    e.preventDefault();
    if (!vipPhone.trim()) {
      showToast("Please enter your phone / WhatsApp number", "error");
      return;
    }
    setVipRegistered(true);
    const text = encodeURIComponent(
      `Salam! I want to register for VIP Early Access to the Upcoming Black Friday Drop at ${STORE_CONFIG.storeName}. My WhatsApp: ${vipPhone}.`
    );
    openWhatsApp(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`);
    showToast("VIP Early Access request submitted via WhatsApp!", "success", "🎉");
  };

  // Products with actual savings
  const saleProducts = PRODUCTS.filter((p) => p.originalPrice && p.originalPrice > p.price);

  return (
    <main>
      {/* Black Friday Hero Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #090a0f 0%, #151821 60%, #1f1406 100%)",
          color: "#ffffff",
          padding: "4.5rem 1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="section-container" style={{ padding: 0 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: "3rem",
              alignItems: "center",
            }}
            className="offers-hero-grid"
          >
            {/* Left Column: Black Friday Announcement */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(217, 119, 6, 0.2)",
                  border: "1px solid rgba(217, 119, 6, 0.4)",
                  color: "#fbbf24",
                  padding: "0.35rem 0.9rem",
                  borderRadius: "99px",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "1.2rem",
                }}
              >
                <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", animation: "pulse 1.5s infinite" }} />
                Special Offers &amp; Upcoming Black Friday
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4rem)",
                  fontWeight: 900,
                  lineHeight: 1.08,
                  marginBottom: "1.2rem",
                  letterSpacing: "-0.03em",
                }}
              >
                The Ultimate <br />
                <span style={{ color: "#fbbf24", textShadow: "0 0 35px rgba(251, 191, 36, 0.35)" }}>
                  Black Friday Drop
                </span>
              </h1>

              <p style={{ color: "#94a3b8", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "520px" }}>
                Humari team upcoming <strong>Black Friday Mega Sale</strong> ki exclusive deals aur bundle offers par tezi se kaam kar rahi hai! Early access lene ke liye abhi register karein ya current live deals ka faida uthayein.
              </p>

              {/* Countdown Clock */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  marginBottom: "2.5rem",
                }}
              >
                {[
                  { label: "DAYS", val: timeLeft.days },
                  { label: "HOURS", val: timeLeft.hours },
                  { label: "MINUTES", val: timeLeft.minutes },
                  { label: "SECONDS", val: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "14px",
                      padding: "1rem 1.2rem",
                      minWidth: "75px",
                      textAlign: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#ffffff", fontFamily: "var(--font-heading)" }}>
                      {String(item.val).padStart(2, "0")}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "#fbbf24", letterSpacing: "0.1em", fontWeight: 700, marginTop: "0.2rem" }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* VIP Early Access WhatsApp Registration Form */}
              <form onSubmit={handleVipWhatsApp} style={{ display: "flex", gap: "0.6rem", maxWidth: "460px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Enter your WhatsApp # for VIP Drop"
                  value={vipPhone}
                  onChange={(e) => setVipPhone(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: "220px",
                    padding: "0.85rem 1.1rem",
                    borderRadius: "99px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    background: "rgba(255, 255, 255, 0.08)",
                    color: "#fff",
                    fontSize: "0.92rem",
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-whatsapp-order"
                  style={{ padding: "0.85rem 1.4rem", borderRadius: "99px" }}
                >
                  <WhatsAppIcon size={18} color="#ffffff" />
                  Get VIP Alerts
                </button>
              </form>
              {vipRegistered && (
                <div style={{ color: "#22c55e", fontSize: "0.85rem", marginTop: "0.6rem", fontWeight: 600 }}>
                  ✓ You are on the VIP Black Friday priority list!
                </div>
              )}
            </div>

            {/* Right Column: User's Requested Black Friday GIF in sleek showcase frame */}
            <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
              <div
                style={{
                  position: "relative",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(217, 119, 6, 0.3)",
                  border: "2px solid rgba(251, 191, 36, 0.4)",
                  background: "#000",
                  maxWidth: "460px",
                  width: "100%",
                }}
              >
                {/* Official Black Friday GIF provided by user */}
                <img
                  src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3eW8wZWFkZXJzOXh6cHExbGJqdmZlcjFrNXdlaGsxZDNhd3llenhuaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/yvbtglsJ1H7aGu0IuN/giphy.gif"
                  alt="Upcoming Black Friday Sale Preparation"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "cover",
                  }}
                  loading="eager"
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)",
                    padding: "1.2rem 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <strong style={{ color: "#fbbf24", fontSize: "0.95rem", display: "block" }}>
                      Work in Progress ⚡
                    </strong>
                    <span style={{ color: "#e2e8f0", fontSize: "0.78rem" }}>
                      Up to 50% Off Master Sound &amp; Living
                    </span>
                  </div>
                  <span
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                      textTransform: "uppercase",
                    }}
                  >
                    Upcoming Drop
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Live Promo Coupons */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">Active Studio Coupons</h2>
          <p className="section-subtitle">
            Click any voucher to copy the code directly to your clipboard or apply on WhatsApp.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Coupon 1 */}
          <div
            className="coupon-card"
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
              color: "#ffffff",
              borderRadius: "var(--radius-lg)",
              padding: "1.8rem",
              border: "1px dashed rgba(251, 191, 36, 0.4)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fbbf24", letterSpacing: "0.1em" }}>
                WELCOME CODE
              </span>
              <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: "0.3rem 0 0.5rem" }}>
                15% OFF
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.88rem", margin: 0 }}>
                Valid on your first order across any audio, desk accessories, or lighting items.
              </p>
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem" }}>
              <code style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.1em", color: "#fbbf24", background: "rgba(0,0,0,0.3)", padding: "0.3rem 0.6rem", borderRadius: "6px" }}>
                LUMINA15
              </code>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => copyPromo("LUMINA15")}
                style={{ background: "#ffffff", color: "#0f172a" }}
              >
                {copiedCode === "LUMINA15" ? "✓ Copied!" : "Copy Code"}
              </button>
            </div>
          </div>

          {/* Coupon 2 */}
          <div
            className="coupon-card"
            style={{
              background: "linear-gradient(135deg, #7c2d12 0%, #451a03 100%)",
              color: "#ffffff",
              borderRadius: "var(--radius-lg)",
              padding: "1.8rem",
              border: "1px dashed rgba(254, 215, 170, 0.4)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fdba74", letterSpacing: "0.1em" }}>
                BLACK FRIDAY TEASER
              </span>
              <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: "0.3rem 0 0.5rem" }}>
                20% OFF $200+
              </h3>
              <p style={{ color: "#fed7aa", fontSize: "0.88rem", margin: 0 }}>
                Get an instant $40+ discount when curating complete audio &amp; workspace setups.
              </p>
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem" }}>
              <code style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.1em", color: "#fdba74", background: "rgba(0,0,0,0.3)", padding: "0.3rem 0.6rem", borderRadius: "6px" }}>
                SAVE20
              </code>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => copyPromo("SAVE20")}
                style={{ background: "#ffffff", color: "#0f172a" }}
              >
                {copiedCode === "SAVE20" ? "✓ Copied!" : "Copy Code"}
              </button>
            </div>
          </div>

          {/* Coupon 3 */}
          <div
            className="coupon-card"
            style={{
              background: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
              color: "#ffffff",
              borderRadius: "var(--radius-lg)",
              padding: "1.8rem",
              border: "1px dashed rgba(167, 243, 208, 0.4)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6ee7b7", letterSpacing: "0.1em" }}>
                LOGISTICS PASS
              </span>
              <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: "0.3rem 0 0.5rem" }}>
                FREE SHIPPING
              </h3>
              <p style={{ color: "#a7f3d0", fontSize: "0.88rem", margin: 0 }}>
                Complimentary white-glove insured delivery with no minimum threshold.
              </p>
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem" }}>
              <code style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.1em", color: "#6ee7b7", background: "rgba(0,0,0,0.3)", padding: "0.3rem 0.6rem", borderRadius: "6px" }}>
                FREESHIP
              </code>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => copyPromo("FREESHIP")}
                style={{ background: "#ffffff", color: "#0f172a" }}
              >
                {copiedCode === "FREESHIP" ? "✓ Copied!" : "Copy Code"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Current Sale Products */}
      <section className="section-container" style={{ background: "var(--bg-subtle)" }}>
        <div className="section-header">
          <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>
            Live Reductions
          </div>
          <h2 className="section-title">Special Discounted Pieces</h2>
          <p className="section-subtitle">
            Items currently marked down ahead of the Black Friday release. Order instantly online or via WhatsApp.
          </p>
        </div>

        <div className="products-grid">
          {saleProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onCartOpen={onCartOpen}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/shop")}>
            View All Studio Items ({PRODUCTS.length}) →
          </button>
        </div>
      </section>

      {/* Black Friday WhatsApp Help */}
      <section className="section-container">
        <div
          style={{
            background: "linear-gradient(135deg, rgba(37, 211, 102, 0.1) 0%, rgba(18, 140, 126, 0.05) 100%)",
            border: "1.5px solid rgba(37, 211, 102, 0.35)",
            borderRadius: "var(--radius-lg)",
            padding: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 0.4rem", color: "#166534" }}>
              Looking for Custom Bundle Discounts?
            </h3>
            <p style={{ color: "var(--text-secondary)", margin: 0, maxWidth: "550px", fontSize: "0.95rem" }}>
              Buying multiple headphones, desk setups, or ambient lighting for your home studio? Chat with our atelier directly on WhatsApp for custom tiered pricing.
            </p>
          </div>

          <button
            className="btn btn-whatsapp-order btn-lg"
            onClick={() => {
              const text = encodeURIComponent(
                `Salam! I am interested in bulk / bundle deals for the Upcoming Black Friday sale at ${STORE_CONFIG.storeName}.`
              );
              openWhatsApp(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`);
            }}
          >
            <WhatsAppIcon size={22} color="#ffffff" />
            Inquire Bundle Rates on WhatsApp
          </button>
        </div>
      </section>
    </main>
  );
}
