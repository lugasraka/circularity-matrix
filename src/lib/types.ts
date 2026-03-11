export type StrategyType = "RPO" | "PLE" | "DFR";

export type EmbeddedValue = "high" | "low";

export type AccessLevel = "easy" | "hard";

export type ProcessLevel = "easy" | "hard";

export type Dimension = "access" | "process" | "embeddedValue";

export interface MatrixPosition {
  access: AccessLevel;
  process: ProcessLevel;
  embeddedValue: EmbeddedValue;
}

export interface CellStrategy {
  id: string;
  strategies: StrategyType[];
  label: string;
  description: string;
  examples: string[];
  guidance: string[];
  position: MatrixPosition;
}

export interface QuestionOption {
  label: string;
  value: number; // 1-5 scale
  description?: string;
}

export interface Question {
  id: string;
  dimension: Dimension;
  text: string;
  helpText: string;
  options: QuestionOption[];
}

export interface Answer {
  questionId: string;
  value: number;
}

export interface DimensionScore {
  access: number; // 0-1, >0.5 = hard
  process: number; // 0-1, >0.5 = hard
  embeddedValue: number; // 0-1, >0.5 = high
}

export interface AssessmentResult {
  scores: DimensionScore;
  position: MatrixPosition;
  cell: CellStrategy;
  whatIfCell: CellStrategy; // Same quadrant, flipped embedded value
}

export interface Product {
  id: string;
  name: string;
  answers: Answer[];
  result: AssessmentResult;
  createdAt: number;
}

export interface Portfolio {
  products: Product[];
}
