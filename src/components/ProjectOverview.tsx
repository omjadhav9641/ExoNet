"use client";

import { motion, Variants } from "framer-motion";
import { AlertCircle, ShieldAlert, Target, Award, Database, Eye, BarChart2, Cpu } from "lucide-react";

export default function ProjectOverview() {
  const cards = [
    {
      title: "The Problem",
      description: "Space telescopes like TESS generate massive streams of astronomical data. Millions of stars are observed continuously, producing gigabytes of light curves every day, creating an immense data processing bottleneck.",
      icon: Database,
      accent: "text-primary-blue",
      borderColor: "hover:border-primary-blue/30",
    },
    {
      title: "The Challenge",
      description: "Exoplanet transits appear as minuscule, periodic decreases in stellar brightness. These signals are frequently buried deep inside instrument errors, stellar flares, and high-frequency background noise.",
      icon: ShieldAlert,
      accent: "text-warning-orange",
      borderColor: "hover:border-warning-orange/30",
    },
    {
      title: "The Goal",
      description: "Apply state-of-the-art Deep Learning models to automatically ingest raw astronomical light curves, filter high-frequency noise, detect dips, and classify them with explainable confidence scores.",
      icon: Target,
      accent: "text-cyan-accent",
      borderColor: "hover:border-cyan-accent/30",
    },
    {
      title: "The Impact",
      description: "Reduces human-expert verification effort from months to seconds. Accelerates outer space discovery rates while providing transparent, physics-grounded validation reports.",
      icon: Award,
      accent: "text-success-green",
      borderColor: "hover:border-success-green/30",
    },
  ];

  const stats = [
    { value: "5,800+", label: "Confirmed Exoplanets", desc: "Across Kepler, TESS, and ground surveys", icon: Award },
    { value: "Millions", label: "Stars Observed", desc: "Monitored across sectors by space missions", icon: Eye },
    { value: "20,000+", label: "TESS Light Curves", desc: "Model pre-training validation archive", icon: Database },
    { value: "5 Categories", label: "Signal Classification", desc: "Candidate, EB, Blend, Noise, Flare", icon: BarChart2 },
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="overview" className="relative py-24 px-6 border-t border-white/5 bg-[#070b1e]/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-mono text-cyan-accent tracking-widest uppercase mb-3">Project Scope</h2>
          <h3 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
            Scientific Overview & Objectives
          </h3>
          <div className="h-1 w-20 bg-gradient-to-r from-primary-blue to-cyan-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* 4 Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`glass-panel p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between group ${card.borderColor}`}
              >
                <div>
                  <div className={`p-3 rounded-xl bg-white/5 w-fit mb-6 transition-transform group-hover:scale-110 ${card.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold font-display mb-3">{card.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed font-sans">{card.description}</p>
                </div>
                
                {/* Decorative bottom line */}
                <div className="h-0.5 w-full bg-white/5 mt-6 group-hover:bg-gradient-to-r group-hover:from-primary-blue group-hover:to-cyan-accent transition-all" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-cyan-accent/25 transition-all duration-300"
              >
                {/* Grid Overlay background */}
                <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-cyan-accent tracking-tight">
                      {stat.value}
                    </span>
                    <Icon className="w-5 h-5 text-gray-500 group-hover:text-cyan-accent transition-colors" />
                  </div>
                  <div>
                    <h5 className="text-md font-bold font-display text-white mb-1">{stat.label}</h5>
                    <p className="text-xs text-gray-400">{stat.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
