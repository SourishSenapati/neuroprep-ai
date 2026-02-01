'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Target, Sparkles, Zap, Brain, Globe, Cloud, Smartphone, 
  Landmark, Cpu, Code2, Settings, Beaker, Briefcase, Building2, 
  Anchor, Ruler, Microscope, Factory, Leaf, Plane, Bot, Activity, 
  Waves, Hammer, Trophy, Flame, User, FileText, Scan
} from 'lucide-react';
import { useGameStore } from '@/lib/store/gameStore';
import { UserProfileModal } from '@/components/social/UserProfileModal';

// ALL Engineering Career Tracks - Comprehensive Universal Paths
// ALL Engineering Career Tracks - Comprehensive Universal Paths
const careerTracks = [
  // Special Features First
  {
    id: 'jd-analysis',
    title: 'Analyze Job Description',
    tagline: 'Custom Role Match',
    description: 'Paste a Job Description. Our AI will extract key skills and generate a tailored interview.',
    topics: ['JD Parsing', 'Skill Extraction', 'Custom Role'],
    icon: <FileText className="w-8 h-8 text-white" />,
    isSpecial: true
  },
  {
    id: 'resume-guidance',
    title: 'Resume & Career',
    tagline: 'Personalized Path',
    description: 'Upload your resume. AI will find knowledge gaps and recommend a learning path.',
    topics: ['Resume Review', 'Gap Analysis', 'Career Path'],
    icon: <Scan className="w-8 h-8 text-white" />,
    isSpecial: true
  },
  {
    id: 'cs-elite',
    title: 'Computer Science Elite',
    tagline: 'Software & Algorithms',
    description: 'Master Data Structures, System Design, and Algorithms for top tech roles.',
    topics: ['DSA', 'System Design', 'OS/DBMS'],
    icon: <Code2 className="w-8 h-8 text-[#3B82F6]" />
  },
  // ... rest of the tracks
  {
    id: 'mechanical-core',
    title: 'Mechanical & Auto',
    tagline: 'Design & Thermodynamics',
    description: 'For roles in Automotive, Aerospace, and Machinery. Thermodynamics, SOM, and CAD.',
    topics: ['Thermodynamics', 'Machine Design', 'Fluid Mechanics'],
    icon: <Settings className="w-8 h-8 text-[#F97316]" />
  },
  {
    id: 'electrical-systems',
    title: 'Electrical Systems',
    tagline: 'Circuits & Power',
    description: 'Power systems, Analog/Digital Electronics, and Control Systems engineering.',
    topics: ['Circuit Theory', 'Power Systems', 'Control Systems'],
    icon: <Zap className="w-8 h-8 text-[#EAB308]" />
  },
  {
    id: 'electronics-comm',
    title: 'Electronics & Comm',
    tagline: 'VLSI & Embedded',
    description: 'VLSI Design, Embedded Systems, IoT and Communication Networks.',
    topics: ['VLSI', 'Embedded C', 'DSP'],
    icon: <Cpu className="w-8 h-8 text-[#8B5CF6]" />
  },
  {
    id: 'civil-structures',
    title: 'Civil & Structural',
    tagline: 'Infrastructure & Design',
    description: 'Structural Analysis, Geotechnical Engg, and Concrete Technology.',
    topics: ['Structures', 'Geotech', 'Construction'],
    icon: <Building2 className="w-8 h-8 text-[#14B8A6]" />
  },
  {
    id: 'chemical-process',
    title: 'Chemical & Process',
    tagline: 'Plant Design',
    description: 'Process Control, Mass Transfer, and Plant Design for Oil & Gas/Pharma.',
    topics: ['Mass Transfer', 'Thermodynamics', 'Plant Design'],
    icon: <Beaker className="w-8 h-8 text-[#EC4899]" />
  },
  {
    id: 'aerospace-eng',
    title: 'Aerospace & Avionics',
    tagline: 'Flight & Propulsion',
    description: 'Aerodynamics, Propulsion systems, and Avionics for defense and space sectors.',
    topics: ['Aerodynamics', 'Propulsion', 'Avionics'],
    icon: <Plane className="w-8 h-8 text-[#0EA5E9]" />
  },
  {
    id: 'biomedical-eng',
    title: 'Biomedical Engg',
    tagline: 'Medical Tech',
    description: 'Medical instrumentation, Biomechanics, and Healthcare technology.',
    topics: ['Biomechanics', 'Instrumentation', 'Anatomy'],
    icon: <Activity className="w-8 h-8 text-[#F43F5E]" />
  },
  {
    id: 'industrial-prod',
    title: 'Industrial & Prod',
    tagline: 'Operations & Supply',
    description: 'Supply chain management, Operations Research, and Manufacturing processes.',
    topics: ['Operations Research', 'Supply Chain', 'Manufacturing'],
    icon: <Factory className="w-8 h-8 text-[#A3E635]" />
  },
  {
    id: 'robotics-mechatronics',
    title: 'Robotics & Mecha',
    tagline: 'Automation & AI',
    description: 'Robotics, PLC/SCADA, and Automation Engineering.',
    topics: ['Robotics', 'Control Systems', 'AI'],
    icon: <Bot className="w-8 h-8 text-[#6366F1]" />
  },
  {
    id: 'environmental-eng',
    title: 'Environmental Engg',
    tagline: 'Sustainability',
    description: 'Water treatment, Waste management, and Sustainable engineering.',
    topics: ['Water Treatment', 'Sustainability', 'Waste Mgmt'],
    icon: <Leaf className="w-8 h-8 text-[#22C55E]" />
  },
  {
    id: 'metallurgy-mining',
    title: 'Metallurgy & Mining',
    tagline: 'Materials Science',
    description: 'Extraction, Material Science, and Mining operations.',
    topics: ['Materials Science', 'Extraction', 'Mining'],
    icon: <Hammer className="w-8 h-8 text-[#78716C]" />
  },
  {
    id: 'marine-naval',
    title: 'Marine & Naval',
    tagline: 'Ocean Engineering',
    description: 'Ship building, Fluid dynamics, and Offshore engineering.',
    topics: ['Fluid Dynamics', 'Ship Design', 'Offshore'],
    icon: <Anchor className="w-8 h-8 text-[#1E3A8A]" />
  },
  {
    id: 'instrumentation',
    title: 'Instrumentation',
    tagline: 'Sensors & Control',
    description: 'Process instrumentation, Sensors, and Industrial automation.',
    topics: ['Sensors', 'Transducers', 'Automation'],
    icon: <Ruler className="w-8 h-8 text-[#D946EF]" />
  },
  {
    id: 'textile-eng',
    title: 'Textile Engineering',
    tagline: 'Fiber & Fabric',
    description: 'Fiber science, Yarn manufacturing, and Textile chemistry.',
    topics: ['Fiber Science', 'Weaving', 'Chemistry'],
    icon: <Microscope className="w-8 h-8 text-[#DB2777]" />
  },
  {
    id: 'ocean-eng',
    title: 'Ocean Engineering',
    tagline: 'Coastal & Offshore',
    description: 'Coastal engineering, Hydrodynamics, and Underwater technology.',
    topics: ['Hydrodynamics', 'Coastal Engg', 'Underwater'],
    icon: <Waves className="w-8 h-8 text-[#0284C7]" />
  },
  {
    id: 'full-stack',
    title: 'Full Stack Elite',
    tagline: 'Web Engineering',
    description: 'End-to-end web development with React, Node.js, and Cloud.',
    topics: ['React', 'Node.js', 'System Design'],
    icon: <Globe className="w-8 h-8 text-[#06B6D4]" />
  },
  {
    id: 'devops-sre',
    title: 'DevOps & SRE',
    tagline: 'Cloud Infrastructure',
    description: 'CI/CD, Kubernetes, and Cloud Architecture (AWS/Azure).',
    topics: ['Kubernetes', 'AWS', 'Docker'],
    icon: <Cloud className="w-8 h-8 text-[#64748B]" />
  },
  {
    id: 'management-consulting',
    title: 'Mgmt & Consulting',
    tagline: 'Business & Strategy',
    description: 'Case studies, Guessti-mates, and Aptitude for non-tech/consulting roles.',
    topics: ['Case Studies', 'Aptitude', 'Strategy'],
    icon: <Briefcase className="w-8 h-8 text-[#10B981]" />
  },
  {
    id: 'govt-psu',
    title: 'GATE & PSU Prior',
    tagline: 'Government Sector',
    description: 'Comprehensive preparation for GATE, ESE, ISRO, and BARC exams.',
    topics: ['GATE Syllabus', 'Technical Core', 'Aptitude'],
    icon: <Building2 className="w-8 h-8 text-[#EF4444]" />
  },
  {
    id: 'universal-logic',
    title: 'Universal Logic',
    tagline: 'Aptitude & Reasoning',
    description: 'General Aptitude, Logical Reasoning, and Quant for all placement tests.',
    topics: ['Quantitative', 'Logical Reasoning', 'Verbal'],
    icon: <Target className="w-8 h-8 text-[#F59E0B]" />
  },
  {
    id: 'data-science',
    title: 'Data Science & AI',
    tagline: 'ML & Analytics',
    description: 'Machine Learning, Deep Learning, and Statistical analysis.',
    topics: ['ML', 'Python', 'Stats'],
    icon: <Brain className="w-8 h-8 text-[#A855F7]" />
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const initializeStreak = useGameStore((state) => state.initializeStreak);
  const streak = useGameStore((state) => state.streak) || 0;
  const xp = useGameStore((state) => state.xp) || 0;

  useEffect(() => {
    setMounted(true);
    initializeStreak();
  }, [initializeStreak]);

  const handleStartInterview = async () => {
    if (!selectedRole) return;
    
    setIsStarting(true);
    
    // Check for special modes
    if (selectedRole === 'jd-analysis') {
         const params = new URLSearchParams({
            role: 'Job Description Analysis', // Identifying Role
            mode: 'jd-analysis',
            difficulty: difficulty.toString(),
            persona: 'Recruiter'
         });
         router.push(`/interview/session?${params.toString()}`);
         return;
    }

    if (selectedRole === 'resume-guidance') {
         const params = new URLSearchParams({
            role: 'Resume Review', // Identifying Role
            mode: 'resume-guidance',
            difficulty: difficulty.toString(),
            persona: 'Career Coach'
         });
         router.push(`/interview/session?${params.toString()}`);
         return;
    }

    const params = new URLSearchParams({
      role: careerTracks.find(t => t.id === selectedRole)?.title || selectedRole, // Pass title instead of ID for better AI Context
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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-y-auto overflow-x-hidden pb-40 font-sans selection:bg-[#4ADE80]/30">
      {/* Refined Background Glows - Green theme */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[#1e293b]/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#4ADE80]/5 blur-[150px] pointer-events-none" />


      {/* User Profile Modal */}
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* Back Button - Minimalist */}
      <motion.button
        onClick={handleBack}
        className="fixed top-6 left-6 z-50 px-4 py-2 rounded-full bg-[#050505]/80 backdrop-blur-md border border-white/5 flex items-center gap-2 text-[#737373] hover:text-white hover:border-white/10 transition-all group"
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-xs font-medium tracking-tight">Return</span>
      </motion.button>
      
      {/* Gamification Stats - Clickable Profile Trigger */}
      <motion.button 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setIsProfileOpen(true)}
        className="fixed top-6 right-6 z-50 flex items-center gap-3 cursor-pointer group hover:scale-105 transition-transform"
      >
        <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[10px] text-[#525252] font-mono uppercase tracking-widest leading-none mb-1">Career Athlete</span>
            <span className="text-xs font-bold text-white leading-none">Guest User</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-[#050505]/80 backdrop-blur-md border border-white/5 flex items-center gap-2 text-[#EAB308] group-hover:bg-[#EAB308]/10 transition-colors">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span className="text-xs font-semibold">{streak}</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-[#050505]/80 backdrop-blur-md border border-white/5 flex items-center gap-2 text-[#4ADE80] group-hover:bg-[#4ADE80]/10 transition-colors">
          <Trophy className="w-3.5 h-3.5 fill-current" />
          <span className="text-xs font-semibold">{xp} XP</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center text-[#737373] group-hover:text-white group-hover:border-white/30 transition-all">
            <User className="w-4 h-4" />
        </div>
      </motion.button>

      {/* Header - Centered & Clean */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-32 pb-16 text-center relative z-10 px-6 max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-medium mb-6 tracking-tight text-white leading-tight">
          Select your <span className="text-[#A3A3A3] italic">specialization</span>.
        </h1>
        
        <p className="text-base text-[#525252] max-w-xl mx-auto font-normal leading-relaxed">
          The simulation adapts its neural complexity to your chosen engineering discipline.
        </p>
      </motion.div>

      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-32">
            {careerTracks.map((track) => {
              const isSelected = selectedRole === track.id;
              
              return (
                <motion.div
                  key={track.id}
                  onClick={() => setSelectedRole(track.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className={`
                    cursor-pointer group relative overflow-hidden rounded-xl p-5 transition-all duration-300
                    ${isSelected 
                      ? 'bg-[#121212] ring-1 ring-[#4ADE80]/30 shadow-[0_0_20px_rgba(74,222,128,0.1)]' 
                      : 'bg-[#0A0A0A] border border-white/5 hover:border-white/10 hover:bg-[#121212]'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-lg transition-colors duration-300 ${isSelected ? 'bg-[#4ADE80]/10' : 'bg-[#171717] group-hover:bg-[#262626]'}`}>
                      {React.cloneElement(track.icon as React.ReactElement, {
                        className: `w-5 h-5 transition-colors duration-300 ${isSelected ? '' : 'text-[#737373] group-hover:text-white'}`
                      })}
                    </div>
                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-[#4ADE80]"
                      />
                    )}
                  </div>

                  <h3 className={`text-base font-medium mb-1 tracking-tight ${isSelected ? 'text-white' : 'text-[#E5E5E5]'}`}>
                    {track.title}
                  </h3>
                  
                  <p className="text-[10px] text-[#A3A3A3] mb-3 font-medium uppercase tracking-wider opacity-60">
                    {track.tagline}
                  </p>

                  {/* Topics Tags - Only visible on hover or selection to reduce clutter */}
                  <div className={`flex flex-wrap gap-1.5 transition-opacity duration-300 ${isSelected || 'md:opacity-40 md:group-hover:opacity-100'}`}>
                    {track.topics.slice(0, 2).map((t, i) => (
                       <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-[#737373] border border-white/5">
                         {t}
                       </span>
                    ))}
                    {track.topics.length > 2 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-[#5e5e5e] border border-white/5">
                            +{track.topics.length - 2}
                        </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Bottom Floating Action Bar - Sleek & Functional */}
      <AnimatePresence>
        {selectedRole && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-8 left-0 right-0 z-50 px-6 flex justify-center pointer-events-none"
          >
            <div className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl w-full max-w-3xl pointer-events-auto flex flex-col md:flex-row items-center gap-6">
              
              {/* Selected Track Info */}
              <div className="hidden md:flex flex-col min-w-[140px]">
                 <div className="text-[10px] text-[#525252] uppercase tracking-wider font-semibold mb-1">Target Role</div>
                 <div className="text-white text-sm font-medium truncate">
                    {careerTracks.find(t => t.id === selectedRole)?.title}
                 </div>
              </div>

              {/* Decorative Divider */}
              <div className="hidden md:block w-px h-8 bg-white/10" />

              {/* Difficulty Slider */}
              <div className="flex-1 w-full">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#525252] uppercase tracking-wider font-semibold mb-0.5">Experience Level</span>
                        <span className="text-white text-xs font-medium">{difficultyLabels[difficulty]}</span>
                    </div>
                    <div className="text-[#4ADE80] text-[10px] font-bold bg-[#4ADE80]/10 px-2 py-0.5 rounded-full">
                        +{(difficulty + 1) * 50} Potential XP
                    </div>
                  </div>
                  <input
                    aria-label="Difficulty Level"
                    type="range"
                    min="0"
                    max="9"
                    step="1"
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#262626] rounded-full appearance-none cursor-pointer accent-[#4ADE80] hover:accent-[#86EFAC] transition-all"
                  />
              </div>

              {/* Start Button */}
              <motion.button
                onClick={handleStartInterview}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto bg-white text-black px-6 py-3 rounded-xl font-semibold text-sm shadow-xl hover:bg-[#F5F5F5] transition-colors flex items-center justify-center gap-2 whitespace-nowrap min-w-[160px]"
                disabled={isStarting}
              >
                 {isStarting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Loading...</span>
                    </>
                 ) : (
                    <>
                      <span>Start Simulation</span>
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
