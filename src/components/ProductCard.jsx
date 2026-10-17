import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { useCompare } from "../context/CompareContext";
import WhatsAppIcon from "./common/WhatsAppIcon";
import { getProductWhatsAppUrl, openWhatsApp } from "../utils/whatsapp";

function StarRating({ rating }) {
  return (
    <span style={{ color: "#f59e0b", letterSpacing: "1px", display: "inline-flex", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ opacity: i <= Math.floor(rating) ? 1 : 0.25, fontSize: "0.95rem" }}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ProductCard({ product, onCartOpen, onQuickView }) {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { showToast } = useToast();

  const wishlisted = isInWishlist(product.id);
  const compared = isInCompare(product.id);

  const savings = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: product.colors?.[0] || "Standard",
        quantity: 1,
      },
    });
    showToast(`Added ${product.name} to bag!`, "success", "🛍️");
    if (onCartOpen) onCartOpen();
  };

  const handleWhatsAppOrder = (e) => {
    e.stopPropagation();
    const url = getProductWhatsAppUrl(product, {
      color: product.colors?.[0] || "Standard",
      quantity: 1,
    });
    openWhatsApp(url);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      wishlisted ? "Removed from wishlist" : `Saved ${product.name} to wishlist`,
      wishlisted ? "info" : "success",
      "❤️"
    );
  };

  const handleCompareToggle = (e) => {
    e.stopPropagation();
    const res = addToCompare(product);
    showToast(res.message, res.added ? "success" : "info", "⚖️");
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate("/product/" + product.id)}
      style={{ cursor: "pointer" }}
    >
      <div className="product-card-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />

        {/* Top Badges */}
        {product.badge && <span className="product-badge badge">{product.badge}</span>}
        {savings > 0 && (
          <span className="product-savings-badge badge badge-success">-{savings}%</span>
        )}

        {/* Hover Quick Action Buttons */}
        <div className="product-card-hover-actions">
          {/* Wishlist Heart Toggle */}
          <button
            className={`card-action-icon-btn ${wishlisted ? "active-wishlist" : ""}`}
            onClick={handleWishlistToggle}
            title={wishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
            aria-label="Wishlist"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={wishlisted ? "#ef4444" : "none"}
              stroke={wishlisted ? "#ef4444" : "currentColor"}
              strokeWidth="2.2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Compare Toggle */}
          <button
            className={`card-action-icon-btn ${compared ? "active-compare" : ""}`}
            onClick={handleCompareToggle}
            title={compared ? "Remove from Compare" : "Compare Product"}
            aria-label="Compare"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M16 3h5v5" />
              <path d="M4 20L21 3" />
              <path d="M21 16v5h-5" />
              <path d="M15 15l6 6" />
              <path d="M4 4l5 5" />
            </svg>
          </button>

          {/* Quick View Modal trigger */}
          <button
            className="card-action-icon-btn"
            onClick={handleQuickViewClick}
            title="Quick Preview"
            aria-label="Quick View"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>

      <div className="product-card-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="product-category-pill">{product.categoryLabel}</div>
          {product.colors && (
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {product.colors.length} finish{product.colors.length > 1 ? "es" : ""}
            </span>
          )}
        </div>

        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-tagline">{product.tagline}</p>

        <div className="product-card-rating">
          <StarRating rating={product.rating} />
          <span className="rating-count">({product.reviewsCount})</span>
        </div>

        <div className="product-card-footer">
          <div className="product-price-block">
            <span className="product-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="product-original-price">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleQuickAdd}
              title="Add to Bag"
            >
              + Bag
            </button>
          </div>
        </div>

        {/* Dedicated WhatsApp Direct Order Button */}
        <button
          className="btn-product-whatsapp"
          onClick={handleWhatsAppOrder}
          title="Order this product instantly via WhatsApp"
        >
          <WhatsAppIcon size={18} color="currentColor" />
          Order on WhatsApp
        </button>
      </div>
    </div>
  );
}