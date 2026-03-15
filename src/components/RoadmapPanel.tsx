"use client";

import { useState } from "react";
import { CellStrategy, StrategyType } from "../lib/types";
import {
  getCellRoadmap,
  getStrategyRoadmap,
  getPrioritizedActions,
  getPhaseDisplayName,
  getPhaseColor,
  RoadmapAction,
  TimePhase,
} from "../lib/roadmaps";

interface RoadmapPanelProps {
  cell: CellStrategy;
}

type TabType = "by-phase" | "by-strategy" | "case-study";

function ActionCard({ action, index }: { action: RoadmapAction; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{action.title}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                action.difficulty === "low"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : action.difficulty === "medium"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {action.difficulty}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                action.costEstimate === "low"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : action.costEstimate === "medium"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {action.costEstimate} cost
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{action.description}</p>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pl-12">
          <p className="text-sm text-gray-600 mb-3">{action.description}</p>

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Duration:</span>{" "}
              <span className="text-gray-600">{action.estimatedDuration}</span>
            </div>

            <div>
              <span className="font-medium text-gray-700">Key Stakeholders:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {action.keyStakeholders.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-medium text-gray-700">Success Metrics:</span>
              <ul className="mt-1 space-y-0.5">
                {action.successMetrics.map((m, i) => (
                  <li key={i} className="text-gray-600 flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            {action.risks.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Risks:</span>
                <ul className="mt-1 space-y-0.5">
                  {action.risks.map((r, i) => (
                    <li key={i} className="text-gray-600 flex items-start gap-1.5">
                      <span className="text-amber-500 mt-0.5">⚠</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StrategyTab({ strategy }: { strategy: StrategyType }) {
  const roadmap = getStrategyRoadmap(strategy);
  const [expandedPhase, setExpandedPhase] = useState<TimePhase | null>("quick");

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-700">{roadmap.overview}</p>
      </div>

      <div>
        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Prerequisites
        </h5>
        <ul className="space-y-1">
          {roadmap.prerequisites.map((p, i) => (
            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">▸</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Implementation Roadmap
        </h5>
        <div className="space-y-2">
          {(["quick", "medium", "long"] as TimePhase[]).map((phase) => (
            <div key={phase}>
              <button
                onClick={() => setExpandedPhase(expandedPhase === phase ? null : phase)}
                className={`w-full flex items-center justify-between p-2 rounded-lg border ${getPhaseColor(
                  phase
                )}`}
              >
                <span className="font-medium text-sm">{getPhaseDisplayName(phase)}</span>
                <span className="text-xs opacity-75">
                  {roadmap.phases[phase].length} actions
                </span>
              </button>
              {expandedPhase === phase && (
                <div className="mt-2 space-y-2 pl-2">
                  {roadmap.phases[phase].map((action, i) => (
                    <ActionCard key={action.id} action={action} index={i} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
        <h5 className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
          Common Pitfalls
        </h5>
        <ul className="space-y-1">
          {roadmap.commonPitfalls.map((p, i) => (
            <li key={i} className="text-sm text-amber-700 flex items-start gap-1.5">
              <span className="mt-0.5">•</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CaseStudyTab({ cell }: { cell: CellStrategy }) {
  // Use the first strategy's case study as primary
  const primaryStrategy = cell.strategies[0];
  const roadmap = getStrategyRoadmap(primaryStrategy);
  const { caseStudy } = roadmap;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h4 className="font-semibold text-blue-900">Case Study: {caseStudy.company}</h4>
        </div>
        <p className="text-sm text-blue-800 mb-3">{caseStudy.context}</p>
      </div>

      <div>
        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Approach
        </h5>
        <p className="text-sm text-gray-700">{caseStudy.approach}</p>
      </div>

      <div>
        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Results
        </h5>
        <p className="text-sm text-gray-700">{caseStudy.results}</p>
      </div>

      {cell.strategies.length > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            This cell recommends combining <strong>{cell.strategies.join(" + ")}</strong>. 
            The case study above focuses on the primary strategy ({primaryStrategy}).
          </p>
        </div>
      )}
    </div>
  );
}

export default function RoadmapPanel({ cell }: RoadmapPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("by-phase");

  // Get prioritized actions across all recommended strategies
  const prioritizedActions = {
    quick: getPrioritizedActions(cell.strategies, "quick"),
    medium: getPrioritizedActions(cell.strategies, "medium"),
    long: getPrioritizedActions(cell.strategies, "long"),
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Implementation Roadmap</h3>
        <p className="text-sm text-gray-500">
          Actionable steps to implement {cell.strategies.join(" + ")} strategy
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: "by-phase" as TabType, label: "By Phase" },
          { id: "by-strategy" as TabType, label: "By Strategy" },
          { id: "case-study" as TabType, label: "Case Study" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "by-phase" && (
          <div className="space-y-3">
            {(["quick", "medium", "long"] as TimePhase[]).map((phase) => (
              <div key={phase}>
                <div className={`p-2 rounded-lg border ${getPhaseColor(phase)} mb-2`}>
                  <span className="font-medium text-sm">{getPhaseDisplayName(phase)}</span>
                  <span className="text-xs opacity-75 ml-2">
                    ({prioritizedActions[phase].length} actions)
                  </span>
                </div>
                <div className="space-y-2 pl-2">
                  {prioritizedActions[phase].slice(0, 3).map((action, i) => (
                    <ActionCard key={action.id} action={action} index={i} />
                  ))}
                  {prioritizedActions[phase].length > 3 && (
                    <p className="text-xs text-gray-500 pl-8">
                      +{prioritizedActions[phase].length - 3} more actions in this phase
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "by-strategy" && (
          <div className="space-y-4">
            {cell.strategies.map((strategy) => (
              <div key={strategy} className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2">{strategy} Strategy</h4>
                <StrategyTab strategy={strategy} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "case-study" && <CaseStudyTab cell={cell} />}
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <strong>Disclaimer:</strong> These are estimates based on typical implementations. 
          Actual timelines and costs will vary based on your organization, market, and product specifics.
        </p>
      </div>
    </div>
  );
}
