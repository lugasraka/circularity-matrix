"use client";

import { useState, useEffect, useMemo } from "react";
import { StrategyType, AssessmentResult } from "../lib/types";
import {
  calculateFinancials,
  formatCurrency,
  formatPercent,
  getDefaultInputs,
  validateFinancialInputs,
  FinancialInputs,
  StrategyFinancials,
  FinancialAssumptions,
  DEFAULT_ASSUMPTIONS,
  STRATEGY_FORMULAS,
} from "../lib/financial-calculator";

interface FinancialCalculatorProps {
  productName: string;
  result: AssessmentResult;
}

const STRATEGY_COLORS: Record<StrategyType, string> = {
  RPO: "bg-purple-100 text-purple-800 border-purple-200",
  PLE: "bg-green-100 text-green-800 border-green-200",
  DFR: "bg-blue-100 text-blue-800 border-blue-200",
};

const STRATEGY_NAMES: Record<StrategyType, string> = {
  RPO: "Retain Product Ownership",
  PLE: "Product Life Extension",
  DFR: "Design for Recycling",
};

// Editable assumption fields per strategy. `percent` fields are stored as
// fractions (0.3) but edited as whole percentages (30).
type AssumptionField = {
  key: string;
  label: string;
  kind: "percent" | "years" | "currency";
};

const STRATEGY_ASSUMPTION_FIELDS: Record<StrategyType, AssumptionField[]> = {
  RPO: [
    { key: "servicePricePremium", label: "Service price premium", kind: "percent" },
    { key: "utilizationRate", label: "Asset utilization", kind: "percent" },
    { key: "maintenanceCostPercent", label: "Annual maintenance (of unit cost)", kind: "percent" },
    { key: "contractRenewalRate", label: "Contract renewal rate", kind: "percent" },
  ],
  PLE: [
    { key: "refurbishmentCostPercent", label: "Refurbishment cost (of unit cost)", kind: "percent" },
    { key: "resalePricePercent", label: "Refurbished resale price (of new)", kind: "percent" },
    { key: "tradeInRate", label: "Trade-in rate", kind: "percent" },
    { key: "lifespanExtensionYears", label: "Lifespan extension", kind: "years" },
  ],
  DFR: [
    { key: "materialRecoveryRate", label: "Material recovery rate", kind: "percent" },
    { key: "recoveredMaterialValuePercent", label: "Recovered material value (of original)", kind: "percent" },
    { key: "designChangeCostPercent", label: "Design cost increase (of unit cost)", kind: "percent" },
    { key: "recyclingPartnershipCost", label: "Annual partnership cost", kind: "currency" },
  ],
};

const ASSUMPTION_GROUP_KEY: Record<StrategyType, "rpo" | "ple" | "dfr"> = {
  RPO: "rpo",
  PLE: "ple",
  DFR: "dfr",
};

export default function FinancialCalculator({ productName, result }: FinancialCalculatorProps) {
  const [inputs, setInputs] = useState<FinancialInputs>(() => getDefaultInputs(productName));
  const [assumptions, setAssumptions] = useState<FinancialAssumptions>(DEFAULT_ASSUMPTIONS);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [showDetails, setShowDetails] = useState<StrategyType | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const calculationResult = useMemo(() => {
    const validationErrors = validateFinancialInputs(inputs);
    setErrors(validationErrors);
    if (validationErrors.length > 0) return null;
    return calculateFinancials(inputs, result.cell.strategies, assumptions);
  }, [inputs, result.cell.strategies, assumptions]);

  const assumptionsModified = useMemo(
    () => JSON.stringify(assumptions) !== JSON.stringify(DEFAULT_ASSUMPTIONS),
    [assumptions]
  );

  const updateInput = (field: keyof FinancialInputs, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) || value === "") {
      setInputs((prev) => ({
        ...prev,
        [field]: value === "" ? 0 : numValue,
      }));
    }
  };

  // Update a global assumption (discount rate / analysis period)
  const updateGlobalAssumption = (field: "discountRate" | "analysisPeriod", value: number) => {
    setAssumptions((prev) => ({ ...prev, [field]: value }));
  };

  // Update a nested per-strategy assumption. `percent` fields are entered as
  // whole numbers (30) and stored as fractions (0.3).
  const updateStrategyAssumption = (
    strategy: StrategyType,
    field: AssumptionField,
    rawValue: string
  ) => {
    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) && rawValue !== "") return;
    const value = rawValue === "" ? 0 : parsed;
    const stored = field.kind === "percent" ? value / 100 : value;
    const group = ASSUMPTION_GROUP_KEY[strategy];
    setAssumptions((prev) => ({
      ...prev,
      [group]: { ...prev[group], [field.key]: stored },
    }));
  };

  const resetAssumptions = () => setAssumptions(DEFAULT_ASSUMPTIONS);

  const getBestStrategy = (): StrategyFinancials | null => {
    if (!calculationResult || calculationResult.strategies.length === 0) return null;
    return calculationResult.strategies.reduce((best, current) =>
      current.fiveYearROI > best.fiveYearROI ? current : best
    );
  };

  const bestStrategy = getBestStrategy();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Financial Calculator</h3>
        <p className="text-sm text-gray-500">
          Estimate ROI for implementing circular economy strategies
        </p>
      </div>

      {/* Inputs */}
      <div className="p-4 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Product Financials</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Annual Volume</label>
            <input
              type="number"
              value={inputs.annualVolume || ""}
              onChange={(e) => updateInput("annualVolume", e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="e.g., 50000"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Unit Cost ($)</label>
            <input
              type="number"
              value={inputs.averageUnitCost || ""}
              onChange={(e) => updateInput("averageUnitCost", e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="e.g., 100"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Selling Price ($)</label>
            <input
              type="number"
              value={inputs.averageSellingPrice || ""}
              onChange={(e) => updateInput("averageSellingPrice", e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="e.g., 250"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">End-of-Life Cost ($)</label>
            <input
              type="number"
              value={inputs.currentEndOfLifeCost || ""}
              onChange={(e) => updateInput("currentEndOfLifeCost", e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="e.g., 5"
            />
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            {errors.map((e, i) => (
              <div key={i}>• {e}</div>
            ))}
          </div>
        )}
      </div>

      {/* Editable assumptions */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => setShowAssumptions((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
        >
          <span className="text-sm font-medium text-gray-700">
            Model assumptions
            {assumptionsModified && (
              <span className="ml-2 text-xs font-normal text-amber-600">(edited)</span>
            )}
          </span>
          <span className="text-xs text-gray-500">{showAssumptions ? "Hide ▲" : "Edit ▼"}</span>
        </button>

        {showAssumptions && (
          <div className="px-4 pb-4 space-y-4">
            <p className="text-xs text-gray-500">
              Adjust any assumption to see projections recalculate instantly. Percentages are
              entered as whole numbers (e.g. 30 = 30%).
            </p>

            {/* Global assumptions */}
            <div>
              <h5 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Global
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Discount rate (%)</label>
                  <input
                    type="number"
                    value={(assumptions.discountRate * 100).toString()}
                    onChange={(e) =>
                      updateGlobalAssumption(
                        "discountRate",
                        (parseFloat(e.target.value) || 0) / 100
                      )
                    }
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Analysis period (years)</label>
                  <input
                    type="number"
                    value={assumptions.analysisPeriod.toString()}
                    onChange={(e) =>
                      updateGlobalAssumption("analysisPeriod", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Per-strategy assumptions (only for recommended strategies) */}
            {result.cell.strategies.map((strategy) => {
              const group = ASSUMPTION_GROUP_KEY[strategy];
              const groupValues = assumptions[group] as unknown as Record<string, number>;
              return (
                <div key={strategy}>
                  <h5 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    {STRATEGY_NAMES[strategy]} ({strategy})
                  </h5>
                  <div className="grid grid-cols-2 gap-3">
                    {STRATEGY_ASSUMPTION_FIELDS[strategy].map((field) => {
                      const stored = groupValues[field.key];
                      const display =
                        field.kind === "percent" ? Math.round(stored * 100) : stored;
                      const suffix =
                        field.kind === "percent"
                          ? " (%)"
                          : field.kind === "years"
                          ? " (yrs)"
                          : " ($)";
                      return (
                        <div key={field.key}>
                          <label className="block text-xs text-gray-600 mb-1">
                            {field.label}
                            {suffix}
                          </label>
                          <input
                            type="number"
                            value={display.toString()}
                            onChange={(e) =>
                              updateStrategyAssumption(strategy, field, e.target.value)
                            }
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {assumptionsModified && (
              <button
                onClick={resetAssumptions}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                ↺ Reset assumptions to defaults
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {calculationResult && (
        <div className="p-4">
          {/* Baseline */}
          <div className="mb-4 p-3 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Annual Profit</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(calculationResult.baselineAnnualProfit)}
              </span>
            </div>
          </div>

          {/* Strategy Comparison */}
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Strategy Comparison ({assumptions.analysisPeriod}-Year)
          </h4>
          <div className="space-y-2">
            {calculationResult.comparisonTable.map((row) => (
              <div
                key={row.strategy}
                className={`p-3 rounded-lg border ${
                  bestStrategy?.strategy === row.strategy
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        STRATEGY_COLORS[row.strategy]
                      }`}
                    >
                      {row.strategy}
                    </span>
                    {bestStrategy?.strategy === row.strategy && (
                      <span className="text-xs text-blue-600 font-medium">Recommended</span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setShowDetails(showDetails === row.strategy ? null : row.strategy)
                    }
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {showDetails === row.strategy ? "Hide" : "Details"}
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-2 text-center">
                  <div>
                    <div className="text-xs text-gray-500">Investment</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(row.investment)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Annual Benefit</div>
                    <div
                      className={`text-sm font-medium ${
                        row.annualBenefit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(row.annualBenefit)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Payback</div>
                    <div className="text-sm font-medium text-gray-900">
                      {row.payback === 999 ? "N/A" : `${row.payback.toFixed(1)} yrs`}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">{assumptions.analysisPeriod}-Year ROI</div>
                    <div
                      className={`text-sm font-medium ${
                        row.fiveYearROI >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatPercent(row.fiveYearROI)}
                    </div>
                  </div>
                </div>

                {/* Detailed View */}
                {showDetails === row.strategy && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {calculationResult.strategies
                      .filter((s) => s.strategy === row.strategy)
                      .map((s) => (
                        <div key={s.strategy} className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-2 bg-gray-50 rounded">
                              <div className="text-xs text-gray-500">Annual Revenue/Savings</div>
                              <div className="font-medium text-green-600">
                                {formatCurrency(s.annualRevenue)}
                              </div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                              <div className="text-xs text-gray-500">Annual Operating Cost</div>
                              <div className="font-medium text-red-600">
                                {formatCurrency(s.annualOperatingCost)}
                              </div>
                            </div>
                          </div>

                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-500">
                              {assumptions.analysisPeriod}-Year NPV ({formatPercent(
                                assumptions.discountRate * 100
                              )}{" "}
                              discount)
                            </div>
                            <div
                              className={`font-medium ${
                                s.fiveYearNPV >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {formatCurrency(s.fiveYearNPV)}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-medium text-gray-700 mb-1">
                              How it&apos;s calculated
                            </div>
                            <div className="space-y-1 text-xs text-gray-600">
                              <div>
                                <span className="font-medium text-gray-500">Investment:</span>{" "}
                                {STRATEGY_FORMULAS[s.strategy].investment}
                              </div>
                              <div>
                                <span className="font-medium text-gray-500">Revenue:</span>{" "}
                                {STRATEGY_FORMULAS[s.strategy].revenue}
                              </div>
                              <div>
                                <span className="font-medium text-gray-500">Operating cost:</span>{" "}
                                {STRATEGY_FORMULAS[s.strategy].cost}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-medium text-gray-700 mb-1">
                              Key Assumptions
                            </div>
                            <ul className="space-y-0.5">
                              {s.assumptions.map((a, i) => (
                                <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                                  <span className="text-gray-400">•</span>
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-amber-50 rounded p-2 border border-amber-200">
                            <div className="text-xs font-medium text-amber-800 mb-1">
                              Key Risks
                            </div>
                            <ul className="space-y-0.5">
                              {s.risks.map((r, i) => (
                                <li
                                  key={i}
                                  className="text-xs text-amber-700 flex items-start gap-1"
                                >
                                  <span className="text-amber-500">⚠</span>
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <strong>Disclaimer:</strong> These are rough estimates for strategic planning only. 
          Validate assumptions with your finance team before making investment decisions. 
          Actual results vary significantly by industry, geography, and execution.
        </p>
      </div>
    </div>
  );
}
