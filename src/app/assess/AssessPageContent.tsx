"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Answer, AssessmentResult, Product } from "../../lib/types";
import { usePortfolio } from "../../lib/portfolio-context";
import { decodeProductFromURL } from "../../lib/share-utils";
import { assess } from "../../lib/scoring";
import QuestionnaireWizard from "../../components/QuestionnaireWizard";
import ResultsCard from "../../components/ResultsCard";
import CircularityMatrix from "../../components/CircularityMatrix";
import Link from "next/link";

type ViewState = "wizard" | "results";

export default function AssessPageContent() {
  const searchParams = useSearchParams();
  const shareParam = searchParams.get("share");
  const { portfolio, addProduct, updateProduct } = usePortfolio();

  const [view, setView] = useState<ViewState>("wizard");
  const [lastProduct, setLastProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sharedProductData, setSharedProductData] = useState<{ name: string; answers: Answer[] } | null>(null);
  const processedShare = useRef(false);

  // Handle edit mode from localStorage (set by portfolio page)
  useEffect(() => {
    try {
      const editData = localStorage.getItem("circularity-matrix-edit-product");
      if (editData) {
        const parsed = JSON.parse(editData);
        if (parsed.id && parsed.name && parsed.answers) {
          // Find the full product in portfolio
          const product = portfolio.products.find(p => p.id === parsed.id);
          if (product) {
            setEditingProduct(product);
          }
        }
        // Clear the edit data
        localStorage.removeItem("circularity-matrix-edit-product");
      }
    } catch {
      // Ignore errors
    }
  }, [portfolio.products]);

  // Handle shared URL
  useEffect(() => {
    if (shareParam && !processedShare.current) {
      processedShare.current = true;
      const decoded = decodeProductFromURL(shareParam);
      if (decoded) {
        setSharedProductData(decoded);
        // Auto-complete with shared data
        const result = assess(decoded.answers);
        const product: Product = {
          id: crypto.randomUUID(),
          name: decoded.name,
          answers: decoded.answers,
          result,
          createdAt: Date.now(),
        };
        addProduct(product);
        setLastProduct(product);
        setView("results");
      }
    }
  }, [shareParam, addProduct]);

  function handleComplete(
    name: string,
    answers: Answer[],
    result: AssessmentResult
  ) {
    if (editingProduct) {
      // Update existing product
      const updatedProduct: Product = {
        ...editingProduct,
        name,
        answers,
        result,
        createdAt: Date.now(),
      };
      updateProduct(editingProduct.id, updatedProduct);
      setLastProduct(updatedProduct);
    } else {
      // Add new product
      const product: Product = {
        id: crypto.randomUUID(),
        name,
        answers,
        result,
        createdAt: Date.now(),
      };
      addProduct(product);
      setLastProduct(product);
    }

    setEditingProduct(null);
    setSharedProductData(null);
    setView("results");
  }

  function handleAssessAnother() {
    setLastProduct(null);
    setEditingProduct(null);
    setSharedProductData(null);
    setView("wizard");
  }

  function handleEditProduct(product: Product) {
    setEditingProduct(product);
    setView("wizard");
  }

  const isEditing = !!editingProduct;
  const isShared = !!sharedProductData;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {view === "wizard" ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Product" : isShared ? "Shared Product Assessment" : "Product Assessment"}
            </h1>
            <p className="text-gray-500 mt-1">
              {isEditing
                ? `Updating "${editingProduct?.name}". Your previous answers are pre-filled.`
                : isShared
                ? "This is a shared product assessment. You can add it to your portfolio."
                : "Answer 8 questions to identify the right circular strategy for your product."}
              {portfolio.products.length > 0 && !isEditing && !isShared && (
                <span className="text-blue-600 ml-1">
                  ({portfolio.products.length} product
                  {portfolio.products.length !== 1 ? "s" : ""} in portfolio)
                </span>
              )}
            </p>
          </div>
          <QuestionnaireWizard
            onComplete={handleComplete}
            initialProductName={editingProduct?.name || ""}
            initialAnswers={editingProduct?.answers}
            editingProductId={editingProduct?.id}
          />
          {isEditing && (
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setEditingProduct(null);
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel editing and start new assessment
              </button>
            </div>
          )}
        </>
      ) : lastProduct ? (
        <>
          {isShared && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Shared product added!</strong> &quot;{lastProduct.name}&quot; has been added to your portfolio.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Results */}
            <div>
              <ResultsCard
                productName={lastProduct.name}
                result={lastProduct.result}
                productId={lastProduct.id}
                answers={lastProduct.answers}
              />
            </div>

            {/* Matrix */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Position on the Circularity Matrix
              </h3>
              <CircularityMatrix
                products={portfolio.products}
                highlightCellId={lastProduct.result.cell.id}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t">
            <button
              onClick={handleAssessAnother}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Assess Another Product
            </button>
            <Link
              href="/portfolio"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              View Portfolio ({portfolio.products.length} product
              {portfolio.products.length !== 1 ? "s" : ""})
            </Link>
            <button
              onClick={() => handleEditProduct(lastProduct)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              ✏️ Edit This Product
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
