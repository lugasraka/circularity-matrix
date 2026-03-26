"use client";

import { useState } from "react";
import { Question as HBRQuestion } from "../lib/types";
import { RStrategyQuestion } from "../lib/r-strategy/types";

type Question = HBRQuestion | RStrategyQuestion;

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

  // Determine if this is HBR or R-strategy question
  const isHBRQuestion = 'dimension' in question;
  const isRStrategyQuestion = 'category' in question;

  // Dimension-specific example products (for HBR)
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

  // Category-specific examples (for R-strategy)
  const categoryExamples: Record<string, string[]> = {
    suitability: [
      "Low-value disposable packaging",
      "Fast fashion clothing",
      "Standard consumer electronics",
      "Industrial machinery",
      "High-value medical equipment",
    ],
    practicality: [
      "Single-material aluminum cans",
      "Modular office furniture",
      "Standard appliances",
      "Complex electronics",
      "Bonded composite materials",
    ],
  };

  const examples = isHBRQuestion 
    ? dimensionExamples[(question as HBRQuestion).dimension] || []
    : isRStrategyQuestion
      ? categoryExamples[(question as RStrategyQuestion).category] || []
      : [];

  const accentColor = isRStrategyQuestion ? "emerald" : "blue";

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {question.text}
      </h3>
      <p className="text-sm text-gray-500 mb-4">{question.helpText}</p>

      {/* Examples toggle */}
      {examples.length > 0 && (
        <button
          onClick={() => setShowExamples(!showExamples)}
          className={`flex items-center gap-1 text-sm text-${accentColor}-600 hover:text-${accentColor}-800 mb-4 transition-colors`}
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
      )}

      {showExamples && examples.length > 0 && (
        <div className={`bg-${accentColor}-50 border border-${accentColor}-100 rounded-lg p-3 mb-4`}>
          <p className={`text-xs text-${accentColor}-700 mb-2 font-medium`}>
            Example products at each level:
          </p>
          <ul className="space-y-1">
            {examples.map((example, idx) => (
              <li key={idx} className={`text-xs text-${accentColor}-800 flex items-start gap-2`}>
                <span className={`font-semibold text-${accentColor}-600 min-w-[1rem]`}>{idx + 1}.</span>
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
                  ? `border-${accentColor}-500 bg-${accentColor}-50 ring-1 ring-${accentColor}-500`
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
