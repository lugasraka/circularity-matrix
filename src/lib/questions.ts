import { Question } from "./types";

export const questions: Question[] = [
  // === ACCESS DIMENSION (3 questions) ===
  {
    id: "access-1",
    dimension: "access",
    text: "How does the product typically reach end users?",
    helpText:
      "Consider your distribution model and how many intermediaries are between you and the product at end-of-use.",
    options: [
      {
        label: "Direct to consumer / on-site",
        value: 1,
        description:
          "You sell and service directly (e.g., industrial equipment at client sites)",
      },
      {
        label: "Through owned retail channels",
        value: 2,
        description: "You control the retail experience (e.g., brand stores)",
      },
      {
        label: "Through select retail partners",
        value: 3,
        description: "Limited distribution through known partners",
      },
      {
        label: "Through broad retail / wholesale",
        value: 4,
        description: "Wide distribution with many intermediaries",
      },
      {
        label: "Globally dispersed via many channels",
        value: 5,
        description:
          "Products end up everywhere with no tracking (e.g., FMCG, packaging)",
      },
    ],
  },
  {
    id: "access-2",
    dimension: "access",
    text: "How willing and able are customers to return the product after use?",
    helpText:
      "Think about whether customers have incentive, convenience, and willingness to return products.",
    options: [
      {
        label: "Contractually required to return",
        value: 1,
        description: "Leasing, rental, or service contracts mandate return",
      },
      {
        label: "Strong incentive programs exist",
        value: 2,
        description:
          "Deposit schemes, trade-in programs, or meaningful buyback offers",
      },
      {
        label: "Moderate — some take-back programs",
        value: 3,
        description: "Voluntary return programs with moderate participation",
      },
      {
        label: "Low — inconvenient or no incentive",
        value: 4,
        description: "Customers must go out of their way to return; low motivation",
      },
      {
        label: "Very low — products are discarded",
        value: 5,
        description:
          "Products typically end up in general waste with no return path",
      },
    ],
  },
  {
    id: "access-3",
    dimension: "access",
    text: "How developed is the reverse logistics infrastructure for this product?",
    helpText:
      "Consider whether collection, transportation, and sorting systems exist to get used products back to you.",
    options: [
      {
        label: "Fully established reverse logistics",
        value: 1,
        description:
          "Dedicated collection and return networks already in place (e.g., fleet vehicles, service contracts)",
      },
      {
        label: "Partially developed",
        value: 2,
        description: "Some infrastructure exists but not comprehensive",
      },
      {
        label: "Relies on third-party systems",
        value: 3,
        description:
          "Depends on municipal waste systems or third-party collectors",
      },
      {
        label: "Minimal — would need significant investment",
        value: 4,
        description: "Little existing infrastructure; building it would be costly",
      },
      {
        label: "Non-existent",
        value: 5,
        description:
          "No viable path to recover products at scale; completely new system needed",
      },
    ],
  },

  // === PROCESS DIMENSION (3 questions) ===
  {
    id: "process-1",
    dimension: "process",
    text: "How complex is the product in terms of materials and components?",
    helpText:
      "Consider how many different materials are used and how they are combined.",
    options: [
      {
        label: "Single material / highly homogeneous",
        value: 1,
        description:
          "Made from one or very few similar materials (e.g., aluminum cans, glass bottles)",
      },
      {
        label: "Few materials, easily separable",
        value: 2,
        description:
          "A small number of distinct materials that can be separated (e.g., clothing with removable hardware)",
      },
      {
        label: "Moderate complexity",
        value: 3,
        description:
          "Multiple material types requiring some processing to separate (e.g., furniture)",
      },
      {
        label: "Complex — many bonded materials",
        value: 4,
        description:
          "Many material types that are glued, welded, or chemically bonded (e.g., multi-layer packaging)",
      },
      {
        label: "Highly complex — inseparable composites",
        value: 5,
        description:
          "Extremely heterogeneous with materials that are practically inseparable (e.g., electronics with embedded components)",
      },
    ],
  },
  {
    id: "process-2",
    dimension: "process",
    text: "How easily can the product be disassembled for value recovery?",
    helpText:
      "Consider whether the product was designed for disassembly or if specialized tools/processes are needed.",
    options: [
      {
        label: "No disassembly needed",
        value: 1,
        description:
          "Product can be recycled or reused as-is (e.g., melt down metal, compost packaging)",
      },
      {
        label: "Simple manual disassembly",
        value: 2,
        description:
          "Can be taken apart with basic tools in minutes (e.g., snap-fit components, screws)",
      },
      {
        label: "Moderate — requires trained labor",
        value: 3,
        description:
          "Needs skilled workers and some specialized tools (e.g., tire retreading, appliance refurbishment)",
      },
      {
        label: "Difficult — specialized equipment needed",
        value: 4,
        description:
          "Requires industrial equipment or chemical processes (e.g., battery disassembly, CRT recycling)",
      },
      {
        label: "Extremely difficult or destructive",
        value: 5,
        description:
          "Disassembly destroys value or is economically unviable (e.g., glued electronics, composite panels)",
      },
    ],
  },
  {
    id: "process-3",
    dimension: "process",
    text: "How much does the product degrade or contaminate during use?",
    helpText:
      "Consider whether the product maintains its material integrity through its use phase or becomes contaminated/worn.",
    options: [
      {
        label: "Minimal degradation — retains integrity",
        value: 1,
        description:
          "Product is essentially unchanged after use (e.g., metals, durable equipment casings)",
      },
      {
        label: "Minor wear — easily remedied",
        value: 2,
        description:
          "Surface wear or minor degradation that doesn't affect material recovery (e.g., clothing, tires with tread wear)",
      },
      {
        label: "Moderate — some contamination",
        value: 3,
        description:
          "Product picks up contaminants or degradation that requires cleaning/processing (e.g., food packaging, oil filters)",
      },
      {
        label: "Significant degradation",
        value: 4,
        description:
          "Material properties notably change during use (e.g., battery chemistry degradation, UV-damaged plastics)",
      },
      {
        label: "Severe — material is fundamentally altered",
        value: 5,
        description:
          "Use phase renders materials very different from original state (e.g., burned fuel, consumed chemicals)",
      },
    ],
  },

  // === EMBEDDED VALUE DIMENSION (2 questions) ===
  {
    id: "embedded-1",
    dimension: "embeddedValue",
    text: "How valuable are the materials and components in this product?",
    helpText:
      "Consider the raw material cost, scarcity, and the sophistication of components.",
    options: [
      {
        label: "Very low-value / commodity materials",
        value: 1,
        description:
          "Cheap, abundant materials (e.g., basic plastics, cardboard, low-grade metals)",
      },
      {
        label: "Below average value",
        value: 2,
        description:
          "Common materials with some processing value (e.g., standard textiles, common alloys)",
      },
      {
        label: "Moderate value",
        value: 3,
        description:
          "Materials with meaningful market value (e.g., engineered plastics, steel alloys, rubber compounds)",
      },
      {
        label: "High value",
        value: 4,
        description:
          "Expensive materials or sophisticated components (e.g., rare earth elements, precision-engineered parts, high-grade metals)",
      },
      {
        label: "Very high value",
        value: 5,
        description:
          "Precious metals, critical minerals, or very expensive engineered components (e.g., gold in electronics, turbine blades)",
      },
    ],
  },
  {
    id: "embedded-2",
    dimension: "embeddedValue",
    text: "How much brand value or technology value is retained in the used product?",
    helpText:
      "Consider whether the product retains its brand premium or technological relevance after initial use.",
    options: [
      {
        label: "No retained brand/tech value",
        value: 1,
        description:
          "Generic product with no brand premium; technology is irrelevant after use (e.g., commodity packaging)",
      },
      {
        label: "Minimal retained value",
        value: 2,
        description:
          "Some brand recognition but low resale or reuse premium (e.g., fast-fashion clothing)",
      },
      {
        label: "Moderate",
        value: 3,
        description:
          "Brand or technology adds some value to second life (e.g., mid-range appliances, tires)",
      },
      {
        label: "High retained value",
        value: 4,
        description:
          "Strong brand premium or technology that retains value (e.g., luxury goods, premium electronics, industrial machines)",
      },
      {
        label: "Very high retained value",
        value: 5,
        description:
          "Exceptional brand or technology value persists (e.g., Patagonia gear, Apple devices, Caterpillar equipment)",
      },
    ],
  },
];
