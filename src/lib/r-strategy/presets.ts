import { CriterionAnswer } from './types';

/**
 * R-Strategy Assessment Presets
 * Pre-filled answers for common product categories
 * Grounded in real-world circular economy practices
 */

export interface RStrategyPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  typicalUseCases: string[];
  answers: Record<string, number>; // questionId -> value (1-5)
  expectedPrimary: string; // Expected primary R-strategy
  reasoning: string; // Why this R-strategy makes sense
}

export const rStrategyPresets: RStrategyPreset[] = [
  // CONSUMER ELECTRONICS - Refurbishment is dominant strategy
  {
    id: 'smartphone',
    name: 'Smartphone',
    category: 'Consumer Electronics',
    description: 'High-value mobile devices with strong refurbishment markets and trade-in programs',
    typicalUseCases: ['iPhone', 'Samsung Galaxy', 'Google Pixel'],
    expectedPrimary: 'REFURBISH',
    reasoning: 'Smartphones have massive refurbishment markets (Apple Certified Refurbished, Samsung Renewed, Back Market). High embedded value, standardized components, and strong secondary demand make refurbishment the clear winner over repurposing.',
    answers: {
      'q-absolute-product-value': 4,      // High ($500-$1,500)
      'q-product-durability': 3,          // Medium (3-5 years usable life)
      'q-regulatory-pressure': 4,         // Strong (e-waste regulations, right to repair)
      'q-technological-change': 3,        // Moderate (annual updates, but 2-3 year old phones still viable)
      'q-logistics-handling': 4,          // Easy (trade-in programs, mail-in)
      'q-value-recovery': 3,              // Moderate (skilled repair needed, but standardized)
      'q-embedded-value': 4,              // High (materials, brand, functionality)
    },
  },
  {
    id: 'laptop',
    name: 'Laptop Computer',
    category: 'Consumer Electronics',
    description: 'Portable computers with 5-10 year lifespans and active secondary markets',
    typicalUseCases: ['MacBook', 'ThinkPad', 'Dell XPS', 'Business laptops'],
    expectedPrimary: 'REFURBISH',
    reasoning: 'Business laptops especially have strong refurbishment markets. Corporate refresh cycles create supply, and 3-5 year old laptops are still highly functional for education and budget-conscious consumers.',
    answers: {
      'q-absolute-product-value': 4,      // High ($800-$2,500)
      'q-product-durability': 4,          // Long (5-10 years possible)
      'q-regulatory-pressure': 3,         // Moderate
      'q-technological-change': 3,        // Moderate
      'q-logistics-handling': 4,          // Easy
      'q-value-recovery': 3,              // Moderate
      'q-embedded-value': 4,              // High
    },
  },
  {
    id: 'television',
    name: 'Television / Display',
    category: 'Consumer Electronics',
    description: 'Large displays with refurbishment potential but challenging logistics',
    typicalUseCases: ['LED/LCD TVs', 'Computer monitors', 'Commercial displays'],
    expectedPrimary: 'REFURBISH',
    reasoning: 'TVs can be refurbished (panel replacement, smart board upgrades), but fragile nature and rapid technology change (4K→8K) limit suitability. Still, large secondary markets exist.',
    answers: {
      'q-absolute-product-value': 3,      // Medium ($300-$2,000)
      'q-product-durability': 3,          // Medium
      'q-regulatory-pressure': 2,         // Weak
      'q-technological-change': 4,        // Fast (resolution, smart features)
      'q-logistics-handling': 2,          // Difficult (fragile, bulky)
      'q-value-recovery': 2,              // Difficult (complex disassembly)
      'q-embedded-value': 3,              // Moderate
    },
  },
  
  // ENERGY STORAGE - Repurposing (second-life) before recycling
  {
    id: 'ev-battery',
    name: 'Electric Vehicle Battery',
    category: 'Energy Storage',
    description: 'High-value lithium-ion batteries with viable second-life stationary applications',
    typicalUseCases: ['Tesla battery packs', 'Nissan Leaf batteries', 'EV modules'],
    expectedPrimary: 'REPURPOSE',
    reasoning: 'EV batteries retain 70-80% capacity when retired from vehicles. Major programs (Nissan xStorage, Tesla Powerwall, BMW i3 home storage) prove second-life viability. Only recycled when capacity drops below viable levels.',
    answers: {
      'q-absolute-product-value': 5,      // Very high ($5,000-$15,000)
      'q-product-durability': 3,          // Medium (degrades but slowly)
      'q-regulatory-pressure': 4,         // Strong (battery regulations)
      'q-technological-change': 3,        // Moderate (chemistry improving but compatible)
      'q-logistics-handling': 3,          // Moderate (hazardous, specialized)
      'q-value-recovery': 2,              // Difficult (cannot refurbish to automotive spec)
      'q-embedded-value': 5,              // Very high (materials, remaining capacity)
    },
  },
  {
    id: 'solar-panel',
    name: 'Solar Panel',
    category: 'Energy Infrastructure',
    description: '25-30 year lifespan with refurbishment and recycling options',
    typicalUseCases: ['Residential solar', 'Commercial installations', 'Solar farms'],
    expectedPrimary: 'REFURBISH',
    reasoning: 'Solar panels can often be refurbished (junction box replacement, cleaning, testing) and resold. 20-year-old panels still produce 80%+ of original output. Recycling mainly for damaged panels or end-of-life recovery.',
    answers: {
      'q-absolute-product-value': 3,      // Medium ($200-$500 per panel)
      'q-product-durability': 5,          // Very long (25-30 years)
      'q-regulatory-pressure': 3,         // Moderate (PV cycle regulations)
      'q-technological-change': 3,        // Moderate (efficiency improving but old panels work)
      'q-logistics-handling': 3,          // Moderate (large, fragile)
      'q-value-recovery': 3,              // Moderate
      'q-embedded-value': 4,              // High (silicon, silver, aluminum)
    },
  },
  
  // INDUSTRIAL - Remanufacturing dominates
  {
    id: 'industrial-pump',
    name: 'Industrial Pump',
    category: 'Industrial Equipment',
    description: 'Heavy rotating equipment with established remanufacturing programs',
    typicalUseCases: ['Grundfos pumps', 'Sulzer pumps', 'Industrial fluid handling'],
    expectedPrimary: 'REMANUFACTURE',
    reasoning: 'Industrial pumps are classic remanufacturing candidates. OEMs (Grundfos, Sulzer, KSB) have established remanufacturing programs. Cast housings last decades, wearing parts (seals, bearings, impellers) are replaced.',
    answers: {
      'q-absolute-product-value': 4,      // High ($2,000-$20,000)
      'q-product-durability': 5,          // Very long (20-40 years)
      'q-regulatory-pressure': 2,         // Weak
      'q-technological-change': 2,        // Slow (fundamental design stable)
      'q-logistics-handling': 3,          // Moderate (B2B logistics)
      'q-value-recovery': 4,              // Easy (modular design, standard parts)
      'q-embedded-value': 4,              // High (cast iron, bronze, stainless steel)
    },
  },
  {
    id: 'wind-turbine',
    name: 'Wind Turbine',
    category: 'Energy Infrastructure',
    description: '25+ year lifespan with component remanufacturing and blade repurposing challenges',
    typicalUseCases: ['GE turbines', 'Vestas turbines', 'Siemens Gamesa'],
    expectedPrimary: 'REMANUFACTURE',
    reasoning: 'Gearboxes, generators, and blades are remanufactured by OEMs (GE, Vestas have major remanufacturing operations). Blades are challenging but being repurposed (bridges, architectural elements) before recycling.',
    answers: {
      'q-absolute-product-value': 5,      // Very high ($1M+ for large turbines)
      'q-product-durability': 5,          // Very long (25-30 years)
      'q-regulatory-pressure': 3,         // Moderate
      'q-technological-change': 2,        // Slow (incremental improvements)
      'q-logistics-handling': 2,          // Difficult (large, remote locations)
      'q-value-recovery': 4,              // Easy (modular components, crane access)
      'q-embedded-value': 5,              // Very high (rare earth magnets, steel, copper)
    },
  },
  {
    id: 'engine',
    name: 'Combustion Engine',
    category: 'Automotive/Industrial',
    description: 'Established remanufacturing industry with OEM warranty programs',
    typicalUseCases: ['Cummins engines', 'Caterpillar engines', 'Automotive engines'],
    expectedPrimary: 'REMANUFACTURE',
    reasoning: 'Engine remanufacturing is one of the most mature circular economy sectors. Cummins, Caterpillar, and automakers offer remanufactured engines with like-new warranties. Block is reused, wearing parts replaced.',
    answers: {
      'q-absolute-product-value': 4,      // High ($5,000-$30,000)
      'q-product-durability': 4,          // Long (designed for multiple lifecycles)
      'q-regulatory-pressure': 3,         // Moderate (emissions regulations)
      'q-technological-change': 3,        // Moderate (EV transition changing landscape)
      'q-logistics-handling': 3,          // Moderate (heavy, but established reverse logistics)
      'q-value-recovery': 4,              // Easy (established reman processes)
      'q-embedded-value': 4,              // High (cast iron, aluminum, precision machined)
    },
  },
  
  // FURNITURE - Refurbishment
  {
    id: 'office-chair',
    name: 'Office Chair',
    category: 'Furniture',
    description: 'Ergonomic seating with strong B2B refurbishment markets',
    typicalUseCases: ['Herman Miller Aeron', 'Steelcase Gesture', 'Haworth chairs'],
    expectedPrimary: 'REFURBISH',
    reasoning: 'Premium office chairs have active refurbishment markets. Components (casters, gas cylinders, arm pads) are standardized and replaced. Used market is strong for $1,000+ chairs.',
    answers: {
      'q-absolute-product-value': 4,      // High ($800-$1,500 for premium)
      'q-product-durability': 4,          // Long (12-15 years designed life)
      'q-regulatory-pressure': 2,         // Weak
      'q-technological-change': 1,        // Very slow
      'q-logistics-handling': 3,          // Moderate
      'q-value-recovery': 3,              // Moderate
      'q-embedded-value': 4,              // High (brand, design, materials)
    },
  },
  {
    id: 'office-desk',
    name: 'Office Desk / Workstation',
    category: 'Furniture',
    description: 'Durable furniture with refurbishment and reuse potential',
    typicalUseCases: ['Height-adjustable desks', 'Modular workstations', 'Meeting tables'],
    expectedPrimary: 'REFURBISH',
    reasoning: 'Desks are refurbished (surface replacement, mechanism repair) or directly reused. Modular systems allow component replacement. Strong secondary market for commercial furniture.',
    answers: {
      'q-absolute-product-value': 3,      // Medium ($500-$2,000)
      'q-product-durability': 4,          // Long
      'q-regulatory-pressure': 2,         // Weak
      'q-technological-change': 2,        // Slow
      'q-logistics-handling': 3,          // Moderate
      'q-value-recovery': 3,              // Moderate
      'q-embedded-value': 3,              // Moderate
    },
  },
  
  // PACKAGING - Reuse and Recycling
  {
    id: 'returnable-packaging',
    name: 'Returnable Transport Packaging',
    category: 'Packaging',
    description: 'Standardized reusable containers for B2B logistics',
    typicalUseCases: ['RPCs (Reusable Plastic Containers)', 'Pallets', 'Crate pools'],
    expectedPrimary: 'REUSE',
    reasoning: 'Returnable packaging is the gold standard for reuse. Standardized pools (CHEP pallets, IFCO RPCs) achieve 50-100+ use cycles. Minimal processing between uses (cleaning, inspection).',
    answers: {
      'q-absolute-product-value': 3,      // Medium ($20-$100 per unit)
      'q-product-durability': 4,          // Long (designed for 50+ cycles)
      'q-regulatory-pressure': 2,         // Weak
      'q-technological-change': 1,        // Very slow
      'q-logistics-handling': 4,          // Easy (established pool systems)
      'q-value-recovery': 4,              // Easy (cleaning, inspection)
      'q-embedded-value': 3,              // Moderate
    },
  },
  {
    id: 'aluminum-can',
    name: 'Aluminum Beverage Can',
    category: 'Packaging',
    description: 'Infinitely recyclable single-material packaging',
    typicalUseCases: ['Soda cans', 'Beer cans', 'Beverage containers'],
    expectedPrimary: 'RECYCLE',
    reasoning: 'Aluminum cans are the recycling success story. 75% of aluminum ever produced is still in use. Collection infrastructure is universal, and recycling uses 95% less energy than primary production.',
    answers: {
      'q-absolute-product-value': 1,      // Very low (<$1)
      'q-product-durability': 1,          // Very short (single use)
      'q-regulatory-pressure': 3,         // Moderate
      'q-technological-change': 1,        // Very slow
      'q-logistics-handling': 5,          // Very easy (municipal recycling)
      'q-value-recovery': 5,              // Very easy (melt and reform)
      'q-embedded-value': 2,              // Low (commodity material only)
    },
  },
  {
    id: 'cardboard-box',
    name: 'Cardboard Packaging',
    category: 'Packaging',
    description: 'Paper-based packaging with established recycling',
    typicalUseCases: ['Shipping boxes', 'Retail packaging', 'E-commerce boxes'],
    expectedPrimary: 'RECYCLE',
    reasoning: 'Cardboard recycling rates exceed 90% in many regions. Fibers can be recycled 5-7 times. Direct reuse limited (contamination, damage), so recycling is dominant strategy.',
    answers: {
      'q-absolute-product-value': 1,      // Very low
      'q-product-durability': 1,          // Very short
      'q-regulatory-pressure': 3,         // Moderate
      'q-technological-change': 1,        // Very slow
      'q-logistics-handling': 5,          // Very easy
      'q-value-recovery': 5,              // Very easy (pulping)
      'q-embedded-value': 1,              // Very low
    },
  },
  
  // AUTOMOTIVE
  {
    id: 'automotive-tire',
    name: 'Vehicle Tire',
    category: 'Automotive',
    description: 'Retreading for commercial, recycling for passenger tires',
    typicalUseCases: ['Commercial truck tires', 'Passenger car tires'],
    expectedPrimary: 'REMANUFACTURE',
    reasoning: 'Commercial truck tires are routinely retreaded (remanufactured) 2-3 times. Passenger tires more often recycled (crumb rubber for asphalt, playgrounds) due to lower economic value.',
    answers: {
      'q-absolute-product-value': 3,      // Medium ($100-$500)
      'q-product-durability': 3,          // Medium
      'q-regulatory-pressure': 3,         // Moderate
      'q-technological-change': 2,        // Slow
      'q-logistics-handling': 4,          // Easy
      'q-value-recovery': 4,              // Easy (retreading infrastructure exists)
      'q-embedded-value': 3,              // Moderate (rubber, steel, textile)
    },
  },
  {
    id: 'carpet-tile',
    name: 'Commercial Carpet Tile',
    category: 'Building Materials',
    description: 'Modular flooring with manufacturer take-back programs',
    typicalUseCases: ['Interface carpet tiles', 'Shaw contract flooring', 'Commercial installations'],
    expectedPrimary: 'RECYCLE',
    reasoning: 'Interface and Shaw have closed-loop recycling programs. Complex multi-layer construction makes refurbishment impractical. Materials (nylon, backing) are recovered and remade into new carpet.',
    answers: {
      'q-absolute-product-value': 2,      // Low
      'q-product-durability': 3,          // Medium
      'q-regulatory-pressure': 3,         // Moderate
      'q-technological-change': 2,        // Slow
      'q-logistics-handling': 3,          // Moderate
      'q-value-recovery': 2,              // Difficult (adhesives, multi-layer)
      'q-embedded-value': 2,              // Low
    },
  },
  
  // APPAREL
  {
    id: 'running-shoes',
    name: 'Athletic Footwear',
    category: 'Apparel',
    description: 'Complex bonded construction challenging to recycle',
    typicalUseCases: ['Nike', 'Adidas', 'Running/training shoes'],
    expectedPrimary: 'RECYCLE',
    reasoning: 'Athletic shoes use bonded multi-material construction (rubber, foam, textile, glue) that is nearly impossible to separate. Nike Grind and similar programs grind shoes into sports surfaces rather than attempt reuse.',
    answers: {
      'q-absolute-product-value': 2,      // Low
      'q-product-durability': 2,          // Short (wear out quickly)
      'q-regulatory-pressure': 2,         // Weak
      'q-technological-change': 2,        // Slow
      'q-logistics-handling': 3,          // Moderate
      'q-value-recovery': 1,              // Very difficult (bonded materials)
      'q-embedded-value': 2,              // Low
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
