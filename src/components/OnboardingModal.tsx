"use client";

import { useState } from "react";

interface OnboardingModalProps {
  onClose: () => void;
}

const STEPS = [
  {
    title: "Welcome to Circularity Matrix",
    content:
      "This tool helps you identify the optimal circular economy strategy for your products based on the Harvard Business Review framework by Atasu, Dumas & Van Wassenhove (2021).",
    icon: "🎯",
  },
  {
    title: "Three Key Dimensions",
    content:
      "Products are evaluated on three dimensions: Access (how easily you can get products back), Process (how easily value can be recovered), and Embedded Value (how much value the product retains).",
    icon: "📊",
  },
  {
    title: "Three Core Strategies",
    content:
      "Depending on your product's position, you'll receive recommendations for: Retain Product Ownership (RPO), Product Life Extension (PLE), or Design for Recycling (DFR).",
    icon: "♻️",
  },
  {
    title: "Build Your Portfolio",
    content:
      "Assess multiple products to compare strategies across your product line. Export your portfolio as JSON, CSV, or PDF to share with your team.",
    icon: "💼",
  },
];

export default function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
              {step.icon}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{step.title}</h2>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-600 mb-6 leading-relaxed">{step.content}</p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentStep
                  ? "bg-blue-600 w-4"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Skip tour
          </button>
          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isLast ? "Get Started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
