import {
  Answer,
  DimensionScore,
  MatrixPosition,
  AssessmentResult,
  AccessLevel,
  ProcessLevel,
  EmbeddedValue,
} from "./types";
import { questions } from "./questions";
import { getCellStrategy } from "./strategies";

export function calculateScores(answers: Answer[]): DimensionScore {
  const dimensionSums: Record<string, { total: number; count: number }> = {
    access: { total: 0, count: 0 },
    process: { total: 0, count: 0 },
    embeddedValue: { total: 0, count: 0 },
  };

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const maxValue = Math.max(...question.options.map((o) => o.value));
    const normalized = (answer.value - 1) / (maxValue - 1); // 0 to 1

    dimensionSums[question.dimension].total += normalized;
    dimensionSums[question.dimension].count += 1;
  }

  return {
    access:
      dimensionSums.access.count > 0
        ? dimensionSums.access.total / dimensionSums.access.count
        : 0.5,
    process:
      dimensionSums.process.count > 0
        ? dimensionSums.process.total / dimensionSums.process.count
        : 0.5,
    embeddedValue:
      dimensionSums.embeddedValue.count > 0
        ? dimensionSums.embeddedValue.total / dimensionSums.embeddedValue.count
        : 0.5,
  };
}

export function scoresToPosition(scores: DimensionScore): MatrixPosition {
  const access: AccessLevel = scores.access >= 0.5 ? "hard" : "easy";
  const process: ProcessLevel = scores.process >= 0.5 ? "hard" : "easy";
  const embeddedValue: EmbeddedValue =
    scores.embeddedValue >= 0.5 ? "high" : "low";

  return { access, process, embeddedValue };
}

export function assess(answers: Answer[]): AssessmentResult {
  const scores = calculateScores(answers);
  const position = scoresToPosition(scores);

  const cell = getCellStrategy(
    position.access,
    position.process,
    position.embeddedValue
  );

  const flippedEmbeddedValue: EmbeddedValue =
    position.embeddedValue === "high" ? "low" : "high";
  const whatIfCell = getCellStrategy(
    position.access,
    position.process,
    flippedEmbeddedValue
  );

  return { scores, position, cell, whatIfCell };
}
