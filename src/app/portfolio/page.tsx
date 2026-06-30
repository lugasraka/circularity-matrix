"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Product, hasHBRResult, hasRStrategyResult } from "../../lib/types";
import { usePortfolio } from "../../lib/portfolio-context";
import CircularityMatrix from "../../components/CircularityMatrix";
import { RStrategyScatterPlot } from "../../components/r-strategy/RStrategyScatterPlot";
import ProductList from "../../components/ProductList";
import ResultsCard from "../../components/ResultsCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PortfolioPage() {
  const router = useRouter();
  const {
    portfolio,
    removeProduct,
    clearPortfolio,
    duplicateProduct,
    importProducts,
    restoreBackup,
  } = usePortfolio();

  const products = portfolio.products;
  
  // Separate products by framework type
  const hbrProducts = products.filter(p => hasHBRResult(p));
  const rStrategyProducts = products.filter(p => hasRStrategyResult(p));

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDataNotice, setShowDataNotice] = useState(true);
  
  // Auto-select default filter based on available products
  const defaultFilter = useMemo(() => {
    if (hbrProducts.length > 0) return "hbr";
    if (rStrategyProducts.length > 0) return "r-strategy";
    return "hbr"; // fallback
  }, [hbrProducts.length, rStrategyProducts.length]);
  
  const [methodFilter, setMethodFilter] = useState<"hbr" | "r-strategy">(defaultFilter);
  
  // Update filter when default changes (e.g., after loading products)
  useEffect(() => {
    setMethodFilter(defaultFilter);
  }, [defaultFilter]);

  // Filter products by assessment mode (no mixing - separate frameworks)
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.assessmentMode === methodFilter);
  }, [products, methodFilter]);

  // Strategy distribution (only for HBR products)
  const strategyCount: Record<string, number> = {};
  for (const p of hbrProducts) {
    if (hasHBRResult(p)) {
      const key = p.result.cell.strategies.join(" + ");
      strategyCount[key] = (strategyCount[key] || 0) + 1;
    }
  }

  // R-Strategy distribution
  const rStrategyCount: Record<string, number> = {};
  for (const p of rStrategyProducts) {
    if (hasRStrategyResult(p)) {
      const key = p.rStrategyResult.primaryRecommendation;
      rStrategyCount[key] = (rStrategyCount[key] || 0) + 1;
    }
  }

  // Handle edit - navigate to assess page with product data
  const handleEdit = (product: Product) => {
    // Save the product data to localStorage for the assess page to pick up
    try {
      localStorage.setItem("circularity-matrix-edit-product", JSON.stringify({
        id: product.id,
        name: product.name,
        assessmentMode: product.assessmentMode,
      }));
    } catch {
      // Ignore storage errors
    }
    router.push("/assess");
  };

  // Export portfolio as JSON
  const exportJSON = (filter?: "hbr" | "r-strategy") => {
    const productsToExport = filter 
      ? products.filter(p => p.assessmentMode === filter)
      : products;
    
    const data = {
      version: "1.1",
      exportedAt: new Date().toISOString(),
      portfolio: {
        products: productsToExport,
      },
    };
    
    const suffix = filter ? `-${filter}` : "";
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `circularity-matrix-portfolio${suffix}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Export as CSV (includes both HBR and R-strategy products)
  const exportCSV = (filter?: "hbr" | "r-strategy") => {
    const productsToExport = filter 
      ? products.filter(p => p.assessmentMode === filter)
      : products;
    
    const headers = [
      "Product Name",
      "Assessment Mode",
      "Created At",
      // HBR columns
      "Access Score",
      "Process Score",
      "Embedded Value Score",
      "Access Level",
      "Process Level",
      "Embedded Value Level",
      "HBR Strategies",
      "Cell ID",
      // R-Strategy columns
      "Primary R-Strategy",
      "Suitability Score",
      "Practicality Score",
      "Overall Score",
      "R-Strategy Rank",
    ];

    const rows = productsToExport.map((p) => {
      const base = [
        `"${p.name.replace(/"/g, '""')}"`,
        p.assessmentMode,
        new Date(p.createdAt).toISOString(),
      ];
      
      if (hasHBRResult(p)) {
        return [
          ...base,
          p.result.scores.access.toFixed(3),
          p.result.scores.process.toFixed(3),
          p.result.scores.embeddedValue.toFixed(3),
          p.result.position.access,
          p.result.position.process,
          p.result.position.embeddedValue,
          `"${p.result.cell.strategies.join(", ")}"`,
          p.result.cell.id,
          // Empty R-strategy columns
          "", "", "", "", "",
        ];
      } else if (hasRStrategyResult(p)) {
        const primaryScore = p.rStrategyResult.scores.find(
          s => s.strategy === p.rStrategyResult?.primaryRecommendation
        );
        return [
          ...base,
          // Empty HBR columns
          "", "", "", "", "", "", "", "",
          // R-strategy columns
          p.rStrategyResult.primaryRecommendation,
          primaryScore?.suitabilityScore || "",
          primaryScore?.practicalityScore || "",
          primaryScore?.overallScore || "",
          primaryScore?.rank || "",
        ];
      }
      
      return [...base, ...Array(14).fill("")];
    });

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const suffix = filter ? `-${filter}` : "";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `circularity-matrix-portfolio${suffix}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Pin color legend (only HBR products have pins)
  const PinLegend = () => {
    if (hbrProducts.length === 0) return null;
    return (
      <div className="mt-4 bg-gray-50 rounded-lg p-3">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Matrix Product Legend
        </h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {hbrProducts.map((p, idx) => {
            const colors = [
              "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6",
              "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#14b8a6",
              "#e11d48", "#2563eb", "#059669", "#d97706", "#7c3aed",
            ];
            return (
              <div key={p.id} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                />
                <span className="text-gray-700 truncate">{p.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Data safety notice — portfolio lives only in this browser */}
      {products.length > 0 && showDataNotice && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="text-lg leading-none" aria-hidden>⚠️</span>
          <div className="flex-1 text-sm text-amber-800">
            <span className="font-medium">Your portfolio is stored only in this browser.</span>{" "}
            Clearing your browser data, switching devices, or using private mode will erase it.
            Download a backup to keep your data safe.
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => exportJSON()}
              className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
            >
              Back up now
            </button>
            <button
              onClick={() => setShowDataNotice(false)}
              className="text-amber-500 hover:text-amber-700 text-sm px-1"
              aria-label="Dismiss notice"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} assessed
            {hbrProducts.length > 0 && rStrategyProducts.length > 0 && (
              <span className="text-gray-400">
                {" "}({hbrProducts.length} HBR, {rStrategyProducts.length} R-Strategy)
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/assess"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Product
          </Link>
          {products.length > 0 && (
            <>
              {/* Export dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  📤 Export
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {/* Export All */}
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase">All Products ({products.length})</span>
                    </div>
                    <button
                      onClick={() => exportJSON()}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      📄 Export as JSON
                    </button>
                    <button
                      onClick={() => exportCSV()}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      📊 Export as CSV
                    </button>
                    
                    {/* HBR Export */}
                    {hbrProducts.length > 0 && (
                      <>
                        <div className="px-3 py-2 bg-blue-50 border-y border-gray-100 mt-1">
                          <span className="text-xs font-semibold text-blue-600 uppercase">HBR Matrix ({hbrProducts.length})</span>
                        </div>
                        <button
                          onClick={() => exportJSON("hbr")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          📄 Export HBR as JSON
                        </button>
                        <button
                          onClick={() => exportCSV("hbr")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          📊 Export HBR as CSV
                        </button>
                      </>
                    )}
                    
                    {/* R-Strategy Export */}
                    {rStrategyProducts.length > 0 && (
                      <>
                        <div className="px-3 py-2 bg-emerald-50 border-y border-gray-100 mt-1">
                          <span className="text-xs font-semibold text-emerald-600 uppercase">R-Strategy ({rStrategyProducts.length})</span>
                        </div>
                        <button
                          onClick={() => exportJSON("r-strategy")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50"
                        >
                          📄 Export R-Strategy as JSON
                        </button>
                        <button
                          onClick={() => exportCSV("r-strategy")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50"
                        >
                          📊 Export R-Strategy as CSV
                        </button>
                      </>
                    )}
                    
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={() => {
                          import("@/lib/report-generator").then(({ generateReport }) => {
                            generateReport(portfolio);
                          });
                          setShowExportMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
                      >
                        📑 Generate PDF Report
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Import dropdown */}
              <div className="relative">
                <ImportDropdown 
                  onImport={importProducts} 
                  onRestore={restoreBackup}
                  hbrCount={hbrProducts.length}
                  rStrategyCount={rStrategyProducts.length}
                />
              </div>

              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-500 text-sm rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                >
                  Clear All
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      clearPortfolio();
                      setShowClearConfirm(false);
                      setSelectedProduct(null);
                    }}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                  >
                    Confirm Clear
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-2 text-gray-500 text-sm hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Method Filter - Only show when both framework types exist */}
      {products.length > 0 && hbrProducts.length > 0 && rStrategyProducts.length > 0 && (
        <div className="mb-6 bg-gray-50 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Select framework:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMethodFilter("hbr");
                  setSelectedProduct(null);
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  methodFilter === "hbr"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50"
                }`}
              >
                HBR Matrix ({hbrProducts.length})
              </button>
              <button
                onClick={() => {
                  setMethodFilter("r-strategy");
                  setSelectedProduct(null);
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  methodFilter === "r-strategy"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50"
                }`}
              >
                R-Strategy ({rStrategyProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No products in your portfolio yet
          </h2>
          <p className="text-gray-500 mb-6">
            Start by assessing your first product to see it on the Circularity
            Matrix.
          </p>
          <Link
            href="/assess"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Assessment →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Product List */}
          <div className="lg:col-span-1">
            <ProductList
              products={filteredProducts}
              onRemove={removeProduct}
              onSelect={setSelectedProduct}
              onEdit={handleEdit}
              onDuplicate={duplicateProduct}
              selectedProductId={selectedProduct?.id}
            />

            {/* Pin legend (HBR only) */}
            {methodFilter === "hbr" && hbrProducts.length > 0 && <PinLegend />}

            {/* HBR Strategy distribution */}
            {methodFilter === "hbr" && Object.keys(strategyCount).length > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  HBR Strategy Distribution
                </h4>
                <div className="space-y-2">
                  {Object.entries(strategyCount)
                    .sort(([, a], [, b]) => b - a)
                    .map(([strategy, count]) => (
                      <div key={strategy} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{strategy}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {count} ({((count / hbrProducts.length) * 100).toFixed(0)}
                          %)
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* R-Strategy distribution */}
            {methodFilter === "r-strategy" && Object.keys(rStrategyCount).length > 0 && (
              <div className="mt-6 bg-emerald-50 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-3">
                  R-Strategy Distribution
                </h4>
                <div className="space-y-2">
                  {Object.entries(rStrategyCount)
                    .sort(([, a], [, b]) => b - a)
                    .map(([strategy, count]) => (
                      <div key={strategy} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{strategy}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {count} ({((count / rStrategyProducts.length) * 100).toFixed(0)}
                          %)
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Main: Visualization + Detail */}
          <div className="lg:col-span-2">
            {/* HBR Matrix Visualization */}
            {methodFilter === "hbr" && hbrProducts.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  HBR Circularity Matrix
                </h3>
                <CircularityMatrix
                  products={hbrProducts}
                  highlightCellId={selectedProduct && hasHBRResult(selectedProduct) ? selectedProduct.result.cell.id : undefined}
                  onProductClick={(p) => setSelectedProduct(p)}
                />
              </>
            )}

            {/* R-Strategy Scatter Plot */}
            {methodFilter === "r-strategy" && rStrategyProducts.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-3">
                  R-Strategy Suitability vs. Practicality
                </h3>
                <RStrategyScatterPlot
                  products={rStrategyProducts}
                  onProductClick={(p) => setSelectedProduct(p)}
                  selectedProductId={selectedProduct?.id}
                />
              </div>
            )}

            

            {/* Selected product detail */}
            {selectedProduct && filteredProducts.find(p => p.id === selectedProduct.id) && (
              <div className="mt-8 border-t pt-6">
                <ResultsCard
                  productName={selectedProduct.name}
                  assessmentMode={selectedProduct.assessmentMode}
                  result={selectedProduct.result}
                  answers={selectedProduct.answers}
                  rStrategyResult={selectedProduct.rStrategyResult}
                  rStrategyAnswers={selectedProduct.rStrategyAnswers}
                  productId={selectedProduct.id}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Import Dropdown Component
interface ImportDropdownProps {
  onImport: (products: Product[], append: boolean) => void;
  onRestore: (products: Product[]) => void;
  hbrCount: number;
  rStrategyCount: number;
}

function ImportDropdown({ onImport, onRestore, hbrCount, rStrategyCount }: ImportDropdownProps) {
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [importFilter, setImportFilter] = useState<"all" | "hbr" | "r-strategy">("all");
  const [importMode, setImportMode] = useState<"merge" | "restore">("merge");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.portfolio || !Array.isArray(data.portfolio.products)) {
          alert("Invalid file format. Expected a portfolio export file.");
          return;
        }

        const allProducts = data.portfolio.products as Product[];

        // Restore mode: replace the entire portfolio, preserving identity
        if (importMode === "restore") {
          const count = allProducts.length;
          if (
            confirm(
              `Restore from backup? This will REPLACE all current products with the ${count} product${
                count !== 1 ? "s" : ""
              } in this file. This cannot be undone.`
            )
          ) {
            onRestore(allProducts);
            alert(`Restored ${count} product${count !== 1 ? "s" : ""} from backup.`);
          }
          return;
        }

        // Merge mode: append products (with new ids), optionally filtered
        let productsToImport = allProducts;
        if (importFilter !== "all") {
          productsToImport = productsToImport.filter((p: Product) => p.assessmentMode === importFilter);
        }

        const importCount = productsToImport.length;
        if (importCount === 0) {
          alert(`No ${importFilter === "all" ? "" : importFilter.toUpperCase()} products found in the file.`);
          return;
        }

        const filterLabel = importFilter !== "all" ? ` (${importFilter.toUpperCase()})` : "";
        if (confirm(`Import ${importCount} product${importCount !== 1 ? "s" : ""}${filterLabel}?`)) {
          onImport(productsToImport, true);
          alert(`Successfully imported ${importCount} product${importCount !== 1 ? "s" : ""}!`);
        }
      } catch (err) {
        alert("Error reading file: " + (err as Error).message);
      } finally {
        // Reset input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
    setShowMenu(false);
  };

  const triggerFileSelect = (filter: "all" | "hbr" | "r-strategy") => {
    setImportMode("merge");
    setImportFilter(filter);
    fileInputRef.current?.click();
  };

  const triggerRestore = () => {
    setImportMode("restore");
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
      >
        📥 Import
      </button>
      
      {showMenu && (
        <div className="absolute right-0 mt-1 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase">Merge into portfolio</span>
          </div>
          
          <button
            onClick={() => triggerFileSelect("all")}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            📁 Import All Products
          </button>
          
          <button
            onClick={() => triggerFileSelect("hbr")}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
          >
            🔵 Import HBR Products Only
          </button>
          
          <button
            onClick={() => triggerFileSelect("r-strategy")}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50"
          >
            🟢 Import R-Strategy Products Only
          </button>

          <div className="px-3 py-2 bg-gray-50 border-y border-gray-100 mt-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Restore backup</span>
          </div>
          <button
            onClick={triggerRestore}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
          >
            ♻️ Restore (replace all)
          </button>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
}
