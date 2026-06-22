"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ShieldAlert, Cpu, Sparkles, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";

interface InsightItem {
  title: string;
  short: string;
  icon: any;
  accent: string;
  detail: string;
  features: string[];
  equation: string;
}

export default function AIInsights() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const insights: InsightItem[] = [
    {
      title: "Explainable AI (XAI)",
      short: "Neural network attention heatmaps for visual vetting verification.",
      icon: Sparkles,
      accent: "text-cyan-accent border-cyan-accent/20 bg-cyan-accent/5",
      detail: "Deep learning models are often black boxes. ExoNet uses custom 1D Attention Maps and integrated gradients to highlight exactly which data points in the light curve influenced the classification. This guarantees that candidates are selected based on physical ingress/egress dips rather than high-frequency noise or spacecraft guide star glitches.",
      features: [
        "Saliency maps matching physical occultation regions",
        "Integrated gradients highlighting transit transitions",
        "Attribution reports generated for raw astronomer reviews",
      ],
      equation: "Attribution(x_i) = (x_i - x'_i) * ∫ [∂F(x' + α(x - x')) / ∂x_i] dα"
    },
    {
      title: "Physics-Based Validation",
      short: "Enforcing Keplerian mechanics onto neural network outputs.",
      icon: ShieldCheck,
      accent: "text-primary-blue border-primary-blue/20 bg-primary-blue/5",
      detail: "AI scores are vetted against physical laws. Our pipeline fits the transit dip into analytical Keplerian models. If the predicted transit depth, duration, and orbital period require an impossible stellar density or orbital velocity, the candidate is flagged as an astrophysical false positive.",
      features: [
        "Limb darkening coefficient constraints validation",
        "Host star density compatibility checks (ρ_star)",
        "Roche limit boundaries verification for short-period planets",
      ],
      equation: "T_{dur} = (P / π) * arcsin( √[ (R_s + R_p)^2 - (b * R_s)^2 ] / a )"
    },
    {
      title: "Confidence Scoring",
      short: "Robust Bayesian probability mapping across multi-stage signals.",
      icon: Cpu,
      accent: "text-purple-accent border-purple-accent/20 bg-purple-accent/5",
      detail: "ExoNet calculates a unified probability score. Rather than relying solely on the neural network's final softmax output, we compute a Bayesian joint probability that merges the deep learning prediction with classical signal properties, such as the Transit Least Squares (TLS) power spectral density.",
      features: [
        "Softmax output weights adjusted for signal SNR",
        "False Alarm Probability (FAP) calculation",
        "Bayesian likelihood integration of stellar templates",
      ],
      equation: "P(Planet | Signal) = [ P(Signal | Planet) * P(Planet) ] / P(Signal)"
    },
    {
      title: "False Positive Rejection",
      short: "Filtering pixel centroid shifts and background eclipses.",
      icon: ShieldAlert,
      accent: "text-warning-orange border-warning-orange/20 bg-warning-orange/5",
      detail: "More than half of transit candidates are false positives. Our vetting engine runs automated diagnostic scans, verifying whether the center-of-light shifts during the transit dip (indicating background star interference) and comparing the odd/even transit cycle depths to identify binary star systems.",
      features: [
        "Difference image centroid offset monitoring",
        "Odd-even depth ratio validation to catch binary stars",
        "Secondary eclipse search in out-of-transit phases",
      ],
      equation: "Δ Centroid = || x_{out-of-transit} - x_{in-transit} || < 1.0\""
    }
  ];

  return (
    <section id="insights" className="relative py-24 px-6 border-t border-white/5 bg-[#070b1e]/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-mono text-cyan-accent tracking-widest uppercase mb-3">Vetting Integrity</h2>
          <h3 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
            Explainable AI & Physics Vetting
          </h3>
          <div className="h-1 w-20 bg-gradient-to-r from-primary-blue to-cyan-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Expandable Accordion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Accordion List */}
          <div className="space-y-4">
            {insights.map((insight, idx) => {
              const Icon = insight.icon;
              const isExpanded = expandedIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isExpanded 
                      ? "bg-space-card border-primary-blue/40 shadow-[0_0_30px_rgba(37,99,235,0.1)]" 
                      : "glass-panel border-white/5 hover:border-white/10"
                  }`}
                >
                  <button
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                    className="w-full p-6 flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl border ${insight.accent}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white font-display">{insight.title}</h4>
                        <p className="text-xs text-gray-400 font-sans mt-0.5">{insight.short}</p>
                      </div>
                    </div>
                    <div className="p-1 rounded-full bg-white/5 text-gray-400 group-hover:text-white">
                      {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Responsive mobile expanded content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden lg:hidden border-t border-white/10"
                      >
                        <div className="p-6 space-y-4">
                          <p className="text-sm text-gray-300 leading-relaxed font-sans">{insight.detail}</p>
                          
                          <div className="space-y-2">
                            <h5 className="text-xs font-mono text-cyan-accent uppercase tracking-wider">Capabilities</h5>
                            <ul className="space-y-1.5">
                              {insight.features.map((feature, fIdx) => (
                                <li key={fIdx} className="text-xs text-gray-400 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-accent" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-[10px] text-cyan-accent/95 overflow-x-auto">
                            <span className="text-gray-500 block mb-1">PHYSICAL MODEL CONSTRAINT</span>
                            {insight.equation}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Preview Panel (syncs with accordion on large screens) */}
          <div className="hidden lg:block">
            <div className="glass-panel p-8 rounded-2xl border border-white/10 relative h-[440px] flex flex-col justify-between scanline">
              <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
              
              {expandedIdx !== null ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={expandedIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-cyan-accent font-mono text-xs uppercase tracking-widest mb-6">
                        <span>Physical Vetting Engine</span>
                        <div className="h-px flex-1 bg-cyan-accent/20" />
                      </div>
                      
                      <h4 className="text-2xl font-bold font-display text-white mb-4">
                        {insights[expandedIdx].title}
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed mb-6 font-sans">
                        {insights[expandedIdx].detail}
                      </p>

                      <div className="space-y-3 mb-6">
                        <h5 className="text-xs font-mono text-cyan-accent uppercase tracking-widest">System Features</h5>
                        <ul className="grid grid-cols-1 gap-2">
                          {insights[expandedIdx].features.map((feature, fIdx) => (
                            <li key={fIdx} className="text-xs text-gray-400 flex items-center gap-2">
                              <ArrowRight className="w-3.5 h-3.5 text-primary-blue shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-cyan-accent/95 overflow-x-auto shadow-inner">
                      <span className="text-gray-500 block mb-1 text-[9px] uppercase tracking-wider">PHYSICAL MODEL CONSTRAINT EQUATION</span>
                      {insights[expandedIdx].equation}
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 font-mono text-xs">
                  <Eye className="w-8 h-8 text-gray-600 mb-3 animate-pulse" />
                  Select an AI insight node to view deep validation telemetry.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
