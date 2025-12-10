'use client';

import React, { useState } from 'react';
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

export default function AppleInterviewSetup() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(5);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartInterview = async () => {
    if (!selectedRole) return;
    
    setIsStarting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    router.push(`/interview/session?role=${selectedRole}&difficulty=${difficulty}`);
  };

  return (
    <div className="apple-bg">
      <div className="apple-container min-h-screen flex flex-col justify-center py-20">
        
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
          
          <div className="selection-grid">
            {engineeringRoles.map((role, index) => (
              <motion.div
                key={role.id}
                className={`selection-card fade-in-up stagger-${(index % 5) + 1} ${
                  selectedRole === role.id ? 'selected' : ''
                }`}
                onClick={() => setSelectedRole(role.id)}
                whileHover={{ scale: 1.02 }}
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
                
                <div className="flex flex-wrap gap-2">
                  {role.topics.slice(0, 3).map((topic) => (
                    <span 
                      key={topic}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                  {role.topics.length > 3 && (
                    <span className="text-xs px-2 py-1">
                      +{role.topics.length - 3}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Difficulty Selection */}
        <AnimatePresence>
          {selectedRole && (
            <motion.div
              className="glass-card max-w-3xl mx-auto w-full mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="heading-md mb-6 text-center">
                Difficulty Level
              </h2>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="body-md">
                    {difficultyLabels[difficulty - 1]}
                  </span>
                  <span className="text-3xl font-bold" style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {difficulty}/10
                  </span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                  className="glass-slider w-full"
                />
                
                <div className="flex justify-between mt-2">
                  {[1, 5, 10].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className="caption hover:text-white transition-colors"
                    >
                      {level === 1 && 'Easy'}
                      {level === 5 && 'Medium'}
                      {level === 10 && 'Expert'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Preview */}
              <div className="glass-card bg-opacity-50 p-4 mb-6">
                <div className="flex items-center gap-4 mb-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ background: engineeringRoles.find(r => r.id === selectedRole)?.color }}
                  >
                    {engineeringRoles.find(r => r.id === selectedRole)?.title.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">
                      {engineeringRoles.find(r => r.id === selectedRole)?.title}
                    </div>
                    <div className="glass-progress">
                      <motion.div
                        className="glass-progress-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${difficulty * 10}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-right">
                    <div className="font-bold">Level {difficulty}</div>
                    <div className="caption">{difficultyLabels[difficulty - 1]}</div>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <motion.button
                className="glass-button-primary w-full text-lg py-4"
                onClick={handleStartInterview}
                disabled={isStarting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isStarting ? 'Preparing Interview...' : 'Start Interview'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Footer */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Adaptive', desc: 'AI adjusts to your level' },
              { title: 'Unlimited', desc: '224M+ unique questions' },
              { title: 'Instant', desc: '<30ms response time' }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="glass-card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <div className="font-semibold mb-1">{feature.title}</div>
                <div className="caption">{feature.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
