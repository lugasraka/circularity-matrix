import jsPDF from "jspdf";
import { Portfolio, Product, StrategyType } from "./types";
import { cellStrategies, strategyDescriptions } from "./strategies";
import { RSTRATEGY_ZONES, RSTRATEGY_DESCRIPTIONS, RStrategy } from "./r-strategy/types";
import { hasHBRResult, hasRStrategyResult } from "./types";

const STRATEGY_COLORS: Record<StrategyType, [number, number, number]> = {
  RPO: [147, 51, 234],  // purple
  PLE: [22, 163, 74],   // green
  DFR: [37, 99, 235],   // blue
};

const RSTRATEGY_PDF_COLORS: Record<RStrategy, [number, number, number]> = {
  REUSE: [16, 185, 129],      // emerald
  REFURBISH: [59, 130, 246],  // blue
  REMANUFACTURE: [139, 92, 246], // violet
  REPURPOSE: [245, 158, 11],  // amber
  RECYCLE: [107, 114, 128],   // gray
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

  // Separate products by framework
  const hbrProducts = portfolio.products.filter(p => hasHBRResult(p));
  const rStrategyProducts = portfolio.products.filter(p => hasRStrategyResult(p));

  // === PAGE 1: Portfolio Overview ===
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Circularity Matrix", margin, 40);
  doc.text("Portfolio Report", margin, 52);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Dual Framework Assessment: HBR Circularity Matrix + R-Strategy Scorecard`,
    margin,
    65
  );
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 72);
  doc.text(
    `Total products assessed: ${portfolio.products.length}`,
    margin,
    79
  );

  // Framework breakdown
  let y = 90;
  if (hbrProducts.length > 0 && rStrategyProducts.length > 0) {
    doc.text(`• HBR Matrix: ${hbrProducts.length} products`, margin + 5, y);
    y += 6;
    doc.text(`• R-Strategy Scorecard: ${rStrategyProducts.length} products`, margin + 5, y);
    y += 10;
  }

  // HBR Strategy distribution
  if (hbrProducts.length > 0) {
    const strategyCount: Record<string, number> = {};
    for (const p of hbrProducts) {
      if (p.result) {
        const key = p.result.cell.strategies.join(" + ");
        strategyCount[key] = (strategyCount[key] || 0) + 1;
      }
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("HBR Matrix Strategy Distribution", margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    for (const [strategy, count] of Object.entries(strategyCount).sort(
      ([, a], [, b]) => b - a
    )) {
      const pct = hbrProducts.length > 0 ? ((count / hbrProducts.length) * 100).toFixed(0) : "0";
      doc.setTextColor(60, 60, 60);
      doc.text(`${strategy}`, margin + 5, y);
      doc.text(
        `${count} product${count !== 1 ? "s" : ""} (${pct}%)`,
        margin + 80,
        y
      );

      const barWidth = hbrProducts.length > 0 ? (count / hbrProducts.length) * 60 : 0;
      doc.setFillColor(37, 99, 235);
      doc.rect(margin + 120, y - 3, barWidth, 4, "F");

      y += 7;
    }
    y += 5;
  }

  // R-Strategy distribution
  if (rStrategyProducts.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 30;
    }

    const rStrategyCount: Record<string, number> = {};
    for (const p of rStrategyProducts) {
      if (p.rStrategyResult) {
        const key = p.rStrategyResult.primaryRecommendation;
        rStrategyCount[key] = (rStrategyCount[key] || 0) + 1;
      }
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("R-Strategy Distribution", margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    for (const [strategy, count] of Object.entries(rStrategyCount).sort(
      ([, a], [, b]) => b - a
    )) {
      const pct = rStrategyProducts.length > 0 ? ((count / rStrategyProducts.length) * 100).toFixed(0) : "0";
      const color = RSTRATEGY_PDF_COLORS[strategy as RStrategy];
      doc.setTextColor(60, 60, 60);
      doc.text(`${strategy}`, margin + 5, y);
      doc.text(
        `${count} product${count !== 1 ? "s" : ""} (${pct}%)`,
        margin + 80,
        y
      );

      const barWidth = rStrategyProducts.length > 0 ? (count / rStrategyProducts.length) * 60 : 0;
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(margin + 120, y - 3, barWidth, 4, "F");

      y += 7;
    }
  }

  // Product lists by framework
  if (hbrProducts.length > 0) {
    doc.addPage();
    y = 30;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("HBR Matrix Products", margin, y);
    y += 8;

    doc.setFontSize(9);
    for (const [i, product] of hbrProducts.entries()) {
      if (!product.result) continue;
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
  }

  if (rStrategyProducts.length > 0) {
    doc.addPage();
    y = 30;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("R-Strategy Products", margin, y);
    y += 8;

    doc.setFontSize(9);
    for (const [i, product] of rStrategyProducts.entries()) {
      if (!product.rStrategyResult) continue;
      if (y > 270) {
        doc.addPage();
        y = 30;
      }
      const primary = product.rStrategyResult.primaryRecommendation;
      const color = RSTRATEGY_PDF_COLORS[primary];
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text(`${i + 1}. ${product.name}`, margin + 5, y);
      
      // Strategy badge
      doc.setFillColor(color[0], color[1], color[2]);
      const tw = doc.getTextWidth(primary) + 6;
      doc.roundedRect(margin + 120, y - 3, tw, 6, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.text(primary, margin + 123, y + 1);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      const score = product.rStrategyResult.scores.find(s => s.strategy === primary);
      doc.text(
        `Suitability: ${score?.suitabilityScore.toFixed(0)}% | Practicality: ${score?.practicalityScore.toFixed(0)}%`,
        margin + 5,
        y + 5
      );
      y += 13;
    }
  }

  // === HBR MATRIX VISUALIZATION ===
  if (hbrProducts.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("HBR Circularity Matrix", margin, 25);
    drawMatrixOnPdf(doc, hbrProducts, margin, 35, contentWidth);
  }

  // === R-STRATEGY VISUALIZATION ===
  if (rStrategyProducts.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("R-Strategy Suitability vs. Practicality", margin, 25);
    drawRStrategyScatterOnPdf(doc, rStrategyProducts, margin, 35, contentWidth);
  }

  // === HBR PRODUCT DETAILS ===
  for (const product of hbrProducts) {
    if (product.result) {
      doc.addPage();
      drawHBRProductDetail(doc, product, margin, contentWidth);
    }
  }

  // === R-STRATEGY PRODUCT DETAILS ===
  for (const product of rStrategyProducts) {
    if (product.rStrategyResult) {
      doc.addPage();
      drawRStrategyProductDetail(doc, product, margin, contentWidth);
    }
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
  const cellH = 50;
  const quadrantH = cellH * 2;
  const totalH = quadrantH * 2;

  const mx = startX + (availableWidth - matrixSize) / 2;
  const my = startY + 10;

  // Axis labels
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);

  doc.text("Process", mx + matrixSize / 2, my + totalH + 12, { align: "center" });
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("← Easy", mx, my + totalH + 12);
  doc.text("Hard →", mx + matrixSize, my + totalH + 12, { align: "right" });

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");

  const yAxisX = mx - 12;
  const yAxisY = my + totalH / 2;
  doc.text("Access", yAxisX, yAxisY, { angle: 90, align: "center" });

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

    const labelLines = doc.splitTextToSize(`Strategy: ${cell.label}`, cellW - 6);
    doc.text(labelLines, cx + 3, cy + 15);

    // Product pins
    const cellProducts = products.filter((p) => p.result?.cell.id === cell.id);
    for (const [idx, product] of cellProducts.entries()) {
      const pinX = cx + cellW - 8 - (idx % 4) * 10;
      const pinY = cy + cellH - 8 - Math.floor(idx / 4) * 10;
      doc.setFillColor(37, 99, 235);
      doc.circle(pinX, pinY, 3, "F");
      doc.setFontSize(5);
      doc.setTextColor(255, 255, 255);
      doc.text(`${products.indexOf(product) + 1}`, pinX, pinY + 1.5, { align: "center" });
    }
  }

  // Quadrant dividers
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.line(mx + cellW, my, mx + cellW, my + totalH);
  doc.line(mx, my + quadrantH, mx + matrixSize, my + quadrantH);

  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.8);
  doc.rect(mx, my, matrixSize, totalH, "S");
  doc.setLineWidth(0.2);

  // Legend
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

function drawRStrategyScatterOnPdf(
  doc: jsPDF,
  products: Product[],
  startX: number,
  startY: number,
  availableWidth: number
) {
  const chartW = Math.min(availableWidth, 160);
  const chartH = 120;
  const cx = startX + (availableWidth - chartW) / 2;
  const cy = startY + 15;

  // Draw zones
  for (const zone of RSTRATEGY_ZONES) {
    const x = cx + (zone.practicalityMin / 100) * chartW;
    const y = cy + chartH - (zone.suitabilityMax / 100) * chartH;
    const w = ((zone.practicalityMax - zone.practicalityMin) / 100) * chartW;
    const h = ((zone.suitabilityMax - zone.suitabilityMin) / 100) * chartH;

    const color = [
      parseInt(zone.color.slice(1, 3), 16),
      parseInt(zone.color.slice(3, 5), 16),
      parseInt(zone.color.slice(5, 7), 16),
    ];

    doc.setFillColor(color[0], color[1], color[2]);
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.rect(x, y, w, h, "FD");

    // Zone label
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(zone.strategy, x + w / 2, y + h / 2, { align: "center" });
  }

  // Grid lines
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  for (let i = 0; i <= 100; i += 25) {
    const x = cx + (i / 100) * chartW;
    const y = cy + chartH - (i / 100) * chartH;
    doc.line(x, cy, x, cy + chartH);
    doc.line(cx, y, cx + chartW, y);
  }

  // Axis labels
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Practicality →", cx + chartW / 2, cy + chartH + 12, { align: "center" });

  doc.setFontSize(10);
  doc.text("Suitability", cx - 8, cy + chartH / 2, { angle: 90, align: "center" });

  // Draw products
  for (const [idx, product] of products.entries()) {
    if (!product.rStrategyResult) continue;
    const score = product.rStrategyResult.scores.find(
      s => s.strategy === product.rStrategyResult?.primaryRecommendation
    );
    if (!score) continue;

    const px = cx + (score.practicalityScore / 100) * chartW;
    const py = cy + chartH - (score.suitabilityScore / 100) * chartH;

    const color = RSTRATEGY_PDF_COLORS[product.rStrategyResult.primaryRecommendation];
    doc.setFillColor(color[0], color[1], color[2]);
    doc.circle(px, py, 4, "F");

    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text(`${idx + 1}`, px, py + 1.5, { align: "center" });
  }

  // Border
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.8);
  doc.rect(cx, cy, chartW, chartH, "S");
  doc.setLineWidth(0.2);

  // Legend
  let ly = cy + chartH + 20;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Product Legend:", cx, ly);
  ly += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  for (const [i, product] of products.entries()) {
    if (ly > 280) break;
    if (!product.rStrategyResult) continue;
    const strategy = product.rStrategyResult.primaryRecommendation;
    const color = RSTRATEGY_PDF_COLORS[strategy];
    doc.setFillColor(color[0], color[1], color[2]);
    doc.circle(cx + 3, ly - 1.5, 2, "F");
    doc.setTextColor(60, 60, 60);
    doc.text(`${i + 1} — ${product.name} (${strategy})`, cx + 8, ly);
    ly += 5;
  }
}

function drawHBRProductDetail(
  doc: jsPDF,
  product: Product,
  margin: number,
  contentWidth: number
) {
  if (!product.result) return;

  let y = 25;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(product.name, margin, y);
  y += 10;

  // Framework badge
  doc.setFillColor(37, 99, 235);
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  const badgeW = doc.getTextWidth("HBR Matrix") + 8;
  doc.roundedRect(margin, y - 4, badgeW, 6, 1, 1, "F");
  doc.text("HBR Matrix", margin + 4, y);
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
}

function drawRStrategyProductDetail(
  doc: jsPDF,
  product: Product,
  margin: number,
  contentWidth: number
) {
  if (!product.rStrategyResult) return;

  let y = 25;
  const result = product.rStrategyResult;
  const primary = result.primaryRecommendation;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(product.name, margin, y);
  y += 10;

  // Framework badge
  const rColor = [5, 150, 105]; // emerald
  doc.setFillColor(rColor[0], rColor[1], rColor[2]);
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  const badgeW = doc.getTextWidth("R-Strategy Scorecard") + 8;
  doc.roundedRect(margin, y - 4, badgeW, 6, 1, 1, "F");
  doc.text("R-Strategy Scorecard", margin + 4, y);
  y += 10;

  // Primary recommendation
  const primaryColor = RSTRATEGY_PDF_COLORS[primary];
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`Primary: ${primary}`, margin, y);
  y += 8;

  // Strategy badge
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  const tw = doc.getTextWidth(primary) + 8;
  doc.roundedRect(margin, y - 4, tw, 7, 1, 1, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(primary, margin + 4, y + 1);
  y += 12;

  // Scores
  const primaryScore = result.scores.find(s => s.strategy === primary);
  if (primaryScore) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(
      `Suitability: ${primaryScore.suitabilityScore.toFixed(0)}% | Practicality: ${primaryScore.practicalityScore.toFixed(0)}% | Overall: ${primaryScore.overallScore.toFixed(0)}%`,
      margin,
      y
    );
    y += 10;
  }

  // Description
  const desc = RSTRATEGY_DESCRIPTIONS[primary];
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Description", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  const descLines = doc.splitTextToSize(desc.fullDescription, contentWidth);
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
  for (const ex of desc.examples) {
    const lines = doc.splitTextToSize(`• ${ex}`, contentWidth - 10);
    doc.text(lines, margin + 5, y);
    y += lines.length * 5 + 2;
  }
  y += 5;

  // When to use
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("When to Use This Strategy", margin, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  for (const item of desc.whenToUse) {
    const lines = doc.splitTextToSize(`→ ${item}`, contentWidth - 10);
    doc.text(lines, margin + 5, y);
    y += lines.length * 5 + 2;
  }
  y += 8;

  // Secondary recommendations
  if (result.secondaryRecommendations.length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Also Consider", margin, y);
    y += 6;

    doc.setFontSize(9);
    for (const strategy of result.secondaryRecommendations) {
      const color = RSTRATEGY_PDF_COLORS[strategy];
      doc.setFillColor(color[0], color[1], color[2]);
      const sw = doc.getTextWidth(strategy) + 6;
      doc.roundedRect(margin + 5, y - 3, sw, 6, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.text(strategy, margin + 8, y + 1);
      y += 8;
    }
  }

  // Criterion scores
  if (y < 240) {
    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Assessment Scores by Criterion", margin, y);
    y += 8;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    for (const criterionScore of result.criterionScores) {
      const score = criterionScore.scores[primary];
      const barWidth = (score / 100) * 80;
      
      doc.setTextColor(60, 60, 60);
      doc.text(criterionScore.criterionName, margin + 5, y);
      doc.text(`${score.toFixed(0)}%`, margin + 85, y);
      
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(margin + 95, y - 3, barWidth, 4, "F");
      
      y += 6;
    }
  }
}
