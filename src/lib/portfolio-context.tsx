"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Product, Portfolio } from "./types";

const STORAGE_KEY = "circularity-matrix-portfolio";

interface PortfolioContextValue {
  portfolio: Portfolio;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearPortfolio: () => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

function loadPortfolio(): Portfolio {
  if (typeof window === "undefined") return { products: [] };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Portfolio;
    }
  } catch {
    // Ignore parse errors
  }
  return { products: [] };
}

function savePortfolio(portfolio: Portfolio) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  } catch {
    // Ignore storage errors
  }
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<Portfolio>({ products: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPortfolio(loadPortfolio());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      savePortfolio(portfolio);
    }
  }, [portfolio, loaded]);

  const addProduct = useCallback((product: Product) => {
    setPortfolio((prev) => ({
      products: [...prev.products, product],
    }));
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setPortfolio((prev) => ({
      products: prev.products.filter((p) => p.id !== productId),
    }));
  }, []);

  const clearPortfolio = useCallback(() => {
    setPortfolio({ products: [] });
  }, []);

  return (
    <PortfolioContext.Provider
      value={{ portfolio, addProduct, removeProduct, clearPortfolio }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx)
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  return ctx;
}
