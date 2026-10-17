import { useNavigate } from "react-router-dom";
import { STORE_CONFIG } from "../data/storeConfig";
import { openWhatsApp } from "../utils/whatsapp";

export default function About() {
  const navigate = useNavigate();

  const values = [
    { icon: "🎯", title: "Obsessive Curation", desc: "Every product in our collection is personally tested and benchmarked against 200+ competitors. We only list what we would actually buy ourselves." },
    { icon: "🌿", title: "Sustainable by Design", desc: "We prioritize materials that are sustainably sourced, machined to aerospace tolerances, and built to last decades without planned obsolescence." },
    { icon: "💬", title: "Human Atelier Support", desc: "Reach real specialists instantly via WhatsApp. No chatbot loops, no robotic answering machines — just real product lovers ready to guide you." },
  ];

  const stats = [
    { num: "12,000+", label: "Happy Customers" },
    { num: "4.9 ★", label: "Average Review Score" },
    { num: "24/7", label: "WhatsApp Human Support" },
    { num: "30-Day", label: "Zero-Risk Guarantee" },
  ];

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Salam! I would like to learn more about ${STORE_CONFIG.storeName} studio products.`
    );
    openWhatsApp(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`);
  };

  return (
    <main>
      <section style={{ background: "linear-gradient(135deg, #0d1017 0%, #171b24 100%)", color: "#ffffff", padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div className="hero-eyebrow" style={{ color: "var(--accent)" }}>The Lumina Atelier</div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1.2rem", color: "#ffffff" }}>
            We Believe Objects Should <span className="hero-accent">Mean Something</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#94a3b8", lineHeight: 1.8 }}>
            LUMINA was founded on a simple conviction: when design, acoustics, and tactile craftsmanship harmonize, everyday rituals become moments of calm and inspiration.
          </p>
        </div>
      </section>

      <section className="section-container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem", textAlign: "center" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ padding: "2rem 1rem", background: "var(--bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--primary)", marginBottom: "0.4rem" }}>{s.num}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container" style={{ background: "var(--bg-subtle)" }}>
        <div className="section-header">
          <h2 className="section-title">Our Guiding Pillars</h2>
        </div>
        <div className="pillars-grid">
          {values.map((v) => (
            <div key={v.title} className="pillar-card">
              <div className="pillar-icon" style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{v.icon}</div>
              <h3 className="pillar-title">{v.title}</h3>
              <p className="pillar-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container">
        <div style={{ maxWidth: "700px", margin: "0 auto", lineHeight: 1.9, color: "var(--text-secondary)", fontSize: "1.05rem", textAlign: "center" }}>
          <h2 className="section-title" style={{ marginBottom: "1.5rem" }}>Curated with Integrity</h2>
          <p style={{ marginBottom: "1.4rem" }}>
            We do not follow trends or inflate our catalog with disposable gadgets. Each headphone, mechanical board, ceramic lamp, and timepiece is selected because it exemplifies timeless materials and engineering mastery.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate("/shop")}>
              Browse Collection →
            </button>
            <button className="btn btn-whatsapp-order btn-lg" onClick={handleWhatsAppChat}>
              Chat with Our Curators
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}