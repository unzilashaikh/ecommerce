import { Link } from "react-router-dom";
import Logo from "../common/Logo";
import { STORE_CONFIG } from "../../data/storeConfig";
import { openWhatsApp } from "../../utils/whatsapp";

export default function Footer() {
  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Salam! I would like to inquire about products at ${STORE_CONFIG.storeName}.`
    );
    openWhatsApp(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`);
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <Logo size="md" className="footer-brand-logo" />
          <p className="footer-description">
            Curated objects for the modern lifestyle. Studio-grade audio, precision workspace tools, and architectural living essentials.
          </p>
          <div className="footer-whatsapp-box" onClick={handleWhatsAppChat}>
            <div className="footer-wa-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.37C9.33 7.37 9 7.45 8.71 7.76C8.42 8.08 7.6 8.85 7.6 10.41C7.6 11.97 8.74 13.48 8.9 13.69C9.06 13.9 11.13 17.1 14.3 18.47C15.06 18.8 15.65 19 16.11 19.14C16.87 19.38 17.56 19.35 18.1 19.27C18.71 19.18 19.97 18.5 20.23 17.77C20.49 17.03 20.49 16.4 20.41 16.27C20.33 16.14 20.13 16.06 19.83 15.91C19.53 15.76 18.06 15.03 17.78 14.93C17.5 14.83 17.3 14.78 17.1 15.09C16.9 15.39 16.33 16.06 16.15 16.27C15.97 16.48 15.8 16.5 15.5 16.35C15.2 16.2 14.24 15.88 13.11 14.88C12.23 14.1 11.64 13.13 11.47 12.83C11.3 12.53 11.45 12.37 11.6 12.22C11.74 12.08 11.91 11.85 12.06 11.67C12.21 11.5 12.26 11.37 12.36 11.17C12.46 10.97 12.41 10.79 12.34 10.64C12.26 10.5 11.69 9.09 11.45 8.53C11.23 7.98 11 8.05 10.83 8.05C10.68 8.05 10.5 8.04 10.33 8.04C10.15 8.04 9.87 8.11 9.64 8.36C9.53 7.37 9.53 7.37 9.53 7.37Z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8" }}>Order via WhatsApp</div>
              <strong style={{ fontSize: "0.92rem", color: "#22c55e" }}>{STORE_CONFIG.displayPhone}</strong>
            </div>
          </div>
        </div>

        <div className="footer-links-grid">
          <div>
            <div className="footer-col-title">Shop Collections</div>
            <Link to="/offers" className="footer-link" style={{ color: "#fbbf24", fontWeight: 700 }}>⚡ Black Friday Offers</Link>
            <Link to="/shop?category=audio" className="footer-link">Audio &amp; Sound</Link>
            <Link to="/shop?category=workspace" className="footer-link">Workspace Gear</Link>
            <Link to="/shop?category=home" className="footer-link">Home &amp; Lighting</Link>
            <Link to="/shop?category=wearables" className="footer-link">Timepieces &amp; Wearables</Link>
            <Link to="/shop?category=lifestyle" className="footer-link">Lifestyle Accessories</Link>
          </div>

          <div>
            <div className="footer-col-title">Customer Care</div>
            <Link to="/wishlist" className="footer-link">Saved Wishlist</Link>
            <Link to="/about" className="footer-link">Our Philosophy</Link>
            <Link to="/shop" className="footer-link">All Products Catalog</Link>
            <Link to="/contact" className="footer-link">Studio Concierge</Link>
            <Link to="/contact" className="footer-link">Shipping &amp; Delivery</Link>
          </div>

          <div>
            <div className="footer-col-title">Assurance</div>
            <span className="footer-pill-item">✓ 30-Day Easy Returns</span>
            <span className="footer-pill-item">✓ Fast Direct WhatsApp Orders</span>
            <span className="footer-pill-item">✓ Free Delivery Over {STORE_CONFIG.currency}{STORE_CONFIG.freeShippingThreshold}</span>
            <span className="footer-pill-item">✓ 1-Year Official Warranty</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <span>&copy; {new Date().getFullYear()} {STORE_CONFIG.storeName} Living &amp; Audio Studio. All rights reserved.</span>
        <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
          <span style={{ color: "#64748b" }}>Order direct via WhatsApp 24/7</span>
        </div>
      </div>
    </footer>
  );
}
