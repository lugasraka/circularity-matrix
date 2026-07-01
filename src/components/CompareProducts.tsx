"use client";

import { useMemo } from "react";
import { Product, hasHBRResult, hasRStrategyResult, StrategyType } from "../lib/types";
import { RStrategy } from "@/lib/r-strategy/types";
import { questions } from "@/lib/questions";
import { criteria } from "@/lib/r-strategy/criteria";

interface CompareProductsProps {
  products: Product[];
  onClose: () => void;
}

const STRATEGY_COLORS: Record<StrategyType, string> = {
  RPO: "bg-purple-100 text-purple-800",
  PLE: "bg-green-100 text-green-800",
  DFR: "bg-blue-100 text-blue-800",
};

const RSTRATEGY_COLORS: Record<RStrategy, string> = {
  REUSE: "bg-emerald-100 text-emerald-800",
  REFURBISH: "bg-blue-100 text-blue-800",
  REMANUFACTURE: "bg-violet-100 text-violet-800",
  REPURPOSE: "bg-amber-100 text-amber-800",
  RECYCLE: "bg-gray-100 text-gray-800",
};

function ScoreBar({ value, max = 100, color = "bg-blue-500" }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-700 w-10 text-right">
        {typeof value === "number" ? (max === 1 ? `${(value * 100).toFixed(0)}%` : `${value.toFixed(0)}%`) : "—"}
      </span>
    </div>
  );
}

function getBestIndex(values: (number | undefined)[], higherIsBetter = true): number {
  let bestIdx = -1;
  let bestVal = higherIsBetter ? -Infinity : Infinity;
  values.forEach((v, i) => {
    if (v === undefined) return;
    if (higherIsBetter ? v > bestVal : v < bestVal) {
      bestVal = v;
      bestIdx = i;
    }
  });
  return bestIdx;
}

export default function CompareProducts({ products, onClose }: CompareProductsProps) {
  const isHBR = products[0]?.assessmentMode === "hbr";
  const colCount = products.length;

  const hbrDimensions = useMemo(() => {
    if (!isHBR) return null;
    const dims = [
      { key: "access" as const, label: "Access", description: "Ease of retrieving the product from end users" },
      { key: "process" as const, label: "Process", description: "Ease of processing the product for value recovery" },
      { key: "embeddedValue" as const, label: "Embedded Value", description: "Value of materials and components" },
    ];
    return dims;
  }, [isHBR]);

  const rStrategies: RStrategy[] = ["REUSE", "REFURBISH", "REMANUFACTURE", "REPURPOSE", "RECYCLE"];

  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Product Comparison
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Comparing {colCount} {isHBR ? "HBR" : "R-Strategy"} products side by side
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Product Names */}
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-44">
                Attribute
              </th>
              {products.map((p) => (
                <th key={p.id} className="px-4 py-3 text-center">
                  <div className="font-semibold text-gray-900 truncate max-w-[180px] mx-auto" title={p.name}>
                    {p.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* === HBR MODE === */}
            {isHBR && (
              <>
                {/* Strategy */}
                <SectionHeader label="Recommended Strategy" colSpan={colCount + 1} />
                <tr className="border-b border-gray-50">
                  <td className="px-6 py-3 text-gray-600">Strategy</td>
                  {products.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-center">
                      {hasHBRResult(p) ? (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {p.result.cell.strategies.map((s) => (
                            <span key={s} className={`px-2 py-0.5 rounded text-xs font-semibold ${STRATEGY_COLORS[s]}`}>
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : "—"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="px-6 py-3 text-gray-600">Cell Position</td>
                  {products.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-center text-xs text-gray-700">
                      {hasHBRResult(p) ? p.result.cell.label : "—"}
                    </td>
                  ))}
                </tr>

                {/* Dimension Scores */}
                <SectionHeader label="Dimension Scores" colSpan={colCount + 1} />
                {hbrDimensions?.map((dim) => {
                  const values = products.map((p) =>
                    hasHBRResult(p) ? p.result.scores[dim.key] : undefined
                  );
                  const bestIdx = getBestIndex(values);
                  return (
                    <tr key={dim.key} className="border-b border-gray-50">
                      <td className="px-6 py-3">
                        <div className="text-gray-700 font-medium">{dim.label}</div>
                        <div className="text-[11px] text-gray-400">{dim.description}</div>
                      </td>
                      {products.map((p, i) => (
                        <td key={p.id} className="px-4 py-3">
                          {hasHBRResult(p) ? (
                            <div>
                              <ScoreBar value={p.result.scores[dim.key]} max={1} color={i === bestIdx ? "bg-blue-500" : "bg-gray-400"} />
                              <div className="text-[11px] text-gray-500 mt-1 text-center">
                                {dim.key === "embeddedValue"
                                  ? p.result.position.embeddedValue === "high" ? "High" : "Low"
                                  : p.result.position[dim.key] === "easy" ? "Easy" : "Hard"
                                }
                              </div>
                            </div>
                          ) : "—"}
                        </td>
                      ))}
                    </tr>
                  );
                })}

                {/* Question Answers */}
                <SectionHeader label="Assessment Answers" colSpan={colCount + 1} />
                {questions.map((q) => (
                  <tr key={q.id} className="border-b border-gray-50">
                    <td className="px-6 py-2.5">
                      <div className="text-gray-600 text-xs leading-snug">{q.text}</div>
                    </td>
                    {products.map((p) => {
                      const answer = p.answers?.find((a) => a.questionId === q.id);
                      const option = answer ? q.options.find((o) => o.value === answer.value) : null;
                      return (
                        <td key={p.id} className="px-4 py-2.5 text-center">
                          {option ? (
                            <div>
                              <span className="text-xs text-gray-700">{option.label}</span>
                              <span className="text-[10px] text-gray-400 ml-1">({answer!.value}/5)</span>
                            </div>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </>
            )}

            {/* === R-STRATEGY MODE === */}
            {!isHBR && (
              <>
                {/* Primary Recommendation */}
                <SectionHeader label="Primary Recommendation" colSpan={colCount + 1} />
                <tr className="border-b border-gray-50">
                  <td className="px-6 py-3 text-gray-600">Best Strategy</td>
                  {products.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-center">
                      {hasRStrategyResult(p) ? (
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${RSTRATEGY_COLORS[p.rStrategyResult.primaryRecommendation]}`}>
                          {p.rStrategyResult.primaryRecommendation}
                        </span>
                      ) : "—"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="px-6 py-3 text-gray-600">Alternatives</td>
                  {products.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-center">
                      {hasRStrategyResult(p) ? (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {p.rStrategyResult.secondaryRecommendations.map((s) => (
                            <span key={s} className={`px-1.5 py-0 rounded text-[10px] font-medium ${RSTRATEGY_COLORS[s]}`}>
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : "—"}
                    </td>
                  ))}
                </tr>

                {/* Overall Scores for each R-Strategy */}
                <SectionHeader label="Strategy Scores (Overall)" colSpan={colCount + 1} />
                {rStrategies.map((strategy) => {
                  const values = products.map((p) => {
                    if (!hasRStrategyResult(p)) return undefined;
                    return p.rStrategyResult.scores.find((s) => s.strategy === strategy)?.overallScore;
                  });
                  const bestIdx = getBestIndex(values);
                  return (
                    <tr key={strategy} className="border-b border-gray-50">
                      <td className="px-6 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${RSTRATEGY_COLORS[strategy]}`}>
                          {strategy}
                        </span>
                      </td>
                      {products.map((p, i) => {
                        if (!hasRStrategyResult(p)) return <td key={p.id} className="px-4 py-2.5 text-center text-gray-300">—</td>;
                        const score = p.rStrategyResult.scores.find((s) => s.strategy === strategy);
                        return (
                          <td key={p.id} className="px-4 py-2.5">
                            {score ? (
                              <ScoreBar value={score.overallScore} color={i === bestIdx ? "bg-emerald-500" : "bg-gray-400"} />
                            ) : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Suitability vs Practicality for primary */}
                <SectionHeader label="Suitability vs. Practicality (Primary Strategy)" colSpan={colCount + 1} />
                <tr className="border-b border-gray-50">
                  <td className="px-6 py-3 text-gray-600">Suitability</td>
                  {products.map((p, i) => {
                    if (!hasRStrategyResult(p)) return <td key={p.id} className="px-4 py-3 text-center text-gray-300">—</td>;
                    const primary = p.rStrategyResult.scores.find((s) => s.strategy === p.rStrategyResult!.primaryRecommendation);
                    const values = products.map((pp) => {
                      if (!hasRStrategyResult(pp)) return undefined;
                      return pp.rStrategyResult.scores.find((s) => s.strategy === pp.rStrategyResult!.primaryRecommendation)?.suitabilityScore;
                    });
                    const bestIdx = getBestIndex(values);
                    return (
                      <td key={p.id} className="px-4 py-3">
                        {primary ? (
                          <ScoreBar value={primary.suitabilityScore} color={i === bestIdx ? "bg-emerald-500" : "bg-gray-400"} />
                        ) : "—"}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="px-6 py-3 text-gray-600">Practicality</td>
                  {products.map((p, i) => {
                    if (!hasRStrategyResult(p)) return <td key={p.id} className="px-4 py-3 text-center text-gray-300">—</td>;
                    const primary = p.rStrategyResult.scores.find((s) => s.strategy === p.rStrategyResult!.primaryRecommendation);
                    const values = products.map((pp) => {
                      if (!hasRStrategyResult(pp)) return undefined;
                      return pp.rStrategyResult.scores.find((s) => s.strategy === pp.rStrategyResult!.primaryRecommendation)?.practicalityScore;
                    });
                    const bestIdx = getBestIndex(values);
                    return (
                      <td key={p.id} className="px-4 py-3">
                        {primary ? (
                          <ScoreBar value={primary.practicalityScore} color={i === bestIdx ? "bg-emerald-500" : "bg-gray-400"} />
                        ) : "—"}
                      </td>
                    );
                  })}
                </tr>

                {/* Criterion Answers */}
                <SectionHeader label="Assessment Answers" colSpan={colCount + 1} />
                {criteria.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50">
                    <td className="px-6 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{c.icon}</span>
                        <span className="text-gray-600 text-xs leading-snug">{c.name}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0 rounded mt-0.5 inline-block ${
                        c.category === "suitability" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {c.category}
                      </span>
                    </td>
                    {products.map((p) => {
                      const answer = p.rStrategyAnswers?.find((a) => a.criterionId === c.id);
                      return (
                        <td key={p.id} className="px-4 py-2.5 text-center">
                          {answer ? (
                            <div>
                              <span className="text-xs font-medium text-gray-700">{answer.normalizedScore}</span>
                              <span className="text-[10px] text-gray-400">/100</span>
                            </div>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionHeader({ label, colSpan }: { label: string; colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-2.5 bg-gray-50">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      </td>
    </tr>
  );
}
