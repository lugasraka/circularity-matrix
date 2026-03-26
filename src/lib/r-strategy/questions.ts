import { RStrategyQuestion } from './types';

/**
 * R-Strategy Assessment Questions
 * 7 questions corresponding to the 7 criteria
 * Each question has 5 options scored 1-5, normalized to 0-100
 */

export const rStrategyQuestions: RStrategyQuestion[] = [
  // =====================================================
  // SUITABILITY QUESTIONS (4)
  // =====================================================
  
  {
    id: 'q-absolute-product-value',
    criterionId: 'absolute-product-value',
    category: 'suitability',
    text: 'What is the absolute economic value of this product?',
    helpText: 'Consider the retail price or market value of the product, not relative to similar products.',
    options: [
      {
        label: 'Very low (< $50)',
        value: 1,
        description: 'Low-value commodity items, disposable products',
        scoreValue: 20,
      },
      {
        label: 'Low ($50 - $200)',
        value: 2,
        description: 'Basic consumer goods, simple tools',
        scoreValue: 40,
      },
      {
        label: 'Medium ($200 - $1,000)',
        value: 3,
        description: 'Mid-range appliances, standard equipment',
        scoreValue: 60,
      },
      {
        label: 'High ($1,000 - $5,000)',
        value: 4,
        description: 'Premium products, professional equipment',
        scoreValue: 80,
      },
      {
        label: 'Very high (> $5,000)',
        value: 5,
        description: 'Industrial machinery, luxury goods, specialized equipment',
        scoreValue: 100,
      },
    ],
  },
  
  {
    id: 'q-product-durability',
    criterionId: 'product-durability',
    category: 'suitability',
    text: 'How durable is this product?',
    helpText: 'Consider expected lifetime and how well the product maintains functionality over time.',
    options: [
      {
        label: 'Very short lifespan (< 1 year)',
        value: 1,
        description: 'Single-use or short-life products, consumables',
        scoreValue: 20,
      },
      {
        label: 'Short lifespan (1-3 years)',
        value: 2,
        description: 'Fast-moving consumer goods, trendy items',
        scoreValue: 35,
      },
      {
        label: 'Medium lifespan (3-7 years)',
        value: 3,
        description: 'Standard consumer electronics, appliances',
        scoreValue: 55,
      },
      {
        label: 'Long lifespan (7-15 years)',
        value: 4,
        description: 'Quality furniture, industrial equipment',
        scoreValue: 75,
      },
      {
        label: 'Very long lifespan (> 15 years)',
        value: 5,
        description: 'Infrastructure, heavy machinery, timeless designs',
        scoreValue: 95,
      },
    ],
  },
  
  {
    id: 'q-regulatory-pressure',
    criterionId: 'regulatory-pressure',
    category: 'suitability',
    text: 'How strong are regulatory drivers for circularity?',
    helpText: 'Consider current and upcoming regulations, EPR schemes, and industry standards.',
    options: [
      {
        label: 'None',
        value: 1,
        description: 'No regulations, purely voluntary circularity',
        scoreValue: 10,
      },
      {
        label: 'Weak',
        value: 2,
        description: 'Minor reporting requirements, industry guidelines',
        scoreValue: 30,
      },
      {
        label: 'Moderate',
        value: 3,
        description: 'Some EPR requirements, recycling targets',
        scoreValue: 50,
      },
      {
        label: 'Strong',
        value: 4,
        description: 'Mandatory take-back, strict recycling quotas',
        scoreValue: 75,
      },
      {
        label: 'Very strong',
        value: 5,
        description: 'Bans on landfill, mandatory circular design, heavy penalties',
        scoreValue: 95,
      },
    ],
  },
  
  {
    id: 'q-technological-change',
    criterionId: 'technological-change',
    category: 'suitability',
    text: 'How quickly does this product become obsolete?',
    helpText: 'Consider the pace of innovation and how quickly new versions make old ones outdated.',
    options: [
      {
        label: 'Very slow',
        value: 1,
        description: 'Mature technology, minimal innovation (e.g., basic tools, furniture)',
        scoreValue: 15,
      },
      {
        label: 'Slow',
        value: 2,
        description: 'Incremental improvements only (e.g., appliances, vehicles)',
        scoreValue: 30,
      },
      {
        label: 'Moderate',
        value: 3,
        description: 'Regular updates but old versions remain functional (e.g., laptops)',
        scoreValue: 50,
      },
      {
        label: 'Fast',
        value: 4,
        description: 'Significant annual improvements (e.g., smartphones, software)',
        scoreValue: 75,
      },
      {
        label: 'Very fast',
        value: 5,
        description: 'Rapid obsolescence, cutting-edge tech (e.g., AI hardware, latest gadgets)',
        scoreValue: 95,
      },
    ],
  },
  
  // =====================================================
  // PRACTICALITY QUESTIONS (3)
  // =====================================================
  
  {
    id: 'q-logistics-handling',
    criterionId: 'logistics-handling',
    category: 'practicality',
    text: 'How easy is logistics handling for used products?',
    helpText: 'Consider collection, transport, storage, and reverse logistics complexity.',
    options: [
      {
        label: 'Very difficult',
        value: 1,
        description: 'Hazardous materials, bulky items, dispersed locations, no collection system',
        scoreValue: 15,
      },
      {
        label: 'Difficult',
        value: 2,
        description: 'Specialized transport needed, limited collection points',
        scoreValue: 35,
      },
      {
        label: 'Moderate',
        value: 3,
        description: 'Standard logistics, some collection infrastructure exists',
        scoreValue: 55,
      },
      {
        label: 'Easy',
        value: 4,
        description: 'Established reverse logistics, multiple collection channels',
        scoreValue: 75,
      },
      {
        label: 'Very easy',
        value: 5,
        description: 'Dedicated return systems, drop-off everywhere, simple handling',
        scoreValue: 95,
      },
    ],
  },
  
  {
    id: 'q-value-recovery',
    criterionId: 'value-recovery',
    category: 'practicality',
    text: 'How easy is value recovery from this product?',
    helpText: 'Consider disassembly difficulty, material separation, and processing requirements.',
    options: [
      {
        label: 'Very difficult',
        value: 1,
        description: 'Destructive disassembly, inseparable materials, toxic components',
        scoreValue: 15,
      },
      {
        label: 'Difficult',
        value: 2,
        description: 'Complex disassembly, bonded materials, specialized equipment needed',
        scoreValue: 35,
      },
      {
        label: 'Moderate',
        value: 3,
        description: 'Some effort required, trained labor needed, multi-step process',
        scoreValue: 55,
      },
      {
        label: 'Easy',
        value: 4,
        description: 'Simple disassembly, modular design, standard tools suffice',
        scoreValue: 75,
      },
      {
        label: 'Very easy',
        value: 5,
        description: 'Tool-free disassembly, single material, no processing needed',
        scoreValue: 95,
      },
    ],
  },
  
  {
    id: 'q-embedded-value',
    criterionId: 'embedded-value',
    category: 'practicality',
    text: 'How much value is retained in used products?',
    helpText: 'Consider material value, brand value, and functional value remaining after use phase.',
    options: [
      {
        label: 'Very little',
        value: 1,
        description: 'Consumed/disposable products, minimal material value, no brand premium',
        scoreValue: 20,
      },
      {
        label: 'Little',
        value: 2,
        description: 'Low-grade materials, high depreciation, generic products',
        scoreValue: 40,
      },
      {
        label: 'Moderate',
        value: 3,
        description: 'Some material value, recognizable brand, partial functionality',
        scoreValue: 60,
      },
      {
        label: 'High',
        value: 4,
        description: 'Quality materials, strong brand, good working condition',
        scoreValue: 80,
      },
      {
        label: 'Very high',
        value: 5,
        description: 'Precious materials, luxury brand, minimal wear, full functionality',
        scoreValue: 100,
      },
    ],
  },
];

// Helper to get question by ID
export function getQuestionById(id: string): RStrategyQuestion | undefined {
  return rStrategyQuestions.find((q) => q.id === id);
}

// Helper to get question by criterion ID
export function getQuestionByCriterionId(criterionId: string): RStrategyQuestion | undefined {
  return rStrategyQuestions.find((q) => q.criterionId === criterionId);
}

// Get suitability questions
export const suitabilityQuestions = rStrategyQuestions.filter((q) => q.category === 'suitability');

// Get practicality questions
export const practicalityQuestions = rStrategyQuestions.filter((q) => q.category === 'practicality');
