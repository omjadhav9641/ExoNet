"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, Filter, Search, ShieldCheck, Cpu, Activity, Award, LayoutDashboard, ChevronRight, Terminal, Info
} from "lucide-react";

interface PipelineStep {
  id: string;
  title: string;
  short: string;
  icon: any;
  explanation: string;
  details: string[];
  techUsed: string;
  codeSnippet: string;
}

export default function PipelineSection() {
  const steps: PipelineStep[] = [
    {
      id: "tess-data",
      title: "TESS Raw Data Ingestion",
      short: "TESS Data",
      icon: Database,
      explanation: "Ingests targets directly from the Barbara A. Mikulski Archive for Space Telescopes (MAST) containing raw target pixel files (TPFs) and light curves.",
      techUsed: "Lightkurve, Astroquery, WebSockets",
      details: [
        "Inporting FFI (Full Frame Images) and Target Pixel Files.",
        "Aperture photometry calculation to sum pixel counts.",
        "Preserving raw stellar flux before any mathematical filter.",
      ],
      codeSnippet: "import lightkurve as lk\ntpf = lk.search_targetpixelfile('TIC 88863', author='SPOC').download()\nlc = tpf.to_lightcurve(aperture_mask='pipeline')"
    },
    {
      id: "detrending",
      title: "Systematic Noise Detrending",
      short: "Detrending",
      icon: Filter,
      explanation: "Filters stellar rotation, spots, and spacecraft thermal drift while preserving the sharp, narrow planetary transit shapes.",
      techUsed: "Astropy, Savitzky-Golay, Gaussian Processes",
      details: [
        "Removing spacecraft jitter and momentum dump artifacts.",
        "Savitzky-Golay filter to fit and divide stellar variability.",
        "Gaussian Process regression to model stellar activity trends.",
      ],
      codeSnippet: "from astropy.timeseries import BoxLeastSquares\n# Apply flattening to remove long term trend\nflat_lc, trend = lc.flatten(window_length=101, return_trend=True)"
    },
    {
      id: "dip-detection",
      title: "Periodic Dip Detection",
      short: "Dip Detection",
      icon: Search,
      explanation: "Performs transit searches using shape-matched algorithms, scanning for repeating dips in brightness across multiple trial periods.",
      techUsed: "Transit Least Squares (TLS), Box Least Squares (BLS)",
      details: [
        "Scanning over trial periods (0.5 to 30 days).",
        "Matching physical transit shapes (ingress/egress limb darkening).",
        "Isolating transit epoch times and orbital periods.",
      ],
      codeSnippet: "from transitleastsquares import transitleastsquares\nmodel = transitleastsquares(flat_lc.time, flat_lc.flux)\nresults = model.power()"
    },
    {
      id: "vetting",
      title: "Astrophysical Vetting",
      short: "Vetting",
      icon: ShieldCheck,
      explanation: "Filters out false positives like Eclipsing Binaries (EBs) or background stars by analyzing brightness changes and stellar movement.",
      techUsed: "PyTransit, Odd-Even Vetting, Centroid Shift Analysis",
      details: [
        "Centroid motion analysis to verify the source of the dip.",
        "Odd-Even transit depth comparison to flag secondary stellar eclipses.",
        "Stellar density compatibility checks.",
      ],
      codeSnippet: "def vet_centroid_shift(tpf, results):\n    # Measure center of light shift during transit\n    offset = calculate_centroid_offset(tpf, results.transit_times)\n    return offset < 1.0 # True if shift < 1 arcsec"
    },
    {
      id: "ai-classification",
      title: "AI Neural Classification",
      short: "AI Classification",
      icon: Cpu,
      explanation: "Feeds the detrended light curve and extracted features into deep neural networks to compute class probabilities.",
      techUsed: "PyTorch, 1D CNN-LSTM, Attention Transformers",
      details: [
        "Extracting local transit regions and global light curves.",
        "1D Convolutional layers extracting shape features.",
        "Transformer-attention maps for Explainable AI (XAI).",
      ],
      codeSnippet: "import torch\nmodel = ExoNetTransformer()\nprediction = model(local_view, global_view)\n# Class probabilities: Planet, EB, Blend, Noise"
    },
    {
      id: "parameter-estimation",
      title: "Physical Parameter Estimation",
      short: "Parameters",
      icon: Activity,
      explanation: "Models the transit with analytical light curves to compute the planet's radius, semi-major axis, and orbital inclination.",
      techUsed: "Batman, MCMC, PyMC3",
      details: [
        "Fitting orbital inclination, eccentricity, and impact parameter.",
        "Calculating planet radius relative to host star (Rp/Rs).",
        "Determining habitable zone compatibility.",
      ],
      codeSnippet: "import batman\nparams = batman.TransitParams()\nparams.t0 = 0.0; params.per = 4.21; params.rp = 0.038\nmodel = batman.TransitModel(params, t)"
    },
    {
      id: "confidence-scoring",
      title: "Multi-factor Confidence Scoring",
      short: "Confidence",
      icon: Award,
      explanation: "Aggregates neural probabilities, Signal-to-Noise ratios, and astrophysical vetting metrics into a final candidate rating.",
      techUsed: "Bayesian Statistics, XGBoost Vetting Classifier",
      details: [
        "Calculating SNR and False Alarm Probability (FAP).",
        "Weighting XAI features and centring diagnostics.",
        "Computing final Planet Candidate Probability score.",
      ],
      codeSnippet: "score = (nn_prob * 0.5) + (vetting_metrics * 0.3) + (snr_weight * 0.2)\nprint(f'Exoplanet Candidate Confidence: {score:.2f}%')"
    },
    {
      id: "dashboard-output",
      title: "Astronomer Dashboard Stream",
      short: "Dashboard",
      icon: LayoutDashboard,
      explanation: "Streams the verified exoplanet candidate parameters, phase-folded diagrams, and XAI outputs to the visual dashboard.",
      techUsed: "React, Next.js, Recharts, Plotly",
      details: [
        "Real-time UI update for target catalogs.",
        "Interactive phase-folded transit curves.",
        "Exporting NASA/Exoplanet Archive compatible summaries.",
      ],
      codeSnippet: "export_to_nasa_format(candidate_id, orbital_params)"
    }
  ];

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeStep = steps[activeIdx];

  return (
    <section id="pipeline" className="relative py-24 px-6 border-t border-white/5 bg-[#050816]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-mono text-cyan-accent tracking-widest uppercase mb-3">Discovery Engine</h2>
          <h3 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
            AI-Driven Detection Pipeline
          </h3>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
            ExoNet automates raw telescope data ingest, cleans noise using physics-grounded detrending, vets orbital shapes, and employs deep learning to deliver explained exoplanet candidate classifications.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-primary-blue to-cyan-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Layout Split: Left Pipeline Flow, Right Explanation Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Horizontal / Vertical Flow Line (8 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h4 className="text-lg font-bold font-display mb-4 text-gray-300 flex items-center gap-2">
              <span>Pipeline Stages</span>
              <span className="text-xs text-gray-500 font-mono font-normal">(Click stages to explore)</span>
            </h4>
            
            {/* Visual Pipeline Grid/List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`p-4 rounded-xl border text-left flex items-start gap-4 transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                      isActive 
                        ? "bg-primary-blue/15 border-primary-blue shadow-[0_0_20px_rgba(37,99,235,0.15)]" 
                        : "glass-panel border-white/5 hover:border-white/20"
                    }`}
                  >
                    {/* Active Gradient Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-accent glow-cyan" />
                    )}

                    <div className={`p-2.5 rounded-lg border ${
                      isActive 
                        ? "bg-primary-blue/20 border-cyan-accent/50 text-cyan-accent" 
                        : "bg-white/5 border-white/5 text-gray-400 group-hover:text-white"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-500">STAGE 0{idx + 1}</span>
                        {isActive && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-accent/20 text-cyan-accent animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <h5 className="font-bold text-sm text-white mt-1 group-hover:text-cyan-accent transition-colors">
                        {step.short}
                      </h5>
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {step.explanation}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Connecting visual pipeline line */}
            <div className="hidden sm:flex items-center justify-between p-4 rounded-xl bg-space-card/20 border border-white/5">
              {steps.map((step, idx) => {
                const isActive = idx === activeIdx;
                const isPassed = idx < activeIdx;
                return (
                  <div key={step.id} className="flex items-center flex-1 last:flex-initial">
                    <button
                      onClick={() => setActiveIdx(idx)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs cursor-pointer transition-all duration-300 ${
                        isActive
                          ? "bg-cyan-accent border-cyan-accent text-space-bg font-bold glow-cyan scale-110"
                          : isPassed
                            ? "bg-primary-blue/30 border-primary-blue text-white"
                            : "bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {idx + 1}
                    </button>
                    {idx < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${
                        isPassed ? "bg-primary-blue" : "bg-white/10"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detail side panel (5 cols) */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-6 rounded-2xl border border-primary-blue/20 relative scanline"
              >
                {/* Decorative title */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-cyan-accent" />
                    <span className="font-mono text-xs uppercase tracking-wider text-gray-400">Pipeline Inspector</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-accent">Step 0{activeIdx + 1} / 08</span>
                </div>

                <h4 className="text-2xl font-bold font-display text-white mb-2">
                  {activeStep.title}
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {activeStep.explanation}
                </p>

                {/* Sub-details checklist */}
                <div className="mb-6">
                  <h5 className="text-xs font-mono text-cyan-accent uppercase tracking-wider mb-3">Key Operations</h5>
                  <ul className="space-y-2">
                    {activeStep.details.map((detail, dIdx) => (
                      <li key={dIdx} className="text-sm text-gray-400 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-primary-blue mt-0.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech specifications */}
                <div className="mb-6">
                  <h5 className="text-xs font-mono text-cyan-accent uppercase tracking-wider mb-2">Algorithm & Tech Stack</h5>
                  <span className="text-xs font-mono bg-white/5 border border-white/10 rounded-md px-2.5 py-1 text-gray-300">
                    {activeStep.techUsed}
                  </span>
                </div>

                {/* Simulated Python Terminal Code Output */}
                <div>
                  <h5 className="text-xs font-mono text-cyan-accent uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Scientific Python Code</span>
                  </h5>
                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-emerald-400 overflow-x-auto select-all leading-normal whitespace-pre">
                    {activeStep.codeSnippet}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
