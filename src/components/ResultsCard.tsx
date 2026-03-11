"use client";

import { useState } from "react";
import { AssessmentResult, CellStrategy, StrategyType } from "../lib/types";
import { strategyDescriptions } from "../lib/strategies";

interface ResultsCardProps {
  productName: string;
  result: AssessmentResult;
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

export default function ResultsCard({ productName, result }: ResultsCardProps) {
  const [showWhatIf, setShowWhatIf] = useState(false);

  const { scores, position, cell, whatIfCell } = result;

  // Strategy descriptions for all unique strategies
  const allStrategies = Array.from(
    new Set([...cell.strategies, ...whatIfCell.strategies])
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Results for &quot;{productName}&quot;
        </h2>
        <p className="text-gray-500">
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
    </div>
  );
}
