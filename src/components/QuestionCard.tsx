"use client";

import { useState } from "react";
import { Question } from "../lib/types";

interface QuestionCardProps {
  question: Question;
  selectedValue: number | null;
  onSelect: (value: number) => void;
}

export default function QuestionCard({
  question,
  selectedValue,
  onSelect,
}: QuestionCardProps) {
  const [showExamples, setShowExamples] = useState(false);

  // Dimension-specific example products
  const dimensionExamples: Record<string, string[]> = {
    access: [
      "Industrial printing press (direct service contract)",
      "Apple products (owned retail + online)",
      "Nike shoes (select retail partners)",
      "Coca-Cola bottles (ubiquitous retail)",
      "Plastic packaging (dispersed, no tracking)",
    ],
    process: [
      "Aluminum soda cans (single material)",
      "Wooden furniture (screws, separable parts)",
      "Car tires (moderate disassembly)",
      "Smartphones (glued, complex electronics)",
      "Composite wind turbine blades",
    ],
    embeddedValue: [
      "Cardboard boxes (commodity material)",
      "Fast fashion t-shirts",
      "Standard appliances",
      "Premium laptops",
      "Industrial machinery, luxury watches",
    ],
  };

  const examples = dimensionExamples[question.dimension] || [];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {question.text}
      </h3>
      <p className="text-sm text-gray-500 mb-4">{question.helpText}</p>

      {/* Examples toggle */}
      <button
        onClick={() => setShowExamples(!showExamples)}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${showExamples ? "rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {showExamples ? "Hide examples" : "See examples for each option"}
      </button>

      {showExamples && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-700 mb-2 font-medium">
            Example products at each level:
          </p>
          <ul className="space-y-1">
            {examples.map((example, idx) => (
              <li key={idx} className="text-xs text-blue-800 flex items-start gap-2">
                <span className="font-semibold text-blue-600 min-w-[1rem]">{idx + 1}.</span>
                <span>{example}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="text-sm text-gray-500 mt-1">
                  {option.description}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
