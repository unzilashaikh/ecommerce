import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";
import { STORE_CONFIG } from "../data/storeConfig";
import { openWhatsApp } from "../utils/whatsapp";

const CATEGORIES = [
  { key: "all", label: "All Products" },
  { key: "audio", label: "Audio & Sound" },
  { key: "workspace", label: "Workspace" },
  { key: "home", label: "Home & Lighting" },
  { key: "wearables", label: "Wearables" },
  { key: "lifestyle", label: "Lifestyle" },
];

export default function Shop({ onCartOpen, onQuickView }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState("default");
  const [priceMax, setPriceMax] = useState(500);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
    const q = searchParams.get("search");
    if (q) setSearch(q);
  }, [searchParams]);

  const handleCategory = (key) => {
    setCategory(key);
    const newParams = {};
    if (key !== "all") newParams.category = key;
    if (search) newParams.search = search;
    setSearchParams(newParams);
  };

  const filtered = PRODUCTS
    .filter((p) => category === "all" || p.category === category)
    .filter((p) => p.price <= priceMax)
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tagline.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const handleWhatsAppConsult = () => {
    const text = encodeURIComponent(
      `Salam! I am browsing the ${STORE_CONFIG.storeName} catalog and would like product recommendations.`
    );
    openWhatsApp(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`);
  };

  return (
    <main>
      <div className="section-container">
        {/* Header with WhatsApp Assistance Pill */}
        <div className="shop-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <h1 className="section-title" style={{ marginBottom: "0.25rem" }}>
              Curated Catalog
            </h1>
            <p className="section-subtitle" style={{ margin: 0 }}>
              Showing {filtered.length} exclusive product{filtered.length !== 1 ? "s" : ""} · Order any item instantly on WhatsApp
            </p>
          </div>

          <button
            className="btn btn-whatsapp-order btn-sm"
            onClick={handleWhatsAppConsult}
            style={{ borderRadius: "99px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.37C9.33 7.37 9 7.45 8.71 7.76C8.42 8.08 7.6 8.85 7.6 10.41C7.6 11.97 8.74 13.48 8.9 13.69C9.06 13.9 11.13 17.1 14.3 18.47C15.06 18.8 15.65 19 16.11 19.14C16.87 19.38 17.56 19.35 18.1 19.27C18.71 19.18 19.97 18.5 20.23 17.77C20.49 17.03 20.49 16.4 20.41 16.27C20.33 16.14 20.13 16.06 19.83 15.91C19.53 15.76 18.06 15.03 17.78 14.93C17.5 14.83 17.3 14.78 17.1 15.09C16.9 15.39 16.33 16.06 16.15 16.27C15.97 16.48 15.8 16.5 15.5 16.35C15.2 16.2 14.24 15.88 13.11 14.88C12.23 14.1 11.64 13.13 11.47 12.83C11.3 12.53 11.45 12.37 11.6 12.22C11.74 12.08 11.91 11.85 12.06 11.67C12.21 11.5 12.26 11.37 12.36 11.17C12.46 10.97 12.41 10.79 12.34 10.64C12.26 10.5 11.69 9.09 11.45 8.53C11.23 7.98 11 8.05 10.83 8.05C10.68 8.05 10.5 8.04 10.33 8.04C10.15 8.04 9.87 8.11 9.64 8.36C9.53 7.37 9.53 7.37 9.53 7.37Z"/>
            </svg>
            Ask for Recommendations on WhatsApp
          </button>
        </div>

        {/* Filters bar */}
        <div className="shop-filters-bar">
          <div className="filter-pills-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`filter-pill ${category === cat.key ? "active" : ""}`}
                onClick={() => handleCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="shop-search-sort-group">
            <div className="search-input-wrap">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0.5,
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="form-input search-input"
                placeholder="Search products, gear, audio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: "2.3rem" }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute",
                    right: "0.8rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ minWidth: "170px" }}
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display & Price Filter Slider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            padding: "0.75rem 1rem",
            background: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.5rem",
            fontSize: "0.86rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, color: "var(--text-secondary)" }}>Active Filter:</span>
            <span className="badge" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              Category: {CATEGORIES.find((c) => c.key === category)?.label}
            </span>
            {search && (
              <span className="badge" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                Query: "{search}"
              </span>
            )}
            <span className="badge" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              Max Price: ${priceMax}
            </span>
            {(category !== "all" || search || priceMax < 500) && (
              <button
                onClick={() => {
                  setCategory("all");
                  setSearch("");
                  setPriceMax(500);
                  setSearchParams({});
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent)",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  textDecoration: "underline",
                  marginLeft: "0.5rem",
                }}
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span>Price: Up to <strong>${priceMax}</strong></span>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              style={{ accentColor: "var(--accent)", cursor: "pointer", width: "120px" }}
            />
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="cart-empty-state" style={{ minHeight: "40vh" }}>
            <div style={{ fontSize: "3rem" }}>🔍</div>
            <h3>No products found</h3>
            <p>Try clearing your search or adjusting the price slider</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setPriceMax(500);
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="products-grid" style={{ marginTop: "1.8rem" }}>
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onCartOpen={onCartOpen}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
