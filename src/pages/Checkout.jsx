import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getCartWhatsAppUrl, openWhatsApp } from "../utils/whatsapp";
import { STORE_CONFIG } from "../data/storeConfig";

export default function Checkout() {
  const { state, dispatch, totals } = useCart();
  const navigate = useNavigate();
  const t = totals();
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("whatsapp");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
    cardNumber: "",
    cardName: "",
    cardExp: "",
    cardCvv: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const shippingCost = shipping === "express" ? 25 : t.shipping;
  const expressExtra = shipping === "express" ? 25 : 0;
  const grandTotal = t.total + expressExtra;

  const validate = (isWhatsApp = false) => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.address.trim()) e.address = "Delivery address is required";
    if (!form.city.trim()) e.city = "City is required";

    if (!isWhatsApp && payment === "card") {
      if (!form.cardNumber || form.cardNumber.replace(/\s/g, "").length < 13)
        e.cardNumber = "Valid card number required";
      if (!form.cardName) e.cardName = "Cardholder name required";
      if (!form.cardExp || !/^\d{2}\/\d{2}$/.test(form.cardExp))
        e.cardExp = "MM/YY format";
      if (!form.cardCvv || form.cardCvv.length < 3) e.cardCvv = "CVV required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleWhatsAppCheckout = () => {
    if (!validate(true)) return;
    const customerInfo = {
      name: form.fullName,
      phone: form.phone,
      address: form.address,
      city: form.city,
      notes: form.notes,
    };
    const orderTotals = { ...t, shipping: shippingCost, total: grandTotal };
    const url = getCartWhatsAppUrl(state.items, orderTotals, customerInfo);
    openWhatsApp(url);

    // Also create order record in confirmation
    const orderId = `LUM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderData = {
      orderId,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      customerName: form.fullName,
      email: form.email || `${form.phone}@whatsapp.order`,
      shippingAddress: `${form.address}, ${form.city}`,
      items: state.items,
      totals: orderTotals,
      paymentMethod: "WhatsApp Direct Order",
    };
    dispatch({ type: "CLEAR_CART" });
    navigate("/order-confirmation", { state: { order: orderData } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (payment === "whatsapp") {
      handleWhatsAppCheckout();
      return;
    }

    if (!validate(false)) return;
    setProcessing(true);
    setTimeout(() => {
      const orderId = `LUM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderData = {
        orderId,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        customerName: form.fullName,
        email: form.email || `${form.phone}@customer.com`,
        shippingAddress: `${form.address}, ${form.city}`,
        items: state.items,
        totals: { ...t, shipping: shippingCost, total: grandTotal },
        paymentMethod: payment === "cod" ? "Cash on Delivery" : "Credit Card",
      };
      dispatch({ type: "CLEAR_CART" });
      navigate("/order-confirmation", { state: { order: orderData } });
    }, 1200);
  };

  if (state.items.length === 0) {
    return (
      <main className="section-container" style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <h2>Your cart is empty</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <button className="btn btn-primary" onClick={() => navigate("/shop")}>
          Shop Now
        </button>
      </main>
    );
  }

  return (
    <main>
      <div className="section-container">
        <h1 className="section-title" style={{ marginBottom: "0.25rem" }}>Complete Your Order</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          Place your order directly via WhatsApp or standard payment
        </p>

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            {/* Left Column: Customer and Shipping */}
            <div style={{ flex: 1.6, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* WhatsApp Preferred Banner */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(37, 211, 102, 0.12) 0%, rgba(18, 140, 126, 0.08) 100%)",
                  border: "1px solid rgba(37, 211, 102, 0.35)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.2rem 1.4rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "#25D366",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.37C9.33 7.37 9 7.45 8.71 7.76C8.42 8.08 7.6 8.85 7.6 10.41C7.6 11.97 8.74 13.48 8.9 13.69C9.06 13.9 11.13 17.1 14.3 18.47C15.06 18.8 15.65 19 16.11 19.14C16.87 19.38 17.56 19.35 18.1 19.27C18.71 19.18 19.97 18.5 20.23 17.77C20.49 17.03 20.49 16.4 20.41 16.27C20.33 16.14 20.13 16.06 19.83 15.91C19.53 15.76 18.06 15.03 17.78 14.93C17.5 14.83 17.3 14.78 17.1 15.09C16.9 15.39 16.33 16.06 16.15 16.27C15.97 16.48 15.8 16.5 15.5 16.35C15.2 16.2 14.24 15.88 13.11 14.88C12.23 14.1 11.64 13.13 11.47 12.83C11.3 12.53 11.45 12.37 11.6 12.22C11.74 12.08 11.91 11.85 12.06 11.67C12.21 11.5 12.26 11.37 12.36 11.17C12.46 10.97 12.41 10.79 12.34 10.64C12.26 10.5 11.69 9.09 11.45 8.53C11.23 7.98 11 8.05 10.83 8.05C10.68 8.05 10.5 8.04 10.33 8.04C10.15 8.04 9.87 8.11 9.64 8.36C9.53 7.37 9.53 7.37 9.53 7.37Z"/>
                  </svg>
                </div>
                <div>
                  <strong style={{ fontSize: "1rem", color: "#166534", display: "block" }}>
                    Instant WhatsApp Checkout
                  </strong>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    You can place this order directly through our official WhatsApp support for fast human confirmation.
                  </span>
                </div>
              </div>

              {/* Shipping info */}
              <div className="checkout-section-card">
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  1. Contact &amp; Shipping Details
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Sarah Jenkins"
                      value={form.fullName}
                      onChange={set("fullName")}
                    />
                    {errors.fullName && <span style={{ color: "var(--error)", fontSize: "0.8rem" }}>{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Phone / WhatsApp Number *</label>
                    <input
                      className="form-input"
                      placeholder="e.g. +92 300 1234567"
                      value={form.phone}
                      onChange={set("phone")}
                    />
                    {errors.phone && <span style={{ color: "var(--error)", fontSize: "0.8rem" }}>{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address (Optional)</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="sarah@example.com"
                    value={form.email}
                    onChange={set("email")}
                  />
                </div>

                <div className="form-group">
                  <label>Street Delivery Address *</label>
                  <input
                    className="form-input"
                    placeholder="House / Apartment #, Street Name, Area"
                    value={form.address}
                    onChange={set("address")}
                  />
                  {errors.address && <span style={{ color: "var(--error)", fontSize: "0.8rem" }}>{errors.address}</span>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Karachi / Lahore / New York"
                      value={form.city}
                      onChange={set("city")}
                    />
                    {errors.city && <span style={{ color: "var(--error)", fontSize: "0.8rem" }}>{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label>Special Delivery Notes</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Leave with security / Call upon arrival"
                      value={form.notes}
                      onChange={set("notes")}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Speed */}
              <div className="checkout-section-card">
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  2. Delivery Option
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem",
                      border: `1.5px solid ${shipping === "standard" ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      background: shipping === "standard" ? "var(--bg-subtle)" : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <input
                        type="radio"
                        name="shipping"
                        checked={shipping === "standard"}
                        onChange={() => setShipping("standard")}
                      />
                      <div>
                        <strong>Standard Insured Delivery (3–5 Business Days)</strong>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                          Complimentary white-glove packaging
                        </div>
                      </div>
                    </div>
                    <strong>{t.shipping === 0 ? "FREE" : `$${t.shipping.toFixed(2)}`}</strong>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem",
                      border: `1.5px solid ${shipping === "express" ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      background: shipping === "express" ? "var(--bg-subtle)" : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <input
                        type="radio"
                        name="shipping"
                        checked={shipping === "express"}
                        onChange={() => setShipping("express")}
                      />
                      <div>
                        <strong>Priority Express Air Delivery (1–2 Business Days)</strong>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                          Guaranteed priority queue dispatch
                        </div>
                      </div>
                    </div>
                    <strong>$25.00</strong>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-section-card">
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  3. Payment &amp; Confirmation Method
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                      padding: "1rem",
                      border: `1.5px solid ${payment === "whatsapp" ? "#22c55e" : "var(--border)"}`,
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      background: payment === "whatsapp" ? "rgba(34, 197, 94, 0.08)" : "transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === "whatsapp"}
                      onChange={() => setPayment("whatsapp")}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: "#15803d", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        Confirm &amp; Pay via WhatsApp (Recommended)
                      </strong>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                        Send your order details straight to our WhatsApp. Pay via Bank Transfer, EasyPaisa, JazzCash, or Cash on Delivery.
                      </span>
                    </div>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                      padding: "1rem",
                      border: `1.5px solid ${payment === "cod" ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      background: payment === "cod" ? "var(--bg-subtle)" : "transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === "cod"}
                      onChange={() => setPayment("cod")}
                    />
                    <div>
                      <strong>Cash on Delivery (COD)</strong>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        Pay cash upon delivery to your doorstep
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                      padding: "1rem",
                      border: `1.5px solid ${payment === "card" ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      background: payment === "card" ? "var(--bg-subtle)" : "transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === "card"}
                      onChange={() => setPayment("card")}
                    />
                    <div>
                      <strong>Credit / Debit Card (Online)</strong>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        Visa, Mastercard, American Express
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
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
                  Items in Order ({state.items.length})
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", maxHeight: "260px", overflowY: "auto", marginBottom: "1.2rem" }}>
                  {state.items.map((item) => (
                    <div key={`${item.id}-${item.color}`} style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                      <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                      <div style={{ flex: 1, fontSize: "0.88rem" }}>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Qty: {item.quantity} · {item.color}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.9rem" }}>
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
                    <span>{shippingCost === 0 ? <span style={{ color: "var(--success)" }}>Free</span> : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Tax (8%)</span>
                    <span>${t.tax.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "1.2rem", paddingTop: "0.8rem", borderTop: "1px solid var(--border)", color: "var(--primary)" }}>
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Primary WhatsApp Action */}
                <button
                  type="button"
                  className="btn btn-whatsapp-order"
                  style={{ width: "100%", marginTop: "1.5rem", padding: "1rem" }}
                  onClick={handleWhatsAppCheckout}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.37C9.33 7.37 9 7.45 8.71 7.76C8.42 8.08 7.6 8.85 7.6 10.41C7.6 11.97 8.74 13.48 8.9 13.69C9.06 13.9 11.13 17.1 14.3 18.47C15.06 18.8 15.65 19 16.11 19.14C16.87 19.38 17.56 19.35 18.1 19.27C18.71 19.18 19.97 18.5 20.23 17.77C20.49 17.03 20.49 16.4 20.41 16.27C20.33 16.14 20.13 16.06 19.83 15.91C19.53 15.76 18.06 15.03 17.78 14.93C17.5 14.83 17.3 14.78 17.1 15.09C16.9 15.39 16.33 16.06 16.15 16.27C15.97 16.48 15.8 16.5 15.5 16.35C15.2 16.2 14.24 15.88 13.11 14.88C12.23 14.1 11.64 13.13 11.47 12.83C11.3 12.53 11.45 12.37 11.6 12.22C11.74 12.08 11.91 11.85 12.06 11.67C12.21 11.5 12.26 11.37 12.36 11.17C12.46 10.97 12.41 10.79 12.34 10.64C12.26 10.5 11.69 9.09 11.45 8.53C11.23 7.98 11 8.05 10.83 8.05C10.68 8.05 10.5 8.04 10.33 8.04C10.15 8.04 9.87 8.11 9.64 8.36C9.53 7.37 9.53 7.37 9.53 7.37Z"/>
                  </svg>
                  Place Order on WhatsApp
                </button>

                {payment !== "whatsapp" && (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "0.6rem", padding: "0.95rem" }}
                    disabled={processing}
                  >
                    {processing ? "Processing Order..." : `Place Order — $${grandTotal.toFixed(2)}`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
