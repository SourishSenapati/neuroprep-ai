'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Linkedin, Mail, Target, BarChart2, Brain, Sparkles, Zap, Globe, Cpu, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-[#4ADE80]/30 selection:text-black">
        {/* Subtle Gold/Green Glow Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#EAB308]/5 blur-[200px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#4ADE80]/5 blur-[200px] pointer-events-none" />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10 pt-20 pb-16">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212]/80 backdrop-blur-xl border border-white/10 mb-8 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        >
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse shadow-[0_0_10px_#4ADE80]" />
          <span className="text-sm text-[#A3A3A3] font-mono tracking-widest uppercase">Production Ready</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight mb-8 leading-[1.1]"
        >
          Master your <br/>
          <span className="bg-gradient-to-r from-white via-[#4ADE80] to-white bg-clip-text text-transparent bg-[200%_auto] animate-shine">
            Engineering Career
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-[#737373] max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          The world's most advanced AI interview platform with <span className="text-white">224+ million unique questions</span> across 47 engineering disciplines.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row items-center gap-4 w-full justify-center"
        >
          <Link href="/interview/setup" className="group relative px-8 py-4 bg-[#4ADE80] text-black rounded-full font-semibold text-base overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(74,222,128,0.2)]">
            <span className="relative z-10 flex items-center gap-2">
              Start Simulation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>

          <Link href="/dashboard" className="group px-8 py-4 bg-[#121212] border border-white/10 text-white rounded-full font-medium text-base hover:bg-white/5 transition-all hover:border-white/20">
            View Analytics
          </Link>
        </motion.div>
      </main>

      <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#525252]">
           <div className="flex items-center gap-6">
              <span>© 2025 NeuroPrep AI</span>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
           </div>

           <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121212] border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse"></span>
                  <span className="text-[#4ADE80] font-bold text-xs tracking-wide">SYSTEM ONLINE</span>
              </div>
              <span>|</span>
              <span className="font-mono">v2.0.0</span>
           </div>
        </div>
      </footer>
    </div>
  );
}