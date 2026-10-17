import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import Logo from "../common/Logo";
import WhatsAppIcon from "../common/WhatsAppIcon";
import { STORE_CONFIG } from "../../data/storeConfig";
import { openWhatsApp } from "../../utils/whatsapp";

export default function Header({ onCartOpen, onSearchOpen }) {
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer whenever route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/offers", label: "Offers & Black Friday", badge: "HOT" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(
      `Salam! I am exploring ${STORE_CONFIG.storeName} and would like to ask a question.`
    );
    openWhatsApp(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span>
          ⚡ <strong>UPCOMING BLACK FRIDAY:</strong> Up to 50% off select pieces &nbsp;|&nbsp; 
          Code <strong>LUMINA15</strong> for 15% off &nbsp;|&nbsp; 
          💬 1-Click WhatsApp Ordering
        </span>
      </div>

      {/* Main Header */}
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner container">
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation - Hidden on tablet & mobile */}
          <nav className="main-nav" aria-label="Main Navigation">
            {navLinks.map((l) => {
              const isActive = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  {l.label}
                  {l.badge && (
                    <span
                      style={{
                        marginLeft: "0.35rem",
                        padding: "0.1rem 0.45rem",
                        borderRadius: "99px",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        background: "#ef4444",
                        color: "#fff",
                      }}
                    >
                      {l.badge}
                    </span>
                  )}
                  {isActive && <span className="nav-active-pill" />}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="header-actions">
            {/* Live Search Trigger button */}
            <button
              className="icon-btn"
              onClick={onSearchOpen}
              aria-label="Search Catalog"
              title="Quick Search (Ctrl + K)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Wishlist Header Icon with live item count */}
            <button
              className="icon-btn wishlist-header-btn"
              onClick={() => navigate("/wishlist")}
              aria-label="Saved Wishlist"
              title="Saved Wishlist"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && <span className="cart-badge wishlist-badge">{wishlistCount}</span>}
            </button>

            {/* Cart Button */}
            <button
              className="icon-btn cart-btn"
              onClick={onCartOpen}
              aria-label="Shopping Cart"
              title="Shopping Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>

            {/* WhatsApp Quick Order button */}
            <button
              className="header-whatsapp-pill"
              onClick={handleWhatsAppContact}
              title="Chat & Order via WhatsApp"
              aria-label="WhatsApp Order"
            >
              <WhatsAppIcon size={18} color="#25D366" />
              <span className="header-whatsapp-label">WhatsApp</span>
            </button>

            {/* Mobile / Tablet Menu Hamburger Button */}
            <button
              className="mobile-menu-btn icon-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open Navigation Menu"
              title="Open Navigation Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="mobile-drawer-top">
          <Logo size="sm" />
          <button
            className="icon-btn close-drawer-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="mobile-nav-links">
          {navLinks.map((l) => {
            const isActive = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`mobile-nav-link ${isActive ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <span>
                  {l.label}
                  {l.badge && (
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        padding: "0.1rem 0.45rem",
                        borderRadius: "99px",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        background: "#ef4444",
                        color: "#fff",
                      }}
                    >
                      {l.badge}
                    </span>
                  )}
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            );
          })}

          {/* Wishlist Link in Mobile Drawer */}
          <Link
            to="/wishlist"
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              ❤️ Saved Wishlist ({wishlistCount})
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </nav>

        <div className="mobile-drawer-bottom">
          <button
            className="btn btn-whatsapp-order"
            style={{ width: "100%", marginBottom: "0.75rem" }}
            onClick={() => {
              setMobileOpen(false);
              handleWhatsAppContact();
            }}
          >
            <WhatsAppIcon size={20} color="#ffffff" />
            Order via WhatsApp
          </button>

          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={() => {
              setMobileOpen(false);
              onCartOpen();
            }}
          >
            View Bag ({itemCount})
          </button>
        </div>
      </div>

      {/* Backdrop overlay */}
      {mobileOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
