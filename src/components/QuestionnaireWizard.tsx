"use client";

import { useState, useEffect, useCallback } from "react";
import { Answer, AssessmentResult } from "../lib/types";
import { questions } from "../lib/questions";
import { assess } from "../lib/scoring";
import QuestionCard from "./QuestionCard";
import PresetSelector from "./PresetSelector";
import AIAssistantPanel from "./AIAssistantPanel";
import { ProductPreset, getPresetAnswersMap } from "../lib/presets";

interface QuestionnaireWizardProps {
  onComplete: (name: string, answers: Answer[], result: AssessmentResult) => void;
  onCancel?: () => void;
  // For editing existing product
  initialProductName?: string;
  initialAnswers?: Answer[];
  editingProductId?: string;
}

export default function QuestionnaireWizard({
  onComplete,
  onCancel,
  initialProductName = "",
  initialAnswers,
  editingProductId,
}: QuestionnaireWizardProps) {
  const [productName, setProductName] = useState(initialProductName);
  const [step, setStep] = useState(-1); // -1 = name input step, -2 = preset selection
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showPresets, setShowPresets] = useState(!editingProductId && !initialAnswers);

  // Initialize from props (editing mode only)
  useEffect(() => {
    if (initialAnswers && initialAnswers.length > 0) {
      // Editing mode - load existing answers
      const answerMap: Record<string, number> = {};
      initialAnswers.forEach((a) => {
        answerMap[a.questionId] = a.value;
      });
      setAnswers(answerMap);
      setProductName(initialProductName);
      setStep(-1);
      setShowPresets(false);
    } else if (!editingProductId) {
      // New product - show presets first
      setStep(-2);
      setShowPresets(true);
    }
  }, [initialAnswers, initialProductName, editingProductId]);

  const handleSelectPreset = (preset: ProductPreset) => {
    setProductName(preset.name);
    setAnswers(getPresetAnswersMap(preset));
    setShowPresets(false);
    setStep(-1); // Go to name step (pre-filled)
  };

  const handleSkipPresets = () => {
    setShowPresets(false);
    setStep(-1);
  };

  const handleApplyAISuggestions = (suggestions: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, ...suggestions }));
  };

  const totalSteps = questions.length;
  const currentQuestion = step >= 0 ? questions[step] : null;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] ?? null : null;

  const canGoNext =
    step === -1 ? productName.trim().length > 0 : currentAnswer !== null;

  const handleSelect = (value: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (step === -1) {
      // Move from name step to first question
      setStep(0);
    } else if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Complete
      const answerList: Answer[] = questions.map((q) => ({
        questionId: q.id,
        value: answers[q.id] ?? 3, // Default to neutral if somehow missing
      }));
      const result = assess(answerList);
      onComplete(productName.trim(), answerList, result);
    }
  };

  const handleBack = () => {
    if (step > -1) {
      setStep(step - 1);
    }
  };

  const progress = step === -1 ? 0 : ((step + 1) / totalSteps) * 100;

  // Dimension label for the current question
  const dimensionLabels: Record<string, string> = {
    access: "Access Difficulty",
    process: "Process Complexity",
    embeddedValue: "Embedded Value",
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>
            {step === -1
              ? "Product Name"
              : `Question ${step + 1} of ${totalSteps}`}
          </span>
          {currentQuestion && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {dimensionLabels[currentQuestion.dimension]}
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      {step === -2 && showPresets ? (
        <PresetSelector onSelectPreset={handleSelectPreset} onSkip={handleSkipPresets} />
      ) : step === -1 ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingProductId ? "Edit Product Name" : "What product are you assessing?"}
            </h3>
            {!editingProductId && (
              <button
                onClick={() => setShowPresets(true)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                ← Back to templates
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Give your product a descriptive name so you can identify it in your
            portfolio.
          </p>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Electric vehicle batteries, Running shoes, Industrial pumps..."
            className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && canGoNext) handleNext();
            }}
            autoFocus
          />
          
          {/* AI Assistant */}
          {!editingProductId && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <AIAssistantPanel
                productName={productName}
                onApplySuggestions={handleApplyAISuggestions}
                currentAnswers={answers}
              />
            </div>
          )}
        </div>
      ) : currentQuestion ? (
        <QuestionCard
          question={currentQuestion}
          selectedValue={currentAnswer}
          onSelect={handleSelect}
        />
      ) : null}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <div>
          {step > -1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>
          ) : onCancel ? (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
          ) : (
            <div />
          )}
        </div>
        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            canGoNext
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {step === totalSteps - 1
            ? editingProductId
              ? "Save Changes"
              : "See Results"
            : "Next →"}
        </button>
      </div>
    </div>
  );
}
