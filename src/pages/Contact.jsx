import { useState } from "react";
import { STORE_CONFIG } from "../data/storeConfig";
import { openWhatsApp } from "../utils/whatsapp";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ticketId] = useState(`TKT-${Math.floor(100000 + Math.random() * 900000)}`);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Salam! I am reaching out through the contact page for inquiries regarding ${STORE_CONFIG.storeName}.`
    );
    openWhatsApp(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`);
  };

  const channels = [
    {
      icon: "💬",
      title: "WhatsApp Direct",
      detail: STORE_CONFIG.displayPhone,
      sub: "Instant response · Mon–Sun",
      isWhatsApp: true,
    },
    {
      icon: "✉️",
      title: "Email Atelier",
      detail: STORE_CONFIG.supportEmail,
      sub: "Response within 24 hours",
    },
    {
      icon: "📍",
      title: "Design Studio",
      detail: "12 Atelier Row, Studio District",
      sub: "Visits by appointment",
    },
  ];

  return (
    <main>
      <section style={{ background: "linear-gradient(135deg, #0d1017 0%, #171b24 100%)", color: "#ffffff", padding: "4rem 2rem", textAlign: "center" }}>
        <div className="hero-eyebrow" style={{ color: "var(--accent)" }}>Direct Concierge</div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, marginBottom: "0.8rem", color: "#fff" }}>
          We Are Here For You
        </h1>
        <p style={{ color: "#94a3b8", maxWidth: "520px", margin: "0 auto" }}>
          Have a question about a product, custom finish, or delivery? Reach our concierge team via WhatsApp or email.
        </p>
      </section>

      <div className="section-container">
        {/* Channels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3.5rem" }}>
          {channels.map((c) => (
            <div
              key={c.title}
              className="pillar-card"
              style={{
                textAlign: "center",
                cursor: c.isWhatsApp ? "pointer" : "default",
                border: c.isWhatsApp ? "1.5px solid #22c55e" : "1px solid var(--border)",
                background: c.isWhatsApp ? "rgba(34, 197, 94, 0.05)" : "var(--bg-card)",
              }}
              onClick={c.isWhatsApp ? handleWhatsAppDirect : undefined}
            >
              <div className="pillar-icon" style={{ fontSize: "2.4rem", marginBottom: "0.5rem" }}>{c.icon}</div>
              <h3 className="pillar-title">{c.title}</h3>
              <p style={{ fontWeight: 700, marginBottom: "0.2rem", color: c.isWhatsApp ? "#16a34a" : "var(--primary)" }}>
                {c.detail}
              </p>
              <p className="pillar-desc">{c.sub}</p>
              {c.isWhatsApp && (
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "0.8rem",
                    padding: "0.3rem 0.8rem",
                    background: "#22c55e",
                    color: "#fff",
                    borderRadius: "99px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                  }}
                >
                  Start WhatsApp Chat →
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "3rem 2rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>✓</div>
              <h2 style={{ marginBottom: "0.5rem" }}>Message Received!</h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Your inquiry reference is <strong style={{ color: "var(--primary)", fontFamily: "monospace" }}>{ticketId}</strong>
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Our team will reply to <strong>{form.email}</strong> within 24 hours.
              </p>
              <button className="btn btn-whatsapp-order" onClick={handleWhatsAppDirect}>
                Need faster response? Message on WhatsApp
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "2.5rem" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.5rem" }}>Send an Inquiry</h2>

              <div className="form-group">
                <label>Your Name *</label>
                <input className="form-input" placeholder="e.g. Liam Vance" value={form.name} onChange={set("name")} />
                {errors.name && <span style={{ color: "var(--error)", fontSize: "0.8rem" }}>{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input className="form-input" type="email" placeholder="liam@example.com" value={form.email} onChange={set("email")} />
                {errors.email && <span style={{ color: "var(--error)", fontSize: "0.8rem" }}>{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input className="form-input" placeholder="Product question, warranty, or custom order" value={form.subject} onChange={set("subject")} />
                {errors.subject && <span style={{ color: "var(--error)", fontSize: "0.8rem" }}>{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea className="form-input" rows="4" placeholder="How can our atelier help you today?" value={form.message} onChange={set("message")} />
                {errors.message && <span style={{ color: "var(--error)", fontSize: "0.8rem" }}>{errors.message}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "0.5rem" }}>
                Submit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
