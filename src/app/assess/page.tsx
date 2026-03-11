"use client";

import { useState } from "react";
import { Answer, AssessmentResult, Product } from "../../lib/types";
import { usePortfolio } from "../../lib/portfolio-context";
import QuestionnaireWizard from "../../components/QuestionnaireWizard";
import ResultsCard from "../../components/ResultsCard";
import CircularityMatrix from "../../components/CircularityMatrix";
import Link from "next/link";

type ViewState = "wizard" | "results";

export default function AssessPage() {
  const { portfolio, addProduct } = usePortfolio();
  const [view, setView] = useState<ViewState>("wizard");
  const [lastProduct, setLastProduct] = useState<Product | null>(null);

  function handleComplete(
    name: string,
    answers: Answer[],
    result: AssessmentResult
  ) {
    const product: Product = {
      id: crypto.randomUUID(),
      name,
      answers,
      result,
      createdAt: Date.now(),
    };
    addProduct(product);
    setLastProduct(product);
    setView("results");
  }

  function handleAssessAnother() {
    setLastProduct(null);
    setView("wizard");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {view === "wizard" ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Product Assessment
            </h1>
            <p className="text-gray-500 mt-1">
              Answer 8 questions to identify the right circular strategy for
              your product.
              {portfolio.products.length > 0 && (
                <span className="text-blue-600 ml-1">
                  ({portfolio.products.length} product
                  {portfolio.products.length !== 1 ? "s" : ""} in portfolio)
                </span>
              )}
            </p>
          </div>
          <QuestionnaireWizard onComplete={handleComplete} />
        </>
      ) : lastProduct ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Results */}
            <div>
              <ResultsCard
                productName={lastProduct.name}
                result={lastProduct.result}
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
          </div>
        </>
      ) : null}
    </div>
  );
}
