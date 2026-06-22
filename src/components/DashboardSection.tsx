"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TARGET_STARS, TargetStar, LightCurvePoint 
} from "@/data/stars";
import { 
  ResponsiveContainer, ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ReferenceLine
} from "recharts";
import { 
  Target, Activity, TrendingDown, Star, AlertTriangle, CheckCircle, Shield, Info, Layers, Download, Play, Upload, RefreshCw, Terminal 
} from "lucide-react";

import { generateScientificReport } from "@/utils/pdfGenerator";

interface DashboardSectionProps {
  selectedStar: TargetStar;
  setSelectedStar: (star: TargetStar) => void;
}

export default function DashboardSection({ selectedStar, setSelectedStar }: DashboardSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [chartTab, setChartTab] = useState<"lightcurve" | "phasefold">("lightcurve");
  const [catalog, setCatalog] = useState<TargetStar[]>(TARGET_STARS);

  // Analysis pipeline simulation states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Zoom / Viewport controls
  const [zoomRange, setZoomRange] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll terminal logs to bottom
  useEffect(() => {
    if (isAnalyzing && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [analysisLogs, isAnalyzing]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planet Candidate":
        return "bg-success-green/20 text-success-green border-success-green/30";
      case "Eclipsing Binary":
        return "bg-primary-blue/20 text-primary-blue border-primary-blue/30";
      case "Blend":
        return "bg-warning-orange/20 text-warning-orange border-warning-orange/30";
      case "Starspot":
        return "bg-purple-accent/20 text-purple-accent border-purple-accent/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-success-green";
      case "Medium":
        return "text-warning-orange";
      case "High":
        return "text-rose-500";
      default:
        return "text-gray-400";
    }
  };

  // 1. Zoom Slider Data Filter
  const startIndex = Math.floor((zoomRange[0] / 100) * selectedStar.lightCurve.length);
  const endIndex = Math.floor((zoomRange[1] / 100) * selectedStar.lightCurve.length);
  const visibleLightCurve = selectedStar.lightCurve.slice(startIndex, Math.max(startIndex + 10, endIndex));

  // Find transit region range for ReferenceArea in visible light curve
  const transitPoints = visibleLightCurve.filter(p => p.isTransit);
  let transitStart = 0;
  let transitEnd = 0;
  if (transitPoints.length > 0) {
    transitStart = transitPoints[0].time;
    transitEnd = transitPoints[transitPoints.length - 1].time;
  }

  // 2. Sequential Analysis Pipeline Simulation
  const handleAnalyzeTarget = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisStep(1);
    setAnalysisLogs([
      `[INFO] Ingesting target parameters for ${selectedStar.id}...`,
      `[INFO] Loading ${selectedStar.lightCurve.length} raw photometry coordinates...`,
    ]);

    const stepLogs = [
      // Step 1: Detrending
      [
        `[PROCESS] Running systematic noise detrending...`,
        `[SYS] Applying Savitzky-Golay filters (window=101)...`,
        `[SYS] Removed 4 spacecraft momentum thermal glitches.`,
        `[SUCCESS] Detrending complete. Baseline stellar flux flattened.`
      ],
      // Step 2: Periodic Dip Detection
      [
        `[PROCESS] Scanning search grid via Transit Least Squares (TLS)...`,
        `[TLS] Iterating period ranges from 0.5 to 30.0 days...`,
        `[TLS] Prominent peak power found at ${selectedStar.period > 0 ? selectedStar.period : "2.45"} days.`,
        `[SUCCESS] Periodic transit parameters locked.`
      ],
      // Step 3: Astrophysical Vetting
      [
        `[PROCESS] Initiating astrophysical diagnostic tests...`,
        `[VET] Comparing odd/even transit depth ratios...`,
        `[VET] Calculating differences centroid pixel coordinates...`,
        `[SUCCESS] Centroid shift = ${selectedStar.status === "Blend" ? "1.42" : "0.04"} arcseconds.`
      ],
      // Step 4: AI Classification
      [
        `[PROCESS] Feeding inputs to CNN-Transformer neural classifier...`,
        `[AI] Ingesting 1D local and global flux views...`,
        `[AI] Softmax outputs: Candidate=${selectedStar.status === "Planet Candidate" ? "91.4%" : "1%"}, EB=${selectedStar.status === "Eclipsing Binary" ? "98.2%" : "2%"}`,
        `[SUCCESS] Classification inference complete: ${selectedStar.status}.`
      ],
      // Step 5: Parameter Estimation
      [
        `[PROCESS] Fitting orbital models via analytical Batman package...`,
        `[FIT] Computing Rp/Rs (ratio of radii) = ${(selectedStar.depth / 1e6).toFixed(5)}`,
        `[FIT] Fitting semi-major axis (a/Rs) & inclination angle...`,
        `[SUCCESS] Parameters successfully fitted to Keplerian model.`
      ],
      // Step 6: Confidence Scoring
      [
        `[PROCESS] Computing unified Bayesian confidence scores...`,
        `[SCORE] Compiling SNR (${selectedStar.snr}) and false alarm statistics...`,
        `[SCORE] Target classification confidence: ${selectedStar.confidence}%`,
        `[SUCCESS] Pipeline summary reports generated. Outputting values.`
      ]
    ];

    let currentStep = 1;
    const interval = setInterval(() => {
      if (currentStep <= 6) {
        setAnalysisStep(currentStep);
        const logs = stepLogs[currentStep - 1];
        if (logs) {
          setAnalysisLogs(prev => [...prev, ...logs]);
        }
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisStep(0);
          // Trigger report generation automatically after analysis!
          generateScientificReport(selectedStar);
        }, 1200);
      }
    }, 1500);
  };

  // 3. CSV File Uploader
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      
      const parsedLightCurve: LightCurvePoint[] = [];
      const parsedFoldedCurve: LightCurvePoint[] = [];
      
      // Parse CSV rows, expecting time,flux format
      let rowCount = 0;
      for (let i = 0; i < lines.length; i++) {
        if (i === 0 && (lines[i].includes("time") || lines[i].includes("flux"))) {
          continue; // skip header
        }
        
        const cols = lines[i].split(",").map(Number);
        if (cols.length >= 2 && !isNaN(cols[0]) && !isNaN(cols[1])) {
          rowCount++;
          const time = cols[0];
          const rawFlux = cols[1];
          // Simple detrending mock
          const cleanedFlux = rawFlux;
          const isTransit = rawFlux < 0.999; // simple dip indicator
          parsedLightCurve.push({ time, rawFlux, cleanedFlux, isTransit });
        }
      }

      if (rowCount === 0) {
        alert("Invalid CSV format. Please upload columns of (time, flux) values.");
        return;
      }

      // Sort light curve by time
      parsedLightCurve.sort((a, b) => a.time - b.time);

      // Generate mock folded curve
      for (let i = 0; i < Math.min(100, parsedLightCurve.length); i++) {
        const timeVal = parsedLightCurve[i].time;
        const phase = (timeVal % 3.0) / 3.0 - 0.5; // dummy period 3.0
        parsedFoldedCurve.push({
          time: parseFloat(phase.toFixed(4)),
          rawFlux: parsedLightCurve[i].rawFlux,
          cleanedFlux: parsedLightCurve[i].cleanedFlux,
          isTransit: parsedLightCurve[i].isTransit
        });
      }
      parsedFoldedCurve.sort((a, b) => a.time - b.time);

      const newStarId = `TIC-USR-${Math.floor(10000 + Math.random() * 90000)}`;
      const customStar: TargetStar = {
        id: newStarId,
        name: file.name.replace(".csv", ""),
        status: "Planet Candidate",
        confidence: 88.7,
        falsePositiveRisk: "Low",
        period: 3.12,
        duration: 2.15,
        depth: 980,
        snr: 9.4,
        metallicity: 0.05,
        stellarRadius: 0.88,
        stellarMass: 0.92,
        temp: 5420,
        notes: `Custom user-uploaded dataset parsed from '${file.name}' containing ${rowCount} entries. Auto-detrending pipeline has isolated periodic transits.`,
        explanation: "Neural network identified transit signature from the uploaded photometry file. Standard odd/even vetting parameters indicate low secondary eclipse compatibility.",
        xaiHeatmap: "High attention weights are aligned around the user-uploaded dip segments, indicating a high-confidence planetary transit candidate.",
        lightCurve: parsedLightCurve,
        foldedCurve: parsedFoldedCurve,
        reasons: [
          "Uploaded file successfully ingested and detrended.",
          "Periodic brightness dip detected at 3.12 days.",
          "Symmetric transit shape aligned with Keplerian physical parameters.",
          "No significant secondary eclipse detected in phase folding."
        ],
        contributions: [
          { name: "Periodicity", value: 40 },
          { name: "Transit Shape", value: 30 },
          { name: "Depth Stability", value: 20 },
          { name: "Low Contamination", value: 10 }
        ]
      };

      setCatalog(prev => [customStar, ...prev]);
      setSelectedStar(customStar);
      
      // Auto analyze after upload
      setTimeout(() => {
        handleAnalyzeTarget();
      }, 500);
    };

    reader.readAsText(file);
  };

  // 4. In-Browser Data Exporters
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Time,RawFlux,CleanedFlux,IsTransit\n";
    selectedStar.lightCurve.forEach(p => {
      csvContent += `${p.time},${p.rawFlux},${p.cleanedFlux},${p.isTransit}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedStar.id}_lightcurve_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportReport = () => {
    generateScientificReport(selectedStar);
  };

  const handleExportSnapshot = () => {
    // Generate a simple mock SVG vector graphic certificate of exoplanet discovery
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450" style="background:#050816; font-family:sans-serif; color:white;">
      <!-- Background space grid -->
      <rect width="800" height="450" fill="#050816"/>
      <circle cx="400" cy="225" r="300" fill="none" stroke="rgba(37, 99, 235, 0.15)" stroke-width="1"/>
      <circle cx="400" cy="225" r="200" fill="none" stroke="rgba(6, 182, 212, 0.15)" stroke-dasharray="5 5" stroke-width="1"/>
      
      <!-- Frame border -->
      <rect x="20" y="20" width="760" height="410" fill="none" stroke="rgba(6, 182, 212, 0.3)" stroke-width="2" rx="10"/>
      <line x1="20" y1="80" x2="780" y2="80" stroke="rgba(6, 182, 212, 0.2)" stroke-width="1"/>
      
      <!-- Headers -->
      <text x="50" y="55" fill="#06B6D4" font-size="20" font-weight="bold" letter-spacing="2">EXONET DIAGNOSTIC SNAPSHOT</text>
      <text x="750" y="52" fill="#888" font-size="10" text-anchor="end" font-family="monospace">DATE: 2026.06.22 SENSOR: TESS</text>
      
      <!-- Content Details -->
      <text x="50" y="130" fill="#fff" font-size="28" font-weight="bold">${selectedStar.id}</text>
      <text x="50" y="160" fill="#888" font-size="14">${selectedStar.name} | ${selectedStar.status}</text>
      
      <!-- Parameters table -->
      <text x="50" y="220" fill="#2563EB" font-size="12" font-family="monospace" font-weight="bold">ORBITAL METRICS:</text>
      <text x="50" y="250" fill="#fff" font-size="14">Period: ${selectedStar.period} Days</text>
      <text x="50" y="280" fill="#fff" font-size="14">Duration: ${selectedStar.duration} Hours</text>
      <text x="50" y="310" fill="#fff" font-size="14">Transit Depth: ${selectedStar.depth} ppm</text>
      <text x="50" y="340" fill="#fff" font-size="14">SNR Ratio: ${selectedStar.snr}</text>

      <!-- Prediction meter -->
      <rect x="450" y="130" width="300" height="150" fill="#0B1026" stroke="rgba(37,99,235,0.3)" rx="8"/>
      <text x="470" y="165" fill="#888" font-size="12" font-family="monospace">CLASSIFICATION INTEGRITY</text>
      <text x="470" y="210" fill="#22C55E" font-size="36" font-weight="bold">${selectedStar.confidence}%</text>
      <text x="470" y="250" fill="#888" font-size="11">False Positive Risk: ${selectedStar.falsePositiveRisk}</text>

      <!-- Footer credits -->
      <text x="400" y="405" fill="rgba(255,255,255,0.3)" font-size="10" text-anchor="middle" font-family="monospace">EXONET DEEP LEARNING VETTING ARCHIVE</text>
    </svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedStar.id}_diagnostic_snapshot.svg`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as LightCurvePoint;
      return (
        <div className="bg-[#0B1026] border border-white/10 p-3 rounded-lg text-xs font-mono">
          <p className="text-gray-400">Time/Phase: <span className="text-white">{data.time}</span></p>
          <p className="text-gray-400">Raw Flux: <span className="text-gray-300">{data.rawFlux.toFixed(6)}</span></p>
          <p className="text-gray-400 font-bold text-cyan-accent">Cleaned: <span>{data.cleanedFlux.toFixed(6)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="dashboard" className="relative py-20 px-6 border-t border-white/5 bg-[#050816] grid-bg">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-sm font-mono text-cyan-accent tracking-widest uppercase mb-3">Interactive Workspace</h2>
            <h3 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
              ExoNet Astronomer Console
            </h3>
          </div>
          <div className="flex gap-3 text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Telemetry Stream
            </span>
          </div>
        </div>

        {/* Console Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">

          {/* PIPELINE ANALYSIS LOADING OVERLAY */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#050816]/90 backdrop-blur-md z-40 rounded-3xl border border-primary-blue/30 flex flex-col items-center justify-center p-6"
              >
                <div className="max-w-xl w-full space-y-6 text-center">
                  <div className="flex justify-center">
                    <RefreshCw className="w-12 h-12 text-cyan-accent animate-spin" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-lg font-mono font-bold text-white">VETTING PROCESS RUNNING</h4>
                    <p className="text-xs text-gray-500 font-mono">Executing pipeline grid analysis (Phase {analysisStep}/6)</p>
                  </div>

                  {/* Horizontal progress bar */}
                  <div className="h-2 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-blue to-cyan-accent transition-all duration-300"
                      style={{ width: `${(analysisStep / 6) * 100}%` }}
                    />
                  </div>

                  {/* Scientific Log Terminal Screen */}
                  <div className="bg-black/60 rounded-xl border border-white/10 p-4 font-mono text-[11px] text-emerald-400 text-left h-44 overflow-y-auto space-y-1 select-none">
                    <div className="text-[10px] text-gray-500 flex items-center gap-1 mb-2">
                      <Terminal className="w-3 h-3" />
                      <span>EXONET DETECTOR CONSOLE LOGS</span>
                    </div>
                    {analysisLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* 1. LEFT SIDEBAR: Target Stars Catalog & Custom Uploads (3 cols) */}
          <div className="lg:col-span-3 space-y-4 flex flex-col h-full">
            
            {/* Target Catalog Header */}
            <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-accent flex items-center gap-2">
                <Target className="w-4 h-4" />
                Target Catalog
              </span>
              <span className="text-xs text-gray-500 font-mono">({catalog.length} loaded)</span>
            </div>

            {/* Ingest custom CSV files */}
            <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Ingest Custom Data</span>
              <label className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-cyan-accent/30 py-3 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-cyan-accent" />
                Upload TESS CSV
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleCSVUpload}
                  className="hidden" 
                />
              </label>
            </div>

            {/* Target List */}
            <div className="flex-1 space-y-2 lg:overflow-y-auto max-h-[380px] pr-1">
              {catalog.map((star) => {
                const isSelected = selectedStar.id === star.id;
                return (
                  <button
                    key={star.id}
                    onClick={() => setSelectedStar(star)}
                    className={`w-full p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                      isSelected 
                        ? "bg-primary-blue/20 border-primary-blue/80 shadow-[0_0_20px_rgba(37,99,235,0.15)]" 
                        : "glass-panel border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-sm font-bold text-white group-hover:text-cyan-accent transition-colors">
                        {star.id}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${getStatusColor(star.status)}`}>
                        {star.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{star.name}</span>
                      <span className="font-mono text-cyan-accent">{star.confidence.toFixed(1)}% conf.</span>
                    </div>

                    {/* Miniature active indicator */}
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-accent" />
                    )}
                  </button>
                );
              })}
            </div>
            
             {/* Analyze Trigger */}
            <button
              onClick={handleAnalyzeTarget}
              disabled={isAnalyzing}
              className={`w-full py-3.5 bg-gradient-to-r from-primary-blue to-cyan-accent text-white font-bold rounded-xl text-xs font-mono shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group shrink-0 ${
                isAnalyzing ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:-translate-y-0.5"
              }`}
            >
              <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              ANALYZE TARGET
            </button>
          </div>

          {/* 2. CENTER PANEL: Interactive Charts & Time Viewport Zoom (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Chart Container */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col h-[520px]">
              
              {/* Tab Selector & Controls */}
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartTab("lightcurve")}
                    className={`px-4 py-2 rounded-lg font-mono text-xs cursor-pointer transition-all ${
                      chartTab === "lightcurve" 
                        ? "bg-primary-blue text-white shadow-md font-bold" 
                        : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    Raw & Cleaned Signal
                  </button>
                  <button
                    onClick={() => setChartTab("phasefold")}
                    className={`px-4 py-2 rounded-lg font-mono text-xs cursor-pointer transition-all ${
                      chartTab === "phasefold" 
                        ? "bg-primary-blue text-white shadow-md font-bold" 
                        : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    Phase Folded Transit
                  </button>
                </div>
                
                {/* Active Star display */}
                <div className="text-right">
                  <span className="text-xs font-mono text-gray-500">ANALYZING</span>
                  <p className="text-sm font-mono font-bold text-cyan-accent">{selectedStar.id}</p>
                </div>
              </div>

              {/* Chart Plot Area */}
              <div className="flex-1 min-h-0 w-full relative">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="95%">
                    <ComposedChart
                      data={chartTab === "lightcurve" ? visibleLightCurve : selectedStar.foldedCurve}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        dataKey="time" 
                        type="number"
                        domain={chartTab === "lightcurve" ? ['dataMin', 'dataMax'] : [-0.2, 0.6]}
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
                        label={{ value: chartTab === "lightcurve" ? 'Time (Days)' : 'Orbital Phase', position: 'insideBottom', fill: 'rgba(255,255,255,0.4)', fontSize: 10, offset: -5 }}
                      />
                      <YAxis 
                        dataKey="rawFlux"
                        type="number"
                        domain={[
                          (dataMin: number) => dataMin - 0.0005,
                          (dataMax: number) => dataMax + 0.0005
                        ]}
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
                        label={{ value: 'Normalized Flux', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.4)', fontSize: 10, offset: 10 }}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(6, 182, 212, 0.3)' }} />
                      
                      {/* Highlight Transit Area for Lightcurve tab */}
                      {chartTab === "lightcurve" && transitStart !== 0 && (
                        <ReferenceArea 
                          x1={transitStart} 
                          x2={transitEnd} 
                          fill="rgba(6, 182, 212, 0.08)" 
                          stroke="rgba(6, 182, 212, 0.2)"
                          strokeDasharray="3 3"
                        />
                      )}

                      {/* Reference line for transit center */}
                      {chartTab === "lightcurve" && transitStart !== 0 && (
                        <ReferenceLine x={(transitStart + transitEnd) / 2} stroke="rgba(6, 182, 212, 0.4)" strokeDasharray="3 3" />
                      )}

                      {/* Folded curves helper center */}
                      {chartTab === "phasefold" && (
                        <ReferenceLine x={0} stroke="rgba(37, 99, 235, 0.4)" strokeDasharray="3 3" />
                      )}

                      {/* Raw Scatter Data Points */}
                      <Scatter 
                        name="Raw Data" 
                        dataKey="rawFlux" 
                        line={false}
                        shape={(props: any) => {
                          const { cx, cy } = props;
                          return <circle cx={cx} cy={cy} r={1.5} fill="rgba(255,255,255,0.3)" />;
                        }}
                      />

                      {/* Cleaned Detrended Data (Line Plot) */}
                      <Line 
                        type="monotone" 
                        dataKey="cleanedFlux" 
                        stroke="#06B6D4" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                        name="Cleaned Signal"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-mono text-gray-500">
                    Initializing Plot Engine...
                  </div>
                )}
              </div>

              {/* Viewport zoom slider */}
              {chartTab === "lightcurve" && (
                <div className="mt-4 px-2 space-y-1 font-mono text-[10px] text-gray-400 shrink-0">
                  <div className="flex justify-between text-gray-500">
                    <span>TIME VIEWPORT ZOOM FILTER: {zoomRange[0]}% - {zoomRange[1]}%</span>
                    <button 
                      onClick={() => setZoomRange([0, 100])}
                      className="text-cyan-accent hover:text-white transition-colors cursor-pointer"
                    >
                      Reset Zoom
                    </button>
                  </div>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="range"
                      min="0"
                      max="90"
                      value={zoomRange[0]}
                      onChange={(e) => setZoomRange([Number(e.target.value), Math.max(Number(e.target.value) + 10, zoomRange[1])])}
                      className="w-1/2 accent-cyan-accent bg-white/5 rounded"
                    />
                    <input 
                      type="range"
                      min="10"
                      max="100"
                      value={zoomRange[1]}
                      onChange={(e) => setZoomRange([Math.min(zoomRange[0], Number(e.target.value) - 10), Number(e.target.value)])}
                      className="w-1/2 accent-cyan-accent bg-white/5 rounded"
                    />
                  </div>
                </div>
              )}

              {/* Chart Legend Summary */}
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 shrink-0 mt-4 border-t border-white/5 pt-3">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    Raw TESS Flux Points
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-cyan-accent inline-block" />
                    Detrended (ExoNet Cleaned)
                  </span>
                </div>
                {chartTab === "lightcurve" && transitStart !== 0 && (
                  <span className="text-cyan-accent bg-cyan-accent/10 px-2 py-0.5 rounded border border-cyan-accent/20">
                    Detected Transit Window
                  </span>
                )}
              </div>

            </div>

            {/* Scientific Diagnostics & Exporters */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1 flex-1">
                <h4 className="text-xs font-mono text-cyan-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  Exporter Utilities
                </h4>
                <p className="text-[11px] text-gray-400 font-sans">
                  Export target parameters and raw light curve vectors for offline astronomical modeling.
                </p>
              </div>
              
              {/* Exporters button group */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleExportCSV}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-mono cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>
                <button
                  onClick={handleExportReport}
                  title="Generate Scientific Report"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-mono cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Sci Report
                </button>
                <button
                  onClick={handleExportSnapshot}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-mono cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Snapshot
                </button>
              </div>
            </div>

          </div>

          {/* 3. RIGHT PANEL: AI Predict, Explanations & Feature Contributions (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* AI PREDICTION CARD */}
            <div className="glass-panel p-5 rounded-xl border border-primary-blue/30 relative overflow-hidden scanline bg-gradient-to-b from-space-card to-space-card/80">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-blue/10 rounded-full blur-2xl pointer-events-none" />
              
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-accent" />
                AI Inference Result
              </h4>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-gray-400 block font-sans">Classification</span>
                  <span className="text-lg font-bold font-display text-white">{selectedStar.status === "Starspot" ? "Stellar Rotation (Noise)" : selectedStar.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-400 block font-sans">Confidence</span>
                    <span className="text-xl font-bold font-mono text-cyan-accent">
                      {selectedStar.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-sans">FP Risk</span>
                    <span className={`text-xl font-bold font-mono ${getRiskColor(selectedStar.falsePositiveRisk)}`}>
                      {selectedStar.falsePositiveRisk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 my-4" />

              {/* Vetting Telemetry */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Period:</span>
                  <span className="text-white">{selectedStar.period > 0 ? `${selectedStar.period} Days` : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="text-white">{selectedStar.duration > 0 ? `${selectedStar.duration} Hours` : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transit Depth:</span>
                  <span className="text-white">{selectedStar.depth > 0 ? `${selectedStar.depth} ppm` : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Signal SNR:</span>
                  <span className="text-cyan-accent font-bold">{selectedStar.snr}</span>
                </div>
              </div>
            </div>

            {/* WHY DID AI CHOOSE THIS? */}
            <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-3">
              <h4 className="text-xs font-mono text-cyan-accent uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Why did AI choose this?
              </h4>
              <ul className="space-y-2 text-[11px] text-gray-300 font-sans">
                {selectedStar.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-1.5">
                    <span className="text-cyan-accent select-none mt-0.5">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FEATURE CONTRIBUTION GRAPH */}
            <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-4">
              <h4 className="text-xs font-mono text-cyan-accent uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Feature Importance
              </h4>
              
              <div className="space-y-3">
                {selectedStar.contributions.map((feature, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-gray-400">
                      <span>{feature.name}</span>
                      <span className="text-cyan-accent font-bold">+{feature.value}%</span>
                    </div>
                    {/* Animated horizontal bar */}
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${feature.value}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="h-full bg-cyan-accent glow-cyan rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
