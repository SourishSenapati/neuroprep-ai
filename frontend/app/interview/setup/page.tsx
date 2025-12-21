'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Target, Sparkles, Zap, Brain, Globe, Cloud, Smartphone, Landmark, Cpu } from 'lucide-react';
import { useGameStore } from '@/lib/store/gameStore';

// ALL Engineering Career Tracks - Comprehensive Universal Paths
const careerTracks = [
  {
    id: 'logic-precision',
    title: 'Logic & Precision',
    tagline: 'Precision Engineering Fundamentals',
    description: 'The essential toolkit for every engineer who values accuracy over approximation.',
    color: 'linear-gradient(135deg, #2A9D8F 0%, #264653 100%)',
    topics: ['Critical Thinking', 'Precision Analysis', 'Core Logic'],
    icon: <Target className="w-8 h-8 text-[#4ADE80]" />
  },
  {
    id: 'complexity-decoded',
    title: 'Complexity Decoded',
    tagline: 'Master Complex Systems',
    description: 'Navigate high-level friction, entropy, and edge cases in any system you design.',
    color: 'linear-gradient(135deg, #7209B7 0%, #3F37C9 100%)',
    topics: ['System Design', 'Edge Cases', 'Optimization'],
    icon: <Brain className="w-8 h-8 text-[#A855F7]" />
  },
  {
    id: 'total-versatility',
    title: 'Total Versatility',
    tagline: 'Adaptive Engineering',
    description: 'Equip yourself to work in R&D, operations, product design, or field services.',
    color: 'linear-gradient(135deg, #F77F00 0%, #D62828 100%)',
    topics: ['Adaptive Solving', 'Crisis Mgmt', 'Operations'],
    icon: <Globe className="w-8 h-8 text-[#F97316]" />
  },
  {
    id: 'career-ready',
    title: 'Career-Ready Skills',
    tagline: 'Universal Professional Skills',
    description: 'Focus on building a robust foundation of universally applicable skills.',
    color: 'linear-gradient(135deg, #4CC9F0 0%, #4361EE 100%)',
    topics: ['Agile', 'Leadership', 'Management'],
    icon: <Zap className="w-8 h-8 text-[#3B82F6]" />
  },
  {
    id: 'devops-sre',
    title: 'DevOps & SRE',
    tagline: 'Infrastructure Excellence',
    description: 'Cloud infrastructure, reliability engineering, and automation for fintech.',
    color: 'linear-gradient(135deg, #00CED1 0%, #4682B4 100%)',
    topics: ['Kubernetes', 'AWS', 'CI/CD'],
    icon: <Cloud className="w-8 h-8 text-[#06B6D4]" />
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    tagline: 'iOS & Android',
    description: 'Native and cross-platform mobile app development for consumer tech.',
    color: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
    topics: ['Kotlin', 'Swift', 'React Native'],
    icon: <Smartphone className="w-8 h-8 text-[#EC4899]" />
  },
  {
    id: 'govt-psu',
    title: 'GATE & PSU Prior',
    tagline: 'Government & Public Sector',
    description: 'Comprehensive GATE, ESE, and PSU exam preparation for all branches.',
    color: 'linear-gradient(135deg, #228B22 0%, #006400 100%)',
    topics: ['GATE', 'Technical Core', 'Aptitude'],
    icon: <Landmark className="w-8 h-8 text-[#22C55E]" />
  },
  {
    id: 'full-stack',
    title: 'Full Stack Elite',
    tagline: 'Modern Web Engineering',
    description: 'End-to-end web development mastering both frontend and backend paradigms.',
    color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    topics: ['React', 'Node.js', 'System Design'],
    icon: <Cpu className="w-8 h-8 text-[#EAB308]" />
  }
];

const difficultyLabels = [
  'Intern',
  'Entry Level (0-1 yr)',
  'Junior (1-2 yrs)',
  'Mid Level (2-4 yrs)',
  'Senior (4-7 yrs)',
  'Lead (7-10 yrs)',
  'Principal (10+ yrs)',
  'Staff Engineer',
  'Distinguished',
  'Chief/Fellow'
];

export default function InterviewSetupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(3);
  const [isStarting, setIsStarting] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const initializeStreak = useGameStore((state) => state.initializeStreak);

  useEffect(() => {
    setMounted(true);
    initializeStreak();
  }, [initializeStreak]);

  const handleStartInterview = async () => {
    if (!selectedRole) return;
    
    setIsStarting(true);
    
    const params = new URLSearchParams({
      role: selectedRole,
      difficulty: difficulty.toString(),
      persona: 'Professional'
    });
    
    router.push(`/interview/session?${params.toString()}`);
  };

  const handleBack = () => {
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-y-auto overflow-x-hidden pb-40">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#EAB308]/5 blur-[250px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#3B82F6]/5 blur-[250px] pointer-events-none" />

      {/* Back Button */}
      <motion.button
        onClick={handleBack}
        className="fixed top-6 left-6 z-50 px-4 py-2 rounded-full bg-[#121212]/50 backdrop-blur-md border border-white/10 flex items-center gap-2 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm font-mono uppercase tracking-wider">Home</span>
      </motion.button>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-24 pb-12 text-center relative z-10 px-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121212]/50 backdrop-blur-md border border-white/10 mb-6 shadow-lg">
          <Sparkles className="w-3 h-3 text-[#EAB308]" />
          <span className="text-[10px] font-mono text-[#A3A3A3] tracking-[0.2em] uppercase">Configure Simulation</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] to-[#DFC278]">Domain</span>
        </h1>
        
        <p className="text-base text-[#A3A3A3] max-w-2xl mx-auto font-light leading-relaxed">
          Select your specialization. The AI will adapt its neural complexity to match your chosen path.
        </p>
      </motion.div>

      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        
        {/* Career Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
            {careerTracks.map((track) => {
              const isSelected = selectedRole === track.id;
              
              return (
                <motion.div
                  key={track.id}
                  onClick={() => setSelectedRole(track.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    cursor-pointer group relative overflow-hidden rounded-2xl p-6 transition-all duration-500
                    ${isSelected 
                      ? 'bg-[#121212] border-[#EAB308]/50 shadow-[0_0_30px_rgba(234,179,8,0.1)]' 
                      : 'bg-[#121212]/30 border-white/5 hover:bg-[#121212]/60 hover:border-white/10'
                    }
                    border backdrop-blur-sm
                  `}
                >
                  {/* Selection Indicator */}
                  <div className={`
                    absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300
                    ${isSelected ? 'bg-[#EAB308] border-[#EAB308]' : 'border-white/10 group-hover:border-white/30'}
                  `}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>

                  {/* Icon */}
                  <div className={`mb-5 p-3 rounded-xl inline-block transition-all duration-500 ${isSelected ? 'bg-[#EAB308]/10' : 'bg-white/5 group-hover:bg-white/10'}`}>
                    {track.icon}
                  </div>

                  <h3 className={`text-lg font-medium mb-2 tracking-wide ${isSelected ? 'text-white' : 'text-[#E5E5E5]'}`}>
                    {track.title}
                  </h3>
                  
                  <p className="text-[10px] text-[#EAB308] mb-4 font-mono tracking-wider uppercase opacity-80">
                    {track.tagline}
                  </p>

                  <p className="text-sm text-[#A3A3A3] line-clamp-2 leading-relaxed font-light mb-4 group-hover:text-[#D4D4D4] transition-colors">
                    {track.description}
                  </p>

                  {/* Topics Tags */}
                  <div className="flex flex-wrap gap-2">
                    {track.topics.map((t, i) => (
                       <span key={i} className="text-[10px] px-2 py-1 rounded bg-white/5 text-[#737373] border border-white/5 font-mono">
                         {t}
                       </span>
                    ))}
                  </div>

                  {/* Hover Detail - Glass Overlay */}
                  <div className={`
                    absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#EAB308] to-transparent
                    transition-opacity duration-500
                    ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
                  `}/>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Bottom Fixed Bar - Apple Style */}
      <AnimatePresence>
        {selectedRole && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 p-6 z-50 bg-[#050505]/90 backdrop-blur-xl border-t border-white/10"
          >
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="hidden md:block">
                 <div className="text-[10px] text-[#737373] uppercase tracking-widest mb-1 font-mono">Selected Path</div>
                 <div className="text-white font-medium text-sm flex items-center gap-2">
                    {careerTracks.find(t => t.id === selectedRole)?.title}
                    <span className="text-[#EAB308]">●</span>
                 </div>
              </div>

              <div className="flex-1 w-full md:max-w-md mx-auto md:mx-0">
                  <div className="flex justify-between text-[10px] text-[#A3A3A3] mb-2 uppercase tracking-wide font-mono">
                    <span>Difficulty: Level {difficulty}</span>
                    <span className="text-white">{difficultyLabels[difficulty]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="9"
                    step="1"
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#1F1F1F] rounded-lg appearance-none cursor-pointer accent-[#EAB308] hover:accent-[#DFC278] transition-all"
                  />
              </div>

              <motion.button
                onClick={handleStartInterview}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto bg-[#3B82F6] text-white px-8 py-3.5 rounded-full font-mono uppercase tracking-widest text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-[#3B82F6]/50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isStarting}
              >
                 {isStarting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Initializing...</span>
                    </>
                 ) : (
                    <>
                      <span>Begin Simulation</span>
                      <Target className="w-4 h-4" />
                    </>
                 )}
              </motion.button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
