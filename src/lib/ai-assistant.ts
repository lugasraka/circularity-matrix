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
interface CategoryPattern {
  name: string;
  keywords: string[];
  descriptionPatterns: string[];
  typicalAnswers: Partial<Record<string, number>>;
  confidenceIndicators: string[];
}

// Rule-based patterns for product categorization
const categoryPatterns: CategoryPattern[] = [
  {
    name: "Consumer Electronics",
    keywords: [
      "phone",
      "smartphone",
      "laptop",
      "computer",
      "tablet",
      "device",
      "gadget",
      "electronics",
      "screen",
      "display",
    ],
    descriptionPatterns: [
      "electronic",
      "digital",
      "smart",
      "tech",
      "battery",
      "charging",
      "software",
    ],
    typicalAnswers: {
      "access-1": 4, // Broad retail
      "access-2": 3, // Moderate trade-in
      "access-3": 3, // Third-party systems
      "process-1": 5, // Highly complex
      "process-2": 4, // Difficult disassembly
      "process-3": 4, // Significant degradation
      "embedded-1": 4, // High material value
      "embedded-2": 4, // High brand value
    },
    confidenceIndicators: ["battery", "screen", "chip", "processor", "memory"],
  },
  {
    name: "Apparel & Textiles",
    keywords: [
      "shirt",
      "pants",
      "dress",
      "jacket",
      "shoe",
      "sneaker",
      "footwear",
      "clothing",
      "apparel",
      "textile",
      "fabric",
      "garment",
      "wear",
    ],
    descriptionPatterns: [
      "wear",
      "clothing",
      "fashion",
      "garment",
      "textile",
      "fabric",
      "cotton",
      "polyester",
      "wool",
      "leather",
    ],
    typicalAnswers: {
      "access-1": 4, // Broad retail
      "access-2": 3, // Moderate return
      "access-3": 3, // Third-party
      "process-1": 3, // Moderate complexity
      "process-2": 2, // Simple manual disassembly
      "process-3": 2, // Minor wear
      "embedded-1": 2, // Low material value
      "embedded-2": 3, // Moderate brand value
    },
    confidenceIndicators: ["size", "fit", "fabric", "material blend", "wash"],
  },
  {
    name: "Packaging",
    keywords: [
      "packaging",
      "box",
      "carton",
      "bottle",
      "container",
      "wrapper",
      "bag",
      "pouch",
      "can",
      "jar",
    ],
    descriptionPatterns: [
      "package",
      "contain",
      "wrap",
      "disposable",
      "single-use",
      "beverage",
      "food",
      "shipping",
    ],
    typicalAnswers: {
      "access-1": 5, // Globally dispersed
      "access-2": 3, // Moderate (recycling bins)
      "access-3": 2, // Municipal systems
      "process-1": 1, // Single material
      "process-2": 1, // No disassembly
      "process-3": 2, // Minor contamination
      "embedded-1": 1, // Very low value
      "embedded-2": 1, // No brand value
    },
    confidenceIndicators: ["disposable", "single-use", "food-grade", "shipping", "protection"],
  },
  {
    name: "Furniture",
    keywords: [
      "chair",
      "table",
      "desk",
      "sofa",
      "couch",
      "bed",
      "shelf",
      "cabinet",
      "furniture",
      "furnishing",
    ],
    descriptionPatterns: [
      "furniture",
      "seating",
      "storage",
      "wood",
      "metal frame",
      "upholstery",
      "assembly",
    ],
    typicalAnswers: {
      "access-1": 3, // Select retail
      "access-2": 3, // Moderate
      "access-3": 3, // Third-party
      "process-1": 3, // Moderate complexity
      "process-2": 3, // Moderate disassembly
      "process-3": 2, // Minor wear
      "embedded-1": 3, // Moderate value
      "embedded-2": 3, // Moderate brand
    },
    confidenceIndicators: ["assemble", "wood", "fabric", "cushion", "frame", "ergonomic"],
  },
  {
    name: "Industrial Equipment",
    keywords: [
      "pump",
      "motor",
      "machine",
      "equipment",
      "machinery",
      "turbine",
      "generator",
      "compressor",
      "industrial",
      "hvac",
    ],
    descriptionPatterns: [
      "industrial",
      "commercial",
      "heavy-duty",
      "automation",
      "manufacturing",
      "processing",
      "infrastructure",
    ],
    typicalAnswers: {
      "access-1": 2, // Direct B2B
      "access-2": 2, // Strong incentives
      "access-3": 2, // Partially developed
      "process-1": 3, // Moderate
      "process-2": 3, // Moderate
      "process-3": 2, // Minor wear
      "embedded-1": 4, // High material value
      "embedded-2": 3, // Moderate tech value
    },
    confidenceIndicators: ["horsepower", "capacity", "operating hours", "maintenance schedule", "warranty"],
  },
  {
    name: "Automotive",
    keywords: [
      "car",
      "vehicle",
      "automotive",
      "tire",
      "battery",
      "ev",
      "automobile",
      "truck",
      "auto",
    ],
    descriptionPatterns: [
      "vehicle",
      "transportation",
      "automotive",
      "driving",
      "engine",
      "motor",
      "mileage",
    ],
    typicalAnswers: {
      "access-1": 3, // Dealer network
      "access-2": 3, // Moderate (service)
      "access-3": 3, // Third-party
      "process-1": 4, // Complex
      "process-2": 4, // Difficult
      "process-3": 3, // Moderate degradation
      "embedded-1": 4, // High value
      "embedded-2": 4, // High brand
    },
    confidenceIndicators: ["mileage", "mpg", "electric", "hybrid", "vehicle identification"],
  },
  {
    name: "Building Materials",
    keywords: [
      "carpet",
      "flooring",
      "tile",
      "insulation",
      "roofing",
      "window",
      "door",
      "building",
      "construction",
      "material",
    ],
    descriptionPatterns: [
      "construction",
      "building",
      "installation",
      "commercial space",
      "residential",
      "renovation",
    ],
    typicalAnswers: {
      "access-1": 3, // B2B
      "access-2": 2, // Take-back programs common
      "access-3": 3, // Third-party
      "process-1": 4, // Complex (layers)
      "process-2": 4, // Difficult separation
      "process-3": 3, // Moderate
      "embedded-1": 2, // Low per unit
      "embedded-2": 3, // Moderate brand
    },
    confidenceIndicators: ["square feet", "installation", "warranty years", "commercial grade"],
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
      "globally",
      "worldwide",
      "many retailers",
      "amazon",
      "walmart",
      "supermarket",
      "mass market",
    ],
    lowValueIndicators: [
      "direct",
      "b2b",
      "custom",
      "contract",
      "lease",
      "service agreement",
      "exclusive",
    ],
  },
  {
    questionId: "access-2",
    highValueIndicators: [
      "discard",
      "throw away",
      "trash",
      "no return",
      "single-use",
      "disposable",
    ],
    lowValueIndicators: [
      "lease",
      "rental",
      "contract",
      "return required",
      "deposit",
      "trade-in",
      "buyback",
    ],
  },
  {
    questionId: "access-3",
    highValueIndicators: ["none", "nothing", "no system", "would need to build", "expensive"],
    lowValueIndicators: [
      "established",
      "existing",
      "network",
      "service fleet",
      "collection",
      "logistics ready",
    ],
  },
  {
    questionId: "process-1",
    highValueIndicators: [
      "complex",
      "many materials",
      "electronics",
      "circuit",
      "composite",
      "multi-layer",
      "bonded",
    ],
    lowValueIndicators: [
      "single material",
      "mono-material",
      "pure",
      "homogeneous",
      "simple",
      "one material",
      "aluminum",
      "glass",
    ],
  },
  {
    questionId: "process-2",
    highValueIndicators: [
      "glued",
      "welded",
      "permanent",
      "sealed",
      "destructive",
      "impossible",
      "non-repairable",
    ],
    lowValueIndicators: [
      "screws",
      "modular",
      "snap-fit",
      "tool-free",
      "easy to take apart",
      "repairable",
      "replaceable",
    ],
  },
  {
    questionId: "process-3",
    highValueIndicators: [
      "consumed",
      "burned",
      "degraded",
      "contaminated",
      "used up",
      "chemical change",
    ],
    lowValueIndicators: [
      "durable",
      "unchanged",
      "maintains integrity",
      "minimal wear",
      "long-lasting",
      "robust",
    ],
  },
  {
    questionId: "embedded-1",
    highValueIndicators: [
      "precious",
      "rare earth",
      "gold",
      "silver",
      "expensive",
      "high-grade",
      "precision",
      "titanium",
    ],
    lowValueIndicators: [
      "cheap",
      "plastic",
      "paper",
      "cardboard",
      "commodity",
      "low-grade",
      "inexpensive",
    ],
  },
  {
    questionId: "embedded-2",
    highValueIndicators: [
      "premium",
      "luxury",
      "brand",
      "designer",
      "patent",
      "proprietary",
      "renowned",
      "collectible",
    ],
    lowValueIndicators: [
      "generic",
      "commodity",
      "no name",
      "basic",
      "standard",
      "utility",
      "off-brand",
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
  const words = fullText.split(/\s+/);

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
      reasoning = `Typical for ${bestCategory.name.toLowerCase()} products`;
      confidence = highestConfidence >= 5 ? "high" : "medium";
    }

    // Refine with question-specific hints
    const hint = questionHints.find((h) => h.questionId === question.id);
    if (hint) {
      const highMatches = hint.highValueIndicators.filter((i) => fullText.includes(i.toLowerCase()))
        .length;
      const lowMatches = hint.lowValueIndicators.filter((i) => fullText.includes(i.toLowerCase()))
        .length;

      if (highMatches > lowMatches && highMatches > 0) {
        // Suggest higher value (4-5 range)
        const newValue = Math.min(5, (suggestedValue || 3) + 1);
        if (newValue !== suggestedValue) {
          if (suggestedValue) alternativeValues.push(suggestedValue);
          suggestedValue = newValue;
          reasoning = highMatches >= 2 
            ? `Strong indicators: ${hint.highValueIndicators.filter((i) => fullText.includes(i.toLowerCase())).slice(0, 2).join(", ")}`
            : `Suggestion based on description analysis`;
          confidence = highMatches >= 2 ? "high" : "medium";
        }
      } else if (lowMatches > highMatches && lowMatches > 0) {
        // Suggest lower value (1-2 range)
        const newValue = Math.max(1, (suggestedValue || 3) - 1);
        if (newValue !== suggestedValue) {
          if (suggestedValue) alternativeValues.push(suggestedValue);
          suggestedValue = newValue;
          reasoning = lowMatches >= 2
            ? `Strong indicators: ${hint.lowValueIndicators.filter((i) => fullText.includes(i.toLowerCase())).slice(0, 2).join(", ")}`
            : `Suggestion based on description analysis`;
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
    ? `This appears to be a **${bestCategory.name}** product (${highestConfidence} matching indicators). I've pre-filled suggestions based on typical characteristics of this category. Please review and adjust as needed for your specific product.`
    : `I couldn't confidently categorize this product. I've provided neutral starting suggestions — please review each answer carefully based on your specific product characteristics.`;

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
