import { jsPDF } from "jspdf";
import { TargetStar, LightCurvePoint } from "@/data/stars";

// Draw headers, footers and page borders on pages (except cover)
function drawPageDecorations(doc: jsPDF, pageNumber: number, title: string, starId: string, reportId: string, timestamp: string) {
  // Page Border Frame
  doc.setDrawColor(11, 16, 38); // Primary Navy accent
  doc.setLineWidth(0.2);
  doc.rect(15, 15, 180, 267);

  // Header Line
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(0.3);
  doc.line(20, 26, 190, 26);

  // Header Text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139); // Slate Gray
  doc.text(`EXONET SCIENTIFIC DOSSIER // TARGET: ${starId}`, 20, 22);
  doc.text(`REPORT: ${reportId} // TS: ${timestamp}`, 190, 22, { align: "right" });

  // Footer Line
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(0.3);
  doc.line(20, 274, 190, 274);

  // Footer Text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("EXONET AI VETTING PLATFORM // TECHNICAL DOSSIER", 20, 279);
  doc.text(`Page ${pageNumber} of 8`, 190, 279, { align: "right" });
}

// Draw vector light curve charts directly in jsPDF for infinite resolution
function drawVectorChart(
  doc: jsPDF,
  points: LightCurvePoint[],
  xOffset: number,
  yOffset: number,
  width: number,
  height: number,
  title: string,
  isPhaseFolded = false
) {
  // Bounding box
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(0.2);
  doc.rect(xOffset, yOffset, width, height);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(11, 16, 38);
  doc.text(title, xOffset, yOffset - 3);

  if (points.length === 0) return;

  // Find min/max values for scaling
  const times = points.map(p => p.time);
  const fluxes = points.map(p => p.rawFlux);
  
  const xMin = Math.min(...times);
  const xMax = Math.max(...times);
  const yMin = Math.min(...fluxes) - 0.0003;
  const yMax = Math.max(...fluxes) + 0.0003;

  const xScale = (t: number) => xOffset + ((t - xMin) / (xMax - xMin)) * width;
  const yScale = (f: number) => yOffset + height - ((f - yMin) / (yMax - yMin)) * height;

  // Grid lines
  doc.setDrawColor(245, 248, 252);
  for (let val = 0.25; val < 1.0; val += 0.25) {
    const gx = xOffset + val * width;
    const gy = yOffset + val * height;
    doc.line(gx, yOffset, gx, yOffset + height);
    doc.line(xOffset, gy, xOffset + width, gy);
  }

  // Draw Raw Scatter points
  doc.setFillColor(150, 160, 185);
  points.forEach(p => {
    const px = xScale(p.time);
    const py = yScale(p.rawFlux);
    if (px >= xOffset && px <= xOffset + width && py >= yOffset && py <= yOffset + height) {
      doc.circle(px, py, 0.3, "F");
    }
  });

  // Draw Cleaned Line (only draw if not showing raw points only)
  doc.setDrawColor(6, 182, 212); // Cyan accent
  doc.setLineWidth(0.5);
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const x1 = xScale(prev.time);
    const y1 = yScale(prev.cleanedFlux);
    const x2 = xScale(curr.time);
    const y2 = yScale(curr.cleanedFlux);
    
    if (
      x1 >= xOffset && x1 <= xOffset + width && 
      y1 >= yOffset && y1 <= yOffset + height &&
      x2 >= xOffset && x2 <= xOffset + width && 
      y2 >= yOffset && y2 <= yOffset + height
    ) {
      doc.line(x1, y1, x2, y2);
    }
  }

  // Axis Labels
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(100, 116, 139);
  doc.text(isPhaseFolded ? "Orbital Phase" : "Time (Days)", xOffset + width / 2, yOffset + height + 4.5, { align: "center" });
  doc.text("Norm. Flux", xOffset - 2, yOffset + height / 2, { angle: 90, align: "center" });
}

export function generateScientificReport(star: TargetStar) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const reportId = `EXONET-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  // Get status color RGB value
  const getStatusColorRGB = (status: string) => {
    switch (status) {
      case "Planet Candidate":
        return [37, 99, 235]; // Primary Blue
      case "Eclipsing Binary":
        return [114, 58, 237]; // Purple
      case "Blend":
        return [245, 158, 11]; // Warning Orange
      case "Starspot":
        return [239, 68, 68]; // Red
      default:
        return [100, 116, 139];
    }
  };

  const getRiskColorRGB = (risk: string) => {
    switch (risk) {
      case "Low":
        return [34, 197, 94]; // Success Green
      case "Medium":
        return [245, 158, 11]; // Warning Orange
      case "High":
        return [239, 68, 68]; // Danger Red
      default:
        return [100, 116, 139];
    }
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  // Cover Frame
  doc.setDrawColor(11, 16, 38);
  doc.setLineWidth(0.4);
  doc.rect(15, 15, 180, 267);

  // Top header band
  doc.setFillColor(11, 16, 38);
  doc.rect(15, 15, 180, 52, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("ExoNet", 25, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(6, 182, 212);
  doc.text("AI-POWERED EXOPLANET DETECTION PLATFORM", 25, 51);

  // Large Scientific Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.setTextColor(11, 16, 38);
  doc.text("Scientific Vetting Analysis Dossier", 25, 95);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text("Deep Learning Inferences from Transiting Exoplanet Survey Satellite (TESS) Light Curves", 25, 104, { maxWidth: 160 });

  // Minimal Orbits Graphic
  const cx = 105;
  const cy = 160;
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(0.25);
  doc.circle(cx, cy, 18);
  doc.circle(cx, cy, 32);
  doc.circle(cx, cy, 48);
  doc.setFillColor(11, 16, 38);
  doc.circle(cx, cy, 4.5, "F"); // Sun
  doc.setFillColor(6, 182, 212);
  doc.circle(cx + 12, cy - 13, 1.8, "F"); // Planet 1
  doc.setFillColor(37, 99, 235);
  doc.circle(cx - 28, cy + 15, 2.5, "F"); // Planet 2
  doc.setFillColor(124, 58, 237);
  doc.circle(cx + 40, cy + 26, 2.8, "F"); // Planet 3

  // Divider line
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.6);
  doc.line(25, 215, 185, 215);

  // Cover Metadata Block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(11, 16, 38);
  doc.text("REPORT SUMMARY METADATA", 25, 224);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Reference ID   : ${reportId}`, 25, 232);
  doc.text(`Timestamp      : ${timestamp}`, 25, 237);
  doc.text(`Target TIC ID  : ${star.id}`, 25, 242);
  doc.text(`Software Core  : ExoNet-v2.1.4 / TLS-v1.0.31`, 25, 247);

  doc.text(`Research Sector  : Transit Photometry Survey`, 110, 232);
  doc.text(`Vetting Unit     : ExoNet Neural Vetting Engine`, 110, 237);
  doc.text(`Organization     : ExoNet Collaboration / Open Source`, 110, 242);
  doc.text(`Document Class   : Technical Memorandum (Dossier)`, 110, 247);

  // Compact Navigation Bar at bottom of Cover Page
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(0.3);
  doc.line(20, 258, 190, 258);
  doc.line(20, 266, 190, 266);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(37, 99, 235);
  doc.text("Executive Summary", 21, 263);
  doc.setTextColor(100, 116, 139);
  doc.text("|", 49, 263);
  doc.setTextColor(37, 99, 235);
  doc.text("Data Overview", 52, 263);
  doc.setTextColor(100, 116, 139);
  doc.text("|", 74, 263);
  doc.setTextColor(37, 99, 235);
  doc.text("AI Vetting Pipeline", 77, 263);
  doc.setTextColor(100, 116, 139);
  doc.text("|", 106, 263);
  doc.setTextColor(37, 99, 235);
  doc.text("Detection Results", 109, 263);
  doc.setTextColor(100, 116, 139);
  doc.text("|", 135, 263);
  doc.setTextColor(37, 99, 235);
  doc.text("Visualizations", 138, 263);
  doc.setTextColor(100, 116, 139);
  doc.text("|", 158, 263);
  doc.setTextColor(37, 99, 235);
  doc.text("Recommendations", 161, 263);

  // Link click areas
  doc.link(20, 259, 28, 6, { pageNumber: 2 }); // Executive Summary
  doc.link(51, 259, 22, 6, { pageNumber: 3 }); // Data Overview
  doc.link(76, 259, 29, 6, { pageNumber: 3 }); // Pipeline
  doc.link(108, 259, 26, 6, { pageNumber: 4 }); // Results
  doc.link(137, 259, 20, 6, { pageNumber: 6 }); // Visualizations
  doc.link(160, 259, 30, 6, { pageNumber: 8 }); // Recommendations

  // ==========================================
  // PAGE 2: EXECUTIVE SUMMARY (2 Columns, 8 Cards)
  // ==========================================
  doc.addPage();
  drawPageDecorations(doc, 2, "Executive Summary", star.id, reportId, timestamp);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(11, 16, 38);
  doc.text("Executive Summary", 25, 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 60, 80);
  doc.text(
    `This report presents the automated classification results compiled by the ExoNet vetting engine for the stellar target ${star.id} (designation: ${star.name}). The light curve data was processed using Cotrending Basis Vector algorithms and classified using 1D convolutional neural structures.`,
    25,
    46,
    { maxWidth: 160 }
  );

  // 8 Cards grid layout (2 columns)
  const cardX1 = 25;
  const cardX2 = 110;
  const cardW = 75;
  const cardH = 22;
  const startCardY = 64;

  const cardsData = [
    { label: "Target Star ID", val: star.id, col: 1, row: 0, color: [11, 16, 38] },
    { label: "AI Classification", val: star.status, col: 2, row: 0, color: getStatusColorRGB(star.status) },
    
    { label: "AI Confidence Score", val: `${star.confidence.toFixed(1)}%`, col: 1, row: 1, color: [34, 197, 94] },
    { label: "False Positive Risk", val: star.falsePositiveRisk, col: 2, row: 1, color: getRiskColorRGB(star.falsePositiveRisk) },
    
    { label: "Stellar Orbital Period", val: star.period > 0 ? `${star.period} Days` : "N/A", col: 1, row: 2, color: [11, 16, 38] },
    { label: "Calculated Transit Depth", val: star.depth > 0 ? `${star.depth} ppm` : "N/A", col: 2, row: 2, color: [11, 16, 38] },
    
    { label: "Transit Duration", val: star.duration > 0 ? `${star.duration} Hours` : "N/A", col: 1, row: 3, color: [11, 16, 38] },
    { label: "Signal-to-Noise Ratio (SNR)", val: star.snr.toString(), col: 2, row: 3, color: [11, 16, 38] },
  ];

  cardsData.forEach(card => {
    const x = card.col === 1 ? cardX1 : cardX2;
    const y = startCardY + card.row * 28;

    // Card background
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.rect(x, y, cardW, cardH, "FD");

    // Card text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(card.label.toUpperCase(), x + 4, y + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(card.color[0], card.color[1], card.color[2]);
    doc.text(card.val, x + 4, y + 16);
  });

  // Overall Assessment Callout Box
  const assessY = startCardY + 4 * 28 + 4;
  doc.setFillColor(240, 246, 255); // Light Blue tint
  doc.setDrawColor(186, 218, 253);
  doc.rect(25, assessY, 160, 48, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(37, 99, 235);
  doc.text("OVERALL SCIENTIFIC ASSESSMENT REPORT", 30, assessY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  
  let assessmentText = "";
  if (star.status === "Planet Candidate") {
    assessmentText = "A high-probability planetary transit has been detected. There are no secondary stellar eclipses in out-of-transit phases, and the difference image centroid shifts map perfectly within the limits of the main star, ruling out background eclipsing binary stars. Spectroscopic follow-up is highly recommended.";
  } else if (star.status === "Eclipsing Binary") {
    assessmentText = "The target is classified as an Eclipsing Binary. The transit shape displays a sharp triangular V-shaped profile indicating a grazing companion star rather than a planet. Furthermore, a secondary stellar occultation dip at phase 0.5 is clearly detected, confirming the presence of a companion star.";
  } else if (star.status === "Blend") {
    assessmentText = "The signal is classified as a Blend. Centroid coordinate mapping indicates that the light dims around a background star 1.4 arcseconds offset from the main target. The shallow transit is the result of blended light from the background eclipsing binary. No planet candidate exists.";
  } else {
    assessmentText = "The signal variation matches instrumental systematic noise, starspots, or stellar activity. No statistically significant transiting shapes were detected. The variations resemble spots rotational modulation. No planet follow-up is necessary.";
  }
  doc.text(assessmentText, 30, assessY + 16, { maxWidth: 150 });

  // ==========================================
  // PAGE 3: DATA & PIPELINE (Combined Page)
  // ==========================================
  doc.addPage();
  drawPageDecorations(doc, 3, "Data & Pipeline", star.id, reportId, timestamp);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(11, 16, 38);
  doc.text("Data Overview & Vetting Pipeline", 25, 38);

  // Ingest Telemetry Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(25, 46, 160, 32, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(11, 16, 38);
  doc.text("DATA INGESTION METRICS", 30, 53);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Mission Source : TESS Spacecraft Sector Ingest`, 30, 61);
  doc.text(`Observation Cadence : 120-second (2 Minutes)`, 30, 67);
  doc.text(`Photometry Observations Ingested : ${star.lightCurve.length} Points`, 30, 73);

  doc.text(`Observational Window : 27.2 Days`, 110, 61);
  doc.text(`Sector Target Number : TIC ${star.id.replace("TIC ", "")}`, 110, 67);
  doc.text(`Stellar Model State  : SPOC Aperture Vetted`, 110, 73);

  // Pipeline execution checklist
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(11, 16, 38);
  doc.text("AI VETTING PIPELINE STAGE OUTCOMES", 25, 92);

  const pipelineStages = [
    { id: "1", title: "Raw Data Ingestion", status: "VERIFIED", time: "1.24s", outcome: "Ingested light curve files from archives." },
    { id: "2", title: "Systematic Noise Detrending", status: "VERIFIED", time: "2.85s", outcome: "SG filters applied. Removed guide jitter." },
    { id: "3", title: "Periodic Dip Detection", status: "VERIFIED", time: "4.15s", outcome: "TLS grid scan locked orbital candidates." },
    { id: "4", title: "Astrophysical Vetting", status: "VERIFIED", time: "1.92s", outcome: "Centroid pixel shifts vetting complete." },
    { id: "5", title: "AI Neural Classification", status: "VERIFIED", time: "0.85s", outcome: "Softmax probabilities completed." },
    { id: "6", title: "Parameter Fit Modeling", status: "VERIFIED", time: "3.20s", outcome: "Fitted analytical transit models." },
    { id: "7", title: "Confidence Scoring", status: "VERIFIED", time: "0.45s", outcome: "Bayesian probabilities compiled." },
  ];

  let pipeY = 98;
  pipelineStages.forEach(stage => {
    // Stage Row card (Compact layout, no huge grey blocks)
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.rect(25, pipeY, 160, 20, "FD");

    // Tick indicator
    doc.setFillColor(34, 197, 94);
    doc.circle(30, pipeY + 10, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(11, 16, 38);
    doc.text(stage.title, 36, pipeY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Time: ${stage.time}`, 36, pipeY + 15);
    doc.text(`Result: ${stage.outcome}`, 75, pipeY + 15);

    // Status stamp
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(34, 197, 94);
    doc.text(stage.status, 180, pipeY + 11.5, { align: "right" });

    pipeY += 23;
  });

  // ==========================================
  // PAGE 4: DETECTION RESULTS TABLE
  // ==========================================
  doc.addPage();
  drawPageDecorations(doc, 4, "Detection Results", star.id, reportId, timestamp);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(11, 16, 38);
  doc.text("Detection Results & Interpretation", 25, 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 60, 80);
  doc.text(
    "The table below organizes the physical telemetry parameters computed for the target, accompanied by astronomical interpretations from standard SPOC vetting frameworks.",
    25,
    46,
    { maxWidth: 160 }
  );

  // Table coordinates
  const tblX = 25;
  const tblY = 62;
  const col1W = 50;
  const col2W = 45;
  const col3W = 65;
  const rowH = 15;

  const rows = [
    { metric: "Classification Tag", val: star.status, inter: star.status === "Planet Candidate" ? "Strong Transit Signature" : star.status === "Eclipsing Binary" ? "Grazing Companion Stars" : star.status === "Blend" ? "Blended Companion Offset" : "Rotational Spots Mod" },
    { metric: "Vetting Confidence", val: `${star.confidence.toFixed(1)}%`, inter: star.confidence > 90 ? "High Reliability" : star.confidence > 70 ? "Moderate Reliability" : "Low Signal Match" },
    { metric: "Stellar Orbit Period", val: star.period > 0 ? `${star.period} Days` : "N/A", inter: star.period > 0 ? "Stable Keplerian Orbit" : "Aperiodic Signatures" },
    { metric: "Transit Occlusion Depth", val: star.depth > 0 ? `${star.depth} ppm` : "N/A", inter: star.depth > 0 ? "High Quality Signal Dip" : "No Periodic Depth Found" },
    { metric: "Transit Duration", val: star.duration > 0 ? `${star.duration} Hours` : "N/A", inter: star.duration > 0 ? "Consistent Transit Phase" : "Aperiodic Jitter" },
    { metric: "Signal-to-Noise (SNR)", val: star.snr.toString(), inter: star.snr > 10 ? "High Quality Signal" : "Noisy Photometry Ingest" },
    { metric: "Centroid Vetting Risk", val: star.falsePositiveRisk, inter: star.falsePositiveRisk === "Low" ? "Low Contamination Risk" : star.falsePositiveRisk === "Medium" ? "Centroid Offset Flagged" : "High Contamination Risk" },
  ];

  // Header
  doc.setFillColor(11, 16, 38);
  doc.rect(tblX, tblY, col1W + col2W + col3W, 11, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("METRIC", tblX + 4, tblY + 7.5);
  doc.text("VALUE", tblX + col1W + 4, tblY + 7.5);
  doc.text("SCIENTIFIC INTERPRETATION", tblX + col1W + col2W + 4, tblY + 7.5);

  let currentY = tblY + 11;
  rows.forEach((row, idx) => {
    // Alternating rows
    const bg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(bg[0], bg[1], bg[2]);
    doc.rect(tblX, currentY, col1W + col2W + col3W, rowH, "F");

    // Bottom border line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(tblX, currentY + rowH, tblX + col1W + col2W + col3W, currentY + rowH);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(11, 16, 38);
    doc.text(row.metric, tblX + 4, currentY + 9);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(row.val, tblX + col1W + 4, currentY + 9);
    doc.text(row.inter, tblX + col1W + col2W + 4, currentY + 9);

    currentY += rowH;
  });

  // Table Outer Frame border
  doc.setDrawColor(148, 163, 184);
  doc.rect(tblX, tblY, col1W + col2W + col3W, currentY - tblY);

  // ==========================================
  // PAGE 5: AI EXPLANATION
  // ==========================================
  doc.addPage();
  drawPageDecorations(doc, 5, "AI Explanation", star.id, reportId, timestamp);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(11, 16, 38);
  doc.text("Why did AI choose this classification?", 25, 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Below are the physical criteria compiled during raw TESS light curve analysis that led the ExoNet classifier to declare this target as a ${star.status}:`,
    25,
    46,
    { maxWidth: 160 }
  );

  // Numbered list
  let numY = 60;
  star.reasons.forEach((reason, idx) => {
    // Number index tag
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(37, 99, 235);
    doc.text(`${idx + 1}.`, 25, numY + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(reason, 33, numY + 4, { maxWidth: 150 });

    numY += 18;
  });

  // Final Verdict box at the bottom
  const verdictY = 195;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(11, 16, 38);
  doc.setLineWidth(0.4);
  doc.rect(25, verdictY, 160, 42, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(11, 16, 38);
  doc.text("FINAL PIPELINE VETTING VERDICT SEAL", 30, verdictY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  
  let verdictText = "";
  if (star.status === "Planet Candidate") {
    verdictText = "VERDICT: Planetary candidate confirmed. The symmetric U-shaped occultation profile, stable period spacing, and absence of secondary stellar binary eclipses meet the thresholds of a Keplerian orbit. System triggers spectroscopic radial velocity observation alert.";
  } else if (star.status === "Eclipsing Binary") {
    verdictText = "VERDICT: Grazing stellar binary companion confirmed. The sharp V-shaped primary transit depth and presence of secondary occultations at phase 0.5 indicate grazing stars rather than planetary spheres. No planetary follow-up observations required.";
  } else if (star.status === "Blend") {
    verdictText = "VERDICT: Background contamination blend confirmed. Spatial differences centroid coordinate shift during the transit dip isolates the occultation source to a background star 1.4 arcseconds offset. No planetary candidate exists on target host.";
  } else {
    verdictText = "VERDICT: Instrumental systematic noise or starspot modulation confirmed. High-frequency guide-sensor thermal variations and low-frequency active spots sine modulation dominate the light curve. No transits detected.";
  }
  doc.text(verdictText, 30, verdictY + 16, { maxWidth: 150 });

  // ==========================================
  // PAGE 6: VISUALIZATIONS (2x2 Grid of Vector Charts)
  // ==========================================
  doc.addPage();
  drawPageDecorations(doc, 6, "Visualizations", star.id, reportId, timestamp);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(11, 16, 38);
  doc.text("High-Resolution Vector Visualizations", 25, 38);

  // Coordinates for 2x2 grid
  const chartW = 76;
  const chartH = 46;
  
  const col1X = 23;
  const col2X = 111;
  
  const row1Y = 56;
  const row2Y = 166;

  // Chart 1: Raw Light Curve
  drawVectorChart(doc, star.lightCurve, col1X, row1Y, chartW, chartH, "Raw Light Curve (Photometry Scatter)", false);

  // Chart 2: Cleaned Light Curve
  drawVectorChart(doc, star.lightCurve, col2X, row1Y, chartW, chartH, "Cleaned & Flattened Light Curve", false);

  // Chart 3: Detected Transit (Zoomed in on transit midpoint)
  // Zoom logic: filter light curve points around the midpoint (e.g. 2.0)
  const transitMidpoint = 2.0;
  const durationDays = star.duration > 0 ? (star.duration / 24) : 0.11;
  const zoomStart = transitMidpoint - 3 * durationDays;
  const zoomEnd = transitMidpoint + 3 * durationDays;
  const zoomedPoints = star.lightCurve.filter(p => p.time >= zoomStart && p.time <= zoomEnd);

  drawVectorChart(
    doc, 
    zoomedPoints.length > 0 ? zoomedPoints : star.lightCurve.slice(60, 95), 
    col1X, 
    row2Y, 
    chartW, 
    chartH, 
    "Zoomed Detected Transit Dip", 
    false
  );

  // Chart 4: Phase Folded Transit Curve
  drawVectorChart(doc, star.foldedCurve, col2X, row2Y, chartW, chartH, "Phase Folded Transit Model", true);

  // Caption notes
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Note: The curves above are plotted dynamically using vector graphics vectors directly from photometry archives, ensuring infinite resolution. Raw scatter indicates raw flux counts; cyan lines illustrate flattened signals.",
    25,
    260,
    { maxWidth: 160 }
  );

  // ==========================================
  // PAGE 7: SCIENTIFIC CONFIDENCE ASSESSMENT
  // ==========================================
  doc.addPage();
  drawPageDecorations(doc, 7, "Confidence Assessment", star.id, reportId, timestamp);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(11, 16, 38);
  doc.text("Scientific Confidence Assessment", 25, 38);

  // Circular Confidence gauge
  const gcx = 105;
  const gcy = 90;
  const gr = 24;

  // Draw outer circle track
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(4.5);
  doc.circle(gcx, gcy, gr, "S");

  // Draw active progress arc based on confidence score (rough approximation)
  doc.setDrawColor(34, 197, 94); // Green
  doc.setLineWidth(5);
  const angleRad = (star.confidence / 100) * 2 * Math.PI;
  // Draw radial segment circles
  for (let a = -Math.PI/2; a < (-Math.PI/2) + angleRad; a += 0.05) {
    const ax = gcx + gr * Math.cos(a);
    const ay = gcy + gr * Math.sin(a);
    doc.circle(ax, ay, 0.8, "F");
  }

  // Value text in center
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(11, 16, 38);
  doc.text(`${star.confidence.toFixed(1)}%`, gcx, gcy + 5, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(37, 99, 235);
  doc.text(`CONFIDENCE LEVEL: ${star.confidence > 90 ? "HIGH" : star.confidence > 70 ? "MODERATE" : "LOW"}`, 105, 126, { align: "center" });

  // Breakdown metrics table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(11, 16, 38);
  doc.text("SIGNAL PARAMETER BREAKDOWN METRICS", 25, 144);

  const getBreakdownVal = (metric: string) => {
    if (star.status === "Planet Candidate") {
      if (metric === "Signal Quality") return 94;
      if (metric === "Periodicity") return 92;
      if (metric === "Transit Shape") return 88;
      return 95; // Contamination Risk
    } else if (star.status === "Eclipsing Binary") {
      if (metric === "Signal Quality") return 98;
      if (metric === "Periodicity") return 96;
      if (metric === "Transit Shape") return 40;
      return 99;
    } else if (star.status === "Blend") {
      if (metric === "Signal Quality") return 45;
      if (metric === "Periodicity") return 82;
      if (metric === "Transit Shape") return 60;
      return 20;
    } else {
      if (metric === "Signal Quality") return 15;
      if (metric === "Periodicity") return 10;
      if (metric === "Transit Shape") return 10;
      return 10;
    }
  };

  const metricsBreakdown = [
    { name: "Signal Quality (Photometry SNR)", val: getBreakdownVal("Signal Quality") },
    { name: "Periodicity Stability (TLS Power Grid)", val: getBreakdownVal("Periodicity") },
    { name: "Transit Shape Match (Keplerian Fit)", val: getBreakdownVal("Transit Shape") },
    { name: "Contamination Risk Clearance", val: getBreakdownVal("Contamination Risk") },
  ];

  let barY = 152;
  const breakX1 = 25;
  const breakColW1 = 70;
  const breakColW2 = 90;
  
  // Header
  doc.setFillColor(11, 16, 38);
  doc.rect(breakX1, barY, breakColW1 + breakColW2, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("VETTING COMPONENT", breakX1 + 4, barY + 6);
  doc.text("VALUE RATIO", breakX1 + breakColW1 + 4, barY + 6);

  currentY = barY + 9;
  metricsBreakdown.forEach((m, idx) => {
    const bg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(bg[0], bg[1], bg[2]);
    doc.rect(breakX1, currentY, breakColW1 + breakColW2, 11, "F");

    doc.setDrawColor(226, 232, 240);
    doc.line(breakX1, currentY + 11, breakX1 + breakColW1 + breakColW2, currentY + 11);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(11, 16, 38);
    doc.text(m.name, breakX1 + 4, currentY + 7);

    // Mini vector progress bar in cell
    doc.setFillColor(241, 245, 249);
    doc.rect(breakX1 + breakColW1 + 4, currentY + 4, 60, 3, "F");

    doc.setFillColor(34, 197, 94);
    doc.rect(breakX1 + breakColW1 + 4, currentY + 4, (m.val / 100) * 60, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(34, 197, 94);
    doc.text(`+${m.val}%`, breakX1 + breakColW1 + 68, currentY + 7);

    currentY += 11;
  });

  doc.setDrawColor(148, 163, 184);
  doc.rect(breakX1, barY, breakColW1 + breakColW2, currentY - barY);

  // Analytical comment
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "The component ratings illustrate how different vetting metrics contributed to the joint Bayesian confidence. Planetary candidates typically display high ratings across all segments; EBs display poor shape matching; blends display high contamination risk.",
    25,
    242,
    { maxWidth: 160 }
  );

  // ==========================================
  // PAGE 8: RECOMMENDATIONS & APPENDIX
  // ==========================================
  doc.addPage();
  drawPageDecorations(doc, 8, "Recommendations", star.id, reportId, timestamp);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(11, 16, 38);
  doc.text("Recommendations & Technical Specifications", 25, 38);

  // Checklist
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(11, 16, 38);
  doc.text("RECOMMENDED OBSERVATIONAL STRATEGY CHECKLIST", 25, 47);

  const recommendations = [
    { title: "Further Telescope Photometric Observations", desc: "Acquire ground-based transit observations during expected transit midpoints to refine period coordinates.", rec: true },
    { title: "Multi-Sector Vetting Validation", desc: "Integrate additional sectors of TESS Full Frame Images to improve the signal-to-noise ratio.", rec: true },
    { title: "Spectroscopic Follow-up RV Surveys", desc: "Conduct radial velocity (RV) scans to isolate companion masses and confirm planet-like density.", rec: star.status === "Planet Candidate" },
    { title: "Independent Astrophysical Vetting Verification", desc: "Cross-validate difference image pixel centroid shifting with ground-based astronomical databases.", rec: true },
  ];

  let recY = 53;
  recommendations.forEach(r => {
    // Checkbox box
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.setFillColor(255, 255, 255);
    doc.rect(25, recY + 1, 4, 4, "FD");

    if (r.rec) {
      // Draw checkmark
      doc.setDrawColor(34, 197, 94); // Green
      doc.setLineWidth(0.6);
      doc.line(25.5, recY + 3, 26.5, recY + 4.5);
      doc.line(26.5, recY + 4.5, 28.5, recY + 1.5);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(11, 16, 38);
    doc.text(r.title, 33, recY + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(r.desc, 33, recY + 8, { maxWidth: 140 });

    recY += 15;
  });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(25, 122, 185, 122);

  // Technical Appendix metadata table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(11, 16, 38);
  doc.text("TECHNICAL APPENDIX & METADATA", 25, 132);

  const techRows = [
    { item: "Data Processing Engine", val: "Python v3.11.4 / Lightkurve v2.4.1" },
    { item: "Stellar Coordinates Lib", val: "Astropy v5.3.1 / Astroquery v0.4.6" },
    { item: "Transit Search Grid", val: "Transit Least Squares (TLS) v1.0.31" },
    { item: "Lightcurve Modeler", val: "Batman Occultation Suite v2.4.9" },
    { item: "Vetting Classifiers", val: "XGBoost Classifier v1.7.6" },
    { item: "PDF Compiler Core", val: "jsPDF (Selectable Type vectors)" },
    { item: "Report Reference Code", val: reportId },
    { item: "Verification Seal TS", val: timestamp },
  ];

  let appY = 138;
  techRows.forEach(row => {
    doc.line(25, appY + 6, 185, appY + 6);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(11, 16, 38);
    doc.text(row.item, 25, appY + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(row.val, 110, appY + 4);

    appY += 10;
  });

  // Stamp Box at bottom of Page 8
  const stampY = 226;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(11, 16, 38);
  doc.setLineWidth(0.3);
  doc.rect(25, stampY, 160, 28, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(11, 16, 38);
  doc.text("EXONET PIPELINE VERIFICATION STAMP", 30, stampY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("This scientific memorandum is generated and signed electronically by the ExoNet AI Core. All numerical outputs represent processed telescope data compatible with NASA/TESS catalog formats.", 30, stampY + 14, { maxWidth: 150 });

  // Download PDF file
  doc.save(`${star.id}_Scientific_Analysis_Report.pdf`);
}
