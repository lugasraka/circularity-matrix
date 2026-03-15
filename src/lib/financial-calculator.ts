import { StrategyType, AssessmentResult } from "./types";

export interface FinancialInputs {
  annualVolume: number; // Units sold per year
  averageUnitCost: number; // Manufacturing cost per unit
  averageSellingPrice: number; // Sale price per unit
  currentEndOfLifeCost: number; // Cost per unit for disposal/waste
  productLifespanYears: number; // Average years product is used
}

export interface StrategyFinancials {
  strategy: StrategyType;
  estimatedInvestment: number; // Upfront investment required
  annualOperatingCost: number; // Ongoing annual cost
  annualRevenue: number; // Annual revenue/savings generated
  netAnnualBenefit: number; // Revenue minus operating cost
  paybackPeriodYears: number; // Years to recover investment
  fiveYearROI: number; // ROI percentage over 5 years
  fiveYearNPV: number; // Net Present Value (10% discount rate)
  assumptions: string[];
  risks: string[];
}

export interface FinancialCalculationResult {
  inputs: FinancialInputs;
  baselineAnnualProfit: number;
  strategies: StrategyFinancials[];
  recommendedStrategy: StrategyType;
  comparisonTable: {
    strategy: StrategyType;
    investment: number;
    annualBenefit: number;
    payback: number;
    fiveYearROI: number;
  }[];
}

// Default assumptions for financial calculations
const DEFAULT_ASSUMPTIONS = {
  discountRate: 0.1, // 10% discount rate for NPV
  analysisPeriod: 5, // 5-year analysis
  rpo: {
    servicePricePremium: 0.3, // 30% premium for service vs sale
    utilizationRate: 0.7, // 70% average utilization across lifecycle
    maintenanceCostPercent: 0.15, // 15% of unit cost annually
    contractRenewalRate: 0.8, // 80% of customers renew
  },
  ple: {
    refurbishmentCostPercent: 0.25, // 25% of unit cost to refurbish
    resalePricePercent: 0.6, // 60% of new price for refurbished
    tradeInRate: 0.3, // 30% of customers trade in
    lifespanExtensionYears: 2, // Average 2-year extension
  },
  dfr: {
    materialRecoveryRate: 0.7, // 70% of material recovered
    recoveredMaterialValuePercent: 0.4, // 40% of original material cost
    designChangeCostPercent: 0.1, // 10% increase in design cost
    recyclingPartnershipCost: 50000, // Annual fixed cost
  },
};

/**
 * Calculate financial projections for circular economy strategies
 * This is an estimation tool - actual results will vary significantly
 */
export function calculateFinancials(
  inputs: FinancialInputs,
  recommendedStrategies: StrategyType[]
): FinancialCalculationResult {
  const baselineAnnualProfit =
    (inputs.averageSellingPrice - inputs.averageUnitCost) * inputs.annualVolume -
    inputs.currentEndOfLifeCost * inputs.annualVolume;

  const strategies: StrategyFinancials[] = recommendedStrategies.map((strategy) =>
    calculateStrategyFinancials(strategy, inputs, baselineAnnualProfit)
  );

  // Sort by 5-year ROI for recommendation
  const sortedByROI = [...strategies].sort((a, b) => b.fiveYearROI - a.fiveYearROI);
  const recommendedStrategy = sortedByROI[0]?.strategy || recommendedStrategies[0];

  return {
    inputs,
    baselineAnnualProfit,
    strategies,
    recommendedStrategy,
    comparisonTable: strategies.map((s) => ({
      strategy: s.strategy,
      investment: s.estimatedInvestment,
      annualBenefit: s.netAnnualBenefit,
      payback: s.paybackPeriodYears,
      fiveYearROI: s.fiveYearROI,
    })),
  };
}

function calculateStrategyFinancials(
  strategy: StrategyType,
  inputs: FinancialInputs,
  baselineProfit: number
): StrategyFinancials {
  const volume = inputs.annualVolume;
  const unitCost = inputs.averageUnitCost;
  const unitPrice = inputs.averageSellingPrice;

  switch (strategy) {
    case "RPO":
      return calculateRPOFinancials(volume, unitCost, unitPrice, baselineProfit);
    case "PLE":
      return calculatePLEFinancials(volume, unitCost, unitPrice, baselineProfit);
    case "DFR":
      return calculateDFRFinancials(volume, unitCost, unitPrice, baselineProfit);
    default:
      throw new Error(`Unknown strategy: ${strategy}`);
  }
}

function calculateRPOFinancials(
  volume: number,
  unitCost: number,
  unitPrice: number,
  baselineProfit: number
): StrategyFinancials {
  const { rpo } = DEFAULT_ASSUMPTIONS;

  // Investment: IT systems, legal framework, service infrastructure
  const estimatedInvestment = Math.max(
    500000,
    volume * unitCost * 0.5 // Need to own inventory = 50% of annual volume
  );

  // Revenue: Service fees over product lifetime
  const lifetimeServiceRevenue = unitPrice * rpo.servicePricePremium * (1 + rpo.utilizationRate);
  const annualRevenue = volume * lifetimeServiceRevenue * rpo.contractRenewalRate;

  // Costs: Maintenance, asset depreciation, operations
  const annualOperatingCost =
    volume * (unitCost * rpo.maintenanceCostPercent + unitCost * 0.05); // 5% annual depreciation

  const netAnnualBenefit = annualRevenue - annualOperatingCost - baselineProfit;
  const paybackPeriodYears = netAnnualBenefit > 0 ? estimatedInvestment / netAnnualBenefit : 999;

  // 5-year NPV calculation
  const fiveYearNPV = calculateNPV(estimatedInvestment, netAnnualBenefit, 5, DEFAULT_ASSUMPTIONS.discountRate);
  const fiveYearROI = ((netAnnualBenefit * 5 - estimatedInvestment) / estimatedInvestment) * 100;

  return {
    strategy: "RPO",
    estimatedInvestment,
    annualOperatingCost,
    annualRevenue,
    netAnnualBenefit,
    paybackPeriodYears: Math.min(paybackPeriodYears, 999),
    fiveYearROI,
    fiveYearNPV,
    assumptions: [
      `Service priced at ${(rpo.servicePricePremium * 100).toFixed(0)}% premium over sale price`,
      `Average asset utilization: ${(rpo.utilizationRate * 100).toFixed(0)}%`,
      `Annual maintenance cost: ${(rpo.maintenanceCostPercent * 100).toFixed(0)}% of unit cost`,
      `Contract renewal rate: ${(rpo.contractRenewalRate * 100).toFixed(0)}%`,
    ],
    risks: [
      "Customer resistance to subscription models",
      "Higher working capital requirements (asset ownership)",
      "Maintenance cost underestimation",
      "Asset tracking and recovery challenges",
    ],
  };
}

function calculatePLEFinancials(
  volume: number,
  unitCost: number,
  unitPrice: number,
  baselineProfit: number
): StrategyFinancials {
  const { ple } = DEFAULT_ASSUMPTIONS;

  // Investment: Refurbishment facility, reverse logistics, quality systems
  const estimatedInvestment = Math.max(
    300000,
    volume * 0.1 * unitCost * 2 // 10% refurbishment rate, 2x unit cost for facility
  );

  // Revenue: Refurbished sales + reduced new production costs
  const refurbishmentVolume = volume * ple.tradeInRate;
  const refurbishmentRevenue = refurbishmentVolume * unitPrice * ple.resalePricePercent;
  const newUnitSavings = refurbishmentVolume * unitCost * 0.5; // Avoid 50% of new production
  const annualRevenue = refurbishmentRevenue + newUnitSavings;

  // Costs: Collection, refurbishment, storage
  const refurbishmentCost = refurbishmentVolume * unitCost * ple.refurbishmentCostPercent;
  const logisticsCost = volume * ple.tradeInRate * unitCost * 0.05; // 5% for logistics
  const annualOperatingCost = refurbishmentCost + logisticsCost;

  const netAnnualBenefit = annualRevenue - annualOperatingCost - baselineProfit * 0.1; // 10% baseline cannibalization
  const paybackPeriodYears = netAnnualBenefit > 0 ? estimatedInvestment / netAnnualBenefit : 999;

  const fiveYearNPV = calculateNPV(estimatedInvestment, netAnnualBenefit, 5, DEFAULT_ASSUMPTIONS.discountRate);
  const fiveYearROI = ((netAnnualBenefit * 5 - estimatedInvestment) / estimatedInvestment) * 100;

  return {
    strategy: "PLE",
    estimatedInvestment,
    annualOperatingCost,
    annualRevenue,
    netAnnualBenefit,
    paybackPeriodYears: Math.min(paybackPeriodYears, 999),
    fiveYearROI,
    fiveYearNPV,
    assumptions: [
      `Refurbishment cost: ${(ple.refurbishmentCostPercent * 100).toFixed(0)}% of unit cost`,
      `Refurbished product price: ${(ple.resalePricePercent * 100).toFixed(0)}% of new`,
      `Trade-in rate: ${(ple.tradeInRate * 100).toFixed(0)}% of customers`,
      `Lifespan extended by ${ple.lifespanExtensionYears} years on average`,
    ],
    risks: [
      "Cannibalization of new product sales",
      "Quality perception of refurbished products",
      "Inconsistent supply of used products",
      "Refurbishment quality control challenges",
    ],
  };
}

function calculateDFRFinancials(
  volume: number,
  unitCost: number,
  unitPrice: number,
  baselineProfit: number
): StrategyFinancials {
  const { dfr } = DEFAULT_ASSUMPTIONS;

  // Investment: Design changes, material testing, recycling partnerships
  const estimatedInvestment = Math.max(
    200000,
    volume * unitCost * 0.05 + dfr.recyclingPartnershipCost * 3
  );

  // Revenue: Recovered material value + avoided disposal costs
  const materialValuePerUnit = unitCost * 0.4; // Materials are ~40% of cost
  const recoveredValuePerUnit = materialValuePerUnit * dfr.materialRecoveryRate * dfr.recoveredMaterialValuePercent;
  const disposalSavings = unitCost * 0.02; // Avoided disposal cost
  const annualRevenue = volume * (recoveredValuePerUnit + disposalSavings);

  // Costs: Design changes, recycling partnerships, collection
  const designCostIncrease = volume * unitCost * dfr.designChangeCostPercent;
  const annualOperatingCost = designCostIncrease + dfr.recyclingPartnershipCost;

  const netAnnualBenefit = annualRevenue - annualOperatingCost;
  const paybackPeriodYears = netAnnualBenefit > 0 ? estimatedInvestment / netAnnualBenefit : 999;

  const fiveYearNPV = calculateNPV(estimatedInvestment, netAnnualBenefit, 5, DEFAULT_ASSUMPTIONS.discountRate);
  const fiveYearROI = ((netAnnualBenefit * 5 - estimatedInvestment) / estimatedInvestment) * 100;

  return {
    strategy: "DFR",
    estimatedInvestment,
    annualOperatingCost,
    annualRevenue,
    netAnnualBenefit,
    paybackPeriodYears: Math.min(paybackPeriodYears, 999),
    fiveYearROI,
    fiveYearNPV,
    assumptions: [
      `Material recovery rate: ${(dfr.materialRecoveryRate * 100).toFixed(0)}%`,
      `Recovered material value: ${(dfr.recoveredMaterialValuePercent * 100).toFixed(0)}% of original`,
      `Design cost increase: ${(dfr.designChangeCostPercent * 100).toFixed(0)}%`,
      `Annual recycling partnership cost: $${dfr.recyclingPartnershipCost.toLocaleString()}`,
    ],
    risks: [
      "Recycling infrastructure may not exist for your materials",
      "Fluctuating commodity prices affect recovered value",
      "Design constraints may impact product performance",
      "Consumer confusion about recyclability",
    ],
  };
}

function calculateNPV(
  initialInvestment: number,
  annualCashFlow: number,
  years: number,
  discountRate: number
): number {
  let npv = -initialInvestment;
  for (let year = 1; year <= years; year++) {
    npv += annualCashFlow / Math.pow(1 + discountRate, year);
  }
  return npv;
}

// Format currency
export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  } else if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

// Format percentage
export function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

// Get default inputs based on product type hint
export function getDefaultInputs(productName: string): FinancialInputs {
  // Try to infer from product name
  const name = productName.toLowerCase();

  if (name.includes("phone") || name.includes("smartphone")) {
    return {
      annualVolume: 100000,
      averageUnitCost: 300,
      averageSellingPrice: 800,
      currentEndOfLifeCost: 5,
      productLifespanYears: 3,
    };
  } else if (name.includes("laptop") || name.includes("computer")) {
    return {
      annualVolume: 50000,
      averageUnitCost: 600,
      averageSellingPrice: 1200,
      currentEndOfLifeCost: 10,
      productLifespanYears: 4,
    };
  } else if (name.includes("packaging") || name.includes("box")) {
    return {
      annualVolume: 1000000,
      averageUnitCost: 2,
      averageSellingPrice: 5,
      currentEndOfLifeCost: 0.1,
      productLifespanYears: 0.1,
    };
  } else if (name.includes("furniture") || name.includes("chair")) {
    return {
      annualVolume: 20000,
      averageUnitCost: 200,
      averageSellingPrice: 600,
      currentEndOfLifeCost: 15,
      productLifespanYears: 10,
    };
  }

  // Default values
  return {
    annualVolume: 50000,
    averageUnitCost: 100,
    averageSellingPrice: 250,
    currentEndOfLifeCost: 5,
    productLifespanYears: 5,
  };
}

// Validate inputs
export function validateFinancialInputs(inputs: FinancialInputs): string[] {
  const errors: string[] = [];

  if (inputs.annualVolume <= 0) errors.push("Annual volume must be greater than 0");
  if (inputs.averageUnitCost <= 0) errors.push("Average unit cost must be greater than 0");
  if (inputs.averageSellingPrice <= 0) errors.push("Average selling price must be greater than 0");
  if (inputs.averageSellingPrice <= inputs.averageUnitCost) {
    errors.push("Selling price should be greater than unit cost");
  }
  if (inputs.currentEndOfLifeCost < 0) errors.push("End-of-life cost cannot be negative");
  if (inputs.productLifespanYears <= 0) errors.push("Product lifespan must be greater than 0");

  return errors;
}
