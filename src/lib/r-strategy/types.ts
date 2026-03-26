/**
 * R-Strategy Framework Types
 * Based on Siemens scorecard approach for circular economy strategy selection
 */

export type RStrategy = 'REUSE' | 'REFURBISH' | 'REMANUFACTURE' | 'REPURPOSE' | 'RECYCLE';

export type CriterionCategory = 'suitability' | 'practicality';

export type AssessmentMode = 'hbr' | 'r-strategy';

export interface CriterionScoringRange {
  min: number;      // Minimum optimal score (0-100)
  max: number;      // Maximum optimal score (0-100)
  optimal: number;  // Ideal score (0-100)
}

export interface Criterion {
  id: string;
  name: string;
  category: CriterionCategory;
  description: string;
  icon: string; // Emoji or icon identifier
  // Scoring matrix: R-strategy → optimal range
  scoringMatrix: Record<RStrategy, CriterionScoringRange>;
}

export interface QuestionOption {
  label: string;
  value: number; // 1-5 scale
  description?: string;
  scoreValue: number; // Normalized 0-100 for calculations
}

export interface RStrategyQuestion {
  id: string;
  criterionId: string;
  category: CriterionCategory;
  text: string;
  helpText: string;
  options: QuestionOption[];
}

export interface CriterionAnswer {
  criterionId: string;
  value: number; // 1-5 (raw answer)
  normalizedScore: number; // 0-100
}

export interface RStrategyCriterionScore {
  criterionId: string;
  criterionName: string;
  category: CriterionCategory;
  scores: Record<RStrategy, number>; // Score for each R-strategy (0-100)
}

export interface RStrategyScore {
  strategy: RStrategy;
  suitabilityScore: number; // 0-100 (average of 4 suitability criteria)
  practicalityScore: number; // 0-100 (average of 3 practicality criteria)
  overallScore: number; // 0-100 (weighted: 60% suitability + 40% practicality)
  rank: number; // 1-5
  zone: {
    suitability: 'very-weak' | 'weak' | 'moderate' | 'strong' | 'very-strong';
    practicality: 'very-weak' | 'weak' | 'moderate' | 'strong' | 'very-strong';
  };
}

export interface RStrategyResult {
  mode: 'r-strategy';
  scores: RStrategyScore[];
  primaryRecommendation: RStrategy;
  secondaryRecommendations: RStrategy[];
  criterionScores: RStrategyCriterionScore[];
  // Fallback logic
  isRecyclingFallback: boolean;
  recyclingReason?: 'low_both_scores' | 'high_embedded_value';
  // Raw data
  answers: CriterionAnswer[];
}

// Zone boundaries for the scatter plot visualization
export interface ZoneBoundary {
  strategy: RStrategy;
  suitabilityMin: number;
  suitabilityMax: number;
  practicalityMin: number;
  practicalityMax: number;
  color: string;
  icon: string;
}

// Zone definitions based on Siemens framework
export const RSTRATEGY_ZONES: ZoneBoundary[] = [
  {
    strategy: 'REUSE',
    suitabilityMin: 70,
    suitabilityMax: 100,
    practicalityMin: 0,
    practicalityMax: 60,
    color: '#10B981', // emerald-500
    icon: '⟳',
  },
  {
    strategy: 'REFURBISH',
    suitabilityMin: 60,
    suitabilityMax: 90,
    practicalityMin: 30,
    practicalityMax: 75,
    color: '#3B82F6', // blue-500
    icon: '🔧',
  },
  {
    strategy: 'REMANUFACTURE',
    suitabilityMin: 45,
    suitabilityMax: 75,
    practicalityMin: 50,
    practicalityMax: 85,
    color: '#8B5CF6', // violet-500
    icon: '⚙️',
  },
  {
    strategy: 'REPURPOSE',
    suitabilityMin: 25,
    suitabilityMax: 60,
    practicalityMin: 60,
    practicalityMax: 100,
    color: '#F59E0B', // amber-500
    icon: '🔄',
  },
  {
    strategy: 'RECYCLE',
    suitabilityMin: 0,
    suitabilityMax: 45,
    practicalityMin: 0,
    practicalityMax: 45,
    color: '#6B7280', // gray-500 (fallback zone)
    icon: '♻️',
  },
];

// Extended zone for RECYCLE when embedded value is high
export const RECYCLE_HIGH_VALUE_ZONE: ZoneBoundary = {
  strategy: 'RECYCLE',
  suitabilityMin: 70,
  suitabilityMax: 100,
  practicalityMin: 70,
  practicalityMax: 100,
  color: '#059669', // emerald-600
  icon: '♻️',
};

// Strategy descriptions
export const RSTRATEGY_DESCRIPTIONS: Record<RStrategy, { 
  name: string; 
  shortDescription: string;
  fullDescription: string;
  examples: string[];
}> = {
  REUSE: {
    name: 'Reuse',
    shortDescription: 'Direct reuse without modification',
    fullDescription: 'Products are used again for the same purpose without significant modification. This preserves all embedded value and requires minimal processing.',
    examples: [
      'Returnable transport packaging',
      'Second-hand sales platforms',
      'Reuse of construction materials',
      'Refillable containers',
    ],
  },
  REFURBISH: {
    name: 'Refurbish',
    shortDescription: 'Clean, repair, and cosmetic improvements',
    fullDescription: 'Products are cleaned, repaired, and updated to improve appearance and functionality. Less intensive than remanufacturing.',
    examples: [
      'Refurbished electronics',
      'Renewed furniture',
      'Reconditioned appliances',
      'Cosmetic restoration of vehicles',
    ],
  },
  REMANUFACTURE: {
    name: 'Remanufacture',
    shortDescription: 'Restore to like-new condition with warranty',
    fullDescription: 'Products are disassembled, inspected, and rebuilt to original specifications with new or refurbished parts. Quality matches new products.',
    examples: [
      'Remanufactured engines',
      'Rebuilt industrial equipment',
      'Refurbished medical devices',
      'Restored office equipment',
    ],
  },
  REPURPOSE: {
    name: 'Repurpose',
    shortDescription: 'Use for a different function',
    fullDescription: 'Products are adapted for a different use than originally intended. Requires creativity and design for new applications.',
    examples: [
      'Shipping containers as housing',
      'Tires as playground surfaces',
      'Pallets as furniture',
      'Glass bottles as building materials',
    ],
  },
  RECYCLE: {
    name: 'Recycle',
    shortDescription: 'Recover materials for new products',
    fullDescription: 'Products are processed to recover materials that can be used to manufacture new products. The final option when other strategies are not viable.',
    examples: [
      'Metal recycling (aluminum, steel)',
      'Plastic reprocessing',
      'Paper pulping',
      'Glass melting',
    ],
  },
};

// Fallback threshold - if all strategies score below this, recommend recycling
export const FALLBACK_THRESHOLD = 35;

// High embedded value threshold for recycling recommendation
export const HIGH_EMBEDDED_VALUE_THRESHOLD = 80;
