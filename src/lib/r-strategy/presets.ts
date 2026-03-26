import { CriterionAnswer } from './types';

/**
 * R-Strategy Assessment Presets
 * Pre-filled answers for common product categories
 */

export interface RStrategyPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  typicalUseCases: string[];
  answers: Record<string, number>; // questionId -> value (1-5)
  expectedPrimary: string; // Expected primary R-strategy
}

export const rStrategyPresets: RStrategyPreset[] = [
  {
    id: 'smartphone',
    name: 'Smartphone',
    category: 'Consumer Electronics',
    description: 'Mobile devices with high embedded value but rapid technological change',
    typicalUseCases: ['iPhone', 'Samsung Galaxy', 'Google Pixel'],
    expectedPrimary: 'REFURBISH',
    answers: {
      'q-absolute-product-value': 4,      // High ($1,000-$5,000)
      'q-product-durability': 3,          // Medium (3-7 years)
      'q-regulatory-pressure': 4,         // Strong (e-waste regulations)
      'q-technological-change': 4,        // Fast (annual updates)
      'q-logistics-handling': 4,          // Easy (trade-in programs)
      'q-value-recovery': 3,              // Moderate (complex disassembly)
      'q-embedded-value': 4,              // High (brand, materials)
    },
  },
  {
    id: 'laptop',
    name: 'Laptop Computer',
    category: 'Consumer Electronics',
    description: 'Portable computers with strong secondary markets',
    typicalUseCases: ['MacBook', 'ThinkPad', 'Dell XPS'],
    expectedPrimary: 'REFURBISH',
    answers: {
      'q-absolute-product-value': 4,      // High
      'q-product-durability': 4,          // Long (7-15 years)
      'q-regulatory-pressure': 3,         // Moderate
      'q-technological-change': 3,        // Moderate
      'q-logistics-handling': 4,          // Easy
      'q-value-recovery': 3,              // Moderate
      'q-embedded-value': 4,              // High
    },
  },
  {
    id: 'aluminum-can',
    name: 'Aluminum Beverage Can',
    category: 'Packaging',
    description: 'Single-material packaging with established recycling infrastructure',
    typicalUseCases: ['Soda cans', 'Beer cans', 'Beverage packaging'],
    expectedPrimary: 'RECYCLE',
    answers: {
      'q-absolute-product-value': 1,      // Very low (<$50)
      'q-product-durability': 1,          // Very short (<1 year)
      'q-regulatory-pressure': 3,         // Moderate
      'q-technological-change': 1,        // Very slow
      'q-logistics-handling': 5,          // Very easy (municipal recycling)
      'q-value-recovery': 5,              // Very easy (melt and reform)
      'q-embedded-value': 2,              // Little (commodity material)
    },
  },
  {
    id: 'industrial-pump',
    name: 'Industrial Pump',
    category: 'Industrial Equipment',
    description: 'Heavy machinery with long lifecycles and refurbishment markets',
    typicalUseCases: ['Grundfos pumps', 'Industrial fluid handling'],
    expectedPrimary: 'REMANUFACTURE',
    answers: {
      'q-absolute-product-value': 5,      // Very high (>$5,000)
      'q-product-durability': 5,          // Very long (>15 years)
      'q-regulatory-pressure': 2,         // Weak
      'q-technological-change': 2,        // Slow
      'q-logistics-handling': 3,          // Moderate (B2B logistics)
      'q-value-recovery': 4,              // Easy (modular design)
      'q-embedded-value': 4,              // High (materials, engineering)
    },
  },
  {
    id: 'ev-battery',
    name: 'Electric Vehicle Battery',
    category: 'Automotive',
    description: 'High-value energy storage with second-life potential',
    typicalUseCases: ['Tesla battery packs', 'EV lithium-ion batteries'],
    expectedPrimary: 'REPURPOSE',
    answers: {
      'q-absolute-product-value': 5,      // Very high
      'q-product-durability': 3,          // Medium (degrades over time)
      'q-regulatory-pressure': 4,         // Strong (battery regulations)
      'q-technological-change': 4,        // Fast (improving chemistry)
      'q-logistics-handling': 3,          // Moderate (hazardous)
      'q-value-recovery': 2,              // Difficult (complex chemistry)
      'q-embedded-value': 5,              // Very high (materials)
    },
  },
  {
    id: 'office-chair',
    name: 'Office Chair',
    category: 'Furniture',
    description: 'Ergonomic seating with mix of materials, strong B2B market',
    typicalUseCases: ['Herman Miller Aeron', 'Steelcase Gesture'],
    expectedPrimary: 'REFURBISH',
    answers: {
      'q-absolute-product-value': 4,      // High
      'q-product-durability': 4,          // Long (7-15 years)
      'q-regulatory-pressure': 2,         // Weak
      'q-technological-change': 1,        // Very slow
      'q-logistics-handling': 3,          // Moderate
      'q-value-recovery': 3,              // Moderate
      'q-embedded-value': 4,              // High (brand, design)
    },
  },
  {
    id: 'carpet-tile',
    name: 'Commercial Carpet Tile',
    category: 'Building Materials',
    description: 'Modular flooring with take-back programs but complex material layers',
    typicalUseCases: ['Interface carpet tiles', 'Modular commercial flooring'],
    expectedPrimary: 'RECYCLE',
    answers: {
      'q-absolute-product-value': 2,      // Low
      'q-product-durability': 3,          // Medium
      'q-regulatory-pressure': 3,         // Moderate
      'q-technological-change': 2,        // Slow
      'q-logistics-handling': 3,          // Moderate
      'q-value-recovery': 2,              // Difficult (layered materials)
      'q-embedded-value': 2,              // Little (low per-unit value)
    },
  },
  {
    id: 'wind-turbine',
    name: 'Wind Turbine',
    category: 'Energy Infrastructure',
    description: 'Large-scale renewable energy equipment with 25+ year lifespans',
    typicalUseCases: ['GE wind turbines', 'Vestas turbines'],
    expectedPrimary: 'REMANUFACTURE',
    answers: {
      'q-absolute-product-value': 5,      // Very high
      'q-product-durability': 5,          // Very long
      'q-regulatory-pressure': 3,         // Moderate
      'q-technological-change': 2,        // Slow
      'q-logistics-handling': 2,          // Difficult (large, remote)
      'q-value-recovery': 4,              // Easy (modular components)
      'q-embedded-value': 5,              // Very high (rare earth magnets)
    },
  },
  {
    id: 'packaging-box',
    name: 'Cardboard Packaging',
    category: 'Packaging',
    description: 'Single-use, single-material packaging with excellent recycling rates',
    typicalUseCases: ['Amazon boxes', 'Shipping cartons'],
    expectedPrimary: 'RECYCLE',
    answers: {
      'q-absolute-product-value': 1,      // Very low
      'q-product-durability': 1,          // Very short
      'q-regulatory-pressure': 3,         // Moderate
      'q-technological-change': 1,        // Very slow
      'q-logistics-handling': 5,          // Very easy
      'q-value-recovery': 5,              // Very easy
      'q-embedded-value': 1,              // Very little
    },
  },
  {
    id: 'running-shoes',
    name: 'Athletic Footwear',
    category: 'Apparel',
    description: 'Complex multi-material products with brand-driven take-back programs',
    typicalUseCases: ['Nike running shoes', 'Adidas sneakers'],
    expectedPrimary: 'RECYCLE',
    answers: {
      'q-absolute-product-value': 2,      // Low
      'q-product-durability': 2,          // Short (1-3 years wear)
      'q-regulatory-pressure': 2,         // Weak
      'q-technological-change': 2,        // Slow
      'q-logistics-handling': 3,          // Moderate
      'q-value-recovery': 2,              // Difficult (bonded materials)
      'q-embedded-value': 3,              // Moderate (brand value)
    },
  },
  {
    id: 'tires',
    name: 'Vehicle Tires',
    category: 'Automotive',
    description: 'Durable rubber products with established retreading and recycling',
    typicalUseCases: ['Michelin tires', 'Goodyear tires'],
    expectedPrimary: 'REMANUFACTURE',
    answers: {
      'q-absolute-product-value': 3,      // Medium
      'q-product-durability': 3,          // Medium
      'q-regulatory-pressure': 3,         // Moderate
      'q-technological-change': 2,        // Slow
      'q-logistics-handling': 4,          // Easy
      'q-value-recovery': 4,              // Easy (retreading)
      'q-embedded-value': 3,              // Moderate (rubber, steel)
    },
  },
  {
    id: 'returnable-packaging',
    name: 'Returnable Transport Packaging',
    category: 'Packaging',
    description: 'Reusable crates, pallets, and containers for B2B logistics',
    typicalUseCases: ['RPCs', 'Reusable pallets', 'Returnable containers'],
    expectedPrimary: 'REUSE',
    answers: {
      'q-absolute-product-value': 3,      // Medium
      'q-product-durability': 4,          // Long (designed for multiple uses)
      'q-regulatory-pressure': 2,         // Weak
      'q-technological-change': 1,        // Very slow
      'q-logistics-handling': 3,          // Moderate (requires return system)
      'q-value-recovery': 3,              // Moderate (cleaning, inspection)
      'q-embedded-value': 3,              // Moderate
    },
  },
];

// Get preset by ID
export function getPresetById(id: string): RStrategyPreset | undefined {
  return rStrategyPresets.find((p) => p.id === id);
}

// Get presets by category
export function getPresetsByCategory(category: string): RStrategyPreset[] {
  return rStrategyPresets.filter((p) => p.category === category);
}

// Get all unique categories
export function getPresetCategories(): string[] {
  return Array.from(new Set(rStrategyPresets.map((p) => p.category)));
}

// Search presets
export function searchPresets(query: string): RStrategyPreset[] {
  const lowerQuery = query.toLowerCase();
  return rStrategyPresets.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.typicalUseCases.some((use) => use.toLowerCase().includes(lowerQuery))
  );
}
