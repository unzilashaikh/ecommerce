import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getCartWhatsAppUrl, openWhatsApp } from "../utils/whatsapp";
import { STORE_CONFIG } from "../data/storeConfig";

export default function Cart() {
  const { state, dispatch, totals } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const navigate = useNavigate();
  const t = totals();
  const freeShipThreshold = STORE_CONFIG.freeShippingThreshold;
  const progress = Math.min((t.subtotal / freeShipThreshold) * 100, 100);

  const handleWhatsAppOrderCart = () => {
    if (state.items.length === 0) return;
    const url = getCartWhatsAppUrl(state.items, t);
    openWhatsApp(url);
  };

  if (state.items.length === 0) {
    return (
      <main className="section-container" style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <div style={{ fontSize: "4.5rem", marginBottom: "1rem" }}>🛍️</div>
        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Your shopping bag is empty</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", maxWidth: "460px", margin: "0 auto 2rem" }}>
          Browse our curated selection of audio, lighting, and living objects to begin.
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/shop")}>
          Explore All Products →
        </button>
      </main>
    );
  }

  return (
    <main>
      <div className="section-container">
        <h1 className="section-title" style={{ marginBottom: "0.4rem" }}>Shopping Bag</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          {state.items.length} item{state.items.length !== 1 ? "s" : ""} in your bag
        </p>

        {/* Free shipping progress bar */}
        {t.subtotal < freeShipThreshold ? (
          <div
            className="free-ship-bar"
            style={{
              marginBottom: "2rem",
              padding: "1rem 1.25rem",
              background: "var(--bg-subtle)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "0.9rem", marginBottom: "0.6rem", display: "flex", justifyContent: "space-between" }}>
              <span>
                Add <strong>${(freeShipThreshold - t.subtotal).toFixed(2)}</strong> more to get <strong>FREE express shipping</strong>!
              </span>
              <span style={{ fontWeight: 700, color: "var(--accent)" }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, var(--accent), #22c55e)",
                  borderRadius: "3px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              marginBottom: "2rem",
              padding: "0.9rem 1.25rem",
              background: "var(--success-bg)",
              borderRadius: "var(--radius-md)",
              color: "var(--success)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <span>🎉</span>
            <span>You have unlocked Complimentary Express Shipping!</span>
          </div>
        )}

        <div className="cart-page-layout">
          {/* Items List */}
          <div className="cart-items-list" style={{ flex: 2 }}>
            {state.items.map((item) => (
              <div
                key={`${item.id}-${item.color}`}
                className="cart-item-row"
                style={{
                  padding: "1.2rem",
                  marginBottom: "1rem",
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  gap: "1.2rem",
                  alignItems: "center",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                  style={{ width: "95px", height: "95px", borderRadius: "10px", objectFit: "cover" }}
                />
                <div className="cart-item-info" style={{ flex: 1 }}>
                  <div className="cart-item-name" style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                    {item.name}
                  </div>
                  <div className="cart-item-meta" style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "0.6rem" }}>
                    Color / Finish: <strong>{item.color}</strong>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
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
                    </div>
                    <strong style={{ fontSize: "1.1rem", color: "var(--primary)" }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </strong>
                    <button
                      className="btn btn-sm"
                      style={{
                        color: "var(--error)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        background: "transparent",
                      }}
                      onClick={() =>
                        dispatch({
                          type: "REMOVE_ITEM",
                          id: item.id,
                          color: item.color,
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & WhatsApp Checkout */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "1.8rem",
                position: "sticky",
                top: "100px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <h3 style={{ fontWeight: 800, fontSize: "1.15rem", marginBottom: "1.2rem" }}>
                Order Summary
              </h3>

              {/* Promo code */}
              <div style={{ marginBottom: "1.2rem" }}>
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
                      style={{ flex: 1, padding: "0.55rem 0.8rem", fontSize: "0.88rem" }}
                      placeholder="Promo code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                    />
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "0.55rem 0.9rem", fontSize: "0.88rem" }}
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
                  <p style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "0.3rem" }}>
                    {state.promoError}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.7rem",
                  fontSize: "0.92rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal</span>
                  <span>${t.subtotal.toFixed(2)}</span>
                </div>
                {t.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--success)" }}>
                    <span>Discount</span>
                    <span>-${t.discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Shipping</span>
                  <span>
                    {t.shipping === 0 ? (
                      <span style={{ color: "var(--success)" }}>Free Express</span>
                    ) : (
                      `$${t.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Estimated Tax (8%)</span>
                  <span>${t.tax.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    paddingTop: "0.8rem",
                    borderTop: "1px solid var(--border)",
                    color: "var(--primary)",
                  }}
                >
                  <span>Grand Total</span>
                  <span>${t.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Instant WhatsApp Order Button */}
              <button
                className="btn btn-whatsapp-order"
                style={{ width: "100%", marginTop: "1.4rem", padding: "0.95rem" }}
                onClick={handleWhatsAppOrderCart}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.37C9.33 7.37 9 7.45 8.71 7.76C8.42 8.08 7.6 8.85 7.6 10.41C7.6 11.97 8.74 13.48 8.9 13.69C9.06 13.9 11.13 17.1 14.3 18.47C15.06 18.8 15.65 19 16.11 19.14C16.87 19.38 17.56 19.35 18.1 19.27C18.71 19.18 19.97 18.5 20.23 17.77C20.49 17.03 20.49 16.4 20.41 16.27C20.33 16.14 20.13 16.06 19.83 15.91C19.53 15.76 18.06 15.03 17.78 14.93C17.5 14.83 17.3 14.78 17.1 15.09C16.9 15.39 16.33 16.06 16.15 16.27C15.97 16.48 15.8 16.5 15.5 16.35C15.2 16.2 14.24 15.88 13.11 14.88C12.23 14.1 11.64 13.13 11.47 12.83C11.3 12.53 11.45 12.37 11.6 12.22C11.74 12.08 11.91 11.85 12.06 11.67C12.21 11.5 12.26 11.37 12.36 11.17C12.46 10.97 12.41 10.79 12.34 10.64C12.26 10.5 11.69 9.09 11.45 8.53C11.23 7.98 11 8.05 10.83 8.05C10.68 8.05 10.5 8.04 10.33 8.04C10.15 8.04 9.87 8.11 9.64 8.36C9.53 7.37 9.53 7.37 9.53 7.37Z"/>
                </svg>
                Order Cart on WhatsApp
              </button>

              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "0.6rem", padding: "0.95rem" }}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout →
              </button>
              <button
                className="btn btn-secondary"
                style={{ width: "100%", marginTop: "0.6rem" }}
                onClick={() => navigate("/shop")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
