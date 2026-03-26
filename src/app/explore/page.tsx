"use client";

import { useState } from "react";
import { CellStrategy } from "../../lib/types";
import { strategyDescriptions } from "../../lib/strategies";
import { RStrategy, RSTRATEGY_ZONES, RSTRATEGY_DESCRIPTIONS } from "@/lib/r-strategy/types";
import CircularityMatrix from "../../components/CircularityMatrix";

export default function ExplorePage() {
  const [activeFramework, setActiveFramework] = useState<"hbr" | "r-strategy">("hbr");
  const [selectedCell, setSelectedCell] = useState<CellStrategy | null>(null);
  const [selectedRStrategy, setSelectedRStrategy] = useState<RStrategy | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header with framework toggle */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Explore Circular Economy Frameworks
        </h1>
        <p className="text-gray-500 mt-1">
          Learn about two complementary approaches to circular strategy selection.
        </p>
        
        {/* Framework toggle */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setActiveFramework("hbr");
              setSelectedRStrategy(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFramework === "hbr"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            HBR Matrix
            <span className="block text-xs font-normal opacity-75">3 dimensions → 8 cells</span>
          </button>
          <button
            onClick={() => {
              setActiveFramework("r-strategy");
              setSelectedCell(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFramework === "r-strategy"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            R-Strategy Scorecard
            <span className="block text-xs font-normal opacity-75">7 criteria → 5 strategies</span>
          </button>
        </div>
      </div>

      {/* HBR Matrix Explorer */}
      {activeFramework === "hbr" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Matrix */}
          <div>
            <CircularityMatrix
              onCellClick={setSelectedCell}
              highlightCellId={selectedCell?.id}
            />

            {/* Axis explanation */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-1">
                  ↔ Process (X-axis)
                </h4>
                <p className="text-gray-500">
                  How easily value can be recovered from the product. Easy = simple
                  material recovery; Hard = complex processing required.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-1">
                  ↕ Access (Y-axis)
                </h4>
                <p className="text-gray-500">
                  How easily the manufacturer can get the product back. Easy =
                  direct relationship with users; Hard = products dispersed across
                  many channels.
                </p>
              </div>
            </div>
          </div>

          {/* Cell detail */}
          <div>
            {selectedCell ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {selectedCell.position.access === "hard" ? "Hard" : "Easy"}{" "}
                    Access
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {selectedCell.position.process === "hard" ? "Hard" : "Easy"}{" "}
                    Process
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {selectedCell.position.embeddedValue === "high"
                      ? "High"
                      : "Low"}{" "}
                    Embedded Value
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">
                  {selectedCell.label}
                </h3>

                <div className="flex gap-1 mb-4">
                  {selectedCell.strategies.map((s) => (
                    <span
                      key={s}
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        s === "RPO"
                          ? "bg-purple-100 text-purple-800"
                          : s === "PLE"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 mb-6">{selectedCell.description}</p>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Real-World Examples
                  </h4>
                  <ul className="space-y-1">
                    {selectedCell.examples.map((ex, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Implementation Guidance
                  </h4>
                  <ul className="space-y-1">
                    {selectedCell.guidance.map((g, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-blue-400 mt-0.5">→</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strategy definitions */}
                <div className="border-t pt-4 mt-6">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Strategy Definitions
                  </h4>
                  <div className="space-y-2">
                    {selectedCell.strategies.map((s) => (
                      <div key={s} className="text-sm">
                        <span className="font-semibold text-gray-900">
                          {s}:
                        </span>{" "}
                        <span className="text-gray-600">
                          {strategyDescriptions[s]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-3xl mb-3">👆</div>
                <p className="text-gray-500">
                  Click a cell on the matrix to see the recommended strategy,
                  examples, and implementation guidance.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* R-Strategy Explorer */}
      {activeFramework === "r-strategy" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* R-Strategy Ladder */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                The R-Strategy Hierarchy
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Click any strategy to learn about its suitability and practicality requirements.
              </p>
              
              {/* Strategy ladder */}
              <div className="space-y-3">
                {RSTRATEGY_ZONES.map((zone, index) => (
                  <button
                    key={zone.strategy}
                    onClick={() => setSelectedRStrategy(zone.strategy)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedRStrategy === zone.strategy
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: zone.color, color: 'white' }}
                      >
                        {zone.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {index + 1}. {zone.strategy}
                        </div>
                        <div className="text-xs text-gray-500">
                          {RSTRATEGY_DESCRIPTIONS[zone.strategy].shortDescription}
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        <div>S: {zone.suitabilityMin}-{zone.suitabilityMax}%</div>
                        <div>P: {zone.practicalityMin}-{zone.practicalityMax}%</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Zone visualization hint */}
            <div className="mt-6 bg-emerald-50 rounded-lg p-4">
              <h4 className="font-semibold text-emerald-900 mb-2">
                Understanding the Zones
              </h4>
              <p className="text-sm text-emerald-700">
                Each R-strategy occupies a specific region on the Suitability vs. Practicality 
                scatter plot. High suitability products are better kept in use (Reuse, Refurbish), 
                while high practicality products are easier to process (Remanufacture, Repurpose, Recycle).
              </p>
            </div>
          </div>

          {/* R-Strategy detail */}
          <div>
            {selectedRStrategy ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {(() => {
                  const zone = RSTRATEGY_ZONES.find(z => z.strategy === selectedRStrategy)!;
                  const desc = RSTRATEGY_DESCRIPTIONS[selectedRStrategy];
                  
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: zone.color, color: 'white' }}
                        >
                          {zone.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {desc.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {desc.shortDescription}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-xs text-blue-600 font-medium uppercase">Suitability Range</div>
                          <div className="text-lg font-bold text-blue-900">
                            {zone.suitabilityMin}% - {zone.suitabilityMax}%
                          </div>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-3">
                          <div className="text-xs text-emerald-600 font-medium uppercase">Practicality Range</div>
                          <div className="text-lg font-bold text-emerald-900">
                            {zone.practicalityMin}% - {zone.practicalityMax}%
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6">{desc.fullDescription}</p>

                      <div className="mb-6">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Real-World Examples
                        </h4>
                        <ul className="space-y-1">
                          {desc.examples.map((ex, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-700 flex items-start gap-2"
                            >
                              <span className="text-emerald-500 mt-0.5">•</span>
                              <span>{ex}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Ideal For Products That Are...
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Suitability: {getSuitabilityDescription(selectedRStrategy)}</li>
                          <li>• Practicality: {getPracticalityDescription(selectedRStrategy)}</li>
                        </ul>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-3xl mb-3">👆</div>
                <p className="text-gray-500">
                  Click a strategy on the ladder to see detailed information about
                  suitability requirements, practicality needs, and real-world examples.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions for descriptions
function getSuitabilityDescription(strategy: RStrategy): string {
  const descriptions: Record<RStrategy, string> = {
    REUSE: "High value, durable, with minimal regulatory pressure",
    REFURBISH: "High value and durable, suitable for cosmetic renewal",
    REMANUFACTURE: "Moderate value with established logistics and recovery processes",
    REPURPOSE: "Lower preservation value but adaptable for different functions",
    RECYCLE: "Low suitability for other R-strategies, but valuable materials",
  };
  return descriptions[strategy];
}

function getPracticalityDescription(strategy: RStrategy): string {
  const descriptions: Record<RStrategy, string> = {
    REUSE: "May have complex logistics, but minimal processing needed",
    REFURBISH: "Moderate processing requirements with trained labor",
    REMANUFACTURE: "Good logistics and established value recovery processes",
    REPURPOSE: "Creative adaptation possible with available infrastructure",
    RECYCLE: "Strong logistics and material recovery infrastructure in place",
  };
  return descriptions[strategy];
}
