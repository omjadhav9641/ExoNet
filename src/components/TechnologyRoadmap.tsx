"use client";

import { motion } from "framer-motion";
import { 
  Database, Layers, Cloud, GraduationCap, Microscope, Code2, Cpu, Globe 
} from "lucide-react";

interface TechItem {
  name: string;
  role: string;
  desc: string;
  icon: string;
}

interface RoadmapItem {
  title: string;
  desc: string;
  icon: any;
  status: "In Pipeline" | "R&D Phase" | "Planned";
  progress: number;
}

export default function TechnologyRoadmap() {
  const techs: TechItem[] = [
    { name: "Python", role: "Core Algorithm Layer", desc: "Powers neural networks, mathematical modelling, and astrophysical libraries.", icon: "🐍" },
    { name: "Lightkurve", role: "Light Curve Ingest", desc: "Retrieves, flattens, and manipulates TESS and Kepler target pixel data.", icon: "📈" },
    { name: "Astropy", role: "Coordinates & Math", desc: "Calculates time arrays, barycentric corrections, and stellar coordinates.", icon: "🌌" },
    { name: "TLS", role: "Transit Least Squares", desc: "Detects realistic planetary transits incorporating limb-darkening shapes.", icon: "🔍" },
    { name: "XGBoost", role: "Vetting Classifier", desc: "Performs tabular statistical checks to rapidly identify false positive stars.", icon: "⚡" },
    { name: "Batman", role: "Transit Lightcurve Fit", desc: "Simulates analytical planetary occultation models for physical fits.", icon: "🦇" },
    { name: "Plotly", role: "Interactive Visuals", desc: "Generates high-performance interactive light curve scatter plots.", icon: "📊" },
    { name: "Streamlit", role: "Internal Testing", desc: "Enables rapid dashboard prototyping for testing pipeline code.", icon: "💻" },
  ];

  const roadmap: RoadmapItem[] = [
    {
      title: "Support Kepler Mission Archival Vetting",
      desc: "Integrate complete historical Kepler and K2 light curve datasets, unlocking retro-active analysis of over 200,000 stellar targets to uncover multi-planet systems hidden inside long-term systematic trends.",
      icon: Database,
      status: "In Pipeline",
      progress: 75,
    },
    {
      title: "Support PLATO Mission Integration",
      desc: "Prepare algorithms to ingest next-generation high-cadence ESA PLATO (Planetary Transits and Oscillations of stars) datasets scheduled for launch in late 2026, targeting terrestrial habitable zone planets.",
      icon: Globe,
      status: "Planned",
      progress: 20,
    },
    {
      title: "Educational Astronomy Platform",
      desc: "Release a gamified citizens' science portal allowing students and amateur astronomers to inspect AI anomalies, label transit signals, and contribute directly to planetary candidates vetting databases.",
      icon: GraduationCap,
      status: "R&D Phase",
      progress: 45,
    },
    {
      title: "Enterprise Cloud Scalability",
      desc: "Port pipeline code to serverless GPU nodes using AWS Lambda and Kubernetes to dynamically scale from one target star to millions within minutes of new TESS sector releases.",
      icon: Cloud,
      status: "Planned",
      progress: 10,
    },
    {
      title: "Collaborative Research Portals",
      desc: "Create an API portal that automatically exports candidates directly into the NASA Exoplanet Archive and ExoFOP (Exoplanet Follow-up Observing Program) formats, initiating immediate ground telescope confirmation campaigns.",
      icon: Microscope,
      status: "R&D Phase",
      progress: 60,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Pipeline":
        return "text-cyan-accent bg-cyan-accent/10 border-cyan-accent/25";
      case "R&D Phase":
        return "text-purple-accent bg-purple-accent/10 border-purple-accent/25";
      case "Planned":
        return "text-gray-400 bg-white/5 border-white/10";
      default:
        return "text-gray-400 bg-white/5 border-white/10";
    }
  };

  return (
    <section id="tech-roadmap" className="relative py-24 px-6 border-t border-white/5 bg-[#050816]">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION 1: TECHNOLOGY STACK */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono text-cyan-accent tracking-widest uppercase mb-3">System Architecture</h2>
            <h3 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
              Platform Technology Stack
            </h3>
            <div className="h-1 w-20 bg-gradient-to-r from-primary-blue to-cyan-accent mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techs.map((tech, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-cyan-accent/25 transition-all duration-300"
              >
                <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl filter saturate-75 group-hover:scale-115 transition-transform duration-300">
                      {tech.icon}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 group-hover:text-cyan-accent group-hover:border-cyan-accent/30 transition-colors">
                      STABLE
                    </span>
                  </div>
                  <h4 className="font-bold text-lg font-display text-white mb-0.5">{tech.name}</h4>
                  <span className="text-xs font-mono text-cyan-accent/80 block mb-3">{tech.role}</span>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: FUTURE ROADMAP */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono text-cyan-accent tracking-widest uppercase mb-3">Expansion Roadmap</h2>
            <h3 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
              Future Objectives
            </h3>
            <div className="h-1 w-20 bg-gradient-to-r from-primary-blue to-cyan-accent mx-auto mt-4 rounded-full" />
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {roadmap.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-cyan-accent/20 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-xl bg-white/5 text-cyan-accent border border-white/10 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="font-bold text-lg font-display text-white group-hover:text-cyan-accent transition-colors">
                            {item.title}
                          </h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed font-sans">{item.desc}</p>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full md:w-36 shrink-0 space-y-1.5 font-mono text-[10px]">
                      <div className="flex justify-between text-gray-500">
                        <span>DEVELOPMENT</span>
                        <span className="text-cyan-accent font-bold">{item.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-blue to-cyan-accent rounded-full transition-all duration-1000"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
