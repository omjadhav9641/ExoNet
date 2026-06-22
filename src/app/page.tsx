"use client";

import React, { useState } from "react";
import Hero from "@/components/Hero";
import ProjectOverview from "@/components/ProjectOverview";
import PipelineSection from "@/components/PipelineSection";
import DashboardSection from "@/components/DashboardSection";
import AIInsights from "@/components/AIInsights";
import TechnologyRoadmap from "@/components/TechnologyRoadmap";
import Footer from "@/components/Footer";
import ChatAssistant from "@/components/ChatAssistant";
import { TARGET_STARS, TargetStar } from "@/data/stars";
import { Sparkles, Menu, X, ArrowUpRight } from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedStar, setSelectedStar] = useState<TargetStar>(TARGET_STARS[0]);

  const navItems = [
    { name: "Overview", href: "#overview" },
    { name: "Pipeline", href: "#pipeline" },
    { name: "Console", href: "#dashboard" },
    { name: "AI Vetting", href: "#insights" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHeroNavigate = (targetId: string) => {
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Dynamic Header Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-space-bg/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 cursor-pointer font-bold font-display text-white text-base tracking-wide"
          >
            <Sparkles className="w-5 h-5 text-cyan-accent animate-pulse" />
            <span>ExoNet</span>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
              v2.0
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-gray-400">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="hover:text-cyan-accent transition-colors cursor-pointer py-2"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#dashboard"
              onClick={(e) => handleScroll(e, "#dashboard")}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Astronomer Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/5 bg-space-bg py-4 px-6 space-y-4">
            <div className="flex flex-col gap-3 font-mono text-xs text-gray-400">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.href)}
                  className="hover:text-cyan-accent py-2 cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
              
              <a
                href="#dashboard"
                onClick={(e) => handleScroll(e, "#dashboard")}
                className="w-full text-center px-4 py-3 rounded-lg text-xs font-mono font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Astronomer Console</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Sections Content */}
      <main className="relative z-10">
        <Hero 
          onLaunchDashboard={() => handleHeroNavigate("#dashboard")} 
          onViewPipeline={() => handleHeroNavigate("#pipeline")} 
        />
        <ProjectOverview />
        <PipelineSection />
        <DashboardSection selectedStar={selectedStar} setSelectedStar={setSelectedStar} />
        <AIInsights />
        <TechnologyRoadmap />
      </main>

      <ChatAssistant activeStar={selectedStar} />
      <Footer />
    </>
  );
}
