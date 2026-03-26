/**
 * R-Strategy Framework Types
 * R-Strategy scorecard approach for circular economy strategy selection
 * Based on DIN R-Strategy Framework principles
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
// Grounded in real-world R-strategy hierarchy and feasibility
export interface ZoneBoundary {
  strategy: RStrategy;
  suitabilityMin: number;
  suitabilityMax: number;
  practicalityMin: number;
  practicalityMax: number;
  color: string;
  icon: string;
  description: string;
}

/**
 * R-STRATEGY ZONES - Grounded in Reality
 * 
 * The R-strategy hierarchy follows value preservation priority:
 * REUSE > REFURBISH > REMANUFACTURE > REPURPOSE > RECYCLE
 * 
 * Zone positioning based on:
 * - Suitability: How well the product retains value for its ORIGINAL purpose
 * - Practicality: Infrastructure and capability required to execute the strategy
 */
export const RSTRATEGY_ZONES: ZoneBoundary[] = [
  {
    strategy: 'REUSE',
    // High suitability: Product is still current, functional, valuable
    // Low-medium practicality: Just needs collection and redistribution
    suitabilityMin: 75,
    suitabilityMax: 100,
    practicalityMin: 0,
    practicalityMax: 50,
    color: '#10B981', // emerald-500
    icon: '⟳',
    description: 'Use again as-is: Returnable packaging, resale platforms',
  },
  {
    strategy: 'REFURBISH',
    // High suitability: Product has value worth preserving
    // Medium practicality: Requires cleaning, minor repairs, cosmetic work
    suitabilityMin: 60,
    suitabilityMax: 100,
    practicalityMin: 35,
    practicalityMax: 75,
    color: '#3B82F6', // blue-500
    icon: '🔧',
    description: 'Clean, repair, restore: Electronics, furniture, appliances',
  },
  {
    strategy: 'REMANUFACTURE',
    // Medium-high suitability: Worth rebuilding to like-new
    // High practicality: Needs industrial processes, tooling, expertise
    suitabilityMin: 45,
    suitabilityMax: 80,
    practicalityMin: 65,
    practicalityMax: 95,
    color: '#8B5CF6', // violet-500
    icon: '⚙️',
    description: 'Rebuild to original specs: Engines, industrial equipment',
  },
  {
    strategy: 'REPURPOSE',
    // Low-medium suitability: Can't use for original purpose, but has material value
    // High practicality: Requires creative redesign and new application development
    suitabilityMin: 20,
    suitabilityMax: 55,
    practicalityMin: 60,
    practicalityMax: 100,
    color: '#F59E0B', // amber-500
    icon: '🔄',
    description: 'Use for different function: EV batteries as stationary storage',
  },
  {
    strategy: 'RECYCLE',
    // Low suitability: Low preservation value for product as whole
    // Varying practicality: Depends on material recovery infrastructure
    suitabilityMin: 0,
    suitabilityMax: 45,
    practicalityMin: 50,
    practicalityMax: 100,
    color: '#6B7280', // gray-500
    icon: '♻️',
    description: 'Recover materials: Metals, plastics, paper when other options fail',
  },
];

// Fallback zone for products with high embedded value but low fit for higher strategies
export const RECYCLE_HIGH_VALUE_ZONE: ZoneBoundary = {
  strategy: 'RECYCLE',
  suitabilityMin: 45,
  suitabilityMax: 75,
  practicalityMin: 80,
  practicalityMax: 100,
  color: '#059669', // emerald-600
  icon: '♻️',
  description: 'High-value materials with established recovery infrastructure',
};

// Strategy descriptions grounded in real-world examples
export const RSTRATEGY_DESCRIPTIONS: Record<RStrategy, { 
  name: string; 
  shortDescription: string;
  fullDescription: string;
  examples: string[];
  whenToUse: string[];
}> = {
  REUSE: {
    name: 'Reuse',
    shortDescription: 'Use again without modification',
    fullDescription: 'Products are used again for the same purpose without modification. Preserves all embedded value with minimal effort. Best for durable, standardized products with established return systems.',
    examples: [
      'Returnable transport packaging (RPCs, pallets)',
      'Refillable beverage containers (glass bottles)',
      'Second-hand sales platforms (thrift stores, online marketplaces)',
      'Construction material reuse (bricks, timber)',
      'Medical equipment refurbishment for secondary markets',
    ],
    whenToUse: [
      'Product is still functional and current',
      'Collection and redistribution infrastructure exists',
      'Product is durable and standardized',
      'Market demand for used products exists',
    ],
  },
  REFURBISH: {
    name: 'Refurbish',
    shortDescription: 'Restore to working condition with cosmetic improvements',
    fullDescription: 'Products are cleaned, repaired, tested, and cosmetically improved to like-new condition. Less intensive than remanufacturing. Major driver of circular economy in consumer electronics and furniture.',
    examples: [
      'Smartphones (Apple Certified Refurbished, Samsung Renewed)',
      'Laptops and computers (Back Market, manufacturer programs)',
      'Furniture renewal (Herman Miller, Steelcase remanufactured)',
      'Appliance reconditioning (washing machines, refrigerators)',
      'Automotive parts reconditioning',
    ],
    whenToUse: [
      'Product has high embedded value worth preserving',
      'Repair and testing capabilities available',
      'Strong secondary market demand',
      'Technology is still current or slightly dated',
    ],
  },
  REMANUFACTURE: {
    name: 'Remanufacture',
    shortDescription: 'Rebuild to original specifications with warranty',
    fullDescription: 'Products are completely disassembled, inspected, cleaned, and rebuilt to original specifications using a mix of retained and new components. Quality matches new products with warranty. Industrial-scale operation.',
    examples: [
      'Automotive engines and transmissions (Cummins, Caterpillar)',
      'Industrial pumps and compressors (Grundfos, Sulzer)',
      'Aerospace components (jet engines, landing gear)',
      'Medical imaging equipment (GE, Siemens Healthcare)',
      'Wind turbine gearboxes and generators',
    ],
    whenToUse: [
      'High-value industrial or automotive products',
      'Established remanufacturing infrastructure exists',
      'Original specifications are critical',
      'Product has modular, serviceable design',
    ],
  },
  REPURPOSE: {
    name: 'Repurpose',
    shortDescription: 'Use for a different function than originally intended',
    fullDescription: 'Products are adapted for a different use case. Requires identifying new applications and often some modification. Best for products with unique material properties or energy storage capacity that retain value but cannot fulfill original purpose.',
    examples: [
      'EV batteries → stationary energy storage (Nissan Leaf, Tesla Powerwall)',
      'Shipping containers → housing, offices, retail spaces',
      'Tires → playground surfaces, artificial turf infill',
      'Glass bottles → building materials (glass bricks)',
      'Pallets → furniture, garden features',
    ],
    whenToUse: [
      'Product cannot fulfill original purpose (degraded, obsolete)',
      'Unique properties suitable for different application',
      'New application market exists or can be developed',
      'Transformation is economically viable',
    ],
  },
  RECYCLE: {
    name: 'Recycle',
    shortDescription: 'Recover materials for new production',
    fullDescription: 'Products are processed to recover materials (metals, plastics, paper, glass) for use in manufacturing new products. Final option when other strategies are not viable. Requires established collection and processing infrastructure.',
    examples: [
      'Aluminum cans → new aluminum products (infinitely recyclable)',
      'Steel from appliances and vehicles → new steel production',
      'PET plastics → fiber, new packaging',
      'Paper and cardboard → pulp for new paper products',
      'Rare earth metals from electronics → new components',
    ],
    whenToUse: [
      'Product has low suitability for reuse/repair',
      'Material recovery infrastructure exists',
      'Material value exceeds recovery cost',
      'Other R-strategies not economically viable',
    ],
  },
};

// Fallback threshold - if all strategies score below this, recommend recycling
export const FALLBACK_THRESHOLD = 35;

// High embedded value threshold for recycling recommendation
export const HIGH_EMBEDDED_VALUE_THRESHOLD = 75;
