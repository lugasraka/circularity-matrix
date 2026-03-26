import { Criterion } from './types';

/**
 * R-Strategy Criteria Definitions
 * Criteria-based approach for R-strategy selection
 * 
 * Grounded in real-world circular economy decision factors:
 * - Products with HIGH suitability for original purpose should pursue REUSE/REFURBISH
 * - Products where original purpose is no longer viable pursue REPURPOSE/RECYCLE
 * - Practicality reflects infrastructure availability and processing complexity
 */

export const criteria: Criterion[] = [
  // =====================================================
  // SUITABILITY CRITERIA (4)
  // How well the product retains value for its ORIGINAL purpose
  // =====================================================
  
  {
    id: 'absolute-product-value',
    name: 'Absolute Product Value',
    category: 'suitability',
    description: 'Economic value of the product in absolute terms. High-value products warrant more investment in preservation.',
    icon: '💰',
    scoringMatrix: {
      // High value products strongly favor preservation strategies
      REUSE: { min: 80, max: 100, optimal: 95 },
      REFURBISH: { min: 70, max: 100, optimal: 85 },
      REMANUFACTURE: { min: 60, max: 90, optimal: 75 },
      REPURPOSE: { min: 30, max: 70, optimal: 50 },
      RECYCLE: { min: 0, max: 50, optimal: 25 },
    },
  },
  
  {
    id: 'product-durability',
    name: 'Product Durability / Functional Life',
    category: 'suitability',
    description: 'How long the product maintains structural and functional integrity. Durable products are better candidates for reuse and refurbishment.',
    icon: '🛡️',
    scoringMatrix: {
      // Durable products suit reuse and refurbishment
      REUSE: { min: 85, max: 100, optimal: 95 },
      REFURBISH: { min: 70, max: 100, optimal: 85 },
      REMANUFACTURE: { min: 60, max: 95, optimal: 80 },
      REPURPOSE: { min: 40, max: 75, optimal: 55 },
      RECYCLE: { min: 0, max: 50, optimal: 30 },
    },
  },
  
  {
    id: 'regulatory-pressure',
    name: 'Regulatory & Market Pressure',
    category: 'suitability',
    description: 'External drivers mandating circular solutions. High pressure can make lower-value strategies (recycling) viable despite economics.',
    icon: '📋',
    scoringMatrix: {
      // Low pressure: market-driven reuse/refurbishment
      // High pressure: may drive recycling even when not economically optimal
      REUSE: { min: 0, max: 40, optimal: 20 },
      REFURBISH: { min: 20, max: 60, optimal: 40 },
      REMANUFACTURE: { min: 30, max: 70, optimal: 50 },
      REPURPOSE: { min: 40, max: 80, optimal: 60 },
      RECYCLE: { min: 50, max: 100, optimal: 75 },
    },
  },
  
  {
    id: 'technological-change',
    name: 'Pace of Technological Obsolescence',
    category: 'suitability',
    description: 'How quickly the product becomes functionally obsolete. Fast tech change reduces suitability for reuse but may enable repurposing.',
    icon: '🚀',
    scoringMatrix: {
      // Slow change: reuse/refurbishment viable (industrial equipment)
      // Fast change: may drive repurposing (EV batteries) or recycling
      REUSE: { min: 0, max: 30, optimal: 15 },
      REFURBISH: { min: 10, max: 50, optimal: 30 },
      REMANUFACTURE: { min: 20, max: 60, optimal: 40 },
      REPURPOSE: { min: 40, max: 85, optimal: 65 },
      RECYCLE: { min: 60, max: 100, optimal: 80 },
    },
  },
  
  // =====================================================
  // PRACTICALITY CRITERIA (3)
  // Infrastructure and capability required to execute the strategy
  // =====================================================
  
  {
    id: 'logistics-handling',
    name: 'Collection & Logistics Infrastructure',
    category: 'practicality',
    description: 'Availability of reverse logistics to collect, transport, and consolidate used products.',
    icon: '🚚',
    scoringMatrix: {
      // Reuse requires basic collection only
      // Remanufacturing and recycling need sophisticated reverse logistics
      REUSE: { min: 20, max: 60, optimal: 40 },
      REFURBISH: { min: 30, max: 70, optimal: 50 },
      REMANUFACTURE: { min: 50, max: 90, optimal: 70 },
      REPURPOSE: { min: 40, max: 85, optimal: 65 },
      RECYCLE: { min: 60, max: 100, optimal: 85 },
    },
  },
  
  {
    id: 'value-recovery',
    name: 'Processing Complexity',
    category: 'practicality',
    description: 'Technical complexity to recover value. Reuse is simplest; remanufacturing requires expertise; recycling varies by material.',
    icon: '🔧',
    scoringMatrix: {
      // Reuse: minimal processing (just collect and redistribute)
      // Refurbishment: cleaning, testing, minor repairs
      // Remanufacturing: complex disassembly and rebuilding
      // Repurposing: creative redesign for new application
      // Recycling: material separation and processing
      REUSE: { min: 0, max: 30, optimal: 15 },
      REFURBISH: { min: 25, max: 65, optimal: 45 },
      REMANUFACTURE: { min: 60, max: 95, optimal: 80 },
      REPURPOSE: { min: 55, max: 95, optimal: 75 },
      RECYCLE: { min: 50, max: 100, optimal: 85 },
    },
  },
  
  {
    id: 'embedded-value',
    name: 'Embedded Value Preservation',
    category: 'practicality',
    description: 'How much original value can be preserved through each strategy. High embedded value favors keeping product intact.',
    icon: '💎',
    scoringMatrix: {
      // High embedded value: preserve through reuse/refurbishment
      // Lower embedded value: accept material recovery (recycling)
      REUSE: { min: 75, max: 100, optimal: 95 },
      REFURBISH: { min: 65, max: 100, optimal: 85 },
      REMANUFACTURE: { min: 55, max: 90, optimal: 75 },
      REPURPOSE: { min: 35, max: 75, optimal: 55 },
      RECYCLE: { min: 0, max: 60, optimal: 35 },
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
