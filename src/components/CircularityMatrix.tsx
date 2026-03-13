"use client";

import { useState } from "react";
import { CellStrategy, Product } from "../lib/types";
import { cellStrategies } from "../lib/strategies";

interface CircularityMatrixProps {
  products?: Product[];
  highlightCellId?: string;
  onCellClick?: (cell: CellStrategy) => void;
  onProductClick?: (product: Product) => void;
  compact?: boolean;
}

const CELL_COLORS: Record<string, { bg: string; border: string }> = {
  "hard-easy-low": { bg: "#dbeafe", border: "#93c5fd" },   // blue-100
  "hard-easy-high": { bg: "#bfdbfe", border: "#60a5fa" },  // blue-200
  "hard-hard-low": { bg: "#d1fae5", border: "#6ee7b7" },   // green-100
  "hard-hard-high": { bg: "#a7f3d0", border: "#34d399" },  // green-200
  "easy-easy-low": { bg: "#fef3c7", border: "#fcd34d" },   // yellow-100
  "easy-easy-high": { bg: "#fde68a", border: "#f59e0b" },  // yellow-200
  "easy-hard-low": { bg: "#fce7f3", border: "#f9a8d4" },   // pink-100
  "easy-hard-high": { bg: "#fbcfe8", border: "#f472b6" },  // pink-200
};

const PIN_COLORS = [
  "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#14b8a6",
  "#e11d48", "#2563eb", "#059669", "#d97706", "#7c3aed",
];

export default function CircularityMatrix({
  products = [],
  highlightCellId,
  onCellClick,
  onProductClick,
  compact = false,
}: CircularityMatrixProps) {
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const margin = compact ? { top: 20, right: 20, bottom: 40, left: 50 } : { top: 30, right: 30, bottom: 50, left: 60 };
  const cellWidth = compact ? 140 : 200;
  const cellHeight = compact ? 80 : 100;
  const quadrantWidth = cellWidth;
  const quadrantHeight = cellHeight * 2; // 2 sub-cells per quadrant
  const gridWidth = quadrantWidth * 2;
  const gridHeight = quadrantHeight * 2;
  const totalWidth = gridWidth + margin.left + margin.right;
  const totalHeight = gridHeight + margin.top + margin.bottom;

  // Map cell positions to grid coordinates
  function getCellCoords(cellId: string): { x: number; y: number } {
    const parts = cellId.split("-");
    const access = parts[0];
    const process = parts[1];
    const embedded = parts[2];

    const col = process === "easy" ? 0 : 1;
    const row = access === "hard" ? 0 : 1;

    const x = margin.left + col * quadrantWidth;
    const embeddedOffset = embedded === "low" ? 0 : cellHeight;
    const y = margin.top + row * quadrantHeight + embeddedOffset;

    return { x, y };
  }

  // Group products by cell
  const productsByCell: Record<string, Product[]> = {};
  for (const p of products) {
    const cellId = p.result.cell.id;
    if (!productsByCell[cellId]) productsByCell[cellId] = [];
    productsByCell[cellId].push(p);
  }

  const fontSize = compact ? 9 : 11;
  const labelFontSize = compact ? 10 : 13;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="w-full h-auto"
        style={{ maxWidth: compact ? 400 : 600 }}
      >
        {/* Axis labels */}
        <text
          x={margin.left + gridWidth / 2}
          y={totalHeight - 5}
          textAnchor="middle"
          className="fill-current"
          fontSize={labelFontSize}
          fontWeight="bold"
        >
          Process
        </text>
        <text
          x={margin.left + 5}
          y={totalHeight - 5}
          textAnchor="start"
          className="fill-gray-500"
          fontSize={fontSize}
        >
          ← Easy
        </text>
        <text
          x={margin.left + gridWidth - 5}
          y={totalHeight - 5}
          textAnchor="end"
          className="fill-gray-500"
          fontSize={fontSize}
        >
          Hard →
        </text>

        <text
          x={15}
          y={margin.top + gridHeight / 2}
          textAnchor="middle"
          className="fill-current"
          fontSize={labelFontSize}
          fontWeight="bold"
          transform={`rotate(-90, 15, ${margin.top + gridHeight / 2})`}
        >
          Access
        </text>
        <text
          x={margin.left - 8}
          y={margin.top + gridHeight - 5}
          textAnchor="middle"
          className="fill-gray-500"
          fontSize={fontSize}
          transform={`rotate(-90, ${margin.left - 8}, ${margin.top + gridHeight - 5})`}
        >
          ← Easy
        </text>
        <text
          x={margin.left - 8}
          y={margin.top + 15}
          textAnchor="middle"
          className="fill-gray-500"
          fontSize={fontSize}
          transform={`rotate(-90, ${margin.left - 8}, ${margin.top + 15})`}
        >
          Hard →
        </text>

        {/* Grid cells */}
        {cellStrategies.map((cell) => {
          const { x, y } = getCellCoords(cell.id);
          const colors = CELL_COLORS[cell.id];
          const isHighlighted = highlightCellId === cell.id;
          const cellProducts = productsByCell[cell.id] || [];

          return (
            <g
              key={cell.id}
              onClick={() => onCellClick?.(cell)}
              className={onCellClick ? "cursor-pointer" : ""}
            >
              <rect
                x={x}
                y={y}
                width={cellWidth}
                height={cellHeight}
                fill={colors.bg}
                stroke={isHighlighted ? "#1d4ed8" : colors.border}
                strokeWidth={isHighlighted ? 3 : 1}
                rx={2}
              />

              <text
                x={x + 6}
                y={y + (compact ? 12 : 16)}
                fontSize={compact ? 7 : 9}
                fontWeight="bold"
                className="fill-gray-600"
              >
                {cell.position.embeddedValue === "high" ? "High" : "Low"} embedded value
              </text>

              <text
                x={x + 6}
                y={y + (compact ? 24 : 32)}
                fontSize={compact ? 8 : 10}
                fontWeight="600"
                className="fill-gray-800"
              >
                Strategy: {cell.label.length > (compact ? 18 : 25) ? cell.label.slice(0, compact ? 16 : 23) + "…" : cell.label}
              </text>

              {!compact && cell.examples[0] && (
                <text
                  x={x + 6}
                  y={y + 48}
                  fontSize={8}
                  fontStyle="italic"
                  className="fill-gray-500"
                >
                  {cell.examples[0].length > 30
                    ? cell.examples[0].slice(0, 28) + "…"
                    : cell.examples[0]}
                </text>
              )}

              {/* Product pins */}
              {cellProducts.map((product, idx) => {
                const pinX = x + cellWidth - 14 - (idx % 4) * 16;
                const pinY = y + cellHeight - 14 - Math.floor(idx / 4) * 16;
                const color = PIN_COLORS[products.indexOf(product) % PIN_COLORS.length];
                const isHovered = hoveredProduct?.id === product.id;

                return (
                  <g
                    key={product.id}
                    className={onProductClick ? "cursor-pointer" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick?.(product);
                    }}
                    onMouseEnter={(e) => {
                      setHoveredProduct(product);
                      setTooltipPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setHoveredProduct(null)}
                    onMouseMove={(e) => {
                      setTooltipPos({ x: e.clientX, y: e.clientY });
                    }}
                  >
                    <circle
                      cx={pinX}
                      cy={pinY}
                      r={compact ? 5 : 6}
                      fill={color}
                      stroke="white"
                      strokeWidth={isHovered ? 2 : 1.5}
                      style={{ filter: isHovered ? "brightness(1.1)" : "none" }}
                    />
                    {isHovered && (
                      <circle
                        cx={pinX}
                        cy={pinY}
                        r={compact ? 7 : 8}
                        fill="none"
                        stroke={color}
                        strokeWidth={1}
                        opacity={0.5}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Quadrant dividers */}
        <line
          x1={margin.left + quadrantWidth}
          y1={margin.top}
          x2={margin.left + quadrantWidth}
          y2={margin.top + gridHeight}
          stroke="#9ca3af"
          strokeWidth={2}
        />
        <line
          x1={margin.left}
          y1={margin.top + quadrantHeight}
          x2={margin.left + gridWidth}
          y2={margin.top + quadrantHeight}
          stroke="#9ca3af"
          strokeWidth={2}
        />
        <rect
          x={margin.left}
          y={margin.top}
          width={gridWidth}
          height={gridHeight}
          fill="none"
          stroke="#6b7280"
          strokeWidth={2}
          rx={4}
        />
      </svg>

      {/* Tooltip */}
      {hoveredProduct && !compact && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none shadow-lg"
          style={{
            left: tooltipPos.x + 10,
            top: tooltipPos.y - 30,
          }}
        >
          <div className="font-semibold">{hoveredProduct.name}</div>
          <div className="text-gray-300">
            {hoveredProduct.result.cell.strategies.join(" + ")}
          </div>
          <div className="text-gray-400 text-[10px]">
            {hoveredProduct.result.position.access === "hard" ? "Hard" : "Easy"} Access ×{" "}
            {hoveredProduct.result.position.process === "hard" ? "Hard" : "Easy"} Process
          </div>
        </div>
      )}
    </div>
  );
}
