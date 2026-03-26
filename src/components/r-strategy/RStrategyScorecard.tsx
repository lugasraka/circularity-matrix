'use client';

import { RStrategyResult, RStrategy } from '@/lib/r-strategy/types';
import { getScoreLabel, getScoreColor } from '@/lib/r-strategy/scoring';
import { criteria } from '@/lib/r-strategy/criteria';

interface RStrategyScorecardProps {
  result: RStrategyResult;
}

const RSTRATEGY_ORDER: RStrategy[] = ['REUSE', 'REFURBISH', 'REMANUFACTURE', 'REPURPOSE', 'RECYCLE'];

export default function RStrategyScorecard({ result }: RStrategyScorecardProps) {
  // Create a map for quick lookup
  const scoreMap = new Map(
    result.scores.map((s) => [s.strategy, s])
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Detailed Scorecard</h3>
        <p className="text-sm text-gray-500">
          Breakdown of scores by criterion and R-strategy
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
                Criterion
              </th>
              {RSTRATEGY_ORDER.map((strategy) => (
                <th
                  key={strategy}
                  className={`px-3 py-3 text-center font-medium ${
                    result.primaryRecommendation === strategy
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-gray-600'
                  }`}
                >
                  {strategy}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Suitability criteria */}
            <tr className="bg-blue-50/50">
              <td
                colSpan={6}
                className="px-4 py-2 text-xs font-semibold text-blue-800 uppercase tracking-wide"
              >
                Suitability Criteria
              </td>
            </tr>
            {result.criterionScores
              .filter((cs) => cs.category === 'suitability')
              .map((criterionScore) => (
                <tr key={criterionScore.criterionId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 sticky left-0 bg-white">
                    <div className="font-medium text-gray-900">
                      {criterionScore.criterionName}
                    </div>
                  </td>
                  {RSTRATEGY_ORDER.map((strategy) => {
                    const score = criterionScore.scores[strategy];
                    const isPrimary = result.primaryRecommendation === strategy;
                    return (
                      <td
                        key={strategy}
                        className={`px-3 py-3 text-center ${
                          isPrimary ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div
                          className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm"
                          style={{
                            backgroundColor: `${getScoreColor(score)}20`,
                            color: getScoreColor(score),
                          }}
                        >
                          {score}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}

            {/* Suitability subtotal */}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-3 sticky left-0 bg-gray-50">
                Suitability Score
              </td>
              {RSTRATEGY_ORDER.map((strategy) => {
                const score = scoreMap.get(strategy)!;
                const isPrimary = result.primaryRecommendation === strategy;
                return (
                  <td
                    key={strategy}
                    className={`px-3 py-3 text-center ${
                      isPrimary ? 'text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <span
                      className="inline-block px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${getScoreColor(score.suitabilityScore)}30`,
                        color: getScoreColor(score.suitabilityScore),
                      }}
                    >
                      {score.suitabilityScore}%
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Practicality criteria */}
            <tr className="bg-emerald-50/50">
              <td
                colSpan={6}
                className="px-4 py-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide"
              >
                Practicality Criteria
              </td>
            </tr>
            {result.criterionScores
              .filter((cs) => cs.category === 'practicality')
              .map((criterionScore) => (
                <tr key={criterionScore.criterionId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 sticky left-0 bg-white">
                    <div className="font-medium text-gray-900">
                      {criterionScore.criterionName}
                    </div>
                  </td>
                  {RSTRATEGY_ORDER.map((strategy) => {
                    const score = criterionScore.scores[strategy];
                    const isPrimary = result.primaryRecommendation === strategy;
                    return (
                      <td
                        key={strategy}
                        className={`px-3 py-3 text-center ${
                          isPrimary ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div
                          className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm"
                          style={{
                            backgroundColor: `${getScoreColor(score)}20`,
                            color: getScoreColor(score),
                          }}
                        >
                          {score}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}

            {/* Practicality subtotal */}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-3 sticky left-0 bg-gray-50">
                Practicality Score
              </td>
              {RSTRATEGY_ORDER.map((strategy) => {
                const score = scoreMap.get(strategy)!;
                const isPrimary = result.primaryRecommendation === strategy;
                return (
                  <td
                    key={strategy}
                    className={`px-3 py-3 text-center ${
                      isPrimary ? 'text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <span
                      className="inline-block px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${getScoreColor(score.practicalityScore)}30`,
                        color: getScoreColor(score.practicalityScore),
                      }}
                    >
                      {score.practicalityScore}%
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Overall score */}
            <tr className="bg-gray-100 font-bold border-t-2 border-gray-200">
              <td className="px-4 py-4 sticky left-0 bg-gray-100 text-gray-900">
                Overall Score
              </td>
              {RSTRATEGY_ORDER.map((strategy) => {
                const score = scoreMap.get(strategy)!;
                const isPrimary = result.primaryRecommendation === strategy;
                return (
                  <td
                    key={strategy}
                    className={`px-3 py-4 text-center ${
                      isPrimary ? 'bg-blue-100 text-blue-800' : 'text-gray-800'
                    }`}
                  >
                    <span className="text-lg">{score.overallScore}%</span>
                    {isPrimary && (
                      <div className="text-xs font-normal mt-1">★ Recommended</div>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Rank */}
            <tr className="text-xs text-gray-500">
              <td className="px-4 py-2 sticky left-0 bg-white">Rank</td>
              {RSTRATEGY_ORDER.map((strategy) => {
                const score = scoreMap.get(strategy)!;
                return (
                  <td key={strategy} className="px-3 py-2 text-center">
                    #{score.rank}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
          <span>Score interpretation:</span>
          {[
            { label: 'Very strong', color: '#10B981', range: '80-100' },
            { label: 'Strong', color: '#3B82F6', range: '60-79' },
            { label: 'Moderate', color: '#F59E0B', range: '40-59' },
            { label: 'Weak', color: '#EF4444', range: '20-39' },
            { label: 'Very weak', color: '#6B7280', range: '0-19' },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
