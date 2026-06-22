"use client";

import { Sparkles, Globe, Shield } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-6 border-t border-white/5 bg-[#040612] z-10 overflow-hidden">
      <div className="absolute inset-0 star-field opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-xs font-mono text-gray-500">
        
        {/* Left Side: Credits */}
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 text-cyan-accent animate-pulse" />
            <span>Team ExoNet</span>
          </div>
          <p className="text-gray-400 font-sans text-xs">
            Explainable AI for Discovering Hidden Exoplanets from Noisy TESS Light Curves.
          </p>
          <p className="text-gray-500 text-[10px]">
            &copy; {currentYear} Team ExoNet. Developed under Apache 2.0 license.
          </p>
        </div>

        {/* Center Side: Platform metadata */}
        <div className="text-center space-y-1">
          <p className="text-gray-300 font-bold">ExoNet AI Vetting Suite</p>
          <p className="text-cyan-accent text-[11px] flex items-center justify-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>Deep Learning Transit Detection Suite</span>
          </p>
        </div>

        {/* Right Side: Links and status */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex gap-4">
            <a 
              href="#overview" 
              className="hover:text-cyan-accent transition-colors cursor-pointer"
            >
              Overview
            </a>
            <a 
              href="#pipeline" 
              className="hover:text-cyan-accent transition-colors cursor-pointer"
            >
              Pipeline
            </a>
            <a 
              href="#dashboard" 
              className="hover:text-cyan-accent transition-colors cursor-pointer"
            >
              Dashboard
            </a>
            <a 
              href="#insights" 
              className="hover:text-cyan-accent transition-colors cursor-pointer"
            >
              AI Vetting
            </a>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-gray-400">
            <Shield className="w-3.5 h-3.5 text-success-green" />
            <span>Secure SSL / P2P Vetted</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
