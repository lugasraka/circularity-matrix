"use client";

import { useState } from "react";
import { AssessmentResult, CellStrategy, StrategyType, AssessmentMode } from "../lib/types";
import { strategyDescriptions } from "../lib/strategies";
import { copyShareURL } from "../lib/share-utils";
import { RStrategyResult } from "@/lib/r-strategy/types";
import RoadmapPanel from "./RoadmapPanel";
import FinancialCalculator from "./FinancialCalculator";
import RStrategyScatterPlot from "./r-strategy/RStrategyScatterPlot";
import RStrategyScorecard from "./r-strategy/RStrategyScorecard";
import RStrategyRecommendation from "./r-strategy/RStrategyRecommendation";

interface ResultsCardProps {
  productName: string;
  assessmentMode: AssessmentMode;
  // HBR mode data
  result?: AssessmentResult;
  answers?: { questionId: string; value: number }[];
  // R-strategy mode data
  rStrategyResult?: RStrategyResult;
  rStrategyAnswers?: { criterionId: string; value: number; normalizedScore: number }[];
  // Common
  productId?: string;
}

const STRATEGY_COLORS: Record<StrategyType, string> = {
  RPO: "bg-purple-100 text-purple-800",
  PLE: "bg-green-100 text-green-800",
  DFR: "bg-blue-100 text-blue-800",
};

function StrategyBadge({ strategy }: { strategy: StrategyType }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${STRATEGY_COLORS[strategy]}`}
    >
      {strategy}
    </span>
  );
}

function CellDetail({ cell, isWhatIf }: { cell: CellStrategy; isWhatIf: boolean }) {
  return (
    <div
      className={`rounded-lg p-5 ${
        isWhatIf ? "bg-gray-50 border border-dashed border-gray-300" : "bg-white border border-gray-200"
      }`}
    >
      {isWhatIf && (
        <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
          What-if: {cell.position.embeddedValue === "high" ? "High" : "Low"}{" "}
          Embedded Value
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <h4 className="font-semibold text-gray-900">{cell.label}</h4>
        <div className="flex gap-1">
          {cell.strategies.map((s) => (
            <StrategyBadge key={s} strategy={s} />
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{cell.description}</p>

      <div className="mb-4">
        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Real-World Examples
        </h5>
        <ul className="text-sm text-gray-700 space-y-1">
          {cell.examples.map((ex, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>{ex}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Implementation Guidance
        </h5>
        <ul className="text-sm text-gray-700 space-y-1">
          {cell.guidance.map((g, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">→</span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// HBR Results Component
function HBRResults({ 
  result, 
  productName, 
  productId, 
  answers 
}: { 
  result: AssessmentResult; 
  productName: string;
  productId?: string;
  answers?: { questionId: string; value: number }[];
}) {
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<"main" | "roadmap" | "financial">("main");

  const { scores, position, cell, whatIfCell } = result;
  const allStrategies = Array.from(new Set([...cell.strategies, ...whatIfCell.strategies]));

  const handleShare = async () => {
    if (!productId || !answers) return;
    
    const product = {
      id: productId,
      name: productName,
      assessmentMode: 'hbr' as const,
      answers,
      result,
      createdAt: Date.now(),
    };
    
    const success = await copyShareURL(product);
    if (success) {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                HBR Matrix
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Results for &quot;{productName}&quot;
            </h2>
            <p className="text-gray-500 mt-1">
              Your product maps to:{" "}
              <span className="font-medium text-gray-700">
                {position.access === "hard" ? "Hard" : "Easy"} Access
              </span>
              {" × "}
              <span className="font-medium text-gray-700">
                {position.process === "hard" ? "Hard" : "Easy"} Process
              </span>
              {" × "}
              <span className="font-medium text-gray-700">
                {position.embeddedValue === "high" ? "High" : "Low"} Embedded Value
              </span>
            </p>
          </div>
          {productId && answers && (
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {shareCopied ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Access", value: scores.access, desc: scores.access >= 0.5 ? "Hard" : "Easy" },
          { label: "Process", value: scores.process, desc: scores.process >= 0.5 ? "Hard" : "Easy" },
          { label: "Embedded Value", value: scores.embeddedValue, desc: scores.embeddedValue >= 0.5 ? "High" : "Low" },
        ].map((dim) => (
          <div key={dim.label} className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              {dim.label}
            </div>
            <div className="text-lg font-bold text-gray-900 mt-1">
              {dim.desc}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${dim.value * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {(dim.value * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>

      {/* Recommended strategy */}
      <CellDetail cell={cell} isWhatIf={false} />

      {/* What-if toggle */}
      <div>
        <button
          onClick={() => setShowWhatIf(!showWhatIf)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showWhatIf ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          What if embedded value were{" "}
          {position.embeddedValue === "high" ? "Low" : "High"}?
        </button>

        {showWhatIf && (
          <div className="mt-3">
            <CellDetail cell={whatIfCell} isWhatIf={true} />
          </div>
        )}
      </div>

      {/* Strategy glossary */}
      <div className="border-t pt-4 mt-4">
        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Strategy Reference
        </h5>
        <div className="space-y-2">
          {allStrategies.map((s) => (
            <div key={s} className="flex items-start gap-2 text-sm">
              <StrategyBadge strategy={s} />
              <span className="text-gray-600">{strategyDescriptions[s]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Tools */}
      <div className="border-t pt-4 mt-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveSection(activeSection === "roadmap" ? "main" : "roadmap")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeSection === "roadmap"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📋 Implementation Roadmap
          </button>
          <button
            onClick={() => setActiveSection(activeSection === "financial" ? "main" : "financial")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeSection === "financial"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            💰 Financial Calculator
          </button>
        </div>

        {activeSection === "roadmap" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <RoadmapPanel cell={cell} />
          </div>
        )}

        {activeSection === "financial" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <FinancialCalculator productName={productName} result={result} />
          </div>
        )}
      </div>
    </div>
  );
}

// R-Strategy Results Component
function RStrategyResults({ 
  result, 
  productName, 
  productId, 
  answers 
}: { 
  result: RStrategyResult; 
  productName: string;
  productId?: string;
  answers?: { criterionId: string; value: number; normalizedScore: number }[];
}) {
  const [activeTab, setActiveTab] = useState<'visualization' | 'scorecard' | 'recommendation'>('visualization');
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = async () => {
    if (!productId || !answers) return;
    
    // Note: copyShareURL needs to be updated to handle R-strategy products
    // For now, we'll skip sharing functionality
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                R-Strategy Scorecard
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Results for &quot;{productName}&quot;
            </h2>
            <p className="text-gray-500 mt-1">
              Primary recommendation:{" "}
              <span className="font-semibold text-emerald-700">
                {result.primaryRecommendation}
              </span>
              {result.isRecyclingFallback && (
                <span className="ml-2 text-xs text-amber-600">
                  (fallback recommendation)
                </span>
              )}
            </p>
          </div>
          {productId && answers && (
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              {shareCopied ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'visualization' as const, label: '📊 Scatter Plot', color: 'emerald' },
          { id: 'scorecard' as const, label: '📋 Scorecard', color: 'emerald' },
          { id: 'recommendation' as const, label: '💡 Recommendation', color: 'emerald' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? `border-${tab.color}-500 text-${tab.color}-700`
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'visualization' && (
          <RStrategyScatterPlot result={result} />
        )}

        {activeTab === 'scorecard' && (
          <RStrategyScorecard result={result} />
        )}

        {activeTab === 'recommendation' && (
          <RStrategyRecommendation result={result} />
        )}
      </div>
    </div>
  );
}

// Main ResultsCard component
export default function ResultsCard({
  productName,
  assessmentMode,
  result,
  answers,
  rStrategyResult,
  rStrategyAnswers,
  productId,
}: ResultsCardProps) {
  if (assessmentMode === 'hbr' && result) {
    return (
      <HBRResults 
        result={result} 
        productName={productName} 
        productId={productId}
        answers={answers}
      />
    );
  }

  if (assessmentMode === 'r-strategy' && rStrategyResult) {
    return (
      <RStrategyResults 
        result={rStrategyResult} 
        productName={productName}
        productId={productId}
        answers={rStrategyAnswers}
      />
    );
  }

  // Fallback for missing data
  return (
    <div className="p-6 text-center text-gray-500">
      <p>Results data not available.</p>
    </div>
  );
}
