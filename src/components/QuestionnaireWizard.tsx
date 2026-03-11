"use client";

import { useState } from "react";
import { Answer, AssessmentResult } from "../lib/types";
import { questions } from "../lib/questions";
import { assess } from "../lib/scoring";
import QuestionCard from "./QuestionCard";

interface QuestionnaireWizardProps {
  onComplete: (name: string, answers: Answer[], result: AssessmentResult) => void;
  onCancel?: () => void;
}

export default function QuestionnaireWizard({
  onComplete,
  onCancel,
}: QuestionnaireWizardProps) {
  const [productName, setProductName] = useState("");
  const [step, setStep] = useState(-1); // -1 = name input step
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const totalSteps = questions.length;
  const currentQuestion = step >= 0 ? questions[step] : null;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] ?? null : null;

  const canGoNext =
    step === -1 ? productName.trim().length > 0 : currentAnswer !== null;

  function handleSelect(value: number) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }

  function handleNext() {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Complete
      const answerList: Answer[] = questions.map((q) => ({
        questionId: q.id,
        value: answers[q.id],
      }));
      const result = assess(answerList);
      onComplete(productName.trim(), answerList, result);
    }
  }

  function handleBack() {
    if (step > -1) {
      setStep(step - 1);
    }
  }

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
      {step === -1 ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            What product are you assessing?
          </h3>
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
          {step === totalSteps - 1 ? "See Results" : "Next →"}
        </button>
      </div>
    </div>
  );
}
