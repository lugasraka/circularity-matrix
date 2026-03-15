"use client";

import { useState } from "react";
import { AISuggestion, AIAnalysisResult, analyzeProductDescription } from "../lib/ai-assistant";
import { questions } from "../lib/questions";

interface AIAssistantPanelProps {
  productName: string;
  onApplySuggestions: (suggestions: Record<string, number>) => void;
  currentAnswers: Record<string, number>;
}

export default function AIAssistantPanel({
  productName,
  onApplySuggestions,
  currentAnswers,
}: AIAssistantPanelProps) {
  const [description, setDescription] = useState("");
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate processing delay for UX
    setTimeout(() => {
      const result = analyzeProductDescription(productName, description);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 500);
  };

  const handleApplyAll = () => {
    if (!analysis) return;
    const suggestions: Record<string, number> = {};
    analysis.suggestions.forEach((s) => {
      suggestions[s.questionId] = s.suggestedValue;
    });
    onApplySuggestions(suggestions);
  };

  const handleApplySingle = (suggestion: AISuggestion) => {
    onApplySuggestions({ [suggestion.questionId]: suggestion.suggestedValue });
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        AI Assist
        <span className="text-xs opacity-75">(Client-side)</span>
      </button>
    );
  }

  return (
    <div className="bg-purple-50 rounded-xl border border-purple-200 overflow-hidden">
      <div className="p-4 border-b border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h3 className="font-semibold text-purple-900">AI Assistant</h3>
          </div>
          <button
            onClick={() => setShowPanel(false)}
            className="text-purple-600 hover:text-purple-800"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-purple-700 mt-1">
          Get answer suggestions based on your product description. All processing happens in your browser.
        </p>
      </div>

      <div className="p-4">
        {!analysis ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-purple-800 mb-1">
                Describe your product (optional but helps accuracy)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`e.g., "A premium smartphone with aluminum body, OLED screen, and lithium battery. Sold globally through retail partners."`}
                className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
                rows={3}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !productName.trim()}
              className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>Analyze &quot;{productName || "product"}&quot;</>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div
              className={`p-3 rounded-lg border ${getConfidenceColor(analysis.confidenceLevel)}`}
            >
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: analysis.summary }} />
              {analysis.productCategory && (
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-xs font-medium">Detected indicators:</span>
                  {analysis.keyIndicators.map((ind) => (
                    <span key={ind} className="text-xs px-1.5 py-0.5 bg-white/50 rounded">
                      {ind}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-purple-800 uppercase tracking-wide">
                  Suggested Answers
                </h4>
                <button
                  onClick={handleApplyAll}
                  className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  Apply All
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {analysis.suggestions.map((suggestion) => {
                  const question = questions.find((q) => q.id === suggestion.questionId);
                  if (!question) return null;

                  const selectedOption = question.options.find(
                    (o) => o.value === suggestion.suggestedValue
                  );
                  const isApplied = currentAnswers[suggestion.questionId] === suggestion.suggestedValue;

                  return (
                    <div
                      key={suggestion.questionId}
                      className={`p-2 rounded border text-sm ${
                        isApplied
                          ? "bg-green-50 border-green-200"
                          : "bg-white border-purple-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-xs">
                            {question.text}
                          </div>
                          <div className="text-purple-700 mt-0.5">
                            Suggested: {selectedOption?.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {suggestion.reasoning}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded ${getConfidenceColor(
                              suggestion.confidence
                            )}`}
                          >
                            {suggestion.confidence}
                          </span>
                          {!isApplied && (
                            <button
                              onClick={() => handleApplySingle(suggestion)}
                              className="text-xs text-purple-600 hover:text-purple-800"
                            >
                              Apply
                            </button>
                          )}
                          {isApplied && (
                            <span className="text-xs text-green-600">✓ Applied</span>
                          )}
                        </div>
                      </div>

                      {suggestion.alternativeValues && suggestion.alternativeValues.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-purple-100">
                          <span className="text-xs text-gray-500">Also consider: </span>
                          {suggestion.alternativeValues.map((val) => {
                            const opt = question.options.find((o) => o.value === val);
                            return (
                              <button
                                key={val}
                                onClick={() =>
                                  handleApplySingle({ ...suggestion, suggestedValue: val })
                                }
                                className="text-xs text-purple-600 hover:text-purple-800 ml-1 underline"
                              >
                                {opt?.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setAnalysis(null);
                setDescription("");
              }}
              className="w-full py-2 text-sm text-purple-600 hover:text-purple-800 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Analyze Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
