'use client';

import { AssessmentMode } from '@/lib/r-strategy/types';

interface ModeSelectorProps {
  currentMode: AssessmentMode;
  onModeChange: (mode: AssessmentMode) => void;
  disabled?: boolean;
}

export default function ModeSelector({ currentMode, onModeChange, disabled }: ModeSelectorProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Assessment Framework
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => onModeChange('hbr')}
          disabled={disabled}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            currentMode === 'hbr'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold">
              HBR
            </div>
            <div>
              <div className={`font-semibold ${
                currentMode === 'hbr' ? 'text-blue-700' : 'text-gray-900'
              }`}>
                HBR Matrix
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Classic 8-cell matrix approach
              </div>
              <div className="text-xs text-gray-400 mt-1">
                3 dimensions · Binary classification
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onModeChange('r-strategy')}
          disabled={disabled}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            currentMode === 'r-strategy'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg font-bold">
              R
            </div>
            <div>
              <div className={`font-semibold ${
                currentMode === 'r-strategy' ? 'text-emerald-700' : 'text-gray-900'
              }`}>
                R-Strategy Scorecard
              </div>
              <div className="text-xs text-gray-500 mt-1">
                R-Strategy scorecard approach
              </div>
              <div className="text-xs text-gray-400 mt-1">
                7 criteria · 5 R-strategies · Detailed scoring
              </div>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        {currentMode === 'hbr' ? (
          <>
            <strong>HBR Matrix</strong> uses Access Difficulty × Process Difficulty × Embedded Value 
            to recommend RPO, PLE, or DFR strategies. Best for quick initial assessment.
          </>
        ) : (
          <>
            <strong>R-Strategy Scorecard</strong> evaluates 7 criteria across 5 R-strategies 
            (Reuse, Refurbish, Remanufacture, Repurpose, Recycle) with detailed scoring. 
            Best for comprehensive analysis.
          </>
        )}
      </div>
    </div>
  );
}
