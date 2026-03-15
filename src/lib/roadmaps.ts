import { StrategyType, CellStrategy } from "./types";

export type TimePhase = "quick" | "medium" | "long";

export interface RoadmapAction {
  id: string;
  title: string;
  description: string;
  phase: TimePhase;
  estimatedDuration: string;
  resources: string[];
  keyStakeholders: string[];
  successMetrics: string[];
  risks: string[];
  difficulty: "low" | "medium" | "high";
  costEstimate: "low" | "medium" | "high";
}

export interface StrategyRoadmap {
  strategy: StrategyType;
  overview: string;
  phases: Record<TimePhase, RoadmapAction[]>;
  prerequisites: string[];
  commonPitfalls: string[];
  caseStudy: {
    company: string;
    context: string;
    approach: string;
    results: string;
  };
}

// Comprehensive roadmaps for each strategy
export const strategyRoadmaps: Record<StrategyType, StrategyRoadmap> = {
  RPO: {
    strategy: "RPO",
    overview:
      "Retain Product Ownership transforms your business model from selling products to providing product-as-a-service. This requires fundamental changes to legal structures, pricing models, and customer relationships.",
    prerequisites: [
      "Strong balance sheet to retain asset ownership",
      "Legal framework for service contracts",
      "Customer willingness to shift from owning to accessing",
      "Product durability suitable for multiple use cycles",
    ],
    commonPitfalls: [
      "Underestimating maintenance and refurbishment costs",
      "Inadequate insurance coverage for retained assets",
      "Poor contract design leading to disputes",
      "Insufficient tracking of asset condition and location",
    ],
    caseStudy: {
      company: "Philips Lighting",
      context: "Schiphol Airport lighting contract",
      approach:
        "Shifted from selling light bulbs to providing 'light as a service' — Philips owns, installs, maintains, and replaces lighting infrastructure",
      results: "50% reduction in energy consumption, guaranteed uptime, lower total cost for airport",
    },
    phases: {
      quick: [
        {
          id: "rpo-1",
          title: "Pilot Program Design",
          description:
            "Design a pilot RPO program with 5-10 key customers. Define service tiers, pricing models, and contract templates.",
          phase: "quick",
          estimatedDuration: "2-3 months",
          resources: ["Business development team", "Legal counsel", "Finance analyst"],
          keyStakeholders: ["Sales leadership", "Legal", "CFO"],
          successMetrics: ["Pilot agreement signed", "Contract template finalized", "Pricing model validated"],
          risks: ["Customer resistance to new model", "Legal complexity delays"],
          difficulty: "medium",
          costEstimate: "medium",
        },
        {
          id: "rpo-2",
          title: "Asset Tracking System",
          description:
            "Implement basic asset tracking (QR codes, RFID, or simple database) to monitor product location and condition.",
          phase: "quick",
          estimatedDuration: "1-2 months",
          resources: ["IT team", "Operations team"],
          keyStakeholders: ["CTO", "Operations manager"],
          successMetrics: ["Tracking system operational", "Data accuracy >95%", "User training complete"],
          risks: ["Integration challenges with existing systems"],
          difficulty: "low",
          costEstimate: "low",
        },
        {
          id: "rpo-3",
          title: "Service Team Setup",
          description:
            "Establish maintenance and support capabilities. Train team on RPO service delivery model.",
          phase: "quick",
          estimatedDuration: "2-4 months",
          resources: ["Service technicians", "Training budget"],
          keyStakeholders: ["Service manager", "HR"],
          successMetrics: ["Service level agreements defined", "Team trained", "Response time targets set"],
          risks: ["Skill gaps in service team", "Union negotiations if applicable"],
          difficulty: "medium",
          costEstimate: "medium",
        },
      ],
      medium: [
        {
          id: "rpo-4",
          title: "Pilot Launch & Iteration",
          description:
            "Launch pilot with selected customers. Monitor closely, gather feedback, and refine the model.",
          phase: "medium",
          estimatedDuration: "6-12 months",
          resources: ["Account managers", "Customer success team", "Data analyst"],
          keyStakeholders: ["Pilot customers", "Sales team", "Product team"],
          successMetrics: [
            "Customer satisfaction >4/5",
            "Uptime targets met",
            "Pilot renewals secured",
          ],
          risks: ["Pilot customers churn", "Unexpected maintenance costs", "Competitive response"],
          difficulty: "high",
          costEstimate: "high",
        },
        {
          id: "rpo-5",
          title: "Insurance & Risk Framework",
          description:
            "Develop comprehensive insurance coverage for retained assets. Create risk assessment protocols.",
          phase: "medium",
          estimatedDuration: "3-4 months",
          resources: ["Risk manager", "Insurance broker", "Legal"],
          keyStakeholders: ["CFO", "Risk committee"],
          successMetrics: ["Insurance coverage secured", "Risk protocols documented", "Claims process defined"],
          risks: ["High insurance premiums", "Coverage gaps discovered"],
          difficulty: "medium",
          costEstimate: "medium",
        },
        {
          id: "rpo-6",
          title: "Pricing Optimization",
          description:
            "Analyze pilot data to optimize pricing. Model total cost of ownership vs. traditional sales.",
          phase: "medium",
          estimatedDuration: "2-3 months",
          resources: ["Pricing analyst", "Finance team", "Data scientist"],
          keyStakeholders: ["CFO", "Sales leadership"],
          successMetrics: ["Pricing model profitable", "Competitive positioning confirmed", "Margin targets met"],
          risks: ["Pricing too high loses customers", "Pricing too low destroys margins"],
          difficulty: "high",
          costEstimate: "low",
        },
      ],
      long: [
        {
          id: "rpo-7",
          title: "Scale & Automation",
          description:
            "Expand RPO offering to broader market. Automate tracking, billing, and maintenance scheduling.",
          phase: "long",
          estimatedDuration: "12-18 months",
          resources: ["Digital transformation team", "Software developers", "Operations scale-up"],
          keyStakeholders: ["CEO", "CTO", "COO"],
          successMetrics: [
            "X% of revenue from services",
            "Automated billing operational",
            "Geographic expansion completed",
          ],
          risks: ["Technology investment required", "Organizational resistance", "Market timing"],
          difficulty: "high",
          costEstimate: "high",
        },
        {
          id: "rpo-8",
          title: "Platform Ecosystem",
          description:
            "Develop platform capabilities to enable third-party services on your product infrastructure.",
          phase: "long",
          estimatedDuration: "18-24 months",
          resources: ["Platform team", "Partnership managers", "API developers"],
          keyStakeholders: ["Chief Strategy Officer", "Partnership leads"],
          successMetrics: ["Platform launched", "Third-party integrations live", "New revenue streams active"],
          risks: ["Platform adoption low", "Security vulnerabilities", "Partner conflicts"],
          difficulty: "high",
          costEstimate: "high",
        },
      ],
    },
  },
  PLE: {
    strategy: "PLE",
    overview:
      "Product Life Extension focuses on maximizing the useful life of products through repair, refurbishment, remanufacturing, and resale. This requires building reverse logistics, service capabilities, and secondary markets.",
    prerequisites: [
      "Product design allows for disassembly and component replacement",
      "Sufficient product volume to justify infrastructure investment",
      "Customer willingness to buy refurbished/extended-life products",
      "Spare parts availability and supply chain",
    ],
    commonPitfalls: [
      "Cannibalizing new product sales without strategy",
      "Inadequate quality control on refurbished products",
      "Poor customer communication about refurbished offerings",
      "Underestimating logistics complexity for returns",
    ],
    caseStudy: {
      company: "Patagonia",
      context: "Outdoor apparel with strong environmental mission",
      approach:
        "Worn Wear program: repairs, resells used gear, and encourages product longevity. Offers trade-in credits.",
      results: "Extended product lifecycles, customer loyalty, new revenue stream from resale",
    },
    phases: {
      quick: [
        {
          id: "ple-1",
          title: "Repair Service Launch",
          description:
            "Launch paid repair service for your products. Start simple: common repairs with predictable costs.",
          phase: "quick",
          estimatedDuration: "1-2 months",
          resources: ["Repair technicians", "Basic tools and parts inventory"],
          keyStakeholders: ["Service manager", "Customer support"],
          successMetrics: ["Repair service live", "Customer uptake targets met", "Positive feedback"],
          risks: ["Repair costs higher than anticipated", "Parts availability issues"],
          difficulty: "low",
          costEstimate: "low",
        },
        {
          id: "ple-2",
          title: "Warranty Extension Program",
          description:
            "Offer extended warranty options at point of sale. Simple revenue model for life extension.",
          phase: "quick",
          estimatedDuration: "1 month",
          resources: ["Finance analyst", "Marketing team"],
          keyStakeholders: ["Sales team", "Finance"],
          successMetrics: ["Warranty attach rate >20%", "Claims rate within model", "Revenue targets"],
          risks: ["Underestimating failure rates", "Customer service burden"],
          difficulty: "low",
          costEstimate: "low",
        },
        {
          id: "ple-3",
          title: "Spare Parts Availability",
          description:
            "Ensure critical spare parts are available for purchase. Publish repair guides for DIY customers.",
          phase: "quick",
          estimatedDuration: "2-3 months",
          resources: ["Supply chain team", "Technical writers"],
          keyStakeholders: ["Operations", "Customer support"],
          successMetrics: ["Parts catalog published", "Top 10 parts in stock", "Repair guides available"],
          risks: ["Inventory carrying costs", "Parts obsolescence"],
          difficulty: "medium",
          costEstimate: "medium",
        },
      ],
      medium: [
        {
          id: "ple-4",
          title: "Certified Refurbishment Program",
          description:
            "Launch 'Certified Refurbished' product line. Establish quality standards and refurbishment processes.",
          phase: "medium",
          estimatedDuration: "4-6 months",
          resources: ["Refurbishment facility", "Quality inspectors", "Reverse logistics"],
          keyStakeholders: ["Operations director", "Sales team", "Brand manager"],
          successMetrics: [
            "Refurb line launched",
            "Quality standards met",
            "Customer satisfaction comparable to new",
          ],
          risks: ["Brand dilution concerns", "Cannibalization of new sales", "Quality failures"],
          difficulty: "high",
          costEstimate: "high",
        },
        {
          id: "ple-5",
          title: "Trade-In Program",
          description:
            "Implement product take-back with credit toward new purchases. Creates supply for refurbishment.",
          phase: "medium",
          estimatedDuration: "2-3 months",
          resources: ["Program manager", "Trade-in valuation system", "Collection logistics"],
          keyStakeholders: ["Sales", "Operations", "Finance"],
          successMetrics: ["Trade-in volume targets", "Credit redemption rate", "Customer acquisition cost reduction"],
          risks: ["Trade-in valuation disputes", "Returned product condition variability"],
          difficulty: "medium",
          costEstimate: "medium",
        },
        {
          id: "ple-6",
          title: "Secondary Marketplace",
          description:
            "Launch owned marketplace for used/refurbished products. Control brand experience and capture margin.",
          phase: "medium",
          estimatedDuration: "4-6 months",
          resources: ["E-commerce team", "Platform development", "Seller support"],
          keyStakeholders: ["Digital team", "Brand team", "Sales"],
          successMetrics: ["Marketplace launched", "GMV growth", "Seller/buyer satisfaction"],
          risks: ["Low liquidity", "Fraud and disputes", "Competition with existing marketplaces"],
          difficulty: "high",
          costEstimate: "high",
        },
      ],
      long: [
        {
          id: "ple-7",
          title: "Remanufacturing at Scale",
          description:
            "Build industrial remanufacturing capability. Products restored to like-new condition with full warranty.",
          phase: "long",
          estimatedDuration: "12-18 months",
          resources: ["Remanufacturing facility", "Engineering team", "Supply chain"],
          keyStakeholders: ["COO", "Manufacturing director", "Quality"],
          successMetrics: [
            "Remanufacturing line operational",
            "Cost parity with new production",
            "Customer acceptance high",
          ],
          risks: ["Capital investment required", "Technology obsolescence", "Skill gaps"],
          difficulty: "high",
          costEstimate: "high",
        },
        {
          id: "ple-8",
          title: "Product-as-a-Service Integration",
          description:
            "Integrate PLE capabilities with RPO offerings. Provide guaranteed life extension as part of service.",
          phase: "long",
          estimatedDuration: "12-24 months",
          resources: ["Strategy team", "Service designers", "Technology platform"],
          keyStakeholders: ["Chief Strategy Officer", "Product management"],
          successMetrics: [
            "Integrated offering launched",
            "Service revenue growth",
            "Customer lifetime value increase",
          ],
          risks: ["Organizational silos", "Complexity management", "Customer confusion"],
          difficulty: "high",
          costEstimate: "high",
        },
      ],
    },
  },
  DFR: {
    strategy: "DFR",
    overview:
      "Design for Recycling focuses on optimizing products for material recovery at end-of-life. This requires design changes, material selection, recycling partnerships, and potentially new business models around material recovery.",
    prerequisites: [
      "Understanding of current recycling infrastructure capabilities",
      "Design team buy-in for recyclability constraints",
      "Supply chain flexibility for material changes",
      "Customer acceptance of potential trade-offs (cost, aesthetics)",
    ],
    commonPitfalls: [
      "Designing for theoretical rather than actual recycling capabilities",
      "Ignoring contamination from use phase",
      "Focusing only on recyclability without market for recycled materials",
      "Inadequate labeling causing recycling confusion",
    ],
    caseStudy: {
      company: "Apple",
      context: "Consumer electronics with complex material requirements",
      approach:
        "Daisy robot for iPhone disassembly, material-specific recovery, closed-loop aluminum goal, detailed material reporting",
      results: "Industry-leading material recovery rates, closed-loop aluminum in new products, transparency leadership",
    },
    phases: {
      quick: [
        {
          id: "dfr-1",
          title: "Recyclability Audit",
          description:
            "Conduct detailed audit of current products against recycling best practices. Identify quick wins.",
          phase: "quick",
          estimatedDuration: "1-2 months",
          resources: ["Sustainability consultant", "Design engineer", "Materials specialist"],
          keyStakeholders: ["Sustainability lead", "Head of Design"],
          successMetrics: ["Audit report completed", "Quick wins identified", "Priority list established"],
          risks: ["Audit scope creep", "Findings too critical for internal acceptance"],
          difficulty: "low",
          costEstimate: "low",
        },
        {
          id: "dfr-2",
          title: "Material Labeling Standard",
          description:
            "Implement clear material labeling (resin codes, material composition). Enables proper sorting.",
          phase: "quick",
          estimatedDuration: "1 month",
          resources: ["Packaging designer", "Regulatory specialist"],
          keyStakeholders: ["Product design", "Compliance"],
          successMetrics: ["Labeling standard defined", "Applied to current products", "Recycling partners informed"],
          risks: ["Regulatory changes requiring relabeling", "Space constraints on small products"],
          difficulty: "low",
          costEstimate: "low",
        },
        {
          id: "dfr-3",
          title: "Eliminate Problematic Materials",
          description:
            "Remove known recycling contaminants (PVC, certain adhesives, mixed laminates) where feasible.",
          phase: "quick",
          estimatedDuration: "2-4 months",
          resources: ["Materials engineers", "Supply chain team"],
          keyStakeholders: ["Head of Engineering", "Procurement"],
          successMetrics: ["Problematic materials list eliminated", "Alternatives qualified", "Cost impact assessed"],
          risks: ["Alternative material cost increase", "Performance trade-offs"],
          difficulty: "medium",
          costEstimate: "medium",
        },
      ],
      medium: [
        {
          id: "dfr-4",
          title: "Design for Disassembly Guidelines",
          description:
            "Create and implement design guidelines prioritizing screws over glue, modular components, easy separation.",
          phase: "medium",
          estimatedDuration: "3-6 months",
          resources: ["Design team", "DFR consultant", "Manufacturing engineers"],
          keyStakeholders: ["Chief Design Officer", "Manufacturing director"],
          successMetrics: [
            "Guidelines published",
            "Training completed",
            "New designs compliant",
          ],
          risks: ["Design team resistance", "Manufacturing process changes required", "Cost increases"],
          difficulty: "high",
          costEstimate: "medium",
        },
        {
          id: "dfr-5",
          title: "Recycling Partnership Development",
          description:
            "Establish partnerships with specialized recyclers. Ensure your designed-for-recycling products can actually be recycled.",
          phase: "medium",
          estimatedDuration: "3-6 months",
          resources: ["Partnership manager", "Sustainability team", "Legal"],
          keyStakeholders: ["Sustainability director", "Supply chain"],
          successMetrics: [
            "Partnerships signed",
            "Material recovery agreements in place",
            "Reverse logistics established",
          ],
          risks: ["Recycler capacity constraints", "Geographic coverage gaps", "Economic viability changes"],
          difficulty: "medium",
          costEstimate: "medium",
        },
        {
          id: "dfr-6",
          title: "Mono-Material Pilot",
          description:
            "Design and launch a mono-material product or component. Test market acceptance and recycling performance.",
          phase: "medium",
          estimatedDuration: "6-9 months",
          resources: ["R&D team", "Product management", "Marketing"],
          keyStakeholders: ["Product VP", "Head of R&D"],
          successMetrics: ["Mono-material product launched", "Recycling rate measured", "Customer feedback positive"],
          risks: ["Performance limitations", "Aesthetic compromises", "Market rejection"],
          difficulty: "high",
          costEstimate: "high",
        },
      ],
      long: [
        {
          id: "dfr-7",
          title: "Closed-Loop Material System",
          description:
            "Establish system where your products are source of recycled material for new production. True circularity.",
          phase: "long",
          estimatedDuration: "18-24 months",
          resources: ["Supply chain transformation", "Recycling technology investment", "Quality assurance"],
          keyStakeholders: ["COO", "Chief Sustainability Officer", "Procurement"],
          successMetrics: [
            "X% recycled content in new products",
            "Collection rate targets met",
            "Quality standards maintained",
          ],
          risks: ["Recycled material quality variability", "Supply uncertainty", "Cost competitiveness"],
          difficulty: "high",
          costEstimate: "high",
        },
        {
          id: "dfr-8",
          title: "Advanced Material Recovery Technology",
          description:
            "Invest in or partner on next-generation recycling technology for your specific material mix.",
          phase: "long",
          estimatedDuration: "24-36 months",
          resources: ["R&D investment", "Technology partnerships", "Pilot facilities"],
          keyStakeholders: ["CTO", "Chief Sustainability Officer"],
          successMetrics: [
            "Technology proven at scale",
            "Recovery rates >90%",
            "Economic viability demonstrated",
          ],
          risks: ["Technology fails to scale", "Better technology emerges", "High R&D costs"],
          difficulty: "high",
          costEstimate: "high",
        },
      ],
    },
  },
};

// Get roadmap for a specific strategy
export function getStrategyRoadmap(strategy: StrategyType): StrategyRoadmap {
  return strategyRoadmaps[strategy];
}

// Get all actions for a cell (combining multiple strategies)
export function getCellRoadmap(cell: CellStrategy): RoadmapAction[] {
  const actions: RoadmapAction[] = [];
  cell.strategies.forEach((strategy) => {
    const roadmap = strategyRoadmaps[strategy];
    actions.push(...roadmap.phases.quick, ...roadmap.phases.medium, ...roadmap.phases.long);
  });
  return actions;
}

// Get actions prioritized by phase
export function getPrioritizedActions(
  strategies: StrategyType[],
  phase: TimePhase
): RoadmapAction[] {
  const actions: RoadmapAction[] = [];
  strategies.forEach((strategy) => {
    actions.push(...strategyRoadmaps[strategy].phases[phase]);
  });
  return actions.sort((a, b) => {
    // Sort by difficulty (easier first) then by cost (lower first)
    const diffOrder = { low: 0, medium: 1, high: 2 };
    const costOrder = { low: 0, medium: 1, high: 2 };
    if (diffOrder[a.difficulty] !== diffOrder[b.difficulty]) {
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    }
    return costOrder[a.costEstimate] - costOrder[b.costEstimate];
  });
}

// Get phase display name
export function getPhaseDisplayName(phase: TimePhase): string {
  const names: Record<TimePhase, string> = {
    quick: "Quick Wins (0-6 months)",
    medium: "Medium Term (6-18 months)",
    long: "Long Term (18+ months)",
  };
  return names[phase];
}

// Get phase color
export function getPhaseColor(phase: TimePhase): string {
  const colors: Record<TimePhase, string> = {
    quick: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    long: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return colors[phase];
}

// Get difficulty/cost display
export function getEffortDisplay(difficulty: string, cost: string): string {
  const diffEmoji = { low: "🟢", medium: "🟡", high: "🔴" };
  return `${diffEmoji[difficulty as keyof typeof diffEmoji]} Difficulty: ${difficulty} | Cost: ${cost}`;
}
