"use client";

import { motion } from "framer-motion";
import { Sparkles, Globe, Activity, Cpu, ArrowRight } from "lucide-react";

interface HeroProps {
  onLaunchDashboard: () => void;
  onViewPipeline: () => void;
}

export default function Hero({ onLaunchDashboard, onViewPipeline }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-20 px-6">
      {/* Space Backdrop Star Field */}
      <div className="absolute inset-0 star-field opacity-60 z-0" />
      
      {/* Nebulae and Glow Effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-blue/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-purple-accent/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-accent/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Orbiting Planets & Star Orbits */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {/* Orbit Path 1 */}
        <div className="absolute w-[240px] h-[240px] border border-white/5 rounded-full animate-spin-slow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-accent rounded-full glow-cyan animate-pulse" />
        </div>
        {/* Orbit Path 2 */}
        <div className="absolute w-[420px] h-[420px] border border-white/5 rounded-full animate-spin-reverse-slow">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-5 h-5 bg-primary-blue rounded-full glow-blue" />
        </div>
        {/* Orbit Path 3 */}
        <div className="absolute w-[640px] h-[640px] border border-white/5 rounded-full animate-spin-slow">
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-purple-accent rounded-full glow-purple" />
        </div>
      </div>

      {/* Central Content */}
      <div className="relative max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-accent/20 bg-cyan-accent/5 text-cyan-accent text-xs font-mono mb-6 glow-cyan"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>EXONET AI VETTING PLATFORM</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-accent animate-ping" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tight font-display mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-primary-blue"
        >
          ExoNet
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-3xl text-gray-300 font-medium mb-4 max-w-2xl mx-auto leading-relaxed"
        >
          Explainable AI for Discovering Hidden Exoplanets from Noisy TESS Light Curves
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xs md:text-sm font-mono tracking-widest text-cyan-accent/80 uppercase mb-10 flex items-center justify-center gap-3"
        >
          <span>Detect</span>
          <span className="text-white/20">•</span>
          <span>Verify</span>
          <span className="text-white/20">•</span>
          <span>Classify</span>
          <span className="text-white/20">•</span>
          <span>Explain</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <button
            onClick={onLaunchDashboard}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-medium bg-gradient-to-r from-primary-blue to-cyan-accent text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Launch Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={onViewPipeline}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-medium border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer glass-panel"
          >
            View Pipeline
            <Activity className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Floating Micro-Features Badge in Hero Bottom */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 px-8 py-3 rounded-full border border-white/5 bg-space-card/40 backdrop-blur-md text-xs font-mono text-gray-400">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary-blue" />
          <span>TESS Transit Search</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-accent" />
          <span>92.4% Recall Acc.</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-accent" />
          <span>Real-time Vetting</span>
        </div>
      </div>
    </section>
  );
}
