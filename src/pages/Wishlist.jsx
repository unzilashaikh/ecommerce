import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import WhatsAppIcon from "../components/common/WhatsAppIcon";
import { getProductWhatsAppUrl, getCartWhatsAppUrl, openWhatsApp } from "../utils/whatsapp";

export default function Wishlist({ onCartOpen, onQuickView }) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { dispatch } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
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

  const handleMoveAllToCart = () => {
    wishlist.forEach((product) => {
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
    });
    showToast(`All ${wishlist.length} saved pieces added to bag!`, "success", "🛍️");
    if (onCartOpen) onCartOpen();
  };

  const handleOrderAllWhatsApp = () => {
    const items = wishlist.map((p) => ({
      ...p,
      quantity: 1,
      color: p.colors?.[0] || "Standard",
    }));
    const subtotal = wishlist.reduce((s, p) => s + p.price, 0);
    const totals = {
      subtotal,
      discount: 0,
      shipping: subtotal >= 150 ? 0 : 12.95,
      total: subtotal + (subtotal >= 150 ? 0 : 12.95) + subtotal * 0.08,
    };
    const url = getCartWhatsAppUrl(items, totals);
    openWhatsApp(url);
  };

  if (wishlist.length === 0) {
    return (
      <main className="section-container" style={{ textAlign: "center", padding: "6rem 2rem" }}>
        <div style={{ fontSize: "4.5rem", marginBottom: "1rem" }}>❤️</div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Your Wishlist is Empty
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "450px", margin: "0 auto 2.2rem", fontSize: "1rem" }}>
          Explore our acoustic instruments, workspace setups, and living objects to save your favorite pieces.
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/shop")}>
          Explore Curated Catalog →
        </button>
      </main>
    );
  }

  return (
    <main>
      <div className="section-container">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2.5rem",
            paddingBottom: "1.2rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>
            <h1 className="section-title" style={{ marginBottom: "0.3rem" }}>
              Saved Wishlist
            </h1>
            <p className="section-subtitle" style={{ margin: 0 }}>
              {wishlist.length} curated piece{wishlist.length !== 1 ? "s" : ""} saved to your personal collection
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-sm" onClick={handleMoveAllToCart}>
              Move All to Bag
            </button>
            <button className="btn btn-whatsapp-order btn-sm" onClick={handleOrderAllWhatsApp}>
              Order All on WhatsApp
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={clearWishlist}
              style={{ color: "var(--error)" }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="products-grid">
          {wishlist.map((product) => {
            const savings = product.originalPrice
              ? Math.round((1 - product.price / product.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="product-card"
                style={{ position: "relative" }}
              >
                {/* Remove button */}
                <button
                  onClick={() => {
                    removeFromWishlist(product.id);
                    showToast(`Removed from wishlist`, "info");
                  }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 10,
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                  title="Remove from wishlist"
                  aria-label="Remove"
                >
                  ✕
                </button>

                <div
                  className="product-card-img-wrap"
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-img"
                  />
                  {product.badge && <span className="product-badge badge">{product.badge}</span>}
                  {savings > 0 && (
                    <span className="product-savings-badge badge badge-success">-{savings}%</span>
                  )}
                </div>

                <div className="product-card-body">
                  <div className="product-category-pill">{product.categoryLabel}</div>
                  <h3
                    className="product-card-name"
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {product.name}
                  </h3>
                  <p className="product-card-tagline">{product.tagline}</p>

                  <div className="product-card-footer">
                    <div className="product-price-block">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="product-original-price">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleMoveToCart(product)}
                    >
                      + Add to Bag
                    </button>
                  </div>

                  {/* Direct WhatsApp button */}
                  <button
                    className="btn-product-whatsapp"
                    onClick={() => {
                      const url = getProductWhatsAppUrl(product);
                      openWhatsApp(url);
                    }}
                  >
                    <WhatsAppIcon size={17} color="currentColor" />
                    Order on WhatsApp
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
