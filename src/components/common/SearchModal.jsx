import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "../../data/products";

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const results = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.tagline.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelect = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  const handleFullSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const quickTerms = ["Headphones", "MagSafe", "Mechanical Keyboard", "Ceramic Lamp", "Titanium"];

  return (
    <>
      <div className="search-modal-overlay" onClick={onClose} />
      <div className="search-modal-container" role="dialog" aria-modal="true">
        <form onSubmit={handleFullSearch} className="search-modal-header">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            className="search-modal-input"
            placeholder="Search audio, lamps, titanium, keyboards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setQuery("")}
              aria-label="Clear query"
            >
              ✕
            </button>
          )}
          <button type="button" className="search-modal-esc" onClick={onClose}>
            ESC
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="search-quick-tags">
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
            Trending Searches:
          </span>
          {quickTerms.map((term) => (
            <button
              key={term}
              type="button"
              className="search-tag-pill"
              onClick={() => setQuery(term)}
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="search-modal-results">
          {query.trim() && results.length === 0 ? (
            <div className="search-empty-state">
              <span style={{ fontSize: "2.4rem", marginBottom: "0.5rem" }}>🔍</span>
              <p style={{ fontWeight: 700, margin: 0 }}>No matching pieces found for "{query}"</p>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Try searching for broader keywords like "audio", "lamp", or "desk"
              </span>
            </div>
          ) : results.length > 0 ? (
            <div className="search-results-list">
              {results.map((p) => (
                <div
                  key={p.id}
                  className="search-result-item"
                  onClick={() => handleSelect(p.id)}
                >
                  <img src={p.image} alt={p.name} className="search-result-thumb" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                      <span className="product-category-pill" style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem" }}>
                        {p.categoryLabel}
                      </span>
                      {p.badge && <span className="badge" style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem" }}>{p.badge}</span>}
                    </div>
                    <div className="search-result-name">{p.name}</div>
                    <div className="search-result-sub">{p.tagline}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--primary)" }}>
                      ${p.price.toFixed(2)}
                    </div>
                    {p.originalPrice && (
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                        ${p.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ textAlign: "center", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleFullSearch}
                >
                  View All Search Results for "{query}" →
                </button>
              </div>
            </div>
          ) : (
            <div className="search-initial-state">
              <div style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                Start typing to instantly search the curated Lumina catalog.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
