import { useLocation, useNavigate } from "react-router-dom";
import { STORE_CONFIG } from "../data/storeConfig";
import { openWhatsApp } from "../utils/whatsapp";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    return (
      <main className="section-container" style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <h2>No order found</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          You don't have an active order session.
        </p>
        <button className="btn btn-primary" onClick={() => navigate("/shop")}>
          Shop Now
        </button>
      </main>
    );
  }

  const trackerSteps = ["Order Placed", "Processing", "Shipped", "Delivered"];

  const handleWhatsAppUpdate = () => {
    const text = encodeURIComponent(
      `Salam! I am inquiring about my Order #${order.orderId} placed on ${order.date}. Customer Name: ${order.customerName}.`
    );
    openWhatsApp(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`);
  };

  return (
    <main>
      <div className="section-container" style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div className="order-success-card" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "2.5rem 2rem", textAlign: "center" }}>
          {/* Success Icon */}
          <div
            className="success-icon-wrap"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "var(--success-bg)",
              color: "var(--success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.2rem",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <span className="badge badge-success" style={{ marginBottom: "0.8rem" }}>Order Confirmed</span>
          <h1 style={{ fontSize: "2.2rem", marginBottom: "0.4rem", fontWeight: 800 }}>
            Thank You, {order.customerName.split(" ")[0]}!
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "2rem" }}>
            Order receipt and status have been dispatched for <strong>{order.customerName}</strong>.
          </p>

          {/* Tracker Timeline */}
          <div
            className="order-tracker-timeline"
            style={{
              display: "flex",
              justifyContent: "space-between",
              position: "relative",
              margin: "2rem 0",
              padding: "0 1rem",
            }}
          >
            {trackerSteps.map((step, i) => (
              <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: i === 0 ? "var(--success)" : i === 1 ? "var(--accent)" : "var(--bg-subtle)",
                    color: i <= 1 ? "#fff" : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    border: "2px solid var(--border)",
                  }}
                >
                  {i === 0 ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "0.8rem", marginTop: "0.5rem", fontWeight: i <= 1 ? 600 : 400, color: i <= 1 ? "var(--text-primary)" : "var(--text-muted)" }}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Receipt */}
          <div
            className="order-receipt-summary"
            style={{
              textAlign: "left",
              background: "var(--bg-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              marginTop: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "1rem",
                marginBottom: "1.2rem",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.78rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Order Reference</div>
                <strong style={{ fontFamily: "monospace", fontSize: "1.1rem", color: "var(--primary)" }}>{order.orderId}</strong>
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Order Date</div>
                <strong>{order.date}</strong>
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Est. Delivery</div>
                <strong style={{ color: "var(--success)" }}>3–5 Business Days</strong>
              </div>
            </div>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.2rem" }}>
              {order.items.map((item) => (
                <div key={`${item.id}-${item.color}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                    <img src={item.image} alt={item.name} style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover" }} />
                    <div>
                      <strong>{item.name}</strong>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Qty: {item.quantity} · {item.color}</div>
                    </div>
                  </div>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.8rem", display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: 800 }}>
              <span>Total Paid / Due</span>
              <span style={{ color: "var(--primary)" }}>${order.totals.total.toFixed(2)}</span>
            </div>

            <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <strong>Ship to:</strong> {order.shippingAddress}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn btn-whatsapp-order" onClick={handleWhatsAppUpdate}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.37C9.33 7.37 9 7.45 8.71 7.76C8.42 8.08 7.6 8.85 7.6 10.41C7.6 11.97 8.74 13.48 8.9 13.69C9.06 13.9 11.13 17.1 14.3 18.47C15.06 18.8 15.65 19 16.11 19.14C16.87 19.38 17.56 19.35 18.1 19.27C18.71 19.18 19.97 18.5 20.23 17.77C20.49 17.03 20.49 16.4 20.41 16.27C20.33 16.14 20.13 16.06 19.83 15.91C19.53 15.76 18.06 15.03 17.78 14.93C17.5 14.83 17.3 14.78 17.1 15.09C16.9 15.39 16.33 16.06 16.15 16.27C15.97 16.48 15.8 16.5 15.5 16.35C15.2 16.2 14.24 15.88 13.11 14.88C12.23 14.1 11.64 13.13 11.47 12.83C11.3 12.53 11.45 12.37 11.6 12.22C11.74 12.08 11.91 11.85 12.06 11.67C12.21 11.5 12.26 11.37 12.36 11.17C12.46 10.97 12.41 10.79 12.34 10.64C12.26 10.5 11.69 9.09 11.45 8.53C11.23 7.98 11 8.05 10.83 8.05C10.68 8.05 10.5 8.04 10.33 8.04C10.15 8.04 9.87 8.11 9.64 8.36C9.53 7.37 9.53 7.37 9.53 7.37Z"/>
              </svg>
              Track / Chat on WhatsApp
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/shop")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
