'use client';

export const dynamic = 'force-dynamic';
// DEPLOYED: 2025-12-21 18:45 IST - FORCE REBUILD v3

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import '@/styles/apple-glass.css';
import MasteryCard from '@/components/MasteryCard';
import LiveAnalytics from '@/components/LiveAnalytics';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [paths, setPaths] = useState<any[]>([]);

  // Fallback data - Trusted Universal Engineering Paths
  const FALLBACK_PATHS = [
    {
      title: "Logic & Precision",
      slug: "logic-precision",
      description: "The essential toolkit for every engineer who values accuracy over approximation. Master the core logic and critical thinking that supports every engineering discipline, from circuits to concrete.",
      companyTags: ["All Industries", "R&D", "Product Design", "Field Services"],
      difficulty: "All Levels",
      salaryRange: "₹5-25 LPA",
      icon: "🎯",
      skills: ["Critical Thinking", "Precision Engineering", "Core Logic", "Risk Assessment"]
    },
    {
      title: "Complexity Decoded",
      slug: "complexity-decoded",
      description: "Navigate high-level friction, entropy, and edge cases in any system you design. Tackle the toughest problems in the industry. Learn to build what hasn't been built yet.",
      companyTags: ["Deep Tech", "Innovation Labs", "Architecture Groups", "Advanced Engineering"],
      difficulty: "Advanced",
      salaryRange: "₹12-45 LPA",
      icon: "🧩",
      skills: ["System Design", "Edge Case Analysis", "Entropy Management", "Optimization"]
    },
    {
      title: "Total Versatility",
      slug: "total-versatility",
      description: "Equip yourself to work in R&D, operations, product design, or field services. Be the engineer who thrives anywhere and solves real-world crises.",
      companyTags: ["Cross-Sector", "Operations", "Consulting", "Global Services"],
      difficulty: "All Levels",
      salaryRange: "₹8-30 LPA",
      icon: "🌐",
      skills: ["Adaptive Solving", "Crisis Management", "Operations", "Versatility"]
    }
  ];

  useEffect(() => {
    setMounted(true);
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/mastery-paths`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            setPaths(data);
        } else {
            setPaths(FALLBACK_PATHS);
        }
    } catch (error) {
        console.error('Failed to fetch paths, using fallback:', error);
        setPaths(FALLBACK_PATHS);
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-void-black min-h-screen flex flex-col overflow-y-auto overflow-x-hidden relative font-sans text-crisp-white">
      <LiveAnalytics />
      
      <main className="flex-grow flex flex-col justify-center relative w-full pt-20">
        
        {/* Subtle Ambient Glow (Green Tint) */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div 
             className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-10" 
             style={{ background: 'radial-gradient(circle, var(--terminal-green) 0%, transparent 70%)' }}
           />
           <div 
             className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-5" 
             style={{ background: 'radial-gradient(circle, var(--terminal-green) 0%, transparent 70%)' }}
           />
        </div>

        <div className="relative z-10 py-10 text-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-glass-charcoal border border-white/10 backdrop-blur-md mb-8 mx-auto"
          >
            <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse"></span>
            <span className="text-sm font-medium text-muted-silver tracking-wide font-mono">India's Premier Interview AI</span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            className="mb-6 max-w-4xl mx-auto tracking-tight font-serif text-5xl md:text-7xl font-light text-crisp-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Personal
            <span className="text-terminal-green block mt-2">AI Tutor</span>
          </motion.h1>

          <motion.p
            className="text-muted-silver max-w-3xl mx-auto mb-8 font-light text-xl tracking-wide leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="text-crisp-white font-medium">Adaptive AI-driven preparation</span> that focuses on your weak areas. 
            Stop wasting time on random practice—let NeuroPrep analyze, guide, and personalize your learning journey.
          </motion.p>

          {/* Value Props */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12 text-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[
              { icon: "🎯", text: "Personalized Questions & Guidance" },
              { icon: "📊", text: "Identifies Your Weak Areas" },
              { icon: "🧠", text: "Adapts to You, Not Vice Versa" }
            ].map((prop, i) => (
              <div key={i} className="flex items-center gap-3 bg-glass-charcoal/30 border border-white/5 px-4 py-3 backdrop-blur-sm">
                <span className="text-2xl">{prop.icon}</span>
                <span className="text-muted-silver font-mono">{prop.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/interview/setup" className="group">
              <button className="border border-terminal-green text-terminal-green bg-terminal-green/5 hover:bg-terminal-green hover:text-void-black text-lg px-8 py-4 min-w-[200px] flex items-center justify-center gap-2 transition-all duration-300 rounded-none tracking-widest uppercase font-mono text-sm">
                Start Your Preparation
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </Link>
          </motion.div>

          {/* Mastery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 text-left">
             {paths.map((path, index) => (
                <motion.div
                  key={path.slug || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                    <MasteryCard 
                        title={path.title}
                        slug={path.slug}
                        description={path.description}
                        companyTags={path.companyTags}
                        difficulty={path.difficulty}
                        salaryRange={path.salaryRange}
                        icon={path.icon}
                        skills={path.skills}
                    />
                </motion.div>
             ))}
             {paths.length === 0 && (
                <div className="col-span-full text-center py-10 text-muted-silver animate-pulse font-mono">
                    Initializing Neural Pathways...
                </div>
             )}
          </div>
          
          {/* Stats Bar */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              { label: 'Questions', value: '1.2B+' },
              { label: 'Unique', value: '99.9%' },
              { label: 'Adaptive AI', value: 'Level 10' },
              { label: 'Engineering Specializations', value: 'All Branches' }
            ].map((stat, i) => (
              <div key={i} className="bg-glass-charcoal border border-white/5 p-6 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-crisp-white mb-1">{stat.value}</span>
                <span className="text-xs text-muted-silver uppercase tracking-wider font-mono">{stat.label}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-auto backdrop-blur-sm relative z-10 bg-void-black/80">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-silver max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-mono opacity-60">
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
/ / 
 
 F o r c e 
 
 r e b u i l d 
 
 % d a t e % 
 
 % t i m e % 
 
 