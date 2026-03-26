import { Criterion } from './types';

/**
 * R-Strategy Criteria Definitions
 * Based on Siemens scorecard approach
 * 
 * Each criterion has optimal score ranges for each R-strategy
 * Scores are 0-100 where higher is better fit
 */

export const criteria: Criterion[] = [
  // =====================================================
  // SUITABILITY CRITERIA (4)
  // =====================================================
  
  {
    id: 'absolute-product-value',
    name: 'Absolute Product Value',
    category: 'suitability',
    description: 'The economic value of the product in absolute terms',
    icon: '💰',
    scoringMatrix: {
      // High value products are better for reuse/refurbish
      REUSE: { min: 70, max: 100, optimal: 90 },
      REFURBISH: { min: 60, max: 100, optimal: 80 },
      REMANUFACTURE: { min: 50, max: 90, optimal: 70 },
      REPURPOSE: { min: 20, max: 70, optimal: 40 },
      RECYCLE: { min: 0, max: 60, optimal: 30 },
    },
  },
  
  {
    id: 'product-durability',
    name: 'Product Durability / Lifetime',
    category: 'suitability',
    description: 'How long the product maintains functionality and structural integrity',
    icon: '🛡️',
    scoringMatrix: {
      // Durable products suit reuse and remanufacture
      REUSE: { min: 80, max: 100, optimal: 95 },
      REFURBISH: { min: 60, max: 100, optimal: 80 },
      REMANUFACTURE: { min: 70, max: 100, optimal: 85 },
      REPURPOSE: { min: 30, max: 80, optimal: 50 },
      RECYCLE: { min: 0, max: 50, optimal: 25 },
    },
  },
  
  {
    id: 'regulatory-pressure',
    name: 'Validity / Regulatory Pressure',
    category: 'suitability',
    description: 'Regulatory and market drivers for circular economy solutions',
    icon: '📋',
    scoringMatrix: {
      // Low regulatory pressure favors reuse (market-driven)
      // High regulatory pressure may force recycling
      REUSE: { min: 0, max: 40, optimal: 20 },
      REFURBISH: { min: 10, max: 50, optimal: 30 },
      REMANUFACTURE: { min: 20, max: 60, optimal: 40 },
      REPURPOSE: { min: 40, max: 80, optimal: 60 },
      RECYCLE: { min: 60, max: 100, optimal: 80 },
    },
  },
  
  {
    id: 'technological-change',
    name: 'Pace of Technological Change',
    category: 'suitability',
    description: 'How quickly the product becomes obsolete due to technology advances',
    icon: '🚀',
    scoringMatrix: {
      // Slow change favors reuse/remanufacture
      // Fast change may require recycling
      REUSE: { min: 0, max: 30, optimal: 15 },
      REFURBISH: { min: 0, max: 40, optimal: 20 },
      REMANUFACTURE: { min: 20, max: 60, optimal: 40 },
      REPURPOSE: { min: 50, max: 90, optimal: 70 },
      RECYCLE: { min: 60, max: 100, optimal: 85 },
    },
  },
  
  // =====================================================
  // PRACTICALITY CRITERIA (3)
  // =====================================================
  
  {
    id: 'logistics-handling',
    name: 'Ease of Logistics Handling',
    category: 'practicality',
    description: 'How easy it is to collect, transport, and store used products',
    icon: '🚚',
    scoringMatrix: {
      // Reuse doesn't require complex logistics
      // Remanufacture and recycling benefit from good logistics
      REUSE: { min: 0, max: 50, optimal: 25 },
      REFURBISH: { min: 20, max: 60, optimal: 40 },
      REMANUFACTURE: { min: 50, max: 90, optimal: 70 },
      REPURPOSE: { min: 60, max: 100, optimal: 80 },
      RECYCLE: { min: 70, max: 100, optimal: 90 },
    },
  },
  
  {
    id: 'value-recovery',
    name: 'Ease of Value Recovery',
    category: 'practicality',
    description: 'How easy it is to recover economic value from the product',
    icon: '💎',
    scoringMatrix: {
      // Reuse is easiest (no processing)
      // Recycling requires complex processing
      REUSE: { min: 0, max: 40, optimal: 20 },
      REFURBISH: { min: 30, max: 70, optimal: 50 },
      REMANUFACTURE: { min: 50, max: 90, optimal: 75 },
      REPURPOSE: { min: 60, max: 100, optimal: 85 },
      RECYCLE: { min: 70, max: 100, optimal: 90 },
    },
  },
  
  {
    id: 'embedded-value',
    name: 'Embedded Value',
    category: 'practicality',
    description: 'How much value is retained in the used product',
    icon: '🏷️',
    scoringMatrix: {
      // High embedded value favors keeping product intact (reuse/refurbish)
      // Low embedded value may require recycling
      REUSE: { min: 70, max: 100, optimal: 90 },
      REFURBISH: { min: 60, max: 100, optimal: 80 },
      REMANUFACTURE: { min: 50, max: 90, optimal: 70 },
      REPURPOSE: { min: 30, max: 80, optimal: 55 },
      RECYCLE: { min: 0, max: 70, optimal: 40 },
    },
  },
];

// Helper to get criteria by category
export function getCriteriaByCategory(category: 'suitability' | 'practicality'): Criterion[] {
  return criteria.filter((c) => c.category === category);
}

// Helper to get criterion by ID
export function getCriterionById(id: string): Criterion | undefined {
  return criteria.find((c) => c.id === id);
}

// All suitability criteria
export const suitabilityCriteria = getCriteriaByCategory('suitability');

// All practicality criteria
export const practicalityCriteria = getCriteriaByCategory('practicality');
