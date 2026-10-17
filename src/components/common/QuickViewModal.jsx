import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import WhatsAppIcon from "./WhatsAppIcon";
import { getProductWhatsAppUrl, openWhatsApp } from "../../utils/whatsapp";

export default function QuickViewModal({ product, onClose, onCartOpen }) {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setSelectedColor(0);
    setQuantity(1);
    setActiveImg(0);
  }, [product]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const wishlisted = isInWishlist(product.id);
  const savings = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: product.colors[selectedColor] || "Standard",
        quantity,
      },
    });
    showToast(`Added ${quantity}x ${product.name} to bag!`, "success", "🛍️");
    onClose();
    if (onCartOpen) onCartOpen();
  };

  const handleWhatsAppOrder = () => {
    const url = getProductWhatsAppUrl(product, {
      color: product.colors[selectedColor] || "Standard",
      quantity,
    });
    openWhatsApp(url);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    showToast(
      wishlisted ? `Removed from wishlist` : `Added ${product.name} to wishlist`,
      wishlisted ? "info" : "success",
      "❤️"
    );
  };

  return (
    <>
      <div className="quickview-overlay" onClick={onClose} />
      <div className="quickview-modal" role="dialog" aria-modal="true">
        <button className="quickview-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="quickview-content-grid">
          {/* Gallery */}
          <div className="quickview-gallery">
            <div className="quickview-main-img-wrap">
              <img
                src={product.gallery?.[activeImg] || product.image}
                alt={product.name}
                className="quickview-main-img"
              />
              {product.badge && <span className="product-badge badge">{product.badge}</span>}
              {savings > 0 && (
                <span className="product-savings-badge badge badge-success">-{savings}%</span>
              )}
            </div>

            {product.gallery && product.gallery.length > 1 && (
              <div className="quickview-thumbs">
                {product.gallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className={`gallery-thumb ${activeImg === i ? "active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="quickview-details">
            <div className="product-category-pill">{product.categoryLabel}</div>
            <h2 className="quickview-title">{product.name}</h2>
            <p className="quickview-tagline">{product.tagline}</p>

            <div className="quickview-price-row">
              <span className="price-big">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="price-original">${product.originalPrice.toFixed(2)}</span>
              )}
              <span className="badge badge-success">In Stock</span>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-option-group" style={{ marginTop: "1rem" }}>
                <div className="product-option-label">
                  Finish / Color: <strong>{product.colors[selectedColor]}</strong>
                </div>
                <div className="color-swatches">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      className={`color-swatch-btn ${selectedColor === i ? "active" : ""}`}
                      onClick={() => setSelectedColor(i)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty & Wishlist */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1.2rem" }}>
              <div className="qty-controls">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qty-display">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                className={`quickview-wishlist-btn ${wishlisted ? "active" : ""}`}
                onClick={handleWishlistToggle}
                title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={wishlisted ? "#ef4444" : "none"}
                  stroke={wishlisted ? "#ef4444" : "currentColor"}
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>{wishlisted ? "Wishlisted" : "Save to Wishlist"}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginTop: "1.5rem" }}>
              <button
                className="btn btn-whatsapp-order"
                style={{ width: "100%", padding: "0.85rem" }}
                onClick={handleWhatsAppOrder}
              >
                <WhatsAppIcon size={20} color="#ffffff" />
                Order via WhatsApp (${(product.price * quantity).toFixed(2)})
              </button>

              <button
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.85rem" }}
                onClick={handleAddToCart}
              >
                Add to Bag — ${(product.price * quantity).toFixed(2)}
              </button>
            </div>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                onClick={() => {
                  onClose();
                  navigate(`/product/${product.id}`);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  fontSize: "0.86rem",
                  fontWeight: 600,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                View Complete Specifications &amp; Reviews →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
