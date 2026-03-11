"use client";

import { useState } from "react";
import { CellStrategy } from "../../lib/types";
import { strategyDescriptions } from "../../lib/strategies";
import CircularityMatrix from "../../components/CircularityMatrix";

export default function ExplorePage() {
  const [selectedCell, setSelectedCell] = useState<CellStrategy | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Explore the Circularity Matrix
        </h1>
        <p className="text-gray-500 mt-1">
          Click any cell on the matrix to learn about the recommended strategy,
          see real-world examples, and get implementation guidance.
        </p>
      </div>

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
    </div>
  );
}
