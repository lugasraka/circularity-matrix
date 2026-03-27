import { Answer, Dimension } from "./types";
import { questions } from "./questions";

export interface AISuggestion {
  questionId: string;
  suggestedValue: number;
  confidence: "high" | "medium" | "low";
  reasoning: string;
  alternativeValues?: number[];
}

export interface AIAnalysisResult {
  suggestions: AISuggestion[];
  summary: string;
  productCategory: string | null;
  confidenceLevel: "high" | "medium" | "low";
  keyIndicators: string[];
}

// Product category patterns and their typical characteristics
// ANSWER VALUES: 1-5 scale where:
// - For ACCESS questions: 1=Easy access, 5=Hard access
// - For PROCESS questions: 1=Easy process, 5=Hard process  
// - For EMBEDDED questions: 1=Low value, 5=High value
interface CategoryPattern {
  name: string;
  keywords: string[];
  descriptionPatterns: string[];
  typicalAnswers: Partial<Record<string, number>>;
  confidenceIndicators: string[];
  expectedStrategy: string; // Expected HBR strategy outcome
}

// Rule-based patterns for product categorization
// Patterns designed to produce realistic HBR Matrix outcomes
const categoryPatterns: CategoryPattern[] = [
  {
    name: "Consumer Electronics",
    keywords: [
      "phone", "smartphone", "laptop", "computer", "tablet", "device",
      "electronics", "screen", "display", "gadget", "tech",
    ],
    descriptionPatterns: [
      "electronic", "digital", "smart", "tech", "battery", "charging", "software",
    ],
    // Smartphones/laptops: Hard access (dispersed), Hard process (complex), High embedded value
    // Expected: PLE (Product Life Extension) - refurbishment/remanufacturing
    typicalAnswers: {
      "access-1": 4, // Broad retail (hard to get back)
      "access-2": 4, // Low return incentive (trade-in exists but many don't use)
      "access-3": 3, // Third-party systems (moderate reverse logistics)
      "process-1": 4, // Complex materials (multi-material, electronics)
      "process-2": 4, // Difficult disassembly (glued, sealed)
      "process-3": 3, // Moderate degradation (functional but battery degrades)
      "embedded-1": 4, // High material value (rare earth, metals)
      "embedded-2": 4, // High brand value (Apple, Samsung, etc.)
    },
    confidenceIndicators: ["battery", "screen", "chip", "processor", "memory", "iphone", "macbook", "samsung"],
    expectedStrategy: "PLE (Product Life Extension) - Refurbishment",
  },
  {
    name: "Apparel & Textiles",
    keywords: [
      "shirt", "pants", "dress", "jacket", "shoe", "sneaker", "footwear",
      "clothing", "apparel", "textile", "fabric", "garment", "wear",
    ],
    descriptionPatterns: [
      "wear", "clothing", "fashion", "garment", "textile", "fabric", "cotton", "polyester", "wool", "leather",
    ],
    // Clothing: Hard access (dispersed), Easy process (simple materials), Low embedded value
    // Expected: DFR (Design for Recycling) or secondhand markets
    typicalAnswers: {
      "access-1": 5, // Globally dispersed (very hard to get back)
      "access-2": 4, // Low return incentive (no deposit, inconvenient)
      "access-3": 3, // Moderate reverse logistics (some collection)
      "process-1": 2, // Simple materials (mostly textiles)
      "process-2": 2, // Easy disassembly (simple construction)
      "process-3": 3, // Moderate degradation (wear and tear)
      "embedded-1": 2, // Low material value (cotton, polyester)
      "embedded-2": 2, // Low brand value (fast fashion)
    },
    confidenceIndicators: ["cotton", "polyester", "fashion", "fast fashion", "t-shirt", "jeans"],
    expectedStrategy: "DFR (Design for Recycling) or Secondhand",
  },
  {
    name: "Industrial Equipment",
    keywords: [
      "machine", "equipment", "industrial", "machinery", "pump", "compressor",
      "motor", "generator", "turbine", "engine", "heavy equipment",
    ],
    descriptionPatterns: [
      "industrial", "commercial", "heavy-duty", "infrastructure", "manufacturing", "plant", "facility",
    ],
    // Industrial: Easy access (B2B, contracts), Hard process (complex), High embedded value
    // Expected: RPO (Retain Product Ownership) or PLE
    typicalAnswers: {
      "access-1": 1, // Direct B2B (easy to track)
      "access-2": 1, // Contractually required (leased, serviced)
      "access-3": 3, // Moderate reverse logistics (specialized transport)
      "process-1": 5, // Very complex (heavy machinery, multiple systems)
      "process-2": 4, // Difficult disassembly (bolted, heavy)
      "process-3": 2, // Minor degradation (built to last, maintained)
      "embedded-1": 5, // Very high material value (steel, rare earth)
      "embedded-2": 4, // High brand value (Caterpillar, Siemens, etc.)
    },
    confidenceIndicators: ["industrial", "machinery", "equipment", "caterpillar", "siemens", "ge", "pump"],
    expectedStrategy: "RPO (Retain Product Ownership) or PLE",
  },
  {
    name: "Automotive",
    keywords: [
      "car", "vehicle", "automotive", "tire", "battery", "ev", "truck", "auto",
      "sedan", "suv", "motorcycle", "fleet",
    ],
    descriptionPatterns: [
      "vehicle", "transportation", "automotive", "driving", "engine", "motor", "mileage", "fleet",
    ],
    // Vehicles: Moderate access (dealer networks), Hard process (complex), High embedded value
    // Expected: PLE (remanufacturing)
    typicalAnswers: {
      "access-1": 3, // Dealer network (moderate tracking)
      "access-2": 3, // Moderate incentive (trade-in programs)
      "access-3": 3, // Moderate reverse logistics (established channels)
      "process-1": 5, // Very complex (thousands of parts)
      "process-2": 4, // Difficult disassembly (specialized tools needed)
      "process-3": 3, // Moderate degradation (wear but maintainable)
      "embedded-1": 4, // High material value (steel, aluminum, copper)
      "embedded-2": 4, // High brand value (Toyota, BMW, etc.)
    },
    confidenceIndicators: ["vehicle", "car", "automotive", "tire", "engine", "transmission", "fleet"],
    expectedStrategy: "PLE (Product Life Extension) - Remanufacturing",
  },
  {
    name: "Packaging",
    keywords: [
      "packaging", "container", "bottle", "box", "carton", "wrapper", "bag",
      "pallet", "crate", "shipping",
    ],
    descriptionPatterns: [
      "packaging", "container", "shipping", "transport", "single-use", "disposable", "wrap",
    ],
    // Packaging: Very hard access (dispersed), Easy process (simple materials), Low embedded value
    // Expected: DFR (Design for Recycling)
    typicalAnswers: {
      "access-1": 5, // Globally dispersed (impossible to track)
      "access-2": 5, // No return incentive (discarded after use)
      "access-3": 3, // Moderate reverse logistics (municipal recycling)
      "process-1": 1, // Simple materials (paper, plastic, glass)
      "process-2": 2, // Easy disassembly (not assembled)
      "process-3": 4, // Significant degradation (consumed)
      "embedded-1": 1, // Low material value (commodity materials)
      "embedded-2": 1, // No brand value
    },
    confidenceIndicators: ["packaging", "cardboard", "plastic bag", "bottle", "container", "single-use"],
    expectedStrategy: "DFR (Design for Recycling)",
  },
  {
    name: "Building Materials",
    keywords: [
      "carpet", "flooring", "tile", "insulation", "roofing", "window", "door",
      "building", "construction", "material", "concrete", "steel beam",
    ],
    descriptionPatterns: [
      "construction", "building", "installation", "commercial space", "residential", "renovation", "infrastructure",
    ],
    // Building materials: Moderate access (B2B), Moderate process, Low embedded value per unit
    // Expected: DFR (recycling) or reuse for some materials
    typicalAnswers: {
      "access-1": 3, // B2B (some tracking)
      "access-2": 3, // Moderate incentive (waste disposal costs)
      "access-3": 4, // Easy reverse logistics (construction waste collection)
      "process-1": 3, // Moderate complexity (layered materials)
      "process-2": 3, // Moderate disassembly (cut, tear)
      "process-3": 3, // Moderate degradation (wear from use)
      "embedded-1": 2, // Low per-unit value (bulk materials)
      "embedded-2": 2, // Low brand value
    },
    confidenceIndicators: ["construction", "building", "carpet", "flooring", "insulation", "concrete"],
    expectedStrategy: "DFR (Design for Recycling)",
  },
  {
    name: "Medical Equipment",
    keywords: [
      "medical", "healthcare", "hospital", "clinical", "diagnostic", "surgical",
      "mri", "x-ray", "ventilator", "monitor", "sterilizer",
    ],
    descriptionPatterns: [
      "medical", "healthcare", "clinical", "hospital", "diagnostic", "patient care", "sterile",
    ],
    // Medical: Easy access (hospitals, contracts), Hard process (regulated), High embedded value
    // Expected: RPO or PLE
    typicalAnswers: {
      "access-1": 1, // Direct to hospitals (easy to track)
      "access-2": 1, // Contractually managed (service contracts)
      "access-3": 2, // Good reverse logistics (service networks)
      "process-1": 4, // Complex (electronics, precision)
      "process-2": 4, // Difficult disassembly (regulated, sterile)
      "process-3": 2, // Minor degradation (maintained, high quality)
      "embedded-1": 4, // High material value (precision metals)
      "embedded-2": 4, // High brand value (GE, Siemens, Philips)
    },
    confidenceIndicators: ["medical", "hospital", "mri", "x-ray", "clinical", "healthcare equipment"],
    expectedStrategy: "RPO (Retain Product Ownership) or PLE",
  },
  {
    name: "Furniture",
    keywords: [
      "furniture", "chair", "table", "desk", "sofa", "cabinet", "shelf", "bed",
      "wardrobe", "bookshelf", "dresser",
    ],
    descriptionPatterns: [
      "furniture", "seating", "storage", "office furniture", "home furnishings", "wooden", "upholstered",
    ],
    // Furniture: Hard access (dispersed), Moderate process, Moderate embedded value
    // Expected: PLE (refurbishment)
    typicalAnswers: {
      "access-1": 4, // Broad retail (hard to track)
      "access-2": 3, // Moderate incentive (some resale value)
      "access-3": 3, // Moderate reverse logistics (bulk collection)
      "process-1": 3, // Moderate complexity (wood, metal, fabric)
      "process-2": 3, // Moderate disassembly (screws, bolts)
      "process-3": 3, // Moderate degradation (wear, but repairable)
      "embedded-1": 3, // Moderate material value (wood, metal)
      "embedded-2": 3, // Moderate brand value (Herman Miller, IKEA)
    },
    confidenceIndicators: ["furniture", "chair", "desk", "sofa", "table", "wooden", "herman miller"],
    expectedStrategy: "PLE (Product Life Extension) - Refurbishment",
  },
  {
    name: "Single-Use / Disposable",
    keywords: [
      "disposable", "single-use", "consumable", "one-time", "throwaway",
      "napkin", "tissue", "wipe", "razor", "cup", "plate", "cutlery",
    ],
    descriptionPatterns: [
      "disposable", "single-use", "throw away", "use once", "consume", "waste",
    ],
    // Disposable: Very hard access, Easy process, Very low embedded value
    // Expected: DFR (if recyclable) or nothing
    typicalAnswers: {
      "access-1": 5, // Globally dispersed
      "access-2": 5, // No return (discarded)
      "access-3": 2, // Some collection (municipal waste)
      "process-1": 1, // Simple (paper, plastic)
      "process-2": 1, // No disassembly needed
      "process-3": 5, // Consumed/destroyed
      "embedded-1": 1, // Very low value
      "embedded-2": 1, // No brand value
    },
    confidenceIndicators: ["disposable", "single-use", "napkin", "tissue", "wipe", "throw away"],
    expectedStrategy: "DFR (Design for Recycling) - if recyclable",
  },
];

// Question-specific hint patterns
interface QuestionHint {
  questionId: string;
  highValueIndicators: string[]; // These suggest HIGH value (5) = Hard access/process OR High embedded value
  lowValueIndicators: string[];  // These suggest LOW value (1) = Easy access/process OR Low embedded value
}

const questionHints: QuestionHint[] = [
  {
    questionId: "access-1",
    // High = Hard to access (dispersed), Low = Easy to access (direct)
    highValueIndicators: [
      "globally", "worldwide", "many retailers", "amazon", "walmart", "supermarket",
      "mass market", "dispersed", "everywhere", "no tracking", "consumer goods",
    ],
    lowValueIndicators: [
      "direct", "b2b", "custom", "contract", "lease", "service agreement",
      "exclusive", "on-site", "managed service", "rental",
    ],
  },
  {
    questionId: "access-2",
    // High = Hard to get back (no incentive), Low = Easy to get back (contract/deposit)
    highValueIndicators: [
      "discard", "throw away", "trash", "no return", "single-use", "disposable",
      "no incentive", "inconvenient", "general waste", "landfill",
    ],
    lowValueIndicators: [
      "lease", "rental", "contract", "return required", "deposit", "trade-in",
      "buyback", "mandatory return", "service contract", "subscription",
    ],
  },
  {
    questionId: "access-3",
    // High = Poor reverse logistics, Low = Good reverse logistics
    highValueIndicators: [
      "none", "nothing", "no system", "would need to build", "expensive logistics",
      "no collection", "no infrastructure", "undeveloped", "challenging",
    ],
    lowValueIndicators: [
      "established", "existing", "network", "service fleet", "collection system",
      "logistics ready", "reverse supply chain", "dedicated return", "easy collection",
    ],
  },
  {
    questionId: "process-1",
    // High = Complex materials (hard to process), Low = Simple materials (easy to process)
    highValueIndicators: [
      "complex", "many materials", "electronics", "circuit", "composite", "multi-layer",
      "bonded", "mixed materials", "heterogeneous", "sophisticated",
    ],
    lowValueIndicators: [
      "single material", "mono-material", "pure", "homogeneous", "simple",
      "one material", "aluminum", "glass", "steel", "straightforward",
    ],
  },
  {
    questionId: "process-2",
    // High = Hard to disassemble, Low = Easy to disassemble
    highValueIndicators: [
      "glued", "welded", "permanent", "sealed", "destructive", "impossible",
      "non-repairable", "ultrasonic welded", "adhesive", "bonded",
    ],
    lowValueIndicators: [
      "screws", "modular", "snap-fit", "tool-free", "easy to take apart",
      "repairable", "replaceable", "standard fasteners", "removable",
    ],
  },
  {
    questionId: "process-3",
    // High = Significant degradation, Low = Minimal degradation
    highValueIndicators: [
      "consumed", "burned", "degraded", "contaminated", "used up", "chemical change",
      "destroyed", "worn out", "exhausted", "spent",
    ],
    lowValueIndicators: [
      "durable", "unchanged", "maintains integrity", "minimal wear", "long-lasting",
      "robust", "resilient", "refurbishable", "like new", "well-maintained",
    ],
  },
  {
    questionId: "embedded-1",
    // High = High material value, Low = Low material value
    highValueIndicators: [
      "precious", "rare earth", "gold", "silver", "expensive materials", "high-grade",
      "precision", "titanium", "platinum", "copper", "aluminum", "quality materials",
    ],
    lowValueIndicators: [
      "cheap", "plastic", "paper", "cardboard", "commodity", "low-grade",
      "inexpensive", "synthetic", "recycled material", "waste material",
    ],
  },
  {
    questionId: "embedded-2",
    // High = High brand/tech value, Low = Low brand/tech value
    highValueIndicators: [
      "premium", "luxury", "brand", "designer", "patent", "proprietary",
      "renowned", "collectible", "high-end", "iconic", "leading brand",
    ],
    lowValueIndicators: [
      "generic", "commodity", "no name", "basic", "standard", "utility",
      "off-brand", "unbranded", "white label", "budget", "low-end",
    ],
  },
];

/**
 * Analyze product description and generate answer suggestions
 * This is a client-side, rule-based AI assistant
 */
export function analyzeProductDescription(
  productName: string,
  description: string = ""
): AIAnalysisResult {
  const fullText = `${productName} ${description}`.toLowerCase();

  // Identify product category
  let bestCategory: CategoryPattern | null = null;
  let highestConfidence = 0;
  const keyIndicators: string[] = [];

  for (const category of categoryPatterns) {
    let score = 0;
    const matchedIndicators: string[] = [];

    // Check keywords
    for (const keyword of category.keywords) {
      if (fullText.includes(keyword.toLowerCase())) {
        score += 2;
        matchedIndicators.push(keyword);
      }
    }

    // Check description patterns
    for (const pattern of category.descriptionPatterns) {
      if (fullText.includes(pattern.toLowerCase())) {
        score += 1;
        matchedIndicators.push(pattern);
      }
    }

    // Check confidence indicators
    for (const indicator of category.confidenceIndicators) {
      if (fullText.includes(indicator.toLowerCase())) {
        score += 3;
        matchedIndicators.push(indicator);
      }
    }

    if (score > highestConfidence) {
      highestConfidence = score;
      bestCategory = category;
      keyIndicators.push(...matchedIndicators.slice(0, 3));
    }
  }

  // Generate suggestions
  const suggestions: AISuggestion[] = [];

  for (const question of questions) {
    let suggestedValue: number | null = null;
    let reasoning = "";
    let confidence: "high" | "medium" | "low" = "low";
    const alternativeValues: number[] = [];

    // Start with category-based suggestion
    if (bestCategory?.typicalAnswers[question.id]) {
      suggestedValue = bestCategory.typicalAnswers[question.id]!;
      reasoning = `Typical for ${bestCategory.name.toLowerCase()} products (${bestCategory.expectedStrategy})`;
      confidence = highestConfidence >= 5 ? "high" : "medium";
    }

    // Refine with question-specific hints
    const hint = questionHints.find((h) => h.questionId === question.id);
    if (hint) {
      const highMatches = hint.highValueIndicators.filter((i) => fullText.includes(i.toLowerCase())).length;
      const lowMatches = hint.lowValueIndicators.filter((i) => fullText.includes(i.toLowerCase())).length;

      if (highMatches > lowMatches && highMatches > 0) {
        // Suggest higher value (4-5 range)
        const newValue = Math.min(5, (suggestedValue || 3) + 1);
        if (newValue !== suggestedValue) {
          if (suggestedValue) alternativeValues.push(suggestedValue);
          suggestedValue = newValue;
          reasoning = highMatches >= 2 
            ? `Strong indicators in description suggest higher value`
            : `Description suggests higher value`;
          confidence = highMatches >= 2 ? "high" : "medium";
        }
      } else if (lowMatches > highMatches && lowMatches > 0) {
        // Suggest lower value (1-2 range)
        const newValue = Math.max(1, (suggestedValue || 3) - 1);
        if (newValue !== suggestedValue) {
          if (suggestedValue) alternativeValues.push(suggestedValue);
          suggestedValue = newValue;
          reasoning = lowMatches >= 2
            ? `Strong indicators in description suggest lower value`
            : `Description suggests lower value`;
          confidence = lowMatches >= 2 ? "high" : "medium";
        }
      }
    }

    // If still no suggestion, use neutral
    if (suggestedValue === null) {
      suggestedValue = 3;
      reasoning = "Neutral starting point — please adjust based on your specific product";
      confidence = "low";
      alternativeValues.push(2, 4);
    }

    suggestions.push({
      questionId: question.id,
      suggestedValue,
      confidence,
      reasoning,
      alternativeValues: alternativeValues.length > 0 ? alternativeValues : undefined,
    });
  }

  // Generate summary
  const confidenceLevel: "high" | "medium" | "low" =
    highestConfidence >= 8 ? "high" : highestConfidence >= 4 ? "medium" : "low";

  const summary = bestCategory
    ? `This appears to be a **${bestCategory.name}** product. Typical strategy: ${bestCategory.expectedStrategy}. Please review and adjust suggestions for your specific product.`
    : `I couldn't confidently categorize this product. I've provided neutral starting suggestions — please review each answer carefully.`;

  return {
    suggestions,
    summary,
    productCategory: bestCategory?.name || null,
    confidenceLevel,
    keyIndicators: [...new Set(keyIndicators)].slice(0, 5),
  };
}

/**
 * Get explanation for a specific suggestion
 */
export function getSuggestionExplanation(
  questionId: string,
  suggestedValue: number
): string {
  const question = questions.find((q) => q.id === questionId);
  if (!question) return "";

  const option = question.options.find((o) => o.value === suggestedValue);
  if (!option) return "";

  return `Suggested: **${option.label}** — ${option.description || ""}`;
}

/**
 * Check if product name contains recognizable patterns
 */
export function hasRecognizablePattern(productName: string): boolean {
  const text = productName.toLowerCase();
  return categoryPatterns.some((cat) =>
    cat.keywords.some((kw) => text.includes(kw.toLowerCase()))
  );
}

// ============================================
// R-STRATEGY AI ASSISTANT
// ============================================

// R-Strategy criterion IDs from criteria.ts
type RStrategyCriterion = 
  | "absolute-product-value" 
  | "product-durability" 
  | "regulatory-pressure" 
  | "technological-change" 
  | "logistics-handling" 
  | "value-recovery" 
  | "embedded-value";

interface RStrategyCategoryPattern {
  name: string;
  keywords: string[];
  typicalAnswers: Record<RStrategyCriterion, number>;
  expectedStrategy: string;
}

// R-Strategy patterns designed to produce realistic R-Strategy outcomes
// Answer values: 1-5 where higher = better for that criterion
const rStrategyCategoryPatterns: RStrategyCategoryPattern[] = [
  {
    name: "Consumer Electronics",
    keywords: ["phone", "smartphone", "laptop", "computer", "tablet", "device", "electronics", "screen"],
    // Smartphones: High value, moderate durability, strong regulations, fast tech change
    // Good logistics, moderate value recovery, high embedded value
    // Expected: REFURBISH
    typicalAnswers: {
      "absolute-product-value": 4,      // High ($500-$2000)
      "product-durability": 3,          // Medium (3-5 years)
      "regulatory-pressure": 4,         // Strong (e-waste laws)
      "technological-change": 4,        // Fast (annual updates)
      "logistics-handling": 4,          // Easy (trade-in programs)
      "value-recovery": 3,              // Moderate (skilled repair)
      "embedded-value": 4,              // High (materials + brand)
    },
    expectedStrategy: "REFURBISH",
  },
  {
    name: "Apparel & Textiles",
    keywords: ["shirt", "pants", "dress", "shoe", "clothing", "apparel", "textile", "fabric"],
    // Clothing: Low value, low durability, weak regulations, slow tech change
    // Moderate logistics, difficult value recovery, low embedded value
    // Expected: RECYCLE
    typicalAnswers: {
      "absolute-product-value": 2,      // Low ($20-$100)
      "product-durability": 2,          // Low (1-3 years)
      "regulatory-pressure": 2,         // Weak
      "technological-change": 1,        // Very slow
      "logistics-handling": 3,          // Moderate
      "value-recovery": 2,              // Difficult (mixed fibers)
      "embedded-value": 2,              // Low
    },
    expectedStrategy: "RECYCLE",
  },
  {
    name: "Industrial Equipment",
    keywords: ["machine", "equipment", "industrial", "machinery", "pump", "compressor", "motor"],
    // Industrial: Very high value, very durable, weak regulations, slow tech
    // Moderate logistics, easy value recovery, high embedded value
    // Expected: REMANUFACTURE
    typicalAnswers: {
      "absolute-product-value": 5,      // Very high ($10K+)
      "product-durability": 5,          // Very long (15+ years)
      "regulatory-pressure": 2,         // Weak
      "technological-change": 2,        // Slow
      "logistics-handling": 3,          // Moderate (B2B)
      "value-recovery": 4,              // Easy (modular)
      "embedded-value": 5,              // Very high
    },
    expectedStrategy: "REMANUFACTURE",
  },
  {
    name: "Automotive",
    keywords: ["car", "vehicle", "automotive", "tire", "battery", "ev", "truck"],
    // Vehicles: High value, durable, moderate regulations, moderate tech
    // Good logistics, easy value recovery, high embedded value
    // Expected: REMANUFACTURE
    typicalAnswers: {
      "absolute-product-value": 4,      // High ($5K-$50K)
      "product-durability": 4,          // Long (10-15 years)
      "regulatory-pressure": 4,         // Strong (safety/emissions)
      "technological-change": 3,        // Moderate
      "logistics-handling": 4,          // Easy (dealer network)
      "value-recovery": 4,              // Easy (established)
      "embedded-value": 4,              // High
    },
    expectedStrategy: "REMANUFACTURE",
  },
  {
    name: "Building Materials",
    keywords: ["carpet", "flooring", "tile", "insulation", "roofing", "window", "construction"],
    // Building: Low value, durable, moderate regulations, slow tech
    // Moderate logistics, difficult recovery, low embedded value
    // Expected: RECYCLE
    typicalAnswers: {
      "absolute-product-value": 2,      // Low per unit
      "product-durability": 4,          // Durable
      "regulatory-pressure": 3,         // Moderate
      "technological-change": 2,        // Slow
      "logistics-handling": 3,          // Moderate
      "value-recovery": 2,              // Difficult (layered)
      "embedded-value": 2,              // Low
    },
    expectedStrategy: "RECYCLE",
  },
  {
    name: "Packaging",
    keywords: ["packaging", "container", "bottle", "box", "carton", "wrapper"],
    // Packaging: Very low value, not durable, moderate regulations, no tech change
    // Very easy logistics, very easy recovery, very low embedded value
    // Expected: RECYCLE
    typicalAnswers: {
      "absolute-product-value": 1,      // Very low (<$1)
      "product-durability": 1,          // Single-use
      "regulatory-pressure": 3,         // Moderate (EPR)
      "technological-change": 1,        // None
      "logistics-handling": 5,          // Very easy (municipal)
      "value-recovery": 5,              // Very easy (pulping)
      "embedded-value": 1,              // Very low
    },
    expectedStrategy: "RECYCLE",
  },
  {
    name: "Medical Devices",
    keywords: ["medical", "healthcare", "hospital", "clinical", "diagnostic", "surgical"],
    // Medical: High value, durable, very strong regulations, moderate tech
    // Difficult logistics, moderate recovery, high embedded value
    // Expected: REMANUFACTURE
    typicalAnswers: {
      "absolute-product-value": 4,      // High ($10K-$100K)
      "product-durability": 4,          // Durable
      "regulatory-pressure": 5,         // Very strong (FDA)
      "technological-change": 3,        // Moderate
      "logistics-handling": 2,          // Difficult (specialized)
      "value-recovery": 3,              // Moderate
      "embedded-value": 4,              // High
    },
    expectedStrategy: "REMANUFACTURE",
  },
  {
    name: "Furniture",
    keywords: ["furniture", "chair", "table", "desk", "sofa", "cabinet", "shelf"],
    // Furniture: Medium value, durable, weak regulations, no tech change
    // Moderate logistics, moderate recovery, moderate embedded value
    // Expected: REFURBISH
    typicalAnswers: {
      "absolute-product-value": 3,      // Medium ($200-$2000)
      "product-durability": 4,          // Durable (10+ years)
      "regulatory-pressure": 2,         // Weak
      "technological-change": 1,        // None
      "logistics-handling": 3,          // Moderate
      "value-recovery": 3,              // Moderate
      "embedded-value": 3,              // Moderate
    },
    expectedStrategy: "REFURBISH",
  },
  {
    name: "Energy Storage / EV Battery",
    keywords: ["ev battery", "lithium battery", "energy storage", "battery pack", "powerwall"],
    // EV Batteries: Very high value, moderate durability, strong regulations, fast tech
    // Moderate logistics, difficult recovery, very high embedded value
    // Expected: REPURPOSE (second-life)
    typicalAnswers: {
      "absolute-product-value": 5,      // Very high ($5K-$15K)
      "product-durability": 3,          // Moderate (degrades)
      "regulatory-pressure": 4,         // Strong (battery laws)
      "technological-change": 4,        // Fast (improving)
      "logistics-handling": 3,          // Moderate (hazardous)
      "value-recovery": 2,              // Difficult (complex chemistry)
      "embedded-value": 5,              // Very high (materials)
    },
    expectedStrategy: "REPURPOSE",
  },
  {
    name: "Returnable Packaging",
    keywords: ["returnable crate", "reusable pallet", "rpc", "returnable container", "pool packaging"],
    // Returnable packaging: Medium value, very durable, weak regulations, no tech
    // Easy logistics, easy recovery, moderate embedded value
    // Expected: REUSE
    typicalAnswers: {
      "absolute-product-value": 3,      // Medium ($20-$100)
      "product-durability": 5,          // Very durable (50+ cycles)
      "regulatory-pressure": 2,         // Weak
      "technological-change": 1,        // None
      "logistics-handling": 4,          // Easy (pool systems)
      "value-recovery": 4,              // Easy (cleaning only)
      "embedded-value": 3,              // Moderate
    },
    expectedStrategy: "REUSE",
  },
];

// R-Strategy criterion hints
const rStrategyCriterionHints: Record<RStrategyCriterion, { high: string[]; low: string[] }> = {
  "absolute-product-value": {
    high: ["expensive", "premium", "high-end", "luxury", "valuable", "costly", "pricey", "investment"],
    low: ["cheap", "inexpensive", "low-cost", "budget", "affordable", "disposable price"],
  },
  "product-durability": {
    high: ["robust", "durable", "long-lasting", "heavy-duty", "industrial-grade", "indestructible"],
    low: ["fragile", "disposable", "single-use", "temporary", "short-lived", "consumable"],
  },
  "regulatory-pressure": {
    high: ["regulated", "compliant", "certified", "e-waste", "mandatory", "required by law", "epr"],
    low: ["unregulated", "voluntary", "no standards", "optional", "self-regulated"],
  },
  "technological-change": {
    high: ["fast", "rapid", "obsolete quickly", "cutting-edge", "rapidly evolving", "annual updates"],
    low: ["slow", "stable", "mature", "unchanging", "timeless", "standardized"],
  },
  "logistics-handling": {
    high: ["widespread", "established", "easy to collect", "global network", "ubiquitous"],
    low: ["limited", "regional", "scarce", "undeveloped", "remote", "difficult access"],
  },
  "value-recovery": {
    high: ["easy to repair", "modular", "serviceable", "accessible", "standard parts", "simple"],
    low: ["sealed", "integrated", "proprietary", "glued", "bonded", "irreparable", "destructive"],
  },
  "embedded-value": {
    high: ["precious materials", "rare earth", "gold", "silver", "copper", "high quality", "valuable materials"],
    low: ["low-grade", "commodity", "mixed materials", "contaminated", "waste"],
  },
};

/**
 * Analyze product description for R-Strategy Scorecard
 */
export function analyzeProductDescriptionRStrategy(
  productName: string,
  description: string = ""
): AIAnalysisResult {
  const fullText = `${productName} ${description}`.toLowerCase();
  const suggestions: AISuggestion[] = [];
  
  // Identify product category
  let bestCategory: RStrategyCategoryPattern | null = null;
  let highestConfidence = 0;
  const keyIndicators: string[] = [];

  for (const category of rStrategyCategoryPatterns) {
    let score = 0;
    const matched: string[] = [];
    
    for (const keyword of category.keywords) {
      if (fullText.includes(keyword.toLowerCase())) {
        score += 2;
        matched.push(keyword);
      }
    }
    
    if (score > highestConfidence) {
      highestConfidence = score;
      bestCategory = category;
      keyIndicators.push(...matched.slice(0, 3));
    }
  }

  // Generate suggestions for each criterion
  const criteriaIds: RStrategyCriterion[] = [
    "absolute-product-value", "product-durability", "regulatory-pressure", 
    "technological-change", "logistics-handling", "value-recovery", "embedded-value"
  ];
  
  // Map criterionId to question ID
  const questionIdMap: Record<RStrategyCriterion, string> = {
    "absolute-product-value": "q-absolute-product-value",
    "product-durability": "q-product-durability",
    "regulatory-pressure": "q-regulatory-pressure",
    "technological-change": "q-technological-change",
    "logistics-handling": "q-logistics-handling",
    "value-recovery": "q-value-recovery",
    "embedded-value": "q-embedded-value",
  };
  
  for (const criterionId of criteriaIds) {
    let suggestedValue: number | null = null;
    let reasoning = "";
    let confidence: "high" | "medium" | "low" = "low";
    const alternativeValues: number[] = [];
    
    // Start with category-based suggestion
    if (bestCategory?.typicalAnswers[criterionId]) {
      suggestedValue = bestCategory.typicalAnswers[criterionId]!;
      reasoning = `Typical for ${bestCategory.name.toLowerCase()} (${bestCategory.expectedStrategy})`;
      confidence = highestConfidence >= 4 ? "high" : "medium";
    }
    
    // Refine with hint patterns
    const hints = rStrategyCriterionHints[criterionId];
    if (hints) {
      const highMatches = hints.high.filter(h => fullText.includes(h.toLowerCase())).length;
      const lowMatches = hints.low.filter(h => fullText.includes(h.toLowerCase())).length;
      
      if (highMatches > lowMatches && highMatches > 0) {
        const newValue = Math.min(5, (suggestedValue || 3) + 1);
        if (newValue !== suggestedValue) {
          if (suggestedValue) alternativeValues.push(suggestedValue);
          suggestedValue = newValue;
          reasoning = highMatches >= 2 
            ? `Strong positive indicators in description` 
            : `Description suggests higher value`;
          confidence = highMatches >= 2 ? "high" : "medium";
        }
      } else if (lowMatches > highMatches && lowMatches > 0) {
        const newValue = Math.max(1, (suggestedValue || 3) - 1);
        if (newValue !== suggestedValue) {
          if (suggestedValue) alternativeValues.push(suggestedValue);
          suggestedValue = newValue;
          reasoning = lowMatches >= 2 
            ? `Strong negative indicators in description` 
            : `Description suggests lower value`;
          confidence = lowMatches >= 2 ? "high" : "medium";
        }
      }
    }
    
    // Default if no suggestion
    if (suggestedValue === null) {
      suggestedValue = 3;
      reasoning = "Neutral starting point — please adjust based on your specific product";
      confidence = "low";
      alternativeValues.push(2, 4);
    }
    
    suggestions.push({
      questionId: questionIdMap[criterionId],
      suggestedValue,
      confidence,
      reasoning,
      alternativeValues: alternativeValues.length > 0 ? alternativeValues : undefined,
    });
  }
  
  const confidenceLevel: "high" | "medium" | "low" =
    highestConfidence >= 6 ? "high" : highestConfidence >= 3 ? "medium" : "low";

  const summary = bestCategory
    ? `This appears to be a **${bestCategory.name}** product. Typical recommendation: **${bestCategory.expectedStrategy}**. Please review and adjust as needed.`
    : `I couldn't confidently categorize this product. I've provided neutral starting suggestions — please review each answer carefully.`;

  return {
    suggestions,
    summary,
    productCategory: bestCategory?.name || null,
    confidenceLevel,
    keyIndicators: [...new Set(keyIndicators)].slice(0, 5),
  };
}
