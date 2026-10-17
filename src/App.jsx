import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ToastProvider } from "./context/ToastContext";
import { CompareProvider } from "./context/CompareContext";

import ScrollToTop from "./components/common/ScrollToTop";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/layout/CartDrawer";
import FloatingWhatsApp from "./components/common/FloatingWhatsApp";
import ToastContainer from "./components/common/ToastContainer";
import QuickViewModal from "./components/common/QuickViewModal";
import SearchModal from "./components/common/SearchModal";
import CompareDrawer from "./components/common/CompareDrawer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Offers from "./pages/Offers";
import Wishlist from "./pages/Wishlist";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ToastProvider>
      <WishlistProvider>
        <CompareProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Header
                onCartOpen={() => setCartOpen(true)}
                onSearchOpen={() => setSearchOpen(true)}
              />
              <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
              
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      onCartOpen={() => setCartOpen(true)}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <Shop
                      onCartOpen={() => setCartOpen(true)}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  }
                />
                <Route
                  path="/offers"
                  element={
                    <Offers
                      onCartOpen={() => setCartOpen(true)}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <Wishlist
                      onCartOpen={() => setCartOpen(true)}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  }
                />
                <Route
                  path="/product/:id"
                  element={<ProductDetail onCartOpen={() => setCartOpen(true)} />}
                />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>

              <Footer />

              {/* Floating Helper Tools */}
              <FloatingWhatsApp />
              <CompareDrawer onCartOpen={() => setCartOpen(true)} />
              <ToastContainer />

              {/* Modals */}
              <QuickViewModal
                product={quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onCartOpen={() => setCartOpen(true)}
              />
              <SearchModal
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
              />
            </BrowserRouter>
          </CartProvider>
        </CompareProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}
