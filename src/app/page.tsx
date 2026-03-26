import Link from "next/link";

const HBR_STRATEGIES = [
  {
    abbr: "RPO",
    name: "Retain Product Ownership",
    description:
      "Keep ownership of the product and offer it as a service. Customers pay for usage, not ownership.",
    color: "bg-purple-50 border-purple-200 text-purple-800",
    icon: "🔄",
  },
  {
    abbr: "PLE",
    name: "Product Life Extension",
    description:
      "Extend the product's useful life through repair, refurbishment, maintenance, or remanufacturing.",
    color: "bg-green-50 border-green-200 text-green-800",
    icon: "🔧",
  },
  {
    abbr: "DFR",
    name: "Design for Recycling",
    description:
      "Design products so materials can be efficiently recovered and recycled at end of life.",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "♻️",
  },
];

const R_STRATEGIES = [
  {
    abbr: "REUSE",
    name: "Reuse",
    description:
      "Direct reuse of products in their original form. Highest value retention with minimal processing.",
    color: "bg-emerald-50 border-emerald-200 text-emerald-800",
    icon: "♻️",
  },
  {
    abbr: "REFURBISH",
    name: "Refurbish",
    description:
      "Cosmetic and functional restoration to like-new condition. Good balance of value and effort.",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "🔧",
  },
  {
    abbr: "REMANUFACTURE",
    name: "Remanufacture",
    description:
      "Systematic restoration to original specifications. Requires established infrastructure and processes.",
    color: "bg-violet-50 border-violet-200 text-violet-800",
    icon: "⚙️",
  },
  {
    abbr: "REPURPOSE",
    name: "Repurpose",
    description:
      "Creative adaptation for different functions. Ideal for products with unique material properties.",
    color: "bg-amber-50 border-amber-200 text-amber-800",
    icon: "🔄",
  },
  {
    abbr: "RECYCLE",
    name: "Recycle",
    description:
      "Material recovery when other strategies aren't feasible. Infrastructure-dependent approach.",
    color: "bg-gray-50 border-gray-200 text-gray-800",
    icon: "📦",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Circularity Matrix
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-2">
          Find the right circular economy strategy for your products
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Now supporting two complementary frameworks: HBR Circularity Matrix + Siemens R-Strategy Scorecard
        </p>
        <p className="text-sm text-gray-500 mb-8">
          AI-Powered · 24+ Product Templates · Dual Assessment Modes · Financial ROI Calculator
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/assess"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Assessment →
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Explore Frameworks
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "1",
              title: "Choose Your Framework",
              description:
                "Select HBR Matrix for strategic positioning or R-Strategy Scorecard for detailed criteria-based scoring.",
            },
            {
              step: "2",
              title: "Start with AI or Templates",
              description:
                "Choose from 24+ product templates or use AI assistance to get instant answer suggestions based on your product description.",
            },
            {
              step: "3",
              title: "Assess Your Product",
              description:
                "Answer framework-specific questions — 8 for HBR Matrix, 7 for R-Strategy Scorecard. Smart defaults save you time.",
            },
            {
              step: "4",
              title: "Get Strategy + Roadmap",
              description:
                "Receive tailored recommendations with detailed implementation roadmaps, financial projections, and real-world case studies.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Frameworks */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Two Frameworks, One Goal
        </h2>
        <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">
          Compare your products against two complementary approaches to circular economy strategy selection.
        </p>

        {/* HBR Matrix */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              HBR
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">HBR Circularity Matrix</h3>
              <p className="text-sm text-gray-500">Atasu, Dumas & Van Wassenhove (2021)</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Maps products along Access (how easily you get products back) and Process (how easily you recover value), 
            plus Embedded Value (high vs. low) to recommend one of three core strategies:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HBR_STRATEGIES.map((s) => (
              <div
                key={s.abbr}
                className={`border rounded-lg p-4 ${s.color}`}
              >
                <div className="text-xl mb-2">{s.icon}</div>
                <div className="font-bold text-sm mb-1">
                  {s.abbr} — {s.name}
                </div>
                <p className="text-xs opacity-80">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* R-Strategy Scorecard */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
              R5
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Siemens R-Strategy Scorecard</h3>
              <p className="text-sm text-gray-500">Criteria-based hierarchical scoring approach</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Evaluates products against 7 criteria to score Suitability (value retention potential) and Practicality 
            (implementation feasibility), mapping them to one of 5 hierarchical R-strategies:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {R_STRATEGIES.map((s) => (
              <div
                key={s.abbr}
                className={`border rounded-lg p-3 ${s.color}`}
              >
                <div className="text-lg mb-1">{s.icon}</div>
                <div className="font-bold text-xs mb-1">{s.name}</div>
                <p className="text-xs opacity-80 leading-tight">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Framework Comparison */}
      <div className="mb-16 bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
          Which Framework Should I Use?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="font-semibold text-gray-900">Choose HBR Matrix when...</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You need a strategic, high-level view</li>
              <li>• Deciding between business model changes</li>
              <li>• Comparing products across different categories</li>
              <li>• Planning portfolio-level circularity strategy</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="font-semibold text-gray-900">Choose R-Strategy when...</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You need detailed operational guidance</li>
              <li>• Evaluating specific product recovery options</li>
              <li>• Assessing feasibility of remanufacturing programs</li>
              <li>• Deciding between Reuse, Refurbish, or Remanufacture</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-2">
          Ready to find the right strategy?
        </h2>
        <p className="text-white/80 mb-6">
          Choose your framework, start from a template, or use AI assistance — assess your first product in under 1 minute.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/assess"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Assessment →
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/30"
          >
            Explore Frameworks
          </Link>
        </div>
      </div>

      {/* Creator credit */}
      <p className="text-center text-sm text-gray-400 mt-12">
        Built by{" "}
        <a
          href="https://github.com/lugasraka"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 underline underline-offset-2 transition-colors"
        >
          Raka Adrianto
        </a>
        {" · "}
        <a
          href="https://github.com/lugasraka"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 underline underline-offset-2 transition-colors"
        >
          GitHub
        </a>
      </p>
    </div>
  );
}
