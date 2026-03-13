"use client";

import { useState } from "react";

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const HELP_SECTIONS = [
  {
    id: "framework",
    title: "About the Framework",
    content: `The Circularity Matrix is based on the Harvard Business Review article "The Circular Business Model" by Atasu, Dumas & Van Wassenhove (2021).

It maps products onto an 8-cell matrix based on three dimensions:
• Access Difficulty: How easily can you get the product back from users?
• Process Difficulty: How easily can you recover value from returned products?
• Embedded Value: How much material, component, brand, or technology value does the product retain?`,
  },
  {
    id: "strategies",
    title: "The Three Strategies",
    content: `**Retain Product Ownership (RPO)**
The manufacturer keeps ownership and sells the function as a service (leasing, pay-per-use). Best for products with high embedded value and hard access.

**Product Life Extension (PLE)**
Extend useful life through maintenance, repair, refurbishment, or remanufacturing. Best for high-value products worth preserving.

**Design for Recycling (DFR)**
Design products so materials can be efficiently recovered and recycled. Best for products with easy access and low complexity.`,
  },
  {
    id: "scoring",
    title: "How Scoring Works",
    content: `Each of the 8 questions is scored on a 1-5 scale:
• Questions 1-3: Access Difficulty
• Questions 4-6: Process Difficulty  
• Questions 7-8: Embedded Value

Scores are normalized (0-1) and averaged per dimension. A threshold of 0.5 determines:
• Access: Easy (< 0.5) vs Hard (≥ 0.5)
• Process: Easy (< 0.5) vs Hard (≥ 0.5)
• Embedded Value: Low (< 0.5) vs High (≥ 0.5)`,
  },
  {
    id: "tips",
    title: "Usage Tips",
    content: `• **Edit Products**: Click the pencil icon in your portfolio to edit answers.
• **Duplicate**: Use the copy icon to assess similar products with slight variations.
• **Export**: Save your portfolio as JSON (for backup/sharing), CSV (for analysis), or PDF (for reports).
• **What-if Analysis**: See how changing embedded value affects your strategy recommendation.`,
  },
];

export default function HelpPanel({ isOpen, onClose }: HelpPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("framework");

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Help & Guide</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {HELP_SECTIONS.map((section) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === section.id ? null : section.id
                    )
                  }
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm">
                    {section.title}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      expandedSection === section.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedSection === section.id && (
                  <div className="p-3 text-sm text-gray-600 bg-white">
                    <div className="whitespace-pre-line leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* External resources */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              External Resources
            </h3>
            <a
              href="https://hbr.org/2021/07/the-circular-business-model"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mb-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              HBR Article: The Circular Business Model
            </a>
          </div>

          {/* Creator identity */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Created by
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Raka Adrianto
            </p>
            <div className="space-y-2">
              <a
                href="https://github.com/lugasraka"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub: lugasraka
              </a>
              <a
                href="https://www.linkedin.com/in/lugasraka/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn: lugasraka
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Circularity Matrix v1.0
          </p>
        </div>
      </div>
    </>
  );
}
