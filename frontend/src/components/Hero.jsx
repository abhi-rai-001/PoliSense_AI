import React from "react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import Threads from '@/animations/Thread';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Thread Animation */}
      <div className="absolute inset-0 z-0">
        <Threads
          amplitude={0.5}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>

      <section className="relative z-10 container mx-auto px-6 text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border border-cyan-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              AI-Powered Document Intelligence
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] font-['Clash_Grotesk'] text-white">
            Your Intelligent Assistant for <br className="hidden md:block"/>
            <span className="text-gradient pb-2 pr-2 inline-block">Document Analysis & Insights</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Leverage advanced AI to extract, organize, and interpret key information from your contracts, reports, and emails in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <RouterLink to="/upload" className="w-full sm:w-auto relative group overflow-hidden rounded-full p-[1px]">
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 rounded-full opacity-100 group-hover:opacity-80 transition-opacity duration-300 animate-gradient"></span>
              <div className="relative bg-black px-8 py-4 rounded-full transition-all duration-300 group-hover:bg-transparent">
                <span className="text-base font-semibold text-white flex items-center justify-center gap-2">
                  Get Started Free
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </RouterLink>
            
            <RouterLink to="/about" className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold text-gray-300 hover:text-white glass-panel hover:bg-white/5 transition-all duration-300">
              How it works
            </RouterLink>
          </div>
        </motion.div>
      </section>
      
      {/* Aurora Ambient Glow (Bottom) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-1/2 bg-gradient-to-t from-violet-600/20 to-transparent blur-[120px] pointer-events-none z-0"></div>
    </div>
  );
};

export default Hero;
