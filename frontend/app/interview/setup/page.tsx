'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, Sparkles, Target, Zap, TrendingUp } from 'lucide-react';
import { useGameStore } from '@/lib/store/gameStore';
import '@/app/luxury-watch-theme.css';
import '@/app/jetbrains-font.css';

// ALL Engineering Career Tracks - Comprehensive Universal Paths
const careerTracks = [
  {
    id: 'logic-precision',
    initial: 'L',
    title: 'Logic & Precision',
    tagline: 'Precision Engineering Fundamentals',
    description: 'The essential toolkit for every engineer who values accuracy over approximation.',
    detailedDesc: 'Master the core logic and critical thinking that supports every engineering discipline, from circuits to concrete. Patterns change, but logic doesn\'t.',
    color: 'linear-gradient(135deg, #2A9D8F 0%, #264653 100%)',
    topics: ['Critical Thinking', 'Precision Analysis', 'Core Logic', 'Risk Assessment'],
    companies: ['R&D Departments', 'Product Design', 'Quality Assurance', 'Field Engineering'],
    salary: '₹5-25 LPA',
    difficulty: 'All Levels',
    icon: '🎯'
  },
  {
    id: 'complexity-decoded',
    initial: 'C',
    title: 'Complexity Decoded',
    tagline: 'Master Complex Systems',
    description: 'Navigate high-level friction, entropy, and edge cases in any system you design.',
    detailedDesc: 'Tackle the toughest problems in the industry. Whether optimizing algorithms or infrastructure, learn to build what hasn\'t been built yet.',
    color: 'linear-gradient(135deg, #7209B7 0%, #3F37C9 100%)',
    topics: ['System Design', 'Edge Case Analysis', 'Entropy Management', 'Optimization'],
    companies: ['Innovation Labs', 'Advanced Technology Groups', 'Deep Tech', 'Architecture'],
    salary: '₹12-45 LPA',
    difficulty: 'Advanced',
    icon: '🧩'
  },
  {
    id: 'total-versatility',
    initial: 'V',
    title: 'Total Versatility',
    tagline: 'Adaptive Engineering',
    description: 'Equip yourself to work in R&D, operations, product design, or field services.',
    detailedDesc: 'Be the engineer who thrives anywhere. Gain the versatility to design products, manage services, and solve real-world crises.',
    color: 'linear-gradient(135deg, #F77F00 0%, #D62828 100%)',
    topics: ['Adaptive Solving', 'Crisis Management', 'Cross-Domain Skills', 'Operations'],
    companies: ['Operations', 'Consulting', 'Startups', 'Global Services'],
    salary: '₹8-30 LPA',
    difficulty: 'All Levels',
    icon: '🌐'
  },
  {
    id: 'career-ready',
    initial: 'S',
    title: 'Career-Ready Skills',
    tagline: 'Universal Professional Skills',
    description: 'Focus on building a robust foundation of universally applicable skills.',
    detailedDesc: 'Develop the agility to pivot and excel in any engineering environment. Focus on transferable skills that transcend specific company requirements.',
    color: 'linear-gradient(135deg, #4CC9F0 0%, #4361EE 100%)',
    topics: ['Agile Methodology', 'Team Dynamics', 'Project Management', 'Communication'],
    companies: ['All Industries', 'Management', 'Leadership', 'Strategy'],
    salary: '₹6-20 LPA',
    difficulty: 'Intermediate',
    icon: '🚀'
  }
];
    initial: 'O',
    title: 'DevOps & SRE',
    tagline: 'Infrastructure Excellence',
    description: 'Cloud infrastructure, reliability engineering, and automation for fintech companies',
    detailedDesc: 'For engineers interested in operations and infrastructure. Covers Kubernetes, AWS, CI/CD, and site reliability engineering.',
    color: 'linear-gradient(135deg, #00CED1 0%, #4682B4 100%)',
    topics: ['Kubernetes', 'AWS', 'CI/CD', 'Monitoring'],
    companies: ['Zerodha', 'PhonePe', 'Paytm', 'Razorpay'],
    salary: '₹10-28 LPA',
    difficulty: 'Intermediate to Advanced',
    icon: '☁️'
  },
  {
    id: 'mobile',
    initial: 'A',
    title: 'Mobile Development',
    tagline: 'iOS & Android',
    description: 'Native and cross-platform mobile app development for consumer tech companies',
    detailedDesc: 'For mobile app developers. Covers Android (Kotlin), iOS (Swift), React Native, and Flutter development.',
    color: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
    topics: ['Kotlin', 'Swift', 'React Native', 'Flutter'],
    companies: ['Ola', 'Myntra', 'CRED', 'PhonePe'],
    salary: '₹8-22 LPA',
    difficulty: 'Intermediate to Advanced',
    icon: '📱'
  },
  {
    id: 'govt-psu',
    initial: 'G',
    title: 'GATE & PSU Preparation',
    tagline: 'Government & Public Sector',
    description: 'Comprehensive GATE, ESE, and PSU exam preparation for all engineering branches',
    detailedDesc: 'For engineers targeting government jobs. Covers GATE syllabus, ESE pattern, technical core subjects, and general aptitude for all branches.',
    color: 'linear-gradient(135deg, #228B22 0%, #006400 100%)',
    topics: ['GATE Syllabus', 'ESE Pattern', 'Technical Core', 'GA'],
    companies: ['ISRO', 'DRDO', 'BHEL', 'NTPC'],
    salary: '₹6-18 LPA',
    difficulty: 'All Levels',
    icon: '🏛️'
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
  const [showDetails, setShowDetails] = useState<string | null>(null);
  
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

  const selectedTrack = careerTracks.find(t => t.id === selectedRole);

  return (
    <div 
      className="min-h-screen" 
      style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #191970 50%, #0a0e1a 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Back Button - Luxury Watch Crown Style */}
      <motion.button
        onClick={handleBack}
        className="fixed top-6 left-6 z-50 watch-button-secondary flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Home</span>
      </motion.button>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="watch-heading-xl mb-4">
            Choose Your Mastery Path
          </h1>
          <p className="watch-body text-lg mb-8 max-w-3xl mx-auto" style={{ color: 'rgba(229, 228, 226, 0.8)' }}>
            Elite preparation for every engineering discipline. From campus placements to FAANG interviews, from core engineering to cutting-edge tech.
          </p>
          
          {/* Premium Stats - Watch Complications Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: '1.2B+ Questions', icon: <Sparkles className="w-5 h-5" />, color: '#B76E79' },
              { label: '99.9 Unique', icon: <Target className="w-5 h-5" />, color: '#E5E4E2' },
              { label: 'Adaptive AI', icon: <Zap className="w-5 h-5" />, color: '#FFD700' },
              { label: 'All Branches', icon: <TrendingUp className="w-5 h-5" />, color: '#50C878' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="watch-card p-4 text-center group hover:scale-105 transition-transform"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-center mb-2" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="watch-body text-sm font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Career Tracks Grid - Luxury Watch Collection */}
        <div className="mb-16">
          <h2 className="watch-heading-md mb-8 text-center" style={{ color: 'var(--watch-platinum)' }}>
            Engineering Specializations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerTracks.map((track, index) => {
              const isSelected = selectedRole === track.id;
              
              return (
                <motion.div
                  key={track.id}
                  className={`watch-card cursor-pointer relative overflow-hidden group ${
                    isSelected ? 'ring-2 ring-rose-gold' : ''
                  }`}
                  style={{
                    borderColor: isSelected ? 'var(--watch-rose-gold)' : 'rgba(183, 110, 121, 0.3)'
                  }}
                  onClick={() => setSelectedRole(track.id)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Gradient Overlay */}
                  <div 
                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ background: track.color }}
                  />
                  
                  <div className="relative z-10 p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform"
                        style={{ background: track.color }}
                      >
                        {track.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="watch-heading-md text-lg mb-1">{track.title}</h3>
                        <p className="text-xs font-semibold" style={{ 
                          background: track.color,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          {track.tagline}
                        </p>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm mb-4" style={{ color: 'rgba(250, 250, 250, 0.7)' }}>
                      {track.description}
                    </p>
                    
                    {/* Companies */}
                    <div className="mb-3 flex flex-wrap gap-1">
                      {track.companies.map((company, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: 'rgba(183, 110, 121, 0.2)',
                            border: '1px solid rgba(183, 110, 121, 0.3)',
                            color: 'var(--watch-champagne)'
                          }}
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                    
                    {/* Topics */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {track.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full backdrop-blur-sm"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-xs font-semibold" style={{ color: 'var(--watch-rose-gold)' }}>
                        {track.salary}
                      </span>
                      <span className="text-xs" style={{ color: 'rgba(250, 250, 250, 0.5)' }}>
                        {track.difficulty}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selector - Watch Power Reserve Style */}
        <AnimatePresence>
          {selectedRole && selectedTrack && (
            <motion.div
              className="max-w-3xl mx-auto watch-modal border border-white/10 bg-black/50 backdrop-blur-md p-6 sticky bottom-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                 <div>
                    <h3 className="watch-heading-sm mb-2">Select Difficulty</h3>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={difficulty}
                        onChange={(e) => setDifficulty(parseInt(e.target.value))}
                        className="w-48 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                      <span className="watch-body font-bold text-white w-8 text-center">{difficulty}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{difficultyLabels[difficulty-1]}</p>
                 </div>

                 <motion.button
                   onClick={handleStartInterview}
                   className="watch-button-primary px-8 py-3 flex items-center gap-2"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   {isStarting ? (
                     <>
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                        Initializing...
                     </>
                   ) : (
                     <>
                        <Target className="w-5 h-5" />
                        Start Interview (+50 XP)
                     </>
                   )}
                 </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Spacer for fixed bottom bar */}
        {selectedRole && <div className="h-32"></div>}

      </div>
    </div>
  );
}
