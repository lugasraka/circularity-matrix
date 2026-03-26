'use client';

import { RStrategyResult, RStrategy, RSTRATEGY_DESCRIPTIONS, RSTRATEGY_ZONES } from '@/lib/r-strategy/types';
import { useState } from 'react';

interface RStrategyRecommendationProps {
  result: RStrategyResult;
}

export default function RStrategyRecommendation({ result }: RStrategyRecommendationProps) {
  const [expandedStrategy, setExpandedStrategy] = useState<RStrategy | null>(result.primaryRecommendation);

  const primaryStrategy = result.primaryRecommendation;
  const primaryScore = result.scores.find((s) => s.strategy === primaryStrategy)!;
  const zoneInfo = RSTRATEGY_ZONES.find((z) => z.strategy === primaryStrategy);
  const zoneColor = zoneInfo?.color || '#6B7280';
  const zoneIcon = zoneInfo?.icon || '♻️';

  const toggleExpand = (strategy: RStrategy) => {
    setExpandedStrategy(expandedStrategy === strategy ? null : strategy);
  };

  return (
    <div className="space-y-4">
      {/* Primary Recommendation */}
      <div
        className="rounded-xl border-2 overflow-hidden"
        style={{ borderColor: zoneColor }}
      >
        <div
          className="p-5"
          style={{ backgroundColor: `${zoneColor}10` }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{
                backgroundColor: zoneColor,
                color: 'white',
              }}
            >
              {zoneIcon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Primary Recommendation
                </span>
                {result.isRecyclingFallback && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                    Fallback
                  </span>
                )}
              </div>
              <h3
                className="text-2xl font-bold"
                style={{ color: zoneColor }}
              >
                {RSTRATEGY_DESCRIPTIONS[primaryStrategy].name}
              </h3>
              <p className="text-gray-600 mt-1">
                {RSTRATEGY_DESCRIPTIONS[primaryStrategy].shortDescription}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ color: zoneColor }}>
                {primaryScore.overallScore}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Suitability: {primaryScore.suitabilityScore}%<br />
                Practicality: {primaryScore.practicalityScore}%
              </div>
            </div>
          </div>

          {/* Fallback explanation */}
          {result.isRecyclingFallback && result.recyclingReason === 'low_both_scores' && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Why recycling?</strong> No R-strategy showed a strong fit based on your product characteristics. 
                Recycling is recommended as the next best option compared to landfill waste.
              </p>
            </div>
          )}

          {result.isRecyclingFallback && result.recyclingReason === 'high_embedded_value' && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-emerald-800">
                <strong>Why recycling?</strong> Your product has high embedded material value that makes 
                material recovery more economically viable than trying to preserve the product for reuse.
              </p>
            </div>
          )}

          {/* Full description */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: `${zoneColor}30` }}>
            <p className="text-gray-700">
              {RSTRATEGY_DESCRIPTIONS[primaryStrategy].fullDescription}
            </p>
          </div>

          {/* Examples */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Real-world examples:</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {RSTRATEGY_DESCRIPTIONS[primaryStrategy].examples.map((example, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span style={{ color: zoneColor }}>•</span>
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Secondary Recommendations */}
      {result.secondaryRecommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Also Consider
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.secondaryRecommendations.map((strategy) => {
              const score = result.scores.find((s) => s.strategy === strategy)!;
              const zone = RSTRATEGY_ZONES.find((z) => z.strategy === strategy);
              const color = zone?.color || '#6B7280';
              const icon = zone?.icon || '♻️';
              const isExpanded = expandedStrategy === strategy;

              return (
                <button
                  key={strategy}
                  onClick={() => toggleExpand(strategy)}
                  className={`text-left p-4 rounded-lg border transition-all ${
                    isExpanded ? 'ring-2 ring-offset-1' : 'hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: isExpanded ? color : '#e5e7eb',
                    backgroundColor: `${color}08`,
                    '--tw-ring-color': color,
                  } as React.CSSProperties}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: color, color: 'white' }}
                    >
                      {icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {strategy}
                      </div>
                      <div className="text-xs text-gray-500">
                        Score: {score.overallScore}%
                      </div>
                    </div>
                    <div
                      className={`transform transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">
                        {RSTRATEGY_DESCRIPTIONS[strategy].fullDescription}
                      </p>
                      <div className="text-xs text-gray-500">
                        Suitability: {score.suitabilityScore}% · 
                        Practicality: {score.practicalityScore}%
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* All strategies comparison */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          All R-Strategies Comparison
        </h4>
        <div className="space-y-2">
          {result.scores
            .sort((a, b) => b.overallScore - a.overallScore)
            .map((score, index) => {
              const zone = RSTRATEGY_ZONES.find((z) => z.strategy === score.strategy);
              const color = zone?.color || '#6B7280';
              const icon = zone?.icon || '♻️';
              const isPrimary = score.strategy === result.primaryRecommendation;

              return (
                <div
                  key={score.strategy}
                  className={`flex items-center gap-3 p-2 rounded ${
                    isPrimary ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  <div className="w-6 text-center font-bold text-gray-400">
                    #{index + 1}
                  </div>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: color, color: 'white' }}
                  >
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {score.strategy}
                      {isPrimary && (
                        <span className="ml-2 text-xs text-blue-600">★</span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${score.overallScore}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ color }}>
                      {score.overallScore}%
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
