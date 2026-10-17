import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";
import { useToast } from "../context/ToastContext";
import WhatsAppIcon from "../components/common/WhatsAppIcon";
import { getProductWhatsAppUrl, openWhatsApp } from "../utils/whatsapp";
import { STORE_CONFIG } from "../data/storeConfig";

export default function ProductDetail({ onCartOpen }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { showToast } = useToast();

  const product = PRODUCTS.find((p) => p.id === parseInt(id));

  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="section-container" style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <h2>Product not found</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          The requested item may have been discontinued or moved.
        </p>
        <button className="btn btn-primary" onClick={() => navigate("/shop")}>
          Back to Shop
        </button>
      </main>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const compared = isInCompare(product.id);

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
    setAdded(true);
    showToast(`Added ${quantity}x ${product.name} to bag!`, "success", "🛍️");
    setTimeout(() => setAdded(false), 2200);
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
      wishlisted ? "Removed from wishlist" : `Saved ${product.name} to wishlist`,
      wishlisted ? "info" : "success",
      "❤️"
    );
  };

  const handleCompareToggle = () => {
    const res = addToCompare(product);
    showToast(res.message, res.added ? "success" : "info", "⚖️");
  };

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <main>
      <div className="section-container">
        {/* Breadcrumb */}
        <nav
          className="breadcrumb"
          style={{
            marginBottom: "1.5rem",
            fontSize: "0.85rem",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            color: "var(--text-muted)",
          }}
        >
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            Home
          </span>
          <span>/</span>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/shop")}>
            Shop
          </span>
          <span>/</span>
          <span style={{ cursor: "pointer" }} onClick={() => navigate(`/shop?category=${product.category}`)}>
            {product.categoryLabel}
          </span>
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            {product.name}
          </span>
        </nav>

        <div className="product-detail-layout">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="product-main-img-box">
              <img
                src={product.gallery[activeImg] || product.image}
                alt={product.name}
                className="product-main-img"
              />
              {savings > 0 && (
                <span className="product-savings-badge badge badge-success">
                  Save {savings}%
                </span>
              )}
            </div>

            {product.gallery.length > 1 && (
              <div className="product-gallery-thumbs">
                {product.gallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className={`gallery-thumb ${activeImg === i ? "active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.8rem", alignItems: "center" }}>
              {product.badge && <span className="badge badge-accent">{product.badge}</span>}
              <span className="badge">{product.categoryLabel}</span>
              <span className="badge badge-success">In Stock &amp; Ready to Ship</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)",
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: "0.6rem",
              }}
            >
              {product.name}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginBottom: "1.2rem", lineHeight: 1.6 }}>
              {product.tagline}
            </p>

            <div className="product-rating-row">
              <span style={{ color: "#f59e0b", letterSpacing: "2px" }}>
                {"★".repeat(Math.floor(product.rating))}
              </span>
              <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{product.rating}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                ({product.reviewsCount} verified reviews)
              </span>
            </div>

            <div className="product-price-hero">
              <span className="price-big">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="price-original">${product.originalPrice.toFixed(2)}</span>
                  <span className="badge badge-success">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
                </>
              )}
            </div>

            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-option-group">
                <div className="product-option-label">
                  Color / Finish: <strong>{product.colors[selectedColor]}</strong>
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

            {/* Quantity, Wishlist & Compare Row */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
              <div className="product-option-group" style={{ margin: 0 }}>
                <div className="product-option-label">Quantity</div>
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
              </div>

              <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.5rem" }}>
                <button
                  className={`btn btn-secondary btn-sm ${wishlisted ? "active-wishlist" : ""}`}
                  onClick={handleWishlistToggle}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={wishlisted ? "#ef4444" : "none"}
                    stroke={wishlisted ? "#ef4444" : "currentColor"}
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {wishlisted ? "Wishlisted" : "Wishlist"}
                </button>

                <button
                  className={`btn btn-secondary btn-sm ${compared ? "active-compare" : ""}`}
                  onClick={handleCompareToggle}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 3h5v5" />
                    <path d="M4 20L21 3" />
                    <path d="M21 16v5h-5" />
                    <path d="M15 15l6 6" />
                    <path d="M4 4l5 5" />
                  </svg>
                  {compared ? "In Compare" : "Compare"}
                </button>
              </div>
            </div>

            {/* Primary Order Buttons */}
            <div className="product-actions-cluster" style={{ marginTop: "1.8rem" }}>
              {/* Prominent WhatsApp Order button */}
              <button
                className="btn btn-whatsapp-hero"
                onClick={handleWhatsAppOrder}
                title="Order via WhatsApp with selected color and quantity"
              >
                <WhatsAppIcon size={22} color="#ffffff" />
                <span>Order via WhatsApp &nbsp;—&nbsp; ${(product.price * quantity).toFixed(2)}</span>
              </button>

              <div style={{ display: "flex", gap: "0.8rem", width: "100%", marginTop: "0.8rem" }}>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                  onClick={handleAddToCart}
                >
                  {added ? "✓ Added to Bag!" : "Add to Bag"}
                </button>
                <button
                  className="btn btn-secondary btn-lg"
                  style={{ flex: 1 }}
                  onClick={() => {
                    handleAddToCart();
                    navigate("/checkout");
                  }}
                >
                  Checkout Now
                </button>
              </div>
            </div>

            {/* Shipping note */}
            <div
              className="shipping-note"
              style={{
                marginTop: "1.2rem",
                padding: "0.9rem 1.1rem",
                background: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.86rem",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>🚚</span>
              <span>
                Free express shipping over {STORE_CONFIG.currency}{STORE_CONFIG.freeShippingThreshold} &nbsp;|&nbsp; 
                Cash on delivery &amp; bank transfer confirmed via WhatsApp.
              </span>
            </div>

            {/* Description */}
            <div style={{ marginTop: "1.8rem" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.6rem" }}>
                Product Overview
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div style={{ marginTop: "1.8rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.8rem" }}>
                  Key Features
                </h3>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {product.features.map((f, i) => (
                    <li key={i} style={{ display: "flex", gap: "0.6rem", fontSize: "0.92rem", color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--success)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs */}
            {product.specs && (
              <div style={{ marginTop: "1.8rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.8rem" }}>
                  Technical Specifications
                </h3>
                <table style={{ width: "100%", fontSize: "0.9rem", borderCollapse: "collapse" }}>
                  <tbody>
                    {Object.entries(product.specs).map(([k, v]) => (
                      <tr key={k} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "0.6rem 0", fontWeight: 600, color: "var(--text-secondary)", width: "40%" }}>
                          {k}
                        </td>
                        <td style={{ padding: "0.6rem 0", color: "var(--text-primary)" }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: "5rem" }}>
            <h2 className="section-title" style={{ marginBottom: "1.5rem" }}>
              You May Also Like
            </h2>
            <div
              className="products-grid"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
            >
              {related.map((p) => (
                <div
                  key={p.id}
                  className="product-card"
                  onClick={() => {
                    navigate(`/product/${p.id}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-card-img-wrap">
                    <img src={p.image} alt={p.name} className="product-card-img" />
                    {p.badge && <span className="product-badge badge">{p.badge}</span>}
                  </div>
                  <div className="product-card-body">
                    <div className="product-category-pill">{p.categoryLabel}</div>
                    <h3 className="product-card-name">{p.name}</h3>
                    <div className="product-card-footer">
                      <span className="product-price">${p.price.toFixed(2)}</span>
                      <span className="btn btn-sm btn-secondary">View Details →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
