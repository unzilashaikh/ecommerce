import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

const CartContext = createContext(null);

const PROMO_CODES = {
  LUMINA15: { type: "percent", value: 15 },
  SAVE20:   { type: "percent", value: 20, minOrder: 200 },
  FREESHIP: { type: "freeship" },
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.id === action.payload.id && i.color === action.payload.color
      );
      const items = existing
        ? state.items.map((i) =>
            i.id === action.payload.id && i.color === action.payload.color
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          )
        : [...state.items, action.payload];
      return { ...state, items };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => !(i.id === action.id && i.color === action.color)) };
    case "UPDATE_QTY": {
      if (action.qty < 1) return { ...state, items: state.items.filter((i) => !(i.id === action.id && i.color === action.color)) };
      return { ...state, items: state.items.map((i) => i.id === action.id && i.color === action.color ? { ...i, quantity: action.qty } : i) };
    }
    case "APPLY_PROMO": {
      const code = action.code.toUpperCase();
      const promo = PROMO_CODES[code];
      if (!promo) return { ...state, promoError: "Invalid promo code." };
      const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
      if (promo.minOrder && subtotal < promo.minOrder) return { ...state, promoError: `Minimum order $${promo.minOrder} required.` };
      return { ...state, appliedPromo: { code, ...promo }, promoError: "" };
    }
    case "REMOVE_PROMO":
      return { ...state, appliedPromo: null, promoError: "" };
    case "CLEAR_CART":
      return { ...state, items: [], appliedPromo: null };
    default:
      return state;
  }
}

function loadCart() {
  try { return JSON.parse(localStorage.getItem("lumina_cart") || "null") || { items: [], appliedPromo: null, promoError: "" }; }
  catch { return { items: [], appliedPromo: null, promoError: "" }; }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem("lumina_cart", JSON.stringify(state));
  }, [state]);

  const totals = useCallback(() => {
    const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
    let discount = 0;
    if (state.appliedPromo) {
      if (state.appliedPromo.type === "percent") discount = subtotal * (state.appliedPromo.value / 100);
    }
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * 0.08;
    const shipping = afterDiscount >= 150 || (state.appliedPromo?.type === "freeship") ? 0 : 12.95;
    return { subtotal, discount, tax, shipping, total: afterDiscount + tax + shipping };
  }, [state]);

  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ state, dispatch, totals, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
