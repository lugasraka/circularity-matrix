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
const ONBOARDING_KEY = "circularity-matrix-onboarding-seen";

interface PortfolioContextValue {
  portfolio: Portfolio;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  removeProduct: (productId: string) => void;
  clearPortfolio: () => void;
  duplicateProduct: (productId: string) => void;
  importProducts: (products: Product[], merge?: boolean) => void;
  // Onboarding
  hasSeenOnboarding: boolean;
  markOnboardingSeen: () => void;
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

function loadOnboardingStatus(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return false;
  }
}

function saveOnboardingStatus(seen: boolean) {
  try {
    localStorage.setItem(ONBOARDING_KEY, seen ? "true" : "false");
  } catch {
    // Ignore storage errors
  }
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<Portfolio>({ products: [] });
  const [loaded, setLoaded] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    setPortfolio(loadPortfolio());
    setHasSeenOnboarding(loadOnboardingStatus());
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

  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setPortfolio((prev) => ({
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, ...updates } : p
      ),
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

  const duplicateProduct = useCallback((productId: string) => {
    setPortfolio((prev) => {
      const product = prev.products.find((p) => p.id === productId);
      if (!product) return prev;

      const duplicated: Product = {
        ...product,
        id: crypto.randomUUID(),
        name: `${product.name} (Copy)`,
        createdAt: Date.now(),
      };

      return {
        products: [...prev.products, duplicated],
      };
    });
  }, []);

  const importProducts = useCallback((products: Product[], merge = true) => {
    setPortfolio((prev) => {
      const newProducts = products.map((p) => ({
        ...p,
        id: crypto.randomUUID(),
        name: prev.products.some((ep) => ep.name === p.name)
          ? `${p.name} (Imported)`
          : p.name,
        createdAt: Date.now(),
      }));

      if (merge) {
        return {
          products: [...prev.products, ...newProducts],
        };
      } else {
        return {
          products: newProducts,
        };
      }
    });
  }, []);

  const markOnboardingSeen = useCallback(() => {
    setHasSeenOnboarding(true);
    saveOnboardingStatus(true);
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        addProduct,
        updateProduct,
        removeProduct,
        clearPortfolio,
        duplicateProduct,
        importProducts,
        hasSeenOnboarding,
        markOnboardingSeen,
      }}
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
