import { useState } from "react";
import { useCompare } from "../../context/CompareContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { getProductWhatsAppUrl, openWhatsApp } from "../../utils/whatsapp";

export default function CompareDrawer({ onCartOpen }) {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { dispatch } = useCart();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  if (compareList.length === 0) return null;

  const handleAddCart = (product) => {
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
    showToast(`Added ${product.name} to cart!`, "success", "🛍️");
    if (onCartOpen) onCartOpen();
  };

  const handleWhatsApp = (product) => {
    const url = getProductWhatsAppUrl(product, {
      color: product.colors?.[0] || "Standard",
      quantity: 1,
    });
    openWhatsApp(url);
  };

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className="compare-floating-bar">
        <div className="compare-bar-inner">
          <div className="compare-thumbs-group">
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Compare ({compareList.length}/3):
            </span>
            {compareList.map((p) => (
              <div key={p.id} className="compare-thumb-item">
                <img src={p.image} alt={p.name} />
                <button
                  className="compare-remove-x"
                  onClick={() => removeFromCompare(p.id)}
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setModalOpen(true)}
              disabled={compareList.length < 2}
            >
              {compareList.length < 2 ? "Select 1 more to compare" : "Compare Now →"}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={clearCompare}
              style={{ padding: "0.4rem 0.7rem" }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {modalOpen && (
        <>
          <div className="quickview-overlay" onClick={() => setModalOpen(false)} />
          <div className="compare-modal-window">
            <div className="compare-modal-header">
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>
                Side-by-Side Product Comparison
              </h2>
              <button
                className="quickview-close-btn"
                onClick={() => setModalOpen(false)}
                aria-label="Close comparison"
              >
                ✕
              </button>
            </div>

            <div className="compare-table-wrap">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Attributes</th>
                    {compareList.map((p) => (
                      <th key={p.id} style={{ width: `${80 / compareList.length}%`, textAlign: "center" }}>
                        <img src={p.image} alt={p.name} style={{ width: "100px", height: "100px", borderRadius: "10px", objectFit: "cover", margin: "0 auto 0.6rem" }} />
                        <div style={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1.3 }}>{p.name}</div>
                        <div style={{ color: "var(--accent)", fontWeight: 800, fontSize: "1.2rem", marginTop: "0.3rem" }}>
                          ${p.price.toFixed(2)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Category</strong></td>
                    {compareList.map((p) => (
                      <td key={p.id} style={{ textAlign: "center" }}>{p.categoryLabel}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Customer Rating</strong></td>
                    {compareList.map((p) => (
                      <td key={p.id} style={{ textAlign: "center" }}>
                        <span style={{ color: "#f59e0b", fontWeight: 700 }}>★ {p.rating}</span> ({p.reviewsCount} reviews)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Finishes / Colors</strong></td>
                    {compareList.map((p) => (
                      <td key={p.id} style={{ textAlign: "center" }}>
                        {p.colors ? p.colors.join(", ") : "Standard"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Key Features</strong></td>
                    {compareList.map((p) => (
                      <td key={p.id}>
                        <ul style={{ paddingLeft: "1.2rem", fontSize: "0.85rem", margin: 0 }}>
                          {p.features?.slice(0, 3).map((f, i) => (
                            <li key={i} style={{ marginBottom: "0.3rem" }}>{f}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Direct Order</strong></td>
                    {compareList.map((p) => (
                      <td key={p.id} style={{ textAlign: "center", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "200px", margin: "0 auto" }}>
                          <button
                            className="btn btn-whatsapp-order btn-sm"
                            onClick={() => handleWhatsApp(p)}
                          >
                            Order on WhatsApp
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleAddCart(p)}
                          >
                            + Add to Bag
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
