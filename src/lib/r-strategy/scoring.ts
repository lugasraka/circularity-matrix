import {
  CriterionAnswer,
  RStrategyResult,
  RStrategyScore,
  RStrategyCriterionScore,
  RStrategy,
  Criterion,
  FALLBACK_THRESHOLD,
  HIGH_EMBEDDED_VALUE_THRESHOLD,
} from './types';
import { criteria, getCriterionById } from './criteria';
import { rStrategyQuestions } from './questions';

const RSTRATEGIES: RStrategy[] = ['REUSE', 'REFURBISH', 'REMANUFACTURE', 'REPURPOSE', 'RECYCLE'];

/**
 * Calculate the fit score for a single criterion against an R-strategy
 * 
 * Score is based on how close the answer is to the optimal range
 * - 100 = perfect match with optimal
 * - 0 = completely outside optimal range
 */
function calculateCriterionFitScore(
  answerScore: number, // 0-100
  criterion: Criterion,
  rStrategy: RStrategy
): number {
  const range = criterion.scoringMatrix[rStrategy];
  
  // If within optimal range, calculate based on distance from optimal point
  if (answerScore >= range.min && answerScore <= range.max) {
    // Distance from optimal (0 = perfect, maxDistance = worst in range)
    const distance = Math.abs(answerScore - range.optimal);
    const maxDistance = Math.max(
      range.optimal - range.min,
      range.max - range.optimal
    );
    
    // Score inversely proportional to distance (100 at optimal, decreases toward edges)
    if (maxDistance === 0) return 100;
    return Math.round(100 - (distance / maxDistance) * 30); // Max 30% penalty at edges
  }
  
  // If below minimum, calculate penalty
  if (answerScore < range.min) {
    const distance = range.min - answerScore;
    // Linear penalty: 70 at min, decreasing
    return Math.max(0, 70 - distance);
  }
  
  // If above maximum, calculate penalty
  if (answerScore > range.max) {
    const distance = answerScore - range.max;
    // Linear penalty: 70 at max, decreasing
    return Math.max(0, 70 - distance);
  }
  
  return 0;
}

/**
 * Calculate scores for all criteria across all R-strategies
 */
function calculateAllCriterionScores(
  answers: CriterionAnswer[]
): RStrategyCriterionScore[] {
  return criteria.map((criterion) => {
    const answer = answers.find((a) => a.criterionId === criterion.id);
    const answerScore = answer?.normalizedScore ?? 50; // Default to neutral
    
    const scores: Record<RStrategy, number> = {
      REUSE: 0,
      REFURBISH: 0,
      REMANUFACTURE: 0,
      REPURPOSE: 0,
      RECYCLE: 0,
    };
    
    // Calculate fit score for each R-strategy
    for (const rStrategy of RSTRATEGIES) {
      scores[rStrategy] = calculateCriterionFitScore(answerScore, criterion, rStrategy);
    }
    
    return {
      criterionId: criterion.id,
      criterionName: criterion.name,
      category: criterion.category,
      scores,
    };
  });
}

/**
 * Aggregate criterion scores to R-strategy level
 */
function aggregateRStrategyScores(
  criterionScores: RStrategyCriterionScore[]
): RStrategyScore[] {
  const scores: RStrategyScore[] = [];
  
  for (const rStrategy of RSTRATEGIES) {
    // Get suitability scores (4 criteria)
    const suitabilityCriteria = criterionScores.filter((cs) => cs.category === 'suitability');
    const suitabilityScore = Math.round(
      suitabilityCriteria.reduce((sum, cs) => sum + cs.scores[rStrategy], 0) / 
      suitabilityCriteria.length
    );
    
    // Get practicality scores (3 criteria)
    const practicalityCriteria = criterionScores.filter((cs) => cs.category === 'practicality');
    const practicalityScore = Math.round(
      practicalityCriteria.reduce((sum, cs) => sum + cs.scores[rStrategy], 0) / 
      practicalityCriteria.length
    );
    
    // Calculate overall with 60/40 weighting toward suitability
    const overallScore = Math.round(suitabilityScore * 0.6 + practicalityScore * 0.4);
    
    // Determine qualitative zones
    const getZone = (score: number): 'very-weak' | 'weak' | 'moderate' | 'strong' | 'very-strong' => {
      if (score < 20) return 'very-weak';
      if (score < 40) return 'weak';
      if (score < 60) return 'moderate';
      if (score < 80) return 'strong';
      return 'very-strong';
    };
    
    scores.push({
      strategy: rStrategy,
      suitabilityScore,
      practicalityScore,
      overallScore,
      rank: 0, // Will be set after sorting
      zone: {
        suitability: getZone(suitabilityScore),
        practicality: getZone(practicalityScore),
      },
    });
  }
  
  // Sort by overall score and assign ranks
  scores.sort((a, b) => b.overallScore - a.overallScore);
  scores.forEach((score, index) => {
    score.rank = index + 1;
  });
  
  return scores;
}

/**
 * Determine if recycling should be recommended as fallback
 */
function determineRecyclingFallback(
  rStrategyScores: RStrategyScore[],
  criterionScores: RStrategyCriterionScore[]
): { isFallback: boolean; reason?: 'low_both_scores' | 'high_embedded_value' } {
  // Check scenario 1: All R-strategies score low on both dimensions
  const allLowScores = rStrategyScores.every(
    (s) => s.suitabilityScore < FALLBACK_THRESHOLD && s.practicalityScore < FALLBACK_THRESHOLD
  );
  
  if (allLowScores) {
    return { isFallback: true, reason: 'low_both_scores' };
  }
  
  // Check scenario 2: High embedded value justifies recycling
  const embeddedValueCriterion = criterionScores.find(
    (cs) => cs.criterionId === 'embedded-value'
  );
  
  if (embeddedValueCriterion) {
    const embeddedValueScore = embeddedValueCriterion.scores.RECYCLE;
    const reuseScore = embeddedValueCriterion.scores.REUSE;
    const refurbishScore = embeddedValueCriterion.scores.REFURBISH;
    
    // If recycling score for embedded value is high, but reuse/refurbish are low
    // This indicates high material value but poor product preservation value
    if (
      embeddedValueScore >= HIGH_EMBEDDED_VALUE_THRESHOLD &&
      reuseScore < 60 &&
      refurbishScore < 60
    ) {
      return { isFallback: true, reason: 'high_embedded_value' };
    }
  }
  
  return { isFallback: false };
}

/**
 * Main assessment function
 * Takes raw answers and returns complete R-strategy results
 */
export function assessRStrategy(
  answers: CriterionAnswer[]
): RStrategyResult {
  // Step 1: Calculate criterion-level scores
  const criterionScores = calculateAllCriterionScores(answers);
  
  // Step 2: Aggregate to R-strategy level
  const rStrategyScores = aggregateRStrategyScores(criterionScores);
  
  // Step 3: Determine fallback logic
  const { isFallback, reason } = determineRecyclingFallback(rStrategyScores, criterionScores);
  
  // Step 4: Determine recommendations
  let primaryRecommendation: RStrategy;
  let secondaryRecommendations: RStrategy[];
  
  if (isFallback && reason === 'low_both_scores') {
    // No good fit found - recommend recycling as fallback
    primaryRecommendation = 'RECYCLE';
    // Secondary: top 2 scoring strategies (even if low)
    secondaryRecommendations = rStrategyScores
      .filter((s) => s.strategy !== 'RECYCLE')
      .slice(0, 2)
      .map((s) => s.strategy);
  } else if (isFallback && reason === 'high_embedded_value') {
    // High embedded value scenario - recycling preferred
    primaryRecommendation = 'RECYCLE';
    // Secondary: best reuse/refurbish options if viable
    secondaryRecommendations = rStrategyScores
      .filter((s) => s.strategy !== 'RECYCLE' && s.overallScore > 50)
      .slice(0, 2)
      .map((s) => s.strategy);
  } else {
    // Normal case - top scoring strategy
    primaryRecommendation = rStrategyScores[0].strategy;
    secondaryRecommendations = rStrategyScores
      .slice(1, 3)
      .map((s) => s.strategy);
  }
  
  return {
    mode: 'r-strategy',
    scores: rStrategyScores,
    primaryRecommendation,
    secondaryRecommendations,
    criterionScores,
    isRecyclingFallback: isFallback,
    recyclingReason: reason,
    answers,
  };
}

/**
 * Convert raw question answers to criterion answers
 */
export function convertAnswers(
  rawAnswers: Record<string, number> // questionId -> value (1-5)
): CriterionAnswer[] {
  return Object.entries(rawAnswers).map(([questionId, value]) => {
    const question = rStrategyQuestions.find((q) => q.id === questionId);
    if (!question) {
      return {
        criterionId: '',
        value: 0,
        normalizedScore: 50,
      };
    }
    
    const option = question.options.find((o) => o.value === value);
    const normalizedScore = option?.scoreValue ?? 50;
    
    return {
      criterionId: question.criterionId,
      value,
      normalizedScore,
    };
  });
}

/**
 * Get qualitative label for a score
 */
export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Very strong';
  if (score >= 60) return 'Strong';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Weak';
  return 'Very weak';
}

/**
 * Get color for a score (for visualizations)
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981'; // green-500
  if (score >= 60) return '#3B82F6'; // blue-500
  if (score >= 40) return '#F59E0B'; // amber-500
  if (score >= 20) return '#EF4444'; // red-500
  return '#6B7280'; // gray-500
}
