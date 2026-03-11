"use client";

import { useState } from "react";
import { Product } from "../../lib/types";
import { usePortfolio } from "../../lib/portfolio-context";
import CircularityMatrix from "../../components/CircularityMatrix";
import ProductList from "../../components/ProductList";
import ResultsCard from "../../components/ResultsCard";
import Link from "next/link";

export default function PortfolioPage() {
  const { portfolio, removeProduct, clearPortfolio } = usePortfolio();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const products = portfolio.products;

  // Strategy distribution
  const strategyCount: Record<string, number> = {};
  for (const p of products) {
    const key = p.result.cell.strategies.join(" + ");
    strategyCount[key] = (strategyCount[key] || 0) + 1;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} assessed
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/assess"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Product
          </Link>
          {products.length > 0 && (
            <>
              <button
                onClick={() => {
                  // Dynamic import to avoid loading jsPDF until needed
                  import("@/lib/report-generator").then(({ generateReport }) => {
                    generateReport(portfolio);
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                📄 Download Report
              </button>
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
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Products
            </h3>
            <ProductList
              products={products}
              onRemove={removeProduct}
              onSelect={setSelectedProduct}
              selectedProductId={selectedProduct?.id}
            />

            {/* Strategy distribution */}
            {Object.keys(strategyCount).length > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Strategy Distribution
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
          </div>

          {/* Main: Matrix + Detail */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Circularity Matrix
            </h3>
            <CircularityMatrix
              products={products}
              highlightCellId={selectedProduct?.result.cell.id}
            />

            {/* Selected product detail */}
            {selectedProduct && (
              <div className="mt-8 border-t pt-6">
                <ResultsCard
                  productName={selectedProduct.name}
                  result={selectedProduct.result}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
