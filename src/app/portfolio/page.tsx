"use client";

import { useState, useMemo } from "react";
import { Product } from "../../lib/types";
import { usePortfolio } from "../../lib/portfolio-context";
import CircularityMatrix from "../../components/CircularityMatrix";
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
  } = usePortfolio();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const products = portfolio.products;

  // Filter products by assessment mode
  const hbrProducts = products.filter(p => p.assessmentMode === 'hbr' && p.result);
  const rStrategyProducts = products.filter(p => p.assessmentMode === 'r-strategy' && p.rStrategyResult);

  // Strategy distribution (only for HBR products)
  const strategyCount: Record<string, number> = {};
  for (const p of hbrProducts) {
    if (p.result) {
      const key = p.result.cell.strategies.join(" + ");
      strategyCount[key] = (strategyCount[key] || 0) + 1;
    }
  }

  // R-Strategy distribution
  const rStrategyCount: Record<string, number> = {};
  for (const p of rStrategyProducts) {
    if (p.rStrategyResult) {
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
  const exportJSON = () => {
    const data = {
      version: "1.1",
      exportedAt: new Date().toISOString(),
      portfolio,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `circularity-matrix-portfolio-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Export as CSV (includes both HBR and R-strategy products)
  const exportCSV = () => {
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

    const rows = products.map((p) => {
      const base = [
        `"${p.name.replace(/"/g, '""')}"`,
        p.assessmentMode,
        new Date(p.createdAt).toISOString(),
      ];
      
      if (p.assessmentMode === 'hbr' && p.result) {
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
      } else if (p.assessmentMode === 'r-strategy' && p.rStrategyResult) {
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

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `circularity-matrix-portfolio-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Import portfolio from JSON
  const importJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.portfolio && Array.isArray(data.portfolio.products)) {
          const importCount = data.portfolio.products.length;
          if (
            confirm(
              `Import ${importCount} product${importCount !== 1 ? "s" : ""}? This will add them to your current portfolio (${products.length} products).`
            )
          ) {
            importProducts(data.portfolio.products, true);
            alert(`Successfully imported ${importCount} product${importCount !== 1 ? "s" : ""}!`);
          }
        } else {
          alert("Invalid file format. Expected a portfolio export file.");
        }
      } catch (err) {
        alert("Error reading file: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
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
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={exportJSON}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                    >
                      📄 Export as JSON
                    </button>
                    <button
                      onClick={exportCSV}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      📊 Export as CSV
                    </button>
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
                )}
              </div>

              {/* Import button */}
              <label className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                📥 Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={importJSON}
                  className="hidden"
                />
              </label>

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
              products={products}
              onRemove={removeProduct}
              onSelect={setSelectedProduct}
              onEdit={handleEdit}
              onDuplicate={duplicateProduct}
              selectedProductId={selectedProduct?.id}
            />

            {/* Pin legend (HBR only) */}
            {hbrProducts.length > 0 && <PinLegend />}

            {/* HBR Strategy distribution */}
            {Object.keys(strategyCount).length > 0 && (
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
                          {count} ({((count / products.length) * 100).toFixed(0)}
                          %)
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* R-Strategy distribution */}
            {Object.keys(rStrategyCount).length > 0 && (
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
                          {count} ({((count / products.length) * 100).toFixed(0)}
                          %)
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Main: Matrix + Detail */}
          <div className="lg:col-span-2">
            {/* Matrix (HBR only) */}
            {hbrProducts.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  HBR Circularity Matrix
                </h3>
                <CircularityMatrix
                  products={hbrProducts}
                  highlightCellId={selectedProduct?.assessmentMode === 'hbr' ? selectedProduct.result?.cell.id : undefined}
                  onProductClick={(p) => setSelectedProduct(p)}
                />
              </>
            )}

            {/* R-Strategy products info */}
            {rStrategyProducts.length > 0 && (
              <div className={`${hbrProducts.length > 0 ? 'mt-8' : ''}`}>
                <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-3">
                  R-Strategy Products ({rStrategyProducts.length})
                </h3>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    {rStrategyProducts.length} product{rStrategyProducts.length !== 1 ? 's' : ''} assessed using the R-Strategy Scorecard framework. 
                    Select a product from the sidebar to view detailed results including the Suitability vs. Practicality scatter plot.
                  </p>
                </div>
              </div>
            )}

            {/* Selected product detail */}
            {selectedProduct && (
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
