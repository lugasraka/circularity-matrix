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

export default function FinancialCalculator({ productName, result }: FinancialCalculatorProps) {
  const [inputs, setInputs] = useState<FinancialInputs>(() => getDefaultInputs(productName));
  const [showDetails, setShowDetails] = useState<StrategyType | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const calculationResult = useMemo(() => {
    const validationErrors = validateFinancialInputs(inputs);
    setErrors(validationErrors);
    if (validationErrors.length > 0) return null;
    return calculateFinancials(inputs, result.cell.strategies);
  }, [inputs, result.cell.strategies]);

  const updateInput = (field: keyof FinancialInputs, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) || value === "") {
      setInputs((prev) => ({
        ...prev,
        [field]: value === "" ? 0 : numValue,
      }));
    }
  };

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
          <h4 className="text-sm font-medium text-gray-700 mb-2">Strategy Comparison (5-Year)</h4>
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
                    <div className="text-xs text-gray-500">5-Year ROI</div>
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
                            <div className="text-xs text-gray-500">5-Year NPV (10% discount)</div>
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
