import Link from "next/link";

const STRATEGIES = [
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
        <p className="text-sm text-gray-400 mb-2">
          Based on the HBR Circularity Matrix framework by Atasu, Dumas &amp;
          Van Wassenhove (2021)
        </p>
        <p className="text-sm text-gray-500 mb-8">
          AI-Powered · 12+ Product Templates · Financial ROI Calculator · Implementation Roadmaps
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
            Explore the Matrix
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
              title: "Start with AI or Templates",
              description:
                "Choose from 12+ product templates or use AI assistance to get instant answer suggestions based on your product description.",
            },
            {
              step: "2",
              title: "Assess Your Product",
              description:
                "Review and refine 8 questions across Access, Process, and Embedded Value dimensions. Smart defaults save you time.",
            },
            {
              step: "3",
              title: "Get Strategy + Roadmap",
              description:
                "Receive your recommended circular strategy with a detailed implementation roadmap, financial projections, and real-world case studies.",
            },
            {
              step: "4",
              title: "Build Your Portfolio",
              description:
                "Track multiple products on the matrix, compare strategies, export PDF reports, and share assessments with your team.",
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

      {/* The Framework */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          The Framework
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8 max-w-xl mx-auto">
          The Circularity Matrix maps products along two axes — <strong>Access</strong> (how easily
          you can get the product back) and <strong>Process</strong> (how easily you can recover
          value) — plus <strong>Embedded Value</strong> (high vs. low) to recommend one of three
          core strategies:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STRATEGIES.map((s) => (
            <div
              key={s.abbr}
              className={`border rounded-lg p-5 ${s.color}`}
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-bold mb-1">
                {s.abbr} — {s.name}
              </div>
              <p className="text-sm opacity-80">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gray-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Ready to find the right strategy?
        </h2>
        <p className="text-gray-500 mb-4">
          Start from a template or use AI assistance — assess your first product in under 1 minute.
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
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white transition-colors"
          >
            Explore the Matrix
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
