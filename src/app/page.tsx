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
        <p className="text-sm text-gray-400 mb-8">
          Based on the HBR Circularity Matrix framework by Atasu, Dumas &amp;
          Van Wassenhove (2021)
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Assess Your Product",
              description:
                "Answer 8 questions about your product's accessibility, processing complexity, and embedded value.",
            },
            {
              step: "2",
              title: "Get Your Strategy",
              description:
                "See which circular strategy (or combination) fits your product, with real-world examples and guidance.",
            },
            {
              step: "3",
              title: "Build Your Portfolio",
              description:
                "Assess multiple products, visualize them on the matrix, and generate a PDF report.",
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
          Assess your first product in under 3 minutes.
        </p>
        <Link
          href="/assess"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Assessment →
        </Link>
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
