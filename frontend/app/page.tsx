'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Linkedin, Mail, Target, BarChart2, Brain, Sparkles, Zap, Globe, Cpu } from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center relative overflow-hidden">
        {/* Subtle Gold Glow Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#EAB308]/5 blur-[200px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#3B82F6]/5 blur-[200px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212]/80 backdrop-blur-xl border border-white/10 mb-8 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        >
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse shadow-[0_0_10px_#4ADE80]" />
          <span className="text-sm text-[#A3A3A3] font-mono tracking-widest uppercase">Next.js 16 • Premium Experience</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-light mb-6 tracking-tight"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Your Personal
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#EAB308]">AI Tutor</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-[#A3A3A3] max-w-3xl mx-auto mb-8 leading-relaxed font-light"
        >
          <span className="text-white font-medium">Adaptive AI-driven preparation</span> that focuses on your weak areas. 
          Stop wasting time on random practice—let NeuroPrep analyze, guide, and personalize your learning journey.
        </motion.p>

        {/* Value Props - Glass Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12"
        >
          {[
            { icon: Target, text: 'Personalized Guidance' },
            { icon: BarChart2, text: 'Weakness Identification' },
            { icon: Brain, text: 'Adaptive Neural Engine' }
          ].map((prop, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-[#121212]/40 backdrop-blur-md border border-white/10 px-6 py-4 rounded-xl hover:border-white/20 transition-all hover:bg-white/5 group"
            >
              <prop.icon className="w-5 h-5 text-[#EAB308] group-hover:scale-110 transition-transform" />
              <span className="text-[#A3A3A3] text-sm font-mono tracking-wide">{prop.text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Button - ELECTRIC BLUE = ACTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/interview/setup">
            <button className="group bg-[#3B82F6] text-white px-10 py-5 rounded-full text-lg font-mono uppercase tracking-widest hover:bg-[#2563EB] transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-[#3B82F6]/50">
              Start Your Preparation
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24"
        >
          {[
            { label: 'Questions', value: '224M+', icon: Globe },
            { label: 'Unique', value: '99.9%', icon: Sparkles },
            { label: 'Adaptive AI', value: 'Level 10', icon: Cpu },
            { label: 'Engineering Students', value: 'All', icon: Zap }
          ].map((stat, i) => (
            <div key={i} className="bg-[#121212]/40 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-[#EAB308]/30 transition-colors group">
              <stat.icon className="w-5 h-5 text-[#EAB308] mx-auto mb-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="text-3xl font-bold text-white mb-1 tracking-tighter">{stat.value}</div>
              <div className="text-xs text-[#A3A3A3] uppercase tracking-widest font-mono">{stat.label}</div>
            </div>
          ))}
        </motion.div>

      </div>

      {/* Footer - Built by Sourish Senapati */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-white/5 py-4 bg-[#050505]/90 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm font-mono gap-4">
            
            {/* Creator Badge */}
           <div className="flex items-center gap-4">
             <span className="text-[#A3A3A3]">Built by</span>
             <a 
                href="https://www.linkedin.com/in/sourish-senapati-0aba921b1/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-[#0077b5]/10 border border-[#0077b5]/30 rounded text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all text-xs uppercase tracking-wider font-bold"
             >
                <Linkedin className="w-3 h-3" />
                Sourish Senapati
             </a>
           </div>

           {/* Contact Links */}
           <div className="flex items-center gap-3">
              <a href="mailto:sourishs.chem.ug@jadavpuruniversity.in" className="text-[#A3A3A3] hover:text-white transition-colors" title="University Email">
                 <Mail className="w-4 h-4" />
              </a>
              <span className="text-white/20">|</span>
              <a href="mailto:sourishsenapati791@gmail.com" className="text-[#A3A3A3] hover:text-white transition-colors" title="Personal Email">
                 <Mail className="w-4 h-4" />
              </a>
              <span className="text-[#A3A3A3] text-xs ml-2 hidden md:inline">© 2025 NeuroPrep AI</span>
           </div>
        </div>
      </footer>
    </div>
  );
}