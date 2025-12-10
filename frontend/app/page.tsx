'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import '@/styles/apple-glass.css';

export default function HomePage() {
  return (
    <div className="apple-bg min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col justify-center relative overlow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
           <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
        </div>

        <div className="apple-container relative z-10 py-20 text-center">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 mx-auto"
          >
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 via-white to-green-400 animate-pulse"></span>
            <span className="text-sm font-medium text-white/80 tracking-wide">India's Premier Interview AI</span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            className="heading-xl mb-6 max-w-4xl mx-auto tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Engineering Excellence.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Mastered.
            </span>
          </motion.h1>

          <motion.p
            className="body-lg text-white/60 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The comprehensive platform for Indian engineering placements. 
            From campus drives to top-tier product companies.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/interview/setup" className="group">
              <button className="glass-button-primary text-lg px-8 py-4 min-w-[200px] flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform duration-300">
                Start Practicing
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </Link>
            
            <Link href="/pricing" className="group">
              <button className="glass-button text-lg px-8 py-4 min-w-[200px] group-hover:bg-white/10 transition-colors duration-300">
                View Pricing
              </button>
            </Link>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { label: 'Questions', value: '224M+' },
              { label: 'Companies', value: '500+' },
              { label: 'Roles', value: '47' },
              { label: 'Uptime', value: '99.9%' }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white mb-1">{stat.value}</span>
                <span className="text-sm text-white/40 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-auto backdrop-blur-sm">
        <div className="apple-container flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
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
