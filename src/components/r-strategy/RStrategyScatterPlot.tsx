'use client';

import { useState } from 'react';
import { RStrategyResult, RStrategyScore, RSTRATEGY_ZONES, RECYCLE_HIGH_VALUE_ZONE, RStrategy } from '@/lib/r-strategy/types';
import { RSTRATEGY_DESCRIPTIONS } from '@/lib/r-strategy/types';

interface RStrategyScatterPlotProps {
  result: RStrategyResult;
}

// Zone colors with transparency for background
const ZONE_COLORS: Record<RStrategy, string> = {
  REUSE: 'rgba(16, 185, 129, 0.15)',      // emerald
  REFURBISH: 'rgba(59, 130, 246, 0.15)',  // blue
  REMANUFACTURE: 'rgba(139, 92, 246, 0.15)', // violet
  REPURPOSE: 'rgba(245, 158, 11, 0.15)',  // amber
  RECYCLE: 'rgba(107, 114, 128, 0.15)',   // gray
};

const ZONE_BORDERS: Record<RStrategy, string> = {
  REUSE: '#10B981',
  REFURBISH: '#3B82F6',
  REMANUFACTURE: '#8B5CF6',
  REPURPOSE: '#F59E0B',
  RECYCLE: '#6B7280',
};

// Helper to get icon for a strategy
const getStrategyIcon = (strategy: RStrategy): string => {
  const zone = RSTRATEGY_ZONES.find(z => z.strategy === strategy);
  return zone?.icon || '♻️';
};

export default function RStrategyScatterPlot({ result }: RStrategyScatterPlotProps) {
  const [hoveredZone, setHoveredZone] = useState<RStrategy | null>(null);
  const [showAllZones, setShowAllZones] = useState(true);

  // Get the primary score for positioning the product dot
  const primaryScore = result.scores.find(
    (s) => s.strategy === result.primaryRecommendation
  ) || result.scores[0];

  // Determine if we should show the high-value recycle zone
  const showHighValueRecycleZone = result.isRecyclingFallback && 
    result.recyclingReason === 'high_embedded_value';

  // SVG dimensions and margins
  const width = 600;
  const height = 500;
  const margin = { top: 40, right: 40, bottom: 60, left: 80 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Scale functions (0-100 to pixels)
  const xScale = (practicality: number) => 
    margin.left + (practicality / 100) * chartWidth;
  const yScale = (suitability: number) => 
    margin.top + chartHeight - (suitability / 100) * chartHeight;

  // Generate grid lines
  const gridLines = [0, 20, 40, 60, 80, 100];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            R-Strategy Suitability vs. Practicality
          </h3>
          <p className="text-sm text-gray-500">
            Your product position determines the optimal circular strategy
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={showAllZones}
            onChange={(e) => setShowAllZones(e.target.checked)}
            className="rounded border-gray-300"
          />
          Show all zones
        </label>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {(['REUSE', 'REFURBISH', 'REMANUFACTURE', 'REPURPOSE', 'RECYCLE'] as RStrategy[]).map(
          (strategy) => (
            <button
              key={strategy}
              onMouseEnter={() => setHoveredZone(strategy)}
              onMouseLeave={() => setHoveredZone(null)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all ${
                hoveredZone === strategy ? 'ring-2 ring-offset-1' : ''
              }`}
              style={{
                backgroundColor: ZONE_COLORS[strategy],
                color: ZONE_BORDERS[strategy],
                border: `1px solid ${ZONE_BORDERS[strategy]}`,
              }}
            >
              <span>{getStrategyIcon(strategy)}</span>
              <span>{strategy}</span>
            </button>
          )
        )}
      </div>

      {/* Scatter Plot SVG */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-2xl mx-auto"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {/* Background zones */}
        {showAllZones && RSTRATEGY_ZONES.map((zone) => (
          <g
            key={zone.strategy}
            onMouseEnter={() => setHoveredZone(zone.strategy)}
            onMouseLeave={() => setHoveredZone(null)}
            className="cursor-pointer"
          >
            <rect
              x={xScale(zone.practicalityMin)}
              y={yScale(zone.suitabilityMax)}
              width={xScale(zone.practicalityMax) - xScale(zone.practicalityMin)}
              height={yScale(zone.suitabilityMin) - yScale(zone.suitabilityMax)}
              fill={ZONE_COLORS[zone.strategy]}
              stroke={ZONE_BORDERS[zone.strategy]}
              strokeWidth={hoveredZone === zone.strategy ? 3 : 2}
              strokeDasharray="8,4"
              rx={8}
            />
            {/* Zone label */}
            <text
              x={xScale((zone.practicalityMin + zone.practicalityMax) / 2)}
              y={yScale((zone.suitabilityMin + zone.suitabilityMax) / 2)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-semibold pointer-events-none"
              fill={ZONE_BORDERS[zone.strategy]}
            >
              {zone.strategy}
            </text>
          </g>
        ))}

        {/* High-value recycle zone (if applicable) */}
        {showHighValueRecycleZone && (
          <g>
            <rect
              x={xScale(RECYCLE_HIGH_VALUE_ZONE.practicalityMin)}
              y={yScale(RECYCLE_HIGH_VALUE_ZONE.suitabilityMax)}
              width={xScale(RECYCLE_HIGH_VALUE_ZONE.practicalityMax) - xScale(RECYCLE_HIGH_VALUE_ZONE.practicalityMin)}
              height={yScale(RECYCLE_HIGH_VALUE_ZONE.suitabilityMin) - yScale(RECYCLE_HIGH_VALUE_ZONE.suitabilityMax)}
              fill="rgba(5, 150, 105, 0.1)"
              stroke="#059669"
              strokeWidth={2}
              strokeDasharray="4,4"
              rx={8}
            />
            <text
              x={xScale(85)}
              y={yScale(85)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-semibold"
              fill="#059669"
            >
              RECYCLE
            </text>
            <text
              x={xScale(85)}
              y={yScale(80)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px]"
              fill="#059669"
            >
              (high embedded value)
            </text>
          </g>
        )}

        {/* Grid lines */}
        {gridLines.map((tick) => (
          <g key={tick}>
            {/* Vertical grid lines */}
            <line
              x1={xScale(tick)}
              y1={margin.top}
              x2={xScale(tick)}
              y2={margin.top + chartHeight}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            {/* Horizontal grid lines */}
            <line
              x1={margin.left}
              y1={yScale(tick)}
              x2={margin.left + chartWidth}
              y2={yScale(tick)}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
          </g>
        ))}

        {/* Axes */}
        <line
          x1={margin.left}
          y1={margin.top + chartHeight}
          x2={margin.left + chartWidth}
          y2={margin.top + chartHeight}
          stroke="#374151"
          strokeWidth={2}
        />
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + chartHeight}
          stroke="#374151"
          strokeWidth={2}
        />

        {/* Axis labels */}
        <text
          x={margin.left + chartWidth / 2}
          y={height - 10}
          textAnchor="middle"
          className="text-sm font-semibold fill-gray-700"
        >
          Practicality →
        </text>
        <text
          x={20}
          y={margin.top + chartHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90, 20, ${margin.top + chartHeight / 2})`}
          className="text-sm font-semibold fill-gray-700"
        >
          Suitability →
        </text>

        {/* Axis ticks and labels */}
        {['Very weak', 'Weak', 'Moderate', 'Strong', 'Very strong'].map((label, i) => {
          const value = i * 25;
          return (
            <g key={label}>
              {/* X-axis labels */}
              <text
                x={xScale(value)}
                y={margin.top + chartHeight + 20}
                textAnchor="middle"
                className="text-[10px] fill-gray-500"
              >
                {label}
              </text>
              {/* Y-axis labels */}
              <text
                x={margin.left - 10}
                y={yScale(value) + 4}
                textAnchor="end"
                className="text-[10px] fill-gray-500"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Product position dot */}
        <g>
          <circle
            cx={xScale(primaryScore.practicalityScore)}
            cy={yScale(primaryScore.suitabilityScore)}
            r={12}
            fill={ZONE_BORDERS[result.primaryRecommendation]}
            stroke="white"
            strokeWidth={3}
            className="animate-pulse"
          />
          <text
            x={xScale(primaryScore.practicalityScore)}
            y={yScale(primaryScore.suitabilityScore) + 4}
            textAnchor="middle"
            className="text-xs font-bold fill-white pointer-events-none"
          >
            You
          </text>
        </g>

        {/* Fallback annotations */}
        {result.isRecyclingFallback && result.recyclingReason === 'low_both_scores' && (
          <g>
            <rect
              x={xScale(5)}
              y={yScale(35)}
              width={140}
              height={50}
              fill="white"
              stroke="#6B7280"
              strokeWidth={1}
              rx={4}
            />
            <text
              x={xScale(10)}
              y={yScale(28)}
              className="text-xs fill-gray-600"
            >
              <tspan x={xScale(10)} dy={0}>Recycling as next</tspan>
              <tspan x={xScale(10)} dy={14}>best option compared</tspan>
              <tspan x={xScale(10)} dy={14}>to landfill waste</tspan>
            </text>
          </g>
        )}

        {result.isRecyclingFallback && result.recyclingReason === 'high_embedded_value' && (
          <g>
            <line
              x1={xScale(75)}
              y1={yScale(95)}
              x2={xScale(85)}
              y2={yScale(85)}
              stroke="#059669"
              strokeWidth={2}
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#059669" />
              </marker>
            </defs>
            <text
              x={xScale(55)}
              y={yScale(98)}
              className="text-xs fill-emerald-700"
            >
              High embedded value
            </text>
            <text
              x={xScale(55)}
              y={yScale(94)}
              className="text-xs fill-emerald-700"
            >
              justifies recycling
            </text>
          </g>
        )}
      </svg>

      {/* Summary below chart */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{
              backgroundColor: ZONE_COLORS[result.primaryRecommendation],
              border: `2px solid ${ZONE_BORDERS[result.primaryRecommendation]}`,
            }}
          >
            {getStrategyIcon(result.primaryRecommendation)}
          </div>
          <div>
            <div className="text-sm text-gray-500">Primary Recommendation</div>
            <div className="text-xl font-bold text-gray-900">
              {result.primaryRecommendation}
            </div>
            <div className="text-sm text-gray-600">
              {RSTRATEGY_DESCRIPTIONS[result.primaryRecommendation].shortDescription}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-sm text-gray-500">Overall Score</div>
            <div className="text-2xl font-bold" style={{ color: ZONE_BORDERS[result.primaryRecommendation] }}>
              {primaryScore.overallScore}%
            </div>
            <div className="text-xs text-gray-500">
              S: {primaryScore.suitabilityScore}% · P: {primaryScore.practicalityScore}%
            </div>
          </div>
        </div>

        {result.secondaryRecommendations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500 mb-2">Also Consider</div>
            <div className="flex gap-2">
              {result.secondaryRecommendations.map((strategy) => (
                <span
                  key={strategy}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: ZONE_COLORS[strategy],
                    color: ZONE_BORDERS[strategy],
                    border: `1px solid ${ZONE_BORDERS[strategy]}`,
                  }}
                >
                  {getStrategyIcon(strategy)} {strategy}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
