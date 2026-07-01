"use client";

import { useState, useMemo } from "react";
import { Product, StrategyType } from "../lib/types";
import { RStrategy } from "@/lib/r-strategy/types";

interface ProductListProps {
  products: Product[];
  onRemove?: (productId: string) => void;
  onSelect?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDuplicate?: (productId: string) => void;
  selectedProductId?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  compareMode?: boolean;
  compareIds?: Set<string>;
  onToggleCompare?: (id: string) => void;
}

const STRATEGY_COLORS: Record<StrategyType, string> = {
  RPO: "bg-purple-100 text-purple-800",
  PLE: "bg-green-100 text-green-800",
  DFR: "bg-blue-100 text-blue-800",
};

const RSTRATEGY_COLORS: Record<RStrategy, string> = {
  REUSE: "bg-emerald-100 text-emerald-800",
  REFURBISH: "bg-blue-100 text-blue-800",
  REMANUFACTURE: "bg-violet-100 text-violet-800",
  REPURPOSE: "bg-amber-100 text-amber-800",
  RECYCLE: "bg-gray-100 text-gray-800",
};

export const PIN_COLORS = [
  "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#14b8a6",
  "#e11d48", "#2563eb", "#059669", "#d97706", "#7c3aed",
];

export function getProductPinColor(productIndex: number): string {
  return PIN_COLORS[productIndex % PIN_COLORS.length];
}

export default function ProductList({
  products,
  onRemove,
  onSelect,
  onEdit,
  onDuplicate,
  selectedProductId,
  showSearch = true,
  showFilters = true,
  compareMode = false,
  compareIds,
  onToggleCompare,
}: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<"all" | "hbr" | "r-strategy">("all");
  const [strategyFilter, setStrategyFilter] = useState<string[]>([]);
  const [dimensionFilter, setDimensionFilter] = useState<{
    access?: "easy" | "hard";
    process?: "easy" | "hard";
    embeddedValue?: "high" | "low";
  }>({});

  // Separate HBR and R-strategy products
  const hbrProducts = useMemo(() => 
    products.filter(p => p.assessmentMode === 'hbr' && p.result),
  [products]);
  
  const rStrategyProducts = useMemo(() => 
    products.filter(p => p.assessmentMode === 'r-strategy' && p.rStrategyResult),
  [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Mode filter
      if (modeFilter !== "all" && product.assessmentMode !== modeFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        
        let matchesStrategy = false;
        if (product.assessmentMode === 'hbr' && product.result) {
          matchesStrategy = product.result.cell.strategies.some((s) =>
            s.toLowerCase().includes(query)
          );
        } else if (product.assessmentMode === 'r-strategy' && product.rStrategyResult) {
          matchesStrategy = product.rStrategyResult.primaryRecommendation.toLowerCase().includes(query);
        }
        
        if (!matchesName && !matchesStrategy) return false;
      }

      // HBR-specific filters
      if (product.assessmentMode === 'hbr' && product.result) {
        // Strategy filter
        if (strategyFilter.length > 0) {
          const productStrategies = product.result.cell.strategies.join("+");
          if (!strategyFilter.includes(productStrategies)) return false;
        }

        // Dimension filter
        if (dimensionFilter.access && product.result.position.access !== dimensionFilter.access) {
          return false;
        }
        if (dimensionFilter.process && product.result.position.process !== dimensionFilter.process) {
          return false;
        }
        if (dimensionFilter.embeddedValue && product.result.position.embeddedValue !== dimensionFilter.embeddedValue) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchQuery, modeFilter, strategyFilter, dimensionFilter]);

  // Get unique strategy combinations for filter (HBR only)
  const strategyOptions = useMemo(() => {
    const strategies = new Set<string>();
    hbrProducts.forEach((p) => {
      if (p.result) {
        strategies.add(p.result.cell.strategies.join("+"));
      }
    });
    return Array.from(strategies).sort();
  }, [hbrProducts]);

  const hasActiveFilters = searchQuery || strategyFilter.length > 0 || 
    Object.keys(dimensionFilter).length > 0 || modeFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setModeFilter("all");
    setStrategyFilter([]);
    setDimensionFilter({});
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">No products assessed yet.</p>
        <p className="text-xs mt-1">Start an assessment to add products to your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mode filter */}
      {hbrProducts.length > 0 && rStrategyProducts.length > 0 && (
        <div className="flex gap-2">
          {[
            { id: "all" as const, label: "All", count: products.length },
            { id: "hbr" as const, label: "HBR", count: hbrProducts.length },
            { id: "r-strategy" as const, label: "R-Strategy", count: rStrategyProducts.length },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setModeFilter(m.id)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                modeFilter === m.id
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              {m.label} ({m.count})
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      {showSearch && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* HBR Strategy filters */}
      {showFilters && strategyOptions.length > 1 && modeFilter !== "r-strategy" && (
        <div className="flex flex-wrap gap-2">
          {strategyOptions.map((strategy) => (
            <button
              key={strategy}
              onClick={() => {
                setStrategyFilter((prev) =>
                  prev.includes(strategy)
                    ? prev.filter((s) => s !== strategy)
                    : [...prev, strategy]
                );
              }}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                strategyFilter.includes(strategy)
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              {strategy}
            </button>
          ))}
        </div>
      )}

      {/* HBR Dimension filters */}
      {showFilters && hbrProducts.length > 3 && modeFilter !== "r-strategy" && (
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={dimensionFilter.access || ""}
            onChange={(e) =>
              setDimensionFilter((prev) => ({
                ...prev,
                access: e.target.value as "easy" | "hard" || undefined,
              }))
            }
            className="px-2 py-1 border border-gray-200 rounded bg-white text-gray-600"
          >
            <option value="">All Access</option>
            <option value="easy">Easy Access</option>
            <option value="hard">Hard Access</option>
          </select>
          <select
            value={dimensionFilter.process || ""}
            onChange={(e) =>
              setDimensionFilter((prev) => ({
                ...prev,
                process: e.target.value as "easy" | "hard" || undefined,
              }))
            }
            className="px-2 py-1 border border-gray-200 rounded bg-white text-gray-600"
          >
            <option value="">All Process</option>
            <option value="easy">Easy Process</option>
            <option value="hard">Hard Process</option>
          </select>
          <select
            value={dimensionFilter.embeddedValue || ""}
            onChange={(e) =>
              setDimensionFilter((prev) => ({
                ...prev,
                embeddedValue: e.target.value as "high" | "low" || undefined,
              }))
            }
            className="px-2 py-1 border border-gray-200 rounded bg-white text-gray-600"
          >
            <option value="">All Value</option>
            <option value="high">High Value</option>
            <option value="low">Low Value</option>
          </select>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 px-2 py-1"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      {filteredProducts.length !== products.length && (
        <p className="text-xs text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      )}

      {/* Product list */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {filteredProducts.map((product, index) => {
          const originalIndex = products.findIndex((p) => p.id === product.id);
          const isSelected = selectedProductId === product.id;
          const pinColor = PIN_COLORS[originalIndex % PIN_COLORS.length];

          return (
            <div
              key={product.id}
              onClick={() => {
                if (compareMode && onToggleCompare) {
                  onToggleCompare(product.id);
                } else {
                  onSelect?.(product);
                }
              }}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                compareMode && compareIds?.has(product.id)
                  ? "border-indigo-500 bg-indigo-50"
                  : isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              } ${onSelect || compareMode ? "cursor-pointer" : ""}`}
            >
              {/* Compare checkbox or color dot */}
              {compareMode ? (
                <div
                  className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    compareIds?.has(product.id)
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-gray-300"
                  }`}
                >
                  {compareIds?.has(product.id) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              ) : (
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: pinColor }}
                />
              )}

              {/* Product info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm truncate">
                  {product.name}
                </div>
                <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                  {/* Mode badge */}
                  <span className={`text-[10px] px-1.5 py-0 rounded font-medium ${
                    product.assessmentMode === 'hbr'
                      ? "bg-blue-100 text-blue-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {product.assessmentMode === 'hbr' ? 'HBR' : 'R'}
                  </span>

                  {/* Strategy badges */}
                  {product.assessmentMode === 'hbr' && product.result && (
                    <>
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
                    </>
                  )}

                  {product.assessmentMode === 'r-strategy' && product.rStrategyResult && (
                    <>
                      <span
                        className={`inline-block px-1.5 py-0 rounded text-[10px] font-semibold ${
                          RSTRATEGY_COLORS[product.rStrategyResult.primaryRecommendation]
                        }`}
                      >
                        {product.rStrategyResult.primaryRecommendation}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-1">
                        S:{product.rStrategyResult.scores[0]?.suitabilityScore}% P:{product.rStrategyResult.scores[0]?.practicalityScore}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(product);
                    }}
                    className="text-gray-300 hover:text-blue-500 transition-colors p-1"
                    title="Edit product"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {onDuplicate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate(product.id);
                    }}
                    className="text-gray-300 hover:text-green-500 transition-colors p-1"
                    title="Duplicate product"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                )}
                {onRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(product.id);
                    }}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    title="Remove product"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && hasActiveFilters && (
        <p className="text-sm text-gray-500 text-center py-4">
          No products match your filters.
        </p>
      )}

      {products.length >= 15 && (
        <p className="text-xs text-amber-600 px-2">
          You have {products.length} products. The matrix and PDF report work best with up to 15 products.
        </p>
      )}
    </div>
  );
}
