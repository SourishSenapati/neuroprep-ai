'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] border border-white/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
          <span className="text-sm text-[#A3A3A3] font-mono">India's Premier Interview AI</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-7xl font-light mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Your Personal
          <span className="block mt-2 text-[#4ADE80]">AI Tutor</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-[#A3A3A3] max-w-3xl mx-auto mb-8 leading-relaxed"
        >
          <span className="text-white font-medium">Adaptive AI-driven preparation</span> that focuses on your weak areas. 
          Stop wasting time on random practice—let NeuroPrep analyze, guide, and personalize your learning journey.
        </motion.p>

        {/* Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12"
        >
          {[
            { icon: '🎯', text: 'Personalized Questions & Guidance' },
            { icon: '📊', text: 'Identifies Your Weak Areas' },
            { icon: '🧠', text: 'Adapts to You, Not Vice Versa' }
          ].map((prop, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-[#121212]/50 border border-white/5 px-4 py-3 rounded-lg"
            >
              <span className="text-2xl">{prop.icon}</span>
              <span className="text-[#A3A3A3] text-sm font-mono">{prop.text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/interview/setup">
            <button className="group bg-[#4ADE80] text-black px-8 py-4 rounded-full text-lg font-mono uppercase tracking-widest hover:bg-[#3BC56D] transition-all duration-300 shadow-lg hover:shadow-[#4ADE80]/50">
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
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
        >
          {[
            { label: 'Questions', value: '1.2B+' },
            { label: 'Unique', value: '99.9%' },
            { label: 'Adaptive AI', value: 'Level 10' },
            { label: 'Engineering Students', value: 'All' }
          ].map((stat, i) => (
            <div key={i} className="bg-[#121212] border border-white/5 p-6 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-[#A3A3A3] uppercase tracking-wide font-mono">{stat.label}</div>
            </div>
          ))}
        </motion.div>

      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-white/5 py-4 bg-[#050505]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-[#A3A3A3] font-mono">
          <p>© 2025 NeuroPrep AI. Crafted for Excellence.</p>
          <div className="flex gap-6">
            <span>Optimized for low-bandwidth</span>
            <span>Mobile Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}