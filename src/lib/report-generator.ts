import jsPDF from "jspdf";
import { Portfolio, Product, StrategyType } from "./types";
import { cellStrategies, strategyDescriptions } from "./strategies";

const STRATEGY_COLORS: Record<StrategyType, [number, number, number]> = {
  RPO: [147, 51, 234],  // purple
  PLE: [22, 163, 74],   // green
  DFR: [37, 99, 235],   // blue
};

const CELL_COLORS: Record<string, [number, number, number]> = {
  "hard-easy-low": [219, 234, 254],
  "hard-easy-high": [191, 219, 254],
  "hard-hard-low": [209, 250, 229],
  "hard-hard-high": [167, 243, 208],
  "easy-easy-low": [254, 243, 199],
  "easy-easy-high": [253, 230, 138],
  "easy-hard-low": [252, 231, 243],
  "easy-hard-high": [251, 207, 232],
};

export function generateReport(portfolio: Portfolio) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // === PAGE 1: Portfolio Overview ===
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Circularity Matrix", margin, 40);
  doc.text("Portfolio Report", margin, 52);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Based on the HBR Circularity Matrix framework (Atasu, Dumas & Van Wassenhove, 2021)`,
    margin,
    65
  );
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 72);
  doc.text(
    `Products assessed: ${portfolio.products.length}`,
    margin,
    79
  );

  // Strategy distribution summary
  const strategyCount: Record<string, number> = {};
  for (const p of portfolio.products) {
    const key = p.result.cell.strategies.join(" + ");
    strategyCount[key] = (strategyCount[key] || 0) + 1;
  }

  let y = 95;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Strategy Distribution", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  for (const [strategy, count] of Object.entries(strategyCount).sort(
    ([, a], [, b]) => b - a
  )) {
    const pct = ((count / portfolio.products.length) * 100).toFixed(0);
    doc.setTextColor(60, 60, 60);
    doc.text(`${strategy}`, margin + 5, y);
    doc.text(
      `${count} product${count !== 1 ? "s" : ""} (${pct}%)`,
      margin + 80,
      y
    );

    // Simple bar
    const barWidth = (count / portfolio.products.length) * 60;
    doc.setFillColor(37, 99, 235);
    doc.rect(margin + 120, y - 3, barWidth, 4, "F");

    y += 7;
  }

  // Product list
  y += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Products", margin, y);
  y += 8;

  doc.setFontSize(9);
  for (const [i, product] of portfolio.products.entries()) {
    if (y > 270) {
      doc.addPage();
      y = 30;
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text(`${i + 1}. ${product.name}`, margin + 5, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `${product.result.cell.label} | ${product.result.position.access === "hard" ? "Hard" : "Easy"} Access, ${product.result.position.process === "hard" ? "Hard" : "Easy"} Process, ${product.result.position.embeddedValue === "high" ? "High" : "Low"} Value`,
      margin + 5,
      y + 5
    );
    y += 13;
  }

  // === PAGE 2: Matrix Visualization ===
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Circularity Matrix", margin, 25);

  drawMatrixOnPdf(doc, portfolio.products, margin, 35, contentWidth);

  // === PAGES 3+: Per-Product Detail ===
  for (const product of portfolio.products) {
    doc.addPage();
    drawProductDetail(doc, product, margin, contentWidth);
  }

  // === Download ===
  doc.save("circularity-matrix-report.pdf");
}

function drawMatrixOnPdf(
  doc: jsPDF,
  products: Product[],
  startX: number,
  startY: number,
  availableWidth: number
) {
  const matrixSize = Math.min(availableWidth, 160);
  const cellW = matrixSize / 2;
  const cellH = 50; // each sub-cell height
  const quadrantH = cellH * 2;
  const totalH = quadrantH * 2;

  const mx = startX + (availableWidth - matrixSize) / 2;
  const my = startY + 10;

  // Axis labels
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);

  // X-axis
  doc.text("Process", mx + matrixSize / 2, my + totalH + 12, {
    align: "center",
  });
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("← Easy", mx, my + totalH + 12);
  doc.text("Hard →", mx + matrixSize, my + totalH + 12, { align: "right" });

  // Y-axis
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");

  const yAxisX = mx - 12;
  const yAxisY = my + totalH / 2;
  doc.text("Access", yAxisX, yAxisY, {
    angle: 90,
    align: "center",
  });

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("Hard →", yAxisX + 5, my + 5, { angle: 90 });
  doc.text("← Easy", yAxisX + 5, my + totalH - 5, { angle: 90 });

  // Draw cells
  for (const cell of cellStrategies) {
    const col = cell.position.process === "easy" ? 0 : 1;
    const row = cell.position.access === "hard" ? 0 : 1;
    const embOffset = cell.position.embeddedValue === "low" ? 0 : cellH;

    const cx = mx + col * cellW;
    const cy = my + row * quadrantH + embOffset;
    const color = CELL_COLORS[cell.id];

    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(cx, cy, cellW, cellH, "F");
    doc.setDrawColor(180, 180, 180);
    doc.rect(cx, cy, cellW, cellH, "S");

    // Cell text
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(
      `${cell.position.embeddedValue === "high" ? "High" : "Low"} embedded value`,
      cx + 3,
      cy + 8
    );
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);

    const labelLines = doc.splitTextToSize(
      `Strategy: ${cell.label}`,
      cellW - 6
    );
    doc.text(labelLines, cx + 3, cy + 15);

    // Product pins
    const cellProducts = products.filter((p) => p.result.cell.id === cell.id);
    for (const [idx, product] of cellProducts.entries()) {
      const pinX = cx + cellW - 8 - (idx % 4) * 10;
      const pinY = cy + cellH - 8 - Math.floor(idx / 4) * 10;
      doc.setFillColor(37, 99, 235);
      doc.circle(pinX, pinY, 3, "F");
      doc.setFontSize(5);
      doc.setTextColor(255, 255, 255);
      doc.text(
        `${products.indexOf(product) + 1}`,
        pinX,
        pinY + 1.5,
        { align: "center" }
      );
    }
  }

  // Quadrant dividers (thicker)
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.line(mx + cellW, my, mx + cellW, my + totalH);
  doc.line(mx, my + quadrantH, mx + matrixSize, my + quadrantH);

  // Outer border
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.8);
  doc.rect(mx, my, matrixSize, totalH, "S");
  doc.setLineWidth(0.2);

  // Legend for product numbers
  let ly = my + totalH + 20;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Product Legend:", mx, ly);
  ly += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  for (const [i, product] of products.entries()) {
    if (ly > 280) break;
    doc.setTextColor(60, 60, 60);
    doc.text(`${i + 1} — ${product.name}`, mx + 5, ly);
    ly += 5;
  }
}

function drawProductDetail(
  doc: jsPDF,
  product: Product,
  margin: number,
  contentWidth: number
) {
  let y = 25;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(product.name, margin, y);
  y += 10;

  // Position info
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Access: ${product.result.position.access === "hard" ? "Hard" : "Easy"} | Process: ${product.result.position.process === "hard" ? "Hard" : "Easy"} | Embedded Value: ${product.result.position.embeddedValue === "high" ? "High" : "Low"}`,
    margin,
    y
  );
  y += 10;

  // Scores
  doc.setFontSize(9);
  const scores = product.result.scores;
  doc.text(
    `Scores — Access: ${(scores.access * 100).toFixed(0)}% | Process: ${(scores.process * 100).toFixed(0)}% | Embedded Value: ${(scores.embeddedValue * 100).toFixed(0)}%`,
    margin,
    y
  );
  y += 12;

  // Recommended strategy
  const cell = product.result.cell;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(`Recommended Strategy: ${cell.label}`, margin, y);
  y += 8;

  // Strategy badges
  doc.setFontSize(9);
  let badgeX = margin;
  for (const s of cell.strategies) {
    const color = STRATEGY_COLORS[s];
    doc.setFillColor(color[0], color[1], color[2]);
    const tw = doc.getTextWidth(s) + 6;
    doc.roundedRect(badgeX, y - 3, tw, 6, 1, 1, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(s, badgeX + 3, y + 1);
    badgeX += tw + 4;
  }
  y += 12;

  // Description
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  const descLines = doc.splitTextToSize(cell.description, contentWidth);
  doc.text(descLines, margin, y);
  y += descLines.length * 5 + 8;

  // Examples
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Real-World Examples", margin, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  for (const ex of cell.examples) {
    doc.text(`• ${ex}`, margin + 5, y);
    y += 5;
  }
  y += 5;

  // Guidance
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Implementation Guidance", margin, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  for (const g of cell.guidance) {
    const lines = doc.splitTextToSize(`→ ${g}`, contentWidth - 10);
    doc.text(lines, margin + 5, y);
    y += lines.length * 5 + 2;
  }
  y += 5;

  // What-if
  const whatIf = product.result.whatIfCell;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(
    `What-If: ${whatIf.position.embeddedValue === "high" ? "High" : "Low"} Embedded Value`,
    margin,
    y
  );
  y += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Alternative strategy: ${whatIf.label}`, margin + 5, y);
  y += 5;
  const whatIfLines = doc.splitTextToSize(whatIf.description, contentWidth - 10);
  doc.text(whatIfLines, margin + 5, y);
  y += whatIfLines.length * 5 + 8;

  // Strategy definitions
  if (y < 250) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Strategy Definitions", margin, y);
    y += 6;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const allStrategies = Array.from(
      new Set([...cell.strategies, ...whatIf.strategies])
    );
    for (const s of allStrategies) {
      doc.setTextColor(60, 60, 60);
      const defLines = doc.splitTextToSize(
        `${s}: ${strategyDescriptions[s]}`,
        contentWidth - 10
      );
      doc.text(defLines, margin + 5, y);
      y += defLines.length * 4 + 3;
    }
  }
}
