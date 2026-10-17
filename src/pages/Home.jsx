import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";
import { STORE_CONFIG } from "../data/storeConfig";
import { openWhatsApp } from "../utils/whatsapp";

const categories = [
  { key: "audio", label: "Audio & Sound", icon: "🎧", desc: "Planar magnetic & spatial acoustics" },
  { key: "workspace", label: "Workspace Gear", icon: "⌨️", desc: "Mechanical boards & MagSafe docks" },
  { key: "home", label: "Home & Lighting", icon: "🏮", desc: "Ceramic arc lamps & air diffusers" },
  { key: "wearables", label: "Wearables", icon: "⌚", desc: "Grade-5 titanium timepieces" },
  { key: "lifestyle", label: "Lifestyle Objects", icon: "🍵", desc: "Ceramic thermals & merino wool" },
];

const pillars = [
  { icon: "🎯", title: "Obsessively Curated", desc: "Every design piece is rigorously tested for acoustic and aesthetic excellence." },
  { icon: "💬", title: "Direct WhatsApp Orders", desc: "Order any item directly via WhatsApp with quick confirmation from real humans." },
  { icon: "🚚", title: "Free Insured Delivery", desc: `Complimentary express shipping on all orders over ${STORE_CONFIG.currency}${STORE_CONFIG.freeShippingThreshold}.` },
  { icon: "🛡️", title: "1-Year Official Warranty", desc: "Full peace of mind with replacement coverage and 30-day effortless returns." },
];

export default function Home({ onCartOpen, onQuickView }) {
  const navigate = useNavigate();
  const featured = PRODUCTS.slice(0, 6);

  const handleWhatsAppConsult = () => {
    const text = encodeURIComponent(
      `Salam! I am visiting the ${STORE_CONFIG.storeName} studio and would like to order or ask about featured collections.`
    );
    openWhatsApp(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-eyebrow">Studio Living &amp; Hi-Fi Acoustics</div>
          <h1 className="hero-title">
            Objects of <br />
            <span className="hero-accent">Intention.</span>
          </h1>
          <p className="hero-subtitle">
            Curated sound, workspace architecture, and ambient lighting crafted for those who demand beauty in everyday moments.
          </p>

          <div className="hero-cta-group">
            <button className="btn btn-primary btn-lg" onClick={() => navigate("/shop")}>
              Shop the Collection
            </button>
            <button
              className="btn btn-whatsapp-hero btn-lg"
              onClick={handleWhatsAppConsult}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.37C9.33 7.37 9 7.45 8.71 7.76C8.42 8.08 7.6 8.85 7.6 10.41C7.6 11.97 8.74 13.48 8.9 13.69C9.06 13.9 11.13 17.1 14.3 18.47C15.06 18.8 15.65 19 16.11 19.14C16.87 19.38 17.56 19.35 18.1 19.27C18.71 19.18 19.97 18.5 20.23 17.77C20.49 17.03 20.49 16.4 20.41 16.27C20.33 16.14 20.13 16.06 19.83 15.91C19.53 15.76 18.06 15.03 17.78 14.93C17.5 14.83 17.3 14.78 17.1 15.09C16.9 15.39 16.33 16.06 16.15 16.27C15.97 16.48 15.8 16.5 15.5 16.35C15.2 16.2 14.24 15.88 13.11 14.88C12.23 14.1 11.64 13.13 11.47 12.83C11.3 12.53 11.45 12.37 11.6 12.22C11.74 12.08 11.91 11.85 12.06 11.67C12.21 11.5 12.26 11.37 12.36 11.17C12.46 10.97 12.41 10.79 12.34 10.64C12.26 10.5 11.69 9.09 11.45 8.53C11.23 7.98 11 8.05 10.83 8.05C10.68 8.05 10.5 8.04 10.33 8.04C10.15 8.04 9.87 8.11 9.64 8.36C9.53 7.37 9.53 7.37 9.53 7.37Z"/>
              </svg>
              Quick WhatsApp Order
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>12,000+</strong>
              <span>Pieces Shipped</span>
            </div>
            <div className="hero-stat">
              <strong>4.9 ★</strong>
              <span>Average Rating</span>
            </div>
            <div className="hero-stat">
              <strong>1-Click</strong>
              <span>WhatsApp Ordering</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-img-card">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
              alt="Aura Horizon Spatial Headphones"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-lg)" }}
            />
          </div>
          <div className="hero-float-badge">
            <span style={{ color: "#f59e0b", fontWeight: 700 }}>★ 4.9</span>
            <span>Flagship Choice</span>
          </div>
        </div>
      </section>

      {/* Upcoming Black Friday Banner Teaser */}
      <section className="section-container" style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
        <div
          onClick={() => navigate("/offers")}
          style={{
            cursor: "pointer",
            background: "linear-gradient(135deg, #090a0f 0%, #1c1404 60%, #b45309 100%)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem 2.5rem",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25), 0 0 20px rgba(251, 191, 36, 0.15)",
            border: "1px solid rgba(251, 191, 36, 0.3)",
            transition: "transform 0.2s ease",
          }}
          className="black-friday-teaser-card"
        >
          <div style={{ maxWidth: "600px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
              <span style={{ background: "#ef4444", color: "#fff", fontSize: "0.68rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: "99px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                UPCOMING DROP
              </span>
              <span style={{ color: "#fbbf24", fontSize: "0.85rem", fontWeight: 700 }}>
                ⚡ Work in progress on Black Friday Deals
              </span>
            </div>
            <h2 style={{ color: "#ffffff", fontSize: "1.7rem", margin: "0 0 0.4rem", fontWeight: 900 }}>
              Up to 50% Off: The Black Friday Drop is Coming
            </h2>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>
              Exclusive previews, limited edition bundle packs, and VIP WhatsApp drop alerts. Click to explore offers.
            </p>
          </div>

          <button
            className="btn btn-primary"
            style={{ background: "#fbbf24", color: "#0f172a", fontWeight: 800, border: "none" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/offers");
            }}
          >
            Explore Black Friday Offers →
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">Shop by Curated Disciplines</h2>
          <p className="section-subtitle">
            Explore dedicated studios tailored for audio enthusiasts, architects, and minimalist workspaces.
          </p>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="category-card"
              onClick={() => navigate("/shop?category=" + cat.key)}
              style={{ cursor: "pointer" }}
            >
              <div style={{ fontSize: "2.4rem", marginBottom: "0.6rem", lineHeight: 1 }}>{cat.icon}</div>
              <div className="category-label">{cat.label}</div>
              <div style={{ fontSize: "0.82rem", opacity: 0.65, marginTop: "0.3rem" }}>{cat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-container" style={{ background: "var(--bg-subtle)" }}>
        <div className="section-header">
          <h2 className="section-title">Featured Highlights</h2>
          <p className="section-subtitle">
            Handpicked studio items available for instant online delivery or WhatsApp ordering.
          </p>
        </div>
        <div className="products-grid">
          {featured.map((p) => (
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
            Explore All Products ({PRODUCTS.length}) →
          </button>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="section-container">
        <div className="pillars-grid">
          {pillars.map((pil) => (
            <div key={pil.title} className="pillar-card">
              <span className="pillar-icon">{pil.icon}</span>
              <h3 className="pillar-title">{pil.title}</h3>
              <p className="pillar-desc">{pil.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="section-container" style={{ paddingTop: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
            background: "linear-gradient(135deg, #0f172a 0%, #b45309 100%)",
            borderRadius: "var(--radius-lg)",
            padding: "3.5rem 2.8rem",
            color: "#ffffff",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#fbbf24",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Exclusive Welcome Offer
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", margin: "0 0 0.6rem" }}>
              Enjoy 15% Off Your First Order
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", margin: 0, maxWidth: "500px" }}>
              Apply coupon code <strong style={{ color: "#fbbf24" }}>LUMINA15</strong> in your bag, or mention it when placing an order via WhatsApp.
            </p>
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ background: "#ffffff", color: "#0f172a" }}
            onClick={() => navigate("/shop")}
          >
            Claim 15% Off &amp; Shop →
          </button>
        </div>
      </section>
    </main>
  );
}