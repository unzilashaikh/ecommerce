import { createContext, useContext, useState } from "react";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  const isInCompare = (id) => compareList.some((p) => p.id === id);

  const addToCompare = (product) => {
    if (isInCompare(product.id)) {
      setCompareList((prev) => prev.filter((p) => p.id !== product.id));
      return { added: false, message: "Removed from comparison" };
    }
    if (compareList.length >= 3) {
      return { added: false, message: "You can compare up to 3 products at a time" };
    }
    setCompareList((prev) => [...prev, product]);
    return { added: true, message: `Added ${product.name} to compare` };
  };

  const removeFromCompare = (id) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        compareCount: compareList.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
