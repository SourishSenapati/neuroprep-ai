'use client';

export const dynamic = 'force-dynamic';
// Deployed: 2025-12-21 17:40 - FORCE UPDATE VOGUE THEME

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import '@/styles/apple-glass.css';
import MasteryCard from '@/components/MasteryCard';
import LiveAnalytics from '@/components/LiveAnalytics';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [paths, setPaths] = useState<any[]>([]);

  // Fallback data - NEW universal paths (NO TCS/Infosys)
  const FALLBACK_PATHS = [
    {
      title: "Logic & Precision",
      slug: "logic-precision",
      description: "The essential toolkit for every engineer who values accuracy over approximation. Master the core logic and critical thinking that supports every engineering discipline, from circuits to concrete. Patterns change, but logic doesn't. Develop the problem-solving intuition that cracks exams and fixes engines alike.",
      companyTags: ["All Industries", "R&D", "Product Design", "Field Services"],
      difficulty: "All Levels",
      salaryRange: "₹3.5-25 LPA",
      icon: "🎯",
      skills: ["Critical Thinking", "Precision Engineering", "Core Logic", "Problem-Solving Intuition"]
    },
    {
      title: "Complexity Decoded",
      slug: "complexity-decoded",
      description: "Learn to navigate high-level friction, entropy, and edge cases in any system you design. Tackle the toughest problems in the industry. Whether optimizing algorithms or infrastructure, learn to build what hasn't been built yet. Go beyond the surface. Gain the deep technical expertise required to innovate, patent, and pioneer new technologies.",
      companyTags: ["Product Companies", "R&D Labs", "Innovation Centers", "Patents"],
      difficulty: "Intermediate to Expert",
      salaryRange: "₹8-45 LPA",
      icon: "🧩",
      skills: ["System Design", "Edge Case Analysis", "Deep Tech", "Innovation"]
    },
    {
      title: "Total Versatility",
      slug: "total-versatility",
      description: "Prepare for a dynamic future. Equip yourself to work in R&D, operations, product design, or field services. Be the engineer who thrives anywhere. Gain the versatility to design products, manage services, and solve real-world crises. Don't just fit a job description. Prepare for a career that bridges the gap between abstract theory and tangible human impact.",
      companyTags: ["Any Industry", "Operations", "Product Design", "Crisis Management"],
      difficulty: "All Levels",
      salaryRange: "₹4-30 LPA",
      icon: "🌐",
      skills: ["Adaptive Engineering", "Versatility", "Impact-Driven", "Real-World Problem Solving"]
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
            // Use fallback if API returns empty or invalid data
            setPaths(FALLBACK_PATHS);
        }
    } catch (error) {
        console.error('Failed to fetch paths, using fallback:', error);
        // Always show fallback instead of empty state
        setPaths(FALLBACK_PATHS);
    }
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="apple-bg min-h-screen flex flex-col overflow-y-auto overflow-x-hidden relative">
      <LiveAnalytics />
      
      <main className="flex-grow flex flex-col justify-center relative w-full pt-20">
        
        {/* Background Gradients */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div 
             className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]" 
             style={{ background: 'radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, rgba(5, 5, 5, 0) 70%)' }}
           />
           <div 
             className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]" 
             style={{ background: 'radial-gradient(circle, rgba(74, 222, 128, 0.05) 0%, rgba(5, 5, 5, 0) 70%)' }}
           />
        </div>

        <div className="apple-container relative z-10 py-10 text-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#1F1F1F] backdrop-blur-md mb-8 mx-auto"
          >
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
            <span className="text-sm font-medium text-[#F0F0F0]/80 tracking-wide font-mono">India's Premier Interview AI</span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            className="heading-xl mb-6 max-w-4xl mx-auto tracking-tight font-serif text-5xl md:text-7xl font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Choose Your
            <span className="text-[#4ADE80] block mt-2">Mastery Path</span>
          </motion.h1>

          <motion.p
            className="body-lg text-[#A3A3A3] max-w-2xl mx-auto mb-12 font-light text-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Elite preparation for every engineering discipline. From campus placements to FAANG interviews.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/interview/setup" className="group">
              <button className="border border-[#4ADE80] text-[#4ADE80] bg-[#4ADE80]/10 text-lg px-8 py-4 min-w-[200px] flex items-center justify-center gap-2 group-hover:bg-[#4ADE80] group-hover:text-black transition-all duration-300 rounded-none">
                Start Practicing
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
                <div className="col-span-full text-center py-10 text-gray-500">
                    Loading Mastery Paths...
                </div>
             )}
          </div>
          
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
              <div key={i} className="glass-card p-6 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white mb-1">{stat.value}</span>
                <span className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-auto backdrop-blur-sm relative z-10">
        <div className="apple-container flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
