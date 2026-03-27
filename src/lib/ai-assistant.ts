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

// ============================================
// HBR MATRIX AI ASSISTANT
// ============================================

// Product category patterns matched to HBR presets (12 total)
// Answer values: 1-5 scale where:
// - For ACCESS questions: 1=Easy access, 5=Hard access
// - For PROCESS questions: 1=Easy process, 5=Hard process  
// - For EMBEDDED questions: 1=Low value, 5=High value
interface CategoryPattern {
  name: string;
  keywords: string[];
  descriptionPatterns: string[];
  typicalAnswers: Partial<Record<string, number>>;
  confidenceIndicators: string[];
  expectedStrategy: string;
}

const categoryPatterns: CategoryPattern[] = [
  {
    name: "Smartphone",
    keywords: [
      "smartphone", "phone", "iphone", "samsung galaxy", "google pixel", 
      "mobile phone", "cell phone", "android phone", "flagship phone"
    ],
    descriptionPatterns: [
      "mobile device", "cellular", "ios", "android", "smart phone", "handset"
    ],
    // Hard Access, Hard Process, High Value → PLE
    typicalAnswers: {
      "access-1": 4, "access-2": 3, "access-3": 3,
      "process-1": 5, "process-2": 4, "process-3": 4,
      "embedded-1": 4, "embedded-2": 4,
    },
    confidenceIndicators: ["iphone", "samsung", "pixel", "ios", "android", "smartphone"],
    expectedStrategy: "PLE (Product Life Extension)",
  },
  {
    name: "Laptop Computer",
    keywords: [
      "laptop", "computer", "macbook", "thinkpad", "dell xps", "notebook",
      "business laptop", "portable computer", "chromebook", "ultrabook"
    ],
    descriptionPatterns: [
      "portable computer", "business computer", "work laptop", "personal computer"
    ],
    // Hard Access, Hard Process, High Value → PLE
    typicalAnswers: {
      "access-1": 4, "access-2": 3, "access-3": 3,
      "process-1": 4, "process-2": 3, "process-3": 3,
      "embedded-1": 4, "embedded-2": 4,
    },
    confidenceIndicators: ["macbook", "thinkpad", "dell", "hp", "lenovo", "laptop"],
    expectedStrategy: "PLE (Product Life Extension)",
  },
  {
    name: "Office Chair",
    keywords: [
      "office chair", "desk chair", "task chair", "ergonomic chair",
      "herman miller", "steelcase", "aeron", "gesture", "work chair"
    ],
    descriptionPatterns: [
      "office seating", "desk seating", "ergonomic seating", "workplace chair"
    ],
    // Moderate Access, Moderate Process, High Value → PLE
    typicalAnswers: {
      "access-1": 3, "access-2": 3, "access-3": 3,
      "process-1": 3, "process-2": 3, "process-3": 2,
      "embedded-1": 3, "embedded-2": 4,
    },
    confidenceIndicators: ["herman miller", "steelcase", "aeron", "ergonomic", "office chair"],
    expectedStrategy: "PLE (Product Life Extension)",
  },
  {
    name: "Aluminum Beverage Can",
    keywords: [
      "aluminum can", "beverage can", "soda can", "beer can", "drink can",
      "aluminum beverage", "metal can", "soft drink can"
    ],
    descriptionPatterns: [
      "beverage container", "drink container", "single-use can", "recyclable can"
    ],
    // Hard Access, Easy Process, Low Value → DFR
    typicalAnswers: {
      "access-1": 5, "access-2": 2, "access-3": 2,
      "process-1": 1, "process-2": 1, "process-3": 1,
      "embedded-1": 2, "embedded-2": 1,
    },
    confidenceIndicators: ["aluminum", "soda", "beer", "beverage can", "drink can"],
    expectedStrategy: "DFR (Design for Recycling)",
  },
  {
    name: "Commercial Carpet Tile",
    keywords: [
      "carpet tile", "carpet square", "modular carpet", "interface carpet",
      "shaw carpet", "floor tile", "commercial flooring", "office carpet"
    ],
    descriptionPatterns: [
      "modular flooring", "carpet flooring", "commercial carpet", "office flooring"
    ],
    // Moderate Access, Hard Process, Low Value → DFR
    typicalAnswers: {
      "access-1": 3, "access-2": 2, "access-3": 3,
      "process-1": 4, "process-2": 4, "process-3": 3,
      "embedded-1": 2, "embedded-2": 3,
    },
    confidenceIndicators: ["interface", "shaw", "carpet tile", "modular carpet", "flooring"],
    expectedStrategy: "DFR (Design for Recycling)",
  },
  {
    name: "Industrial Pump",
    keywords: [
      "industrial pump", "grundfos", "sulzer", "ksb", "centrifugal pump",
      "water pump", "fluid handling", "process pump", "industrial equipment"
    ],
    descriptionPatterns: [
      "industrial equipment", "fluid handling", "pumping equipment", "machinery"
    ],
    // Easy Access, Hard Process, High Value → RPO or PLE
    typicalAnswers: {
      "access-1": 2, "access-2": 2, "access-3": 2,
      "process-1": 3, "process-2": 3, "process-3": 2,
      "embedded-1": 4, "embedded-2": 3,
    },
    confidenceIndicators: ["grundfos", "sulzer", "pump", "industrial equipment", "fluid"],
    expectedStrategy: "RPO (Retain Product Ownership) or PLE",
  },
  {
    name: "Electric Vehicle Battery",
    keywords: [
      "ev battery", "electric vehicle battery", "tesla battery", "lithium battery",
      "battery pack", "nissan leaf battery", "car battery", "automotive battery"
    ],
    descriptionPatterns: [
      "electric vehicle", "battery pack", "lithium ion", "energy storage", "ev battery"
    ],
    // Moderate Access, Hard Process, High Value → PLE
    typicalAnswers: {
      "access-1": 3, "access-2": 3, "access-3": 3,
      "process-1": 5, "process-2": 5, "process-3": 4,
      "embedded-1": 5, "embedded-2": 4,
    },
    confidenceIndicators: ["tesla", "ev battery", "lithium", "battery pack", "electric vehicle"],
    expectedStrategy: "PLE (Product Life Extension)",
  },
  {
    name: "Athletic Footwear",
    keywords: [
      "running shoe", "athletic footwear", "sneaker", "nike shoe", "adidas shoe",
      "sports shoe", "athletic shoe", "performance footwear", "trainer", "gym shoe"
    ],
    descriptionPatterns: [
      "athletic footwear", "sports footwear", "running footwear", "performance shoe"
    ],
    // Hard Access, Hard Process, Moderate Value → DFR
    typicalAnswers: {
      "access-1": 4, "access-2": 3, "access-3": 3,
      "process-1": 4, "process-2": 5, "process-3": 3,
      "embedded-1": 2, "embedded-2": 4,
    },
    confidenceIndicators: ["nike", "adidas", "running shoe", "sneaker", "athletic", "footwear"],
    expectedStrategy: "DFR (Design for Recycling)",
  },
  {
    name: "Cardboard Packaging",
    keywords: [
      "cardboard box", "shipping box", "carton", "paper box", "corrugated box",
      "amazon box", "delivery box", "moving box", "packaging box"
    ],
    descriptionPatterns: [
      "cardboard packaging", "paper packaging", "shipping container", "delivery box"
    ],
    // Hard Access, Easy Process, Low Value → DFR
    typicalAnswers: {
      "access-1": 5, "access-2": 3, "access-3": 2,
      "process-1": 1, "process-2": 1, "process-3": 2,
      "embedded-1": 1, "embedded-2": 1,
    },
    confidenceIndicators: ["cardboard", "shipping box", "carton", "paper box", "packaging"],
    expectedStrategy: "DFR (Design for Recycling)",
  },
  {
    name: "Wind Turbine",
    keywords: [
      "wind turbine", "wind generator", "ge turbine", "vestas turbine",
      "siemens gamesa", "wind energy", "windmill", "renewable energy"
    ],
    descriptionPatterns: [
      "wind energy", "renewable energy", "wind power", "energy infrastructure"
    ],
    // Easy Access, Hard Process, High Value → RPO or PLE
    typicalAnswers: {
      "access-1": 1, "access-2": 1, "access-3": 2,
      "process-1": 4, "process-2": 4, "process-3": 3,
      "embedded-1": 5, "embedded-2": 4,
    },
    confidenceIndicators: ["vestas", "ge", "siemens", "wind turbine", "wind energy"],
    expectedStrategy: "RPO (Retain Product Ownership) or PLE",
  },
  {
    name: "Disposable Coffee Cup",
    keywords: [
      "coffee cup", "disposable cup", "paper cup", "starbucks cup", "takeaway cup",
      "hot beverage cup", "single-use cup", "to-go cup"
    ],
    descriptionPatterns: [
      "disposable cup", "paper cup", "takeaway container", "single-use beverage"
    ],
    // Hard Access, Hard Process, Low Value → DFR
    typicalAnswers: {
      "access-1": 5, "access-2": 4, "access-3": 4,
      "process-1": 4, "process-2": 4, "process-3": 3,
      "embedded-1": 1, "embedded-2": 1,
    },
    confidenceIndicators: ["starbucks", "coffee cup", "disposable cup", "paper cup", "takeaway"],
    expectedStrategy: "DFR (Design for Recycling)",
  },
  {
    name: "Vehicle Tires",
    keywords: [
      "tire", "tyre", "vehicle tire", "car tire", "michelin", "goodyear",
      "passenger tire", "automotive tire", "rubber tire"
    ],
    descriptionPatterns: [
      "vehicle tire", "automotive tire", "rubber tire", "passenger tire"
    ],
    // Hard Access, Moderate Process, Moderate Value → PLE
    typicalAnswers: {
      "access-1": 4, "access-2": 3, "access-3": 3,
      "process-1": 3, "process-2": 3, "process-3": 2,
      "embedded-1": 3, "embedded-2": 3,
    },
    confidenceIndicators: ["michelin", "goodyear", "tire", "tyre", "automotive"],
    expectedStrategy: "PLE (Product Life Extension) - Retreading",
  },
];

// Question-specific hint patterns
interface QuestionHint {
  questionId: string;
  highValueIndicators: string[];
  lowValueIndicators: string[];
}

const questionHints: QuestionHint[] = [
  {
    questionId: "access-1",
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
 * Analyze product description and generate answer suggestions for HBR Matrix
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
      reasoning = `Typical for ${bestCategory.name} (${bestCategory.expectedStrategy})`;
      confidence = highestConfidence >= 5 ? "high" : "medium";
    }

    // Refine with question-specific hints
    const hint = questionHints.find((h) => h.questionId === question.id);
    if (hint) {
      const highMatches = hint.highValueIndicators.filter((i) => fullText.includes(i.toLowerCase())).length;
      const lowMatches = hint.lowValueIndicators.filter((i) => fullText.includes(i.toLowerCase())).length;

      if (highMatches > lowMatches && highMatches > 0) {
        const newValue = Math.min(5, (suggestedValue || 3) + 1);
        if (newValue !== suggestedValue) {
          if (suggestedValue) alternativeValues.push(suggestedValue);
          suggestedValue = newValue;
          reasoning = highMatches >= 2 
            ? `Strong indicators suggest higher value`
            : `Description suggests higher value`;
          confidence = highMatches >= 2 ? "high" : "medium";
        }
      } else if (lowMatches > highMatches && lowMatches > 0) {
        const newValue = Math.max(1, (suggestedValue || 3) - 1);
        if (newValue !== suggestedValue) {
          if (suggestedValue) alternativeValues.push(suggestedValue);
          suggestedValue = newValue;
          reasoning = lowMatches >= 2
            ? `Strong indicators suggest lower value`
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
    ? `This appears to be a **${bestCategory.name}** product. Expected strategy: ${bestCategory.expectedStrategy}. Please review and adjust as needed.`
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

// R-Strategy patterns matched to presets (16 total)
const rStrategyCategoryPatterns: RStrategyCategoryPattern[] = [
  {
    name: "Smartphone",
    keywords: [
      "smartphone", "phone", "iphone", "samsung galaxy", "google pixel",
      "mobile phone", "cell phone", "android phone"
    ],
    typicalAnswers: {
      "absolute-product-value": 4, "product-durability": 3, "regulatory-pressure": 4,
      "technological-change": 3, "logistics-handling": 4, "value-recovery": 3, "embedded-value": 4,
    },
    expectedStrategy: "REFURBISH",
  },
  {
    name: "Laptop Computer",
    keywords: [
      "laptop", "computer", "macbook", "thinkpad", "dell xps", "notebook",
      "business laptop", "portable computer"
    ],
    typicalAnswers: {
      "absolute-product-value": 4, "product-durability": 4, "regulatory-pressure": 3,
      "technological-change": 3, "logistics-handling": 4, "value-recovery": 3, "embedded-value": 4,
    },
    expectedStrategy: "REFURBISH",
  },
  {
    name: "Television / Display",
    keywords: [
      "television", "tv", "display", "monitor", "led tv", "lcd tv", "smart tv",
      "screen", "flat panel", "oled"
    ],
    typicalAnswers: {
      "absolute-product-value": 3, "product-durability": 3, "regulatory-pressure": 2,
      "technological-change": 4, "logistics-handling": 2, "value-recovery": 2, "embedded-value": 3,
    },
    expectedStrategy: "REFURBISH",
  },
  {
    name: "Electric Vehicle Battery",
    keywords: [
      "ev battery", "electric vehicle battery", "tesla battery", "lithium battery",
      "battery pack", "nissan leaf battery", "car battery"
    ],
    typicalAnswers: {
      "absolute-product-value": 5, "product-durability": 3, "regulatory-pressure": 4,
      "technological-change": 3, "logistics-handling": 3, "value-recovery": 2, "embedded-value": 5,
    },
    expectedStrategy: "REPURPOSE",
  },
  {
    name: "Solar Panel",
    keywords: [
      "solar panel", "pv panel", "photovoltaic", "solar module", "solar cell",
      "residential solar", "solar farm"
    ],
    typicalAnswers: {
      "absolute-product-value": 3, "product-durability": 5, "regulatory-pressure": 3,
      "technological-change": 3, "logistics-handling": 3, "value-recovery": 3, "embedded-value": 4,
    },
    expectedStrategy: "REFURBISH",
  },
  {
    name: "Industrial Pump",
    keywords: [
      "industrial pump", "grundfos", "sulzer", "ksb", "centrifugal pump",
      "water pump", "fluid handling", "process pump"
    ],
    typicalAnswers: {
      "absolute-product-value": 4, "product-durability": 5, "regulatory-pressure": 2,
      "technological-change": 2, "logistics-handling": 3, "value-recovery": 4, "embedded-value": 4,
    },
    expectedStrategy: "REMANUFACTURE",
  },
  {
    name: "Wind Turbine",
    keywords: [
      "wind turbine", "wind generator", "ge turbine", "vestas", "siemens gamesa",
      "wind energy", "windmill"
    ],
    typicalAnswers: {
      "absolute-product-value": 5, "product-durability": 5, "regulatory-pressure": 3,
      "technological-change": 2, "logistics-handling": 2, "value-recovery": 4, "embedded-value": 5,
    },
    expectedStrategy: "REMANUFACTURE",
  },
  {
    name: "Combustion Engine",
    keywords: [
      "engine", "combustion engine", "cummins", "caterpillar", "automotive engine",
      "diesel engine", "gasoline engine", "motor"
    ],
    typicalAnswers: {
      "absolute-product-value": 4, "product-durability": 4, "regulatory-pressure": 3,
      "technological-change": 3, "logistics-handling": 3, "value-recovery": 4, "embedded-value": 4,
    },
    expectedStrategy: "REMANUFACTURE",
  },
  {
    name: "Office Chair",
    keywords: [
      "office chair", "desk chair", "task chair", "ergonomic chair",
      "herman miller", "steelcase", "aeron"
    ],
    typicalAnswers: {
      "absolute-product-value": 4, "product-durability": 4, "regulatory-pressure": 2,
      "technological-change": 1, "logistics-handling": 3, "value-recovery": 3, "embedded-value": 4,
    },
    expectedStrategy: "REFURBISH",
  },
  {
    name: "Office Desk",
    keywords: [
      "office desk", "workstation", "desk", "standing desk", "height-adjustable desk",
      "work table", "meeting table"
    ],
    typicalAnswers: {
      "absolute-product-value": 3, "product-durability": 4, "regulatory-pressure": 2,
      "technological-change": 2, "logistics-handling": 3, "value-recovery": 3, "embedded-value": 3,
    },
    expectedStrategy: "REFURBISH",
  },
  {
    name: "Returnable Transport Packaging",
    keywords: [
      "returnable packaging", "reusable pallet", "rpc", "returnable container",
      "chep pallet", "ifco", "pool packaging", "reusable crate"
    ],
    typicalAnswers: {
      "absolute-product-value": 3, "product-durability": 4, "regulatory-pressure": 2,
      "technological-change": 1, "logistics-handling": 4, "value-recovery": 4, "embedded-value": 3,
    },
    expectedStrategy: "REUSE",
  },
  {
    name: "Aluminum Beverage Can",
    keywords: [
      "aluminum can", "beverage can", "soda can", "beer can", "drink can",
      "metal can", "aluminum beverage"
    ],
    typicalAnswers: {
      "absolute-product-value": 1, "product-durability": 1, "regulatory-pressure": 3,
      "technological-change": 1, "logistics-handling": 5, "value-recovery": 5, "embedded-value": 2,
    },
    expectedStrategy: "RECYCLE",
  },
  {
    name: "Cardboard Packaging",
    keywords: [
      "cardboard box", "shipping box", "carton", "paper box", "corrugated box",
      "amazon box", "packaging box", "paper packaging"
    ],
    typicalAnswers: {
      "absolute-product-value": 1, "product-durability": 1, "regulatory-pressure": 3,
      "technological-change": 1, "logistics-handling": 5, "value-recovery": 5, "embedded-value": 1,
    },
    expectedStrategy: "RECYCLE",
  },
  {
    name: "Vehicle Tire",
    keywords: [
      "tire", "tyre", "vehicle tire", "car tire", "michelin", "goodyear",
      "passenger tire", "automotive tire", "truck tire"
    ],
    typicalAnswers: {
      "absolute-product-value": 3, "product-durability": 3, "regulatory-pressure": 3,
      "technological-change": 2, "logistics-handling": 4, "value-recovery": 4, "embedded-value": 3,
    },
    expectedStrategy: "REMANUFACTURE",
  },
  {
    name: "Commercial Carpet Tile",
    keywords: [
      "carpet tile", "carpet square", "modular carpet", "interface carpet",
      "shaw carpet", "floor tile", "commercial flooring"
    ],
    typicalAnswers: {
      "absolute-product-value": 2, "product-durability": 3, "regulatory-pressure": 3,
      "technological-change": 2, "logistics-handling": 3, "value-recovery": 2, "embedded-value": 2,
    },
    expectedStrategy: "RECYCLE",
  },
  {
    name: "Athletic Footwear",
    keywords: [
      "running shoe", "athletic footwear", "sneaker", "nike", "adidas",
      "sports shoe", "athletic shoe", "trainer", "footwear"
    ],
    typicalAnswers: {
      "absolute-product-value": 2, "product-durability": 2, "regulatory-pressure": 2,
      "technological-change": 2, "logistics-handling": 3, "value-recovery": 1, "embedded-value": 2,
    },
    expectedStrategy: "RECYCLE",
  },
];

// R-Strategy criterion hints
const rStrategyCriterionHints: Record<RStrategyCriterion, { high: string[]; low: string[] }> = {
  "absolute-product-value": {
    high: ["expensive", "premium", "high-end", "luxury", "valuable", "costly", "pricey", "investment"],
    low: ["cheap", "inexpensive", "low-cost", "budget", "affordable", "disposable"],
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
      reasoning = `Typical for ${bestCategory.name} (${bestCategory.expectedStrategy})`;
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
            ? `Strong indicators suggest higher value` 
            : `Description suggests higher value`;
          confidence = highMatches >= 2 ? "high" : "medium";
        }
      } else if (lowMatches > highMatches && lowMatches > 0) {
        const newValue = Math.max(1, (suggestedValue || 3) - 1);
        if (newValue !== suggestedValue) {
          if (suggestedValue) alternativeValues.push(suggestedValue);
          suggestedValue = newValue;
          reasoning = lowMatches >= 2 
            ? `Strong indicators suggest lower value` 
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
    ? `This appears to be a **${bestCategory.name}** product. Expected recommendation: **${bestCategory.expectedStrategy}**. Please review and adjust as needed.`
    : `I couldn't confidently categorize this product. I've provided neutral starting suggestions — please review each answer carefully.`;

  return {
    suggestions,
    summary,
    productCategory: bestCategory?.name || null,
    confidenceLevel,
    keyIndicators: [...new Set(keyIndicators)].slice(0, 5),
  };
}
