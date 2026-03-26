"use client";

import { useState, useEffect } from "react";
import { Answer, AssessmentResult, AssessmentMode } from "../lib/types";
import { questions as hbrQuestions } from "../lib/questions";
import { assess } from "../lib/scoring";
import { rStrategyQuestions } from "../lib/r-strategy/questions";
import { assessRStrategy, convertAnswers } from "../lib/r-strategy/scoring";
import QuestionCard from "./QuestionCard";
import PresetSelector from "./PresetSelector";
import AIAssistantPanel from "./AIAssistantPanel";
import ModeSelector from "./r-strategy/ModeSelector";
import { ProductPreset, getPresetAnswersMap } from "../lib/presets";
import { RStrategyPreset, getPresetById as getRStrategyPresetById } from "../lib/r-strategy/presets";

// Union type for completion data
type CompletionData = 
  | { mode: 'hbr'; answers: Answer[]; result: AssessmentResult }
  | { mode: 'r-strategy'; answers: { criterionId: string; value: number; normalizedScore: number }[]; result: ReturnType<typeof assessRStrategy> };

interface QuestionnaireWizardProps {
  onComplete: (name: string, data: CompletionData) => void;
  onCancel?: () => void;
  // For editing existing product
  initialProductName?: string;
  initialMode?: AssessmentMode;
  initialAnswers?: Answer[];
  initialRStrategyAnswers?: { criterionId: string; value: number; normalizedScore: number }[];
  editingProductId?: string;
}

export default function QuestionnaireWizard({
  onComplete,
  onCancel,
  initialProductName = "",
  initialMode = "r-strategy", // Default to R-strategy for new products
  initialAnswers,
  initialRStrategyAnswers,
  editingProductId,
}: QuestionnaireWizardProps) {
  const [productName, setProductName] = useState(initialProductName);
  const [mode, setMode] = useState<AssessmentMode>(initialMode);
  const [step, setStep] = useState(-2); // -2 = mode selection, -1 = name input, 0+ = questions
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showPresets, setShowPresets] = useState(!editingProductId && !initialAnswers && !initialRStrategyAnswers);

  // Get questions based on current mode
  const questions = mode === 'hbr' ? hbrQuestions : rStrategyQuestions;
  const totalSteps = questions.length;
  const currentQuestion = step >= 0 ? questions[step] : null;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] ?? null : null;

  // Initialize from props (editing mode)
  useEffect(() => {
    if (editingProductId) {
      // Editing mode - determine which mode based on provided answers
      if (initialRStrategyAnswers && initialRStrategyAnswers.length > 0) {
        setMode('r-strategy');
        const answerMap: Record<string, number> = {};
        initialRStrategyAnswers.forEach((a) => {
          // Find question ID for this criterion
          const question = rStrategyQuestions.find(q => q.criterionId === a.criterionId);
          if (question) {
            answerMap[question.id] = a.value;
          }
        });
        setAnswers(answerMap);
        setStep(-1);
        setShowPresets(false);
      } else if (initialAnswers && initialAnswers.length > 0) {
        setMode('hbr');
        const answerMap: Record<string, number> = {};
        initialAnswers.forEach((a) => {
          answerMap[a.questionId] = a.value;
        });
        setAnswers(answerMap);
        setStep(-1);
        setShowPresets(false);
      }
    } else if (!showPresets) {
      // New product without presets - start at mode selection
      setStep(-2);
    }
  }, [initialAnswers, initialRStrategyAnswers, editingProductId, showPresets]);

  const handleSelectPreset = (preset: ProductPreset) => {
    setProductName(preset.name);
    setAnswers(getPresetAnswersMap(preset));
    setMode('hbr');
    setShowPresets(false);
    setStep(-1);
  };

  const handleSelectRStrategyPreset = (preset: RStrategyPreset) => {
    setProductName(preset.name);
    setAnswers(preset.answers);
    setMode('r-strategy');
    setShowPresets(false);
    setStep(-1);
  };

  const handleSkipPresets = () => {
    setShowPresets(false);
    setStep(-2); // Go to mode selection
  };

  const handleApplyAISuggestions = (suggestions: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, ...suggestions }));
  };

  const handleModeChange = (newMode: AssessmentMode) => {
    setMode(newMode);
    setAnswers({}); // Clear answers when switching modes
    setStep(-1); // Go to name input
  };

  const canGoNext =
    step === -2 ? mode !== null :
    step === -1 ? productName.trim().length > 0 : 
    currentAnswer !== null;

  const handleSelect = (value: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (step === -2) {
      // Mode selected, go to name input
      setStep(-1);
    } else if (step === -1) {
      // Name entered, go to first question
      setStep(0);
    } else if (step < totalSteps - 1) {
      // Next question
      setStep(step + 1);
    } else {
      // Complete assessment
      if (mode === 'hbr') {
        const answerList: Answer[] = hbrQuestions.map((q) => ({
          questionId: q.id,
          value: answers[q.id] ?? 3,
        }));
        const result = assess(answerList);
        onComplete(productName.trim(), { mode: 'hbr', answers: answerList, result });
      } else {
        const rStrategyAnswerList = convertAnswers(answers);
        const result = assessRStrategy(rStrategyAnswerList);
        onComplete(productName.trim(), { mode: 'r-strategy', answers: rStrategyAnswerList, result });
      }
    }
  };

  const handleBack = () => {
    if (step > -2) {
      setStep(step - 1);
    }
  };

  const progress = step < 0 ? 0 : ((step + 1) / totalSteps) * 100;

  // Dimension label for HBR questions
  const dimensionLabels: Record<string, string> = {
    access: "Access Difficulty",
    process: "Process Complexity",
    embeddedValue: "Embedded Value",
  };

  // Category label for R-strategy questions
  const categoryLabels: Record<string, string> = {
    suitability: "Suitability",
    practicality: "Practicality",
  };

  // Render preset selector with both HBR and R-strategy options
  if (step === -2 && showPresets) {
    return (
      <div className="max-w-2xl mx-auto">
        <PresetSelector 
          onSelectPreset={handleSelectPreset} 
          onSkip={handleSkipPresets}
          onSelectRStrategyPreset={handleSelectRStrategyPreset}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      {step >= 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              {mode === 'hbr' ? 'HBR Matrix' : 'R-Strategy Scorecard'} · Question {step + 1} of {totalSteps}
            </span>
            {currentQuestion && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {mode === 'hbr' 
                  ? dimensionLabels[(currentQuestion as typeof hbrQuestions[0]).dimension]
                  : categoryLabels[(currentQuestion as typeof rStrategyQuestions[0]).category]
                }
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                mode === 'hbr' ? 'bg-blue-600' : 'bg-emerald-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      {step === -2 ? (
        // Mode selection
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Choose Assessment Framework
          </h3>
          <ModeSelector
            currentMode={mode}
            onModeChange={handleModeChange}
          />
          {!showPresets && (
            <button
              onClick={() => setShowPresets(true)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back to templates
            </button>
          )}
        </div>
      ) : step === -1 ? (
        // Name input
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingProductId ? "Edit Product Name" : "What product are you assessing?"}
            </h3>
            <button
              onClick={() => setStep(-2)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              ← Change framework
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Give your product a descriptive name so you can identify it in your portfolio.
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
          
          {/* AI Assistant - available for both modes */}
          {!editingProductId && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <AIAssistantPanel
                productName={productName}
                onApplySuggestions={handleApplyAISuggestions}
                currentAnswers={answers}
                mode={mode}
              />
            </div>
          )}
        </div>
      ) : currentQuestion ? (
        // Question card
        <QuestionCard
          question={currentQuestion}
          selectedValue={currentAnswer}
          onSelect={handleSelect}
        />
      ) : null}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <div>
          {step > -2 ? (
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
              ? mode === 'hbr'
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {step === totalSteps - 1
            ? editingProductId
              ? "Save Changes"
              : "See Results"
            : step === -2
            ? "Continue →"
            : "Next →"}
        </button>
      </div>
    </div>
  );
}
