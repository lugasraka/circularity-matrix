import { Answer } from "./types";

export interface ProductPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  answers: Answer[];
  typicalUseCases: string[];
}

// Pre-defined assessment presets for common product categories
// These are based on typical characteristics of each product type
export const productPresets: ProductPreset[] = [
  {
    id: "smartphone",
    name: "Smartphone",
    category: "Consumer Electronics",
    description: "Mobile devices with high embedded value but complex material composition",
    typicalUseCases: ["iPhone", "Samsung Galaxy", "Google Pixel", " flagship smartphones"],
    answers: [
      { questionId: "access-1", value: 4 }, // Broad retail distribution
      { questionId: "access-2", value: 3 }, // Moderate trade-in programs
      { questionId: "access-3", value: 3 }, // Third-party systems (retailers, carriers)
      { questionId: "process-1", value: 5 }, // Highly complex electronics
      { questionId: "process-2", value: 4 }, // Difficult disassembly
      { questionId: "process-3", value: 4 }, // Battery degradation
      { questionId: "embedded-1", value: 4 }, // High value materials (rare earths)
      { questionId: "embedded-2", value: 4 }, // High brand/tech value retention
    ],
  },
  {
    id: "laptop",
    name: "Laptop Computer",
    category: "Consumer Electronics",
    description: "Portable computers with modular components and strong secondary markets",
    typicalUseCases: ["MacBook", "ThinkPad", "Dell XPS", "business laptops"],
    answers: [
      { questionId: "access-1", value: 4 },
      { questionId: "access-2", value: 3 },
      { questionId: "access-3", value: 3 },
      { questionId: "process-1", value: 4 }, // Complex but less than phones
      { questionId: "process-2", value: 3 }, // Moderate disassembly
      { questionId: "process-3", value: 3 }, // Moderate degradation
      { questionId: "embedded-1", value: 4 },
      { questionId: "embedded-2", value: 4 },
    ],
  },
  {
    id: "office-chair",
    name: "Office Chair",
    category: "Furniture",
    description: "Ergonomic seating with mix of materials, strong B2B market",
    typicalUseCases: ["Herman Miller Aeron", "Steelcase Gesture", "office seating"],
    answers: [
      { questionId: "access-1", value: 3 }, // Select retail partners (B2B)
      { questionId: "access-2", value: 3 }, // Moderate take-back
      { questionId: "access-3", value: 3 }, // Third-party logistics
      { questionId: "process-1", value: 3 }, // Moderate complexity (metal, plastic, fabric)
      { questionId: "process-2", value: 3 }, // Moderate disassembly
      { questionId: "process-3", value: 2 }, // Minor wear
      { questionId: "embedded-1", value: 3 }, // Moderate material value
      { questionId: "embedded-2", value: 4 }, // High brand value (designer chairs)
    ],
  },
  {
    id: "aluminum-can",
    name: "Aluminum Beverage Can",
    category: "Packaging",
    description: "Single-material packaging with established recycling infrastructure",
    typicalUseCases: ["Soda cans", "Beer cans", "beverage packaging"],
    answers: [
      { questionId: "access-1", value: 5 }, // Globally dispersed
      { questionId: "access-2", value: 2 }, // Deposit schemes in many regions
      { questionId: "access-3", value: 2 }, // Municipal recycling systems
      { questionId: "process-1", value: 1 }, // Single material
      { questionId: "process-2", value: 1 }, // No disassembly needed
      { questionId: "process-3", value: 1 }, // Minimal degradation
      { questionId: "embedded-1", value: 2 }, // Below average value per unit
      { questionId: "embedded-2", value: 1 }, // No brand/tech value
    ],
  },
  {
    id: "carpet-tile",
    name: "Commercial Carpet Tile",
    category: "Building Materials",
    description: "Modular flooring with take-back programs but complex material layers",
    typicalUseCases: ["Interface carpet tiles", "modular commercial flooring"],
    answers: [
      { questionId: "access-1", value: 3 }, // B2B distribution
      { questionId: "access-2", value: 2 }, // Strong take-back programs
      { questionId: "access-3", value: 3 }, // Third-party logistics
      { questionId: "process-1", value: 4 }, // Complex bonded layers
      { questionId: "process-2", value: 4 }, // Difficult separation
      { questionId: "process-3", value: 3 }, // Moderate contamination
      { questionId: "embedded-1", value: 2 }, // Low per-unit value
      { questionId: "embedded-2", value: 3 }, // Moderate brand value
    ],
  },
  {
    id: "industrial-pump",
    name: "Industrial Pump",
    category: "Industrial Equipment",
    description: "Heavy machinery with long lifecycles and refurbishment markets",
    typicalUseCases: ["Grundfos pumps", "industrial fluid handling equipment"],
    answers: [
      { questionId: "access-1", value: 2 }, // Direct B2B sales
      { questionId: "access-2", value: 2 }, // Strong incentives (service contracts)
      { questionId: "access-3", value: 2 }, // Partially developed (service networks)
      { questionId: "process-1", value: 3 }, // Moderate complexity
      { questionId: "process-2", value: 3 }, // Moderate disassembly
      { questionId: "process-3", value: 2 }, // Minor wear
      { questionId: "embedded-1", value: 4 }, // High material value (metals)
      { questionId: "embedded-2", value: 3 }, // Moderate tech value
    ],
  },
  {
    id: "ev-battery",
    name: "Electric Vehicle Battery",
    category: "Automotive",
    description: "High-value energy storage with emerging second-life markets",
    typicalUseCases: ["Tesla battery packs", "EV lithium-ion batteries"],
    answers: [
      { questionId: "access-1", value: 3 }, // Through dealers/service centers
      { questionId: "access-2", value: 3 }, // Moderate (warranty exchanges)
      { questionId: "access-3", value: 3 }, // Third-party (dealers)
      { questionId: "process-1", value: 5 }, // Highly complex
      { questionId: "process-2", value: 5 }, // Very difficult/dangerous
      { questionId: "process-3", value: 4 }, // Significant degradation
      { questionId: "embedded-1", value: 5 }, // Very high value (lithium, cobalt)
      { questionId: "embedded-2", value: 4 }, // High tech value
    ],
  },
  {
    id: "running-shoes",
    name: "Athletic Footwear",
    category: "Apparel",
    description: "Complex multi-material products with brand-driven take-back programs",
    typicalUseCases: ["Nike running shoes", "Adidas sneakers", "performance footwear"],
    answers: [
      { questionId: "access-1", value: 4 }, // Broad retail
      { questionId: "access-2", value: 3 }, // Moderate (Nike Grind, etc.)
      { questionId: "access-3", value: 3 }, // Third-party systems
      { questionId: "process-1", value: 4 }, // Complex (foam, rubber, textile, glue)
      { questionId: "process-2", value: 5 }, // Very difficult (bonded materials)
      { questionId: "process-3", value: 3 }, // Moderate wear
      { questionId: "embedded-1", value: 2 }, // Low material value
      { questionId: "embedded-2", value: 4 }, // High brand value
    ],
  },
  {
    id: "packaging-box",
    name: "Cardboard Packaging",
    category: "Packaging",
    description: "Single-use, single-material packaging with excellent recycling rates",
    typicalUseCases: ["Amazon boxes", "shipping cartons", "retail packaging"],
    answers: [
      { questionId: "access-1", value: 5 }, // Globally dispersed
      { questionId: "access-2", value: 3 }, // Moderate (curbside recycling)
      { questionId: "access-3", value: 2 }, // Municipal systems exist
      { questionId: "process-1", value: 1 }, // Single material
      { questionId: "process-2", value: 1 }, // No disassembly
      { questionId: "process-3", value: 2 }, // Minor contamination
      { questionId: "embedded-1", value: 1 }, // Very low value
      { questionId: "embedded-2", value: 1 }, // No brand value
    ],
  },
  {
    id: "wind-turbine",
    name: "Wind Turbine",
    category: "Energy Infrastructure",
    description: "Large-scale renewable energy equipment with 25+ year lifespans",
    typicalUseCases: ["GE wind turbines", "Vestas turbines", "renewable energy infrastructure"],
    answers: [
      { questionId: "access-1", value: 1 }, // Direct to site
      { questionId: "access-2", value: 1 }, // Contractually required (service contracts)
      { questionId: "access-3", value: 2 }, // Partially developed (service networks)
      { questionId: "process-1", value: 4 }, // Complex (blades, generator, tower)
      { questionId: "process-2", value: 4 }, // Difficult (especially blade disposal)
      { questionId: "process-3", value: 3 }, // Moderate degradation
      { questionId: "embedded-1", value: 5 }, // Very high (rare earth magnets, composites)
      { questionId: "embedded-2", value: 4 }, // High tech value
    ],
  },
  {
    id: "coffee-cup",
    name: "Disposable Coffee Cup",
    category: "Food Service",
    description: "Paper-plastic laminate with limited recycling infrastructure",
    typicalUseCases: ["Starbucks cups", "disposable hot beverage cups"],
    answers: [
      { questionId: "access-1", value: 5 }, // Globally dispersed
      { questionId: "access-2", value: 4 }, // Low incentive (hard to recycle)
      { questionId: "access-3", value: 4 }, // Minimal infrastructure
      { questionId: "process-1", value: 4 }, // Complex laminate
      { questionId: "process-2", value: 4 }, // Difficult separation
      { questionId: "process-3", value: 3 }, // Moderate contamination
      { questionId: "embedded-1", value: 1 }, // Very low value
      { questionId: "embedded-2", value: 1 }, // No brand value
    ],
  },
  {
    id: "tires",
    name: "Vehicle Tires",
    category: "Automotive",
    description: "Durable rubber products with established retreading and recycling",
    typicalUseCases: ["Michelin tires", "Goodyear tires", "passenger vehicle tires"],
    answers: [
      { questionId: "access-1", value: 4 }, // Broad retail/service
      { questionId: "access-2", value: 3 }, // Moderate (disposal fees)
      { questionId: "access-3", value: 3 }, // Third-party collection
      { questionId: "process-1", value: 3 }, // Moderate (rubber, steel, textile)
      { questionId: "process-2", value: 3 }, // Moderate (retreading requires skill)
      { questionId: "process-3", value: 2 }, // Tread wear (retreadable)
      { questionId: "embedded-1", value: 3 }, // Moderate (rubber, steel)
      { questionId: "embedded-2", value: 3 }, // Moderate brand value
    ],
  },
];

// Get preset by ID
export function getPresetById(id: string): ProductPreset | undefined {
  return productPresets.find((p) => p.id === id);
}

// Get presets by category
export function getPresetsByCategory(category: string): ProductPreset[] {
  return productPresets.filter((p) => p.category === category);
}

// Get all unique categories
export function getPresetCategories(): string[] {
  return Array.from(new Set(productPresets.map((p) => p.category)));
}

// Search presets by name or use case
export function searchPresets(query: string): ProductPreset[] {
  const lowerQuery = query.toLowerCase();
  return productPresets.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.typicalUseCases.some((use) => use.toLowerCase().includes(lowerQuery))
  );
}

// Convert preset answers to the format expected by the wizard
export function getPresetAnswersMap(preset: ProductPreset): Record<string, number> {
  const map: Record<string, number> = {};
  preset.answers.forEach((a) => {
    map[a.questionId] = a.value;
  });
  return map;
}
