import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getCartWhatsAppUrl, openWhatsApp } from "../../utils/whatsapp";
import { STORE_CONFIG } from "../../data/storeConfig";

export default function CartDrawer({ open, onClose }) {
  const { state, dispatch, totals, itemCount } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const navigate = useNavigate();
  const t = totals();

  const goCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const goCart = () => {
    onClose();
    navigate("/cart");
  };

  const handleWhatsAppOrderCart = () => {
    if (state.items.length === 0) return;
    const url = getCartWhatsAppUrl(state.items, t);
    openWhatsApp(url);
  };

  return (
    <>
      <div
        className={`cart-drawer-overlay ${open ? "active" : ""}`}
        onClick={onClose}
      />
      <div className={`cart-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="cart-drawer-header">
          <span className="cart-drawer-title">
            Your Bag{" "}
            <span
              className="cart-badge"
              style={{ position: "static", marginLeft: "0.5rem" }}
            >
              {itemCount}
            </span>
          </span>
          <button className="icon-btn" onClick={onClose} aria-label="Close cart">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cart-drawer-body">
          {state.items.length === 0 ? (
            <div className="cart-empty-state">
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🛍️</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Your cart is empty
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Discover our hand-crafted acoustic and living collections.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  navigate("/shop");
                }}
              >
                Browse Shop
              </button>
            </div>
          ) : (
            <>
              {/* Free shipping progress */}
              {t.subtotal < STORE_CONFIG.freeShippingThreshold ? (
                <div
                  style={{
                    padding: "0.8rem 1.5rem",
                    background: "var(--bg-subtle)",
                    fontSize: "0.82rem",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  Add{" "}
                  <strong>
                    ${(STORE_CONFIG.freeShippingThreshold - t.subtotal).toFixed(2)}
                  </strong>{" "}
                  more for <strong>FREE Shipping</strong>!
                </div>
              ) : (
                <div
                  style={{
                    padding: "0.8rem 1.5rem",
                    background: "var(--success-bg)",
                    color: "var(--success)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  🎉 You unlocked Free Tracked Delivery!
                </div>
              )}

              <div className="cart-items-list">
                {state.items.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="cart-item-row">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-img"
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-meta">{item.color}</div>
                      <div className="cart-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QTY",
                              id: item.id,
                              color: item.color,
                              qty: item.quantity - 1,
                            })
                          }
                        >
                          -
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QTY",
                              id: item.id,
                              color: item.color,
                              qty: item.quantity + 1,
                            })
                          }
                        >
                          +
                        </button>
                        <button
                          className="qty-btn remove-btn"
                          style={{ marginLeft: "0.5rem" }}
                          onClick={() =>
                            dispatch({
                              type: "REMOVE_ITEM",
                              id: item.id,
                              color: item.color,
                            })
                          }
                          title="Remove item"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6m4-6v6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo code */}
              <div style={{ padding: "0.8rem 1.5rem", borderTop: "1px solid var(--border)" }}>
                {state.appliedPromo ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "var(--bg-subtle)",
                      padding: "0.6rem 1rem",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <span style={{ color: "var(--success)", fontWeight: 600, fontSize: "0.85rem" }}>
                      ✓ {state.appliedPromo.code} applied
                    </span>
                    <button
                      className="btn"
                      style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}
                      onClick={() => dispatch({ type: "REMOVE_PROMO" })}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      className="form-input"
                      style={{ flex: 1, padding: "0.5rem 0.8rem", fontSize: "0.85rem" }}
                      placeholder="Promo code (e.g. LUMINA15)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                    />
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "0.5rem 0.8rem", fontSize: "0.85rem" }}
                      onClick={() => {
                        dispatch({ type: "APPLY_PROMO", code: promoInput });
                        setPromoInput("");
                      }}
                    >
                      Apply
                    </button>
                  </div>
                )}
                {state.promoError && (
                  <p style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                    {state.promoError}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="cart-drawer-totals">
                <div className="cart-total-row">
                  <span>Subtotal</span>
                  <span>${t.subtotal.toFixed(2)}</span>
                </div>
                {t.discount > 0 && (
                  <div className="cart-total-row" style={{ color: "var(--success)" }}>
                    <span>Discount</span>
                    <span>-${t.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="cart-total-row">
                  <span>Shipping</span>
                  <span>
                    {t.shipping === 0 ? (
                      <span style={{ color: "var(--success)" }}>Free</span>
                    ) : (
                      `$${t.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="cart-total-row cart-grand-total">
                  <span>Total</span>
                  <span>${t.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions with WhatsApp order priority */}
              <div className="cart-drawer-actions" style={{ flexDirection: "column", gap: "0.6rem" }}>
                {/* Direct WhatsApp Order button for all items */}
                <button
                  className="btn btn-whatsapp-order"
                  style={{ width: "100%", padding: "0.85rem 1rem" }}
                  onClick={handleWhatsAppOrderCart}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.37C9.33 7.37 9 7.45 8.71 7.76C8.42 8.08 7.6 8.85 7.6 10.41C7.6 11.97 8.74 13.48 8.9 13.69C9.06 13.9 11.13 17.1 14.3 18.47C15.06 18.8 15.65 19 16.11 19.14C16.87 19.38 17.56 19.35 18.1 19.27C18.71 19.18 19.97 18.5 20.23 17.77C20.49 17.03 20.49 16.4 20.41 16.27C20.33 16.14 20.13 16.06 19.83 15.91C19.53 15.76 18.06 15.03 17.78 14.93C17.5 14.83 17.3 14.78 17.1 15.09C16.9 15.39 16.33 16.06 16.15 16.27C15.97 16.48 15.8 16.5 15.5 16.35C15.2 16.2 14.24 15.88 13.11 14.88C12.23 14.1 11.64 13.13 11.47 12.83C11.3 12.53 11.45 12.37 11.6 12.22C11.74 12.08 11.91 11.85 12.06 11.67C12.21 11.5 12.26 11.37 12.36 11.17C12.46 10.97 12.41 10.79 12.34 10.64C12.26 10.5 11.69 9.09 11.45 8.53C11.23 7.98 11 8.05 10.83 8.05C10.68 8.05 10.5 8.04 10.33 8.04C10.15 8.04 9.87 8.11 9.64 8.36C9.53 7.37 9.53 7.37 9.53 7.37Z"/>
                  </svg>
                  Order via WhatsApp (${t.total.toFixed(2)})
                </button>

                <div style={{ display: "flex", gap: "0.6rem", width: "100%" }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={goCart}>
                    View Bag
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={goCheckout}>
                    Checkout →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
