"use client";

import { Product, StrategyType } from "../lib/types";

interface ProductListProps {
  products: Product[];
  onRemove?: (productId: string) => void;
  onSelect?: (product: Product) => void;
  selectedProductId?: string;
}

const STRATEGY_COLORS: Record<StrategyType, string> = {
  RPO: "bg-purple-100 text-purple-800",
  PLE: "bg-green-100 text-green-800",
  DFR: "bg-blue-100 text-blue-800",
};

const PIN_COLORS = [
  "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#14b8a6",
  "#e11d48", "#2563eb", "#059669", "#d97706", "#7c3aed",
];

export default function ProductList({
  products,
  onRemove,
  onSelect,
  selectedProductId,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">No products assessed yet.</p>
        <p className="text-xs mt-1">Start an assessment to add products to your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {products.map((product, index) => {
        const isSelected = selectedProductId === product.id;
        const pinColor = PIN_COLORS[index % PIN_COLORS.length];

        return (
          <div
            key={product.id}
            onClick={() => onSelect?.(product)}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              isSelected
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            } ${onSelect ? "cursor-pointer" : ""}`}
          >
            {/* Color dot matching matrix pin */}
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: pinColor }}
            />

            {/* Product info */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm truncate">
                {product.name}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {product.result.cell.strategies.map((s) => (
                  <span
                    key={s}
                    className={`inline-block px-1.5 py-0 rounded text-[10px] font-semibold ${STRATEGY_COLORS[s]}`}
                  >
                    {s}
                  </span>
                ))}
                <span className="text-[10px] text-gray-400 ml-1">
                  {product.result.position.access === "hard" ? "H" : "E"}/
                  {product.result.position.process === "hard" ? "H" : "E"}/
                  {product.result.position.embeddedValue === "high" ? "H" : "L"}
                </span>
              </div>
            </div>

            {/* Remove button */}
            {onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(product.id);
                }}
                className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                title="Remove product"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        );
      })}

      {products.length >= 15 && (
        <p className="text-xs text-amber-600 mt-2 px-2">
          You have {products.length} products. The matrix and PDF report work best with up to 15 products.
        </p>
      )}
    </div>
  );
}
