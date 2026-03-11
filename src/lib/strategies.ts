import { CellStrategy } from "./types";

export const strategyDescriptions: Record<string, string> = {
  RPO: "Retain Product Ownership — The manufacturer retains ownership and offers the product as a service. Customers pay for access/usage rather than owning the product outright.",
  PLE: "Product Life Extension — Extend the product's useful life through repair, refurbishment, maintenance, or remanufacturing. Keeps products in use longer.",
  DFR: "Design for Recycling — Design products so that materials can be efficiently recovered and recycled at end of life. Focuses on material recovery rather than product reuse.",
};

export const cellStrategies: CellStrategy[] = [
  // === TOP-LEFT: Hard Access, Easy Process ===
  {
    id: "hard-easy-low",
    strategies: ["DFR"],
    label: "DFR + Infrastructure/Partnerships",
    description:
      "Products that are hard to get back but easy to process once recovered. With low embedded value, the economics only work with shared infrastructure and partnerships to reduce collection costs.",
    examples: ["Biodegradable packaging (BioPak)"],
    guidance: [
      "Invest in collection infrastructure or partner with waste management companies",
      "Design for easy material identification and sorting",
      "Consider biodegradable or compostable material alternatives",
      "Join or create industry-wide collection consortiums to share costs",
    ],
    position: { access: "hard", process: "easy", embeddedValue: "low" },
  },
  {
    id: "hard-easy-high",
    strategies: ["PLE", "RPO"],
    label: "PLE + RPO",
    description:
      "Products that are hard to get back but easy to process, with high embedded value. Retaining ownership solves the access challenge, while high value justifies life extension investments.",
    examples: [
      "Industrial equipment (Caterpillar)",
      "Office equipment (Xerox)",
    ],
    guidance: [
      "Consider product-as-a-service or leasing models to maintain control",
      "Build service and maintenance networks for life extension",
      "Design modular products with replaceable components",
      "Implement IoT monitoring for predictive maintenance",
    ],
    position: { access: "hard", process: "easy", embeddedValue: "high" },
  },

  // === TOP-RIGHT: Hard Access, Hard Process ===
  {
    id: "hard-hard-low",
    strategies: ["DFR", "RPO"],
    label: "DFR + RPO",
    description:
      "Products that are hard to get back AND hard to process, with low embedded value. Retaining ownership enables access, while DFR makes processing viable despite complexity.",
    examples: ["Commercial tires — servicing and retreading (Michelin)"],
    guidance: [
      "Retain ownership to ensure product return (e.g., fleet tire services)",
      "Design for easier disassembly and material separation",
      "Invest in specialized processing technology",
      "Consider product-as-a-service models with guaranteed take-back",
    ],
    position: { access: "hard", process: "hard", embeddedValue: "low" },
  },
  {
    id: "hard-hard-high",
    strategies: ["PLE"],
    label: "PLE",
    description:
      "Products that are hard to get back AND hard to process, but with high embedded value. The high value justifies the investment in extending product life despite the challenges.",
    examples: ["Wind turbines"],
    guidance: [
      "Focus on maximizing product lifespan through robust design",
      "Build dedicated service and refurbishment capabilities",
      "Design for long-term durability and component replaceability",
      "Develop specialized end-of-life processing when products finally reach retirement",
    ],
    position: { access: "hard", process: "hard", embeddedValue: "high" },
  },

  // === BOTTOM-LEFT: Easy Access, Easy Process ===
  {
    id: "easy-easy-low",
    strategies: ["DFR"],
    label: "Incremental DFR",
    description:
      "Products that are easy to get back and easy to process, with low embedded value. The favorable conditions allow straightforward, incremental improvements to Design for Recycling.",
    examples: [
      "Commodity raw materials (Real Alloy)",
      "Aluminum recycling (Norsk Hydro)",
    ],
    guidance: [
      "Optimize material purity to maintain recycling quality",
      "Minimize contaminants and mixed materials",
      "Leverage existing recycling infrastructure",
      "Focus on closed-loop material flows within your supply chain",
    ],
    position: { access: "easy", process: "easy", embeddedValue: "low" },
  },
  {
    id: "easy-easy-high",
    strategies: ["PLE", "DFR"],
    label: "PLE + DFR",
    description:
      "Products that are easy to get back and easy to process, with high embedded value. The best of both worlds — extend life while the product has value, then design for easy recycling at end of life.",
    examples: ["Branded reusable and recyclable clothing (Patagonia)"],
    guidance: [
      "Implement repair and resale programs to extend first life",
      "Design for both durability (PLE) and eventual recyclability (DFR)",
      "Build take-back programs leveraging brand loyalty",
      "Create secondary markets for used products (e.g., Worn Wear program)",
    ],
    position: { access: "easy", process: "easy", embeddedValue: "high" },
  },

  // === BOTTOM-RIGHT: Easy Access, Hard Process ===
  {
    id: "easy-hard-low",
    strategies: ["DFR"],
    label: "DFR + Partnerships",
    description:
      "Products that are easy to get back but hard to process, with low embedded value. Easy access is advantage, but processing complexity and low value require partnerships and DFR innovation.",
    examples: [
      "Carpets (Interface)",
      "Mattresses (DSM-Niaga)",
      "Footwear (Nike, Adidas)",
    ],
    guidance: [
      "Redesign products for easier material separation (e.g., mono-material layers)",
      "Partner with recycling technology innovators",
      "Invest in R&D for processing complex materials",
      "Join industry coalitions to develop new recycling standards and infrastructure",
    ],
    position: { access: "easy", process: "hard", embeddedValue: "low" },
  },
  {
    id: "easy-hard-high",
    strategies: ["DFR"],
    label: "DFR",
    description:
      "Products that are easy to get back but hard to process, with high embedded value. The high value of recoverable materials justifies investment in better Design for Recycling.",
    examples: ["Consumer electronics (Apple)"],
    guidance: [
      "Design for disassembly — use screws instead of glue, modular components",
      "Map and track valuable materials through the product lifecycle",
      "Invest in urban mining and advanced material recovery technology",
      "Implement trade-in programs leveraging brand ecosystem and high retained value",
    ],
    position: { access: "easy", process: "hard", embeddedValue: "high" },
  },
];

export function getCellStrategy(
  access: "easy" | "hard",
  process: "easy" | "hard",
  embeddedValue: "high" | "low"
): CellStrategy {
  const cell = cellStrategies.find(
    (c) =>
      c.position.access === access &&
      c.position.process === process &&
      c.position.embeddedValue === embeddedValue
  );
  if (!cell) throw new Error(`No cell found for ${access}/${process}/${embeddedValue}`);
  return cell;
}
