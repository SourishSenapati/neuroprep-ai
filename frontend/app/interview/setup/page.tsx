'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import '@/styles/apple-glass.css';

interface EngineeringRole {
  id: string;
  title: string;
  description: string;
  color: string;
  topics: string[];
}

const engineeringRoles: EngineeringRole[] = [
  {
    id: 'frontend',
    title: 'Frontend Engineer',
    description: 'React, Vue, Angular, UI/UX',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    topics: ['React', 'TypeScript', 'CSS', 'Performance']
  },
  {
    id: 'backend',
    title: 'Backend Engineer',
    description: 'Node.js, Python, APIs, Databases',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    topics: ['System Design', 'Databases', 'APIs', 'Scalability']
  },
  {
    id: 'fullstack',
    title: 'Fullstack Engineer',
    description: 'End-to-end development',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    topics: ['Frontend', 'Backend', 'DevOps', 'Architecture']
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    description: 'CI/CD, Cloud, Infrastructure',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    topics: ['Kubernetes', 'AWS', 'CI/CD', 'Monitoring']
  },
  {
    id: 'ml',
    title: 'ML Engineer',
    description: 'Machine Learning, AI, Data',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    topics: ['TensorFlow', 'PyTorch', 'MLOps', 'NLP']
  },
  {
    id: 'mobile',
    title: 'Mobile Engineer',
    description: 'iOS, Android, React Native',
    color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    topics: ['Swift', 'Kotlin', 'React Native', 'Flutter']
  },
  {
    id: 'security',
    title: 'Security Engineer',
    description: 'Cybersecurity, Penetration Testing',
    color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    topics: ['AppSec', 'Pentesting', 'Cryptography', 'OWASP']
  },
  {
    id: 'civil',
    title: 'Civil Engineer',
    description: 'Structural, Construction',
    color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    topics: ['Structural Design', 'CAD', 'Materials', 'Construction']
  },
  {
    id: 'mechanical',
    title: 'Mechanical Engineer',
    description: 'Thermodynamics, Mechanics',
    color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    topics: ['Thermodynamics', 'CAD', 'Manufacturing', 'Robotics']
  },
  {
    id: 'electrical',
    title: 'Electrical Engineer',
    description: 'Circuits, Power Systems',
    color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    topics: ['Circuits', 'Power Systems', 'Electronics', 'Control']
  },
  {
    id: 'data',
    title: 'Data Engineer',
    description: 'ETL, Data Pipelines, Analytics',
    color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    topics: ['SQL', 'Spark', 'Data Warehousing', 'ETL']
  },
  {
    id: 'chemical',
    title: 'Chemical Engineer',
    description: 'Process Design, Chemistry',
    color: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    topics: ['Process Design', 'Thermodynamics', 'Chemistry', 'Safety']
  }
];

const difficultyLabels = [
  'Beginner',
  'Entry Level',
  'Junior',
  'Mid Level',
  'Senior',
  'Expert',
  'Principal',
  'Distinguished',
  'Fellow',
  'Legendary'
];

export default function InterviewSetupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(5);
  const [isStarting, setIsStarting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartInterview = async () => {
    if (!selectedRole) return;
    
    setIsStarting(true);
    // Simulate prep time
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push(`/interview/session?role=${selectedRole}&difficulty=${difficulty}`);
  };

  if (!mounted) return null;

  return (
    <div className="apple-bg min-h-screen overflow-y-auto overflow-x-hidden">
      <div className="apple-container min-h-screen flex flex-col justify-start py-20 px-4 max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="heading-xl mb-4">
            Choose Your Path
          </h1>
          
          <p className="body-lg max-w-2xl mx-auto">
            Select your engineering discipline and skill level to begin your personalized interview experience.
          </p>
          
          <div className="flex gap-3 justify-center mt-6 flex-wrap">
            <span className="glass-badge glass-badge-blue">224M+ Questions</span>
            <span className="glass-badge">99.9% Unique</span>
            <span className="glass-badge">Adaptive AI</span>
          </div>
        </motion.div>

        {/* Role Selection */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="heading-md mb-6 text-center">
            Engineering Discipline
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {engineeringRoles.map((role, index) => (
              <motion.div
                key={role.id}
                className={`glass-card cursor-pointer transition-all duration-300 ${
                  selectedRole === role.id 
                    ? 'ring-2 ring-blue-500 bg-white/10' 
                    : 'hover:bg-white/5 opacity-80 hover:opacity-100'
                }`}
                onClick={() => setSelectedRole(role.id)}
                whileHover={{ y: -5,  scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div 
                  className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-xl"
                  style={{ background: role.color }}
                >
                  {role.title.charAt(0)}
                </div>
                
                <h3 className="heading-md text-lg mb-2">
                  {role.title}
                </h3>
                
                <p className="caption mb-3">
                  {role.description}
                </p>
                
                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wide opacity-70">
                   {role.topics.slice(0, 3).join(' • ')}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Difficulty Selection */}
        <AnimatePresence>
          {selectedRole && (
            <motion.div
              className="fixed bottom-0 left-0 w-full z-50 p-4 border-t border-white/10 backdrop-blur-xl bg-black/60"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 justify-between">
                
                <div className="flex-1 w-full">
                    <div className="flex justify-between mb-2 text-sm font-medium">
                        <span>Difficulty: {difficultyLabels[difficulty - 1]}</span>
                        <span className="text-blue-400">{difficulty}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={difficulty}
                      onChange={(e) => setDifficulty(parseInt(e.target.value))}
                      className="w-full"
                    />
                </div>

                <motion.button
                  className="glass-button-primary px-8 py-3 whitespace-nowrap w-full md:w-auto text-lg font-semibold"
                  onClick={handleStartInterview}
                  disabled={isStarting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isStarting ? 'Preparing...' : 'Start Interview'}
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
