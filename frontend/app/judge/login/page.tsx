'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Crown, Zap, Unlock } from 'lucide-react';

/**
 * JUDGE MODE - VIP Backdoor Access
 * Bypasses auth, pre-loads perfect data, instant demo
 * NO LOGIN REQUIRED - Red carpet treatment for hackathon judges
 */

export default function JudgeLogin() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Immediately hydrate with judge data
    activateJudgeMode();
  }, []);

  const activateJudgeMode = () => {
    // 1. Set auth token (bypass login)
    localStorage.setItem('token', 'JUDGE_VIP_ACCESS_TOKEN_2024');
    
    // 2. Set perfect user data
    const judgeUser = {
      id: 'judge_vip_001',
      name: 'Honorable Judge',
      email: 'judge@hackathon.com',
      role: 'VIP Evaluator',
      isPremium: true,
      isJudge: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('user', JSON.stringify(judgeUser));

    // 3. Pre-load Steve Jobs resume data
    const steveJobsResume = {
      name: 'Steve Jobs',
      email: 'steve@apple.com',
      phone: '+1 (555) APPLE-01',
      role: 'Senior Software Engineer',
      experienceLevel: 'Senior Engineer',
      skills: [
        'System Design',
        'Product Vision',
        'Leadership',
        'Innovation',
        'iOS Development',
        'Swift',
        'Objective-C',
        'Python',
        'Machine Learning',
        'UI/UX Design',
        'Agile Methodology',
        'Team Building',
        'Public Speaking',
        'Strategic Planning',
        'Cloud Architecture'
      ],
      education: [
        'Stanford University - Computer Science',
        'Reed College - Liberal Arts'
      ],
      experience: '15+ years in technology and product development',
      summary: 'Visionary technologist with proven track record of building revolutionary products. Expert in combining technology with design thinking to create user-centric solutions.'
    };
    localStorage.setItem('parsed_resume', JSON.stringify(steveJobsResume));

    // 4. Pre-populate gamification data (looks impressive)
    const gameData = {
      xp: 2450,
      streak: 14,
      level: 8,
      lastActiveDate: new Date().toISOString().split('T')[0],
      sessionsCompleted: 47,
      questionsAnswered: 234,
      codeExecutions: 89,
      achievements: [
        '🔥 First Streak',
        '💯 100 Questions Answered',
        '🎯 10 Roasts Completed',
        '🧘 Focus Master',
        '🏆 Interview Pro'
      ]
    };
    localStorage.setItem('neuroprep-game-storage', JSON.stringify({ state: gameData }));

    // 5. Pre-populate interview history (perfect growth trend)
    const perfectMetrics = {
      sessions: [
        { date: '2024-12-01', score: 65, duration: 45, topic: 'System Design' },
        { date: '2024-12-03', score: 72, duration: 52, topic: 'Algorithms' },
        { date: '2024-12-05', score: 78, duration: 48, topic: 'Frontend' },
        { date: '2024-12-08', score: 85, duration: 55, topic: 'Backend' },
        { date: '2024-12-10', score: 88, duration: 50, topic: 'Cloud Architecture' },
        { date: '2024-12-12', score: 92, duration: 58, topic: 'Machine Learning' },
        { date: '2024-12-15', score: 95, duration: 60, topic: 'Full Stack' }
      ],
      totalInterviews: 47,
      averageScore: 89,
      improvementRate: '+45%',
      strongestArea: 'System Design',
      weakestArea: 'Dynamic Programming (improving)',
      currentStreak: 14,
      longestStreak: 21
    };
    localStorage.setItem('interview_metrics', JSON.stringify(perfectMetrics));

    // 6. Show welcome modal (will be picked up by layout)
    sessionStorage.setItem('show_judge_welcome', 'true');

    // 7. Redirect to dashboard after 2 seconds (dramatic entrance)
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  // Prevent SSR - wait for client-side mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading VIP Access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center p-4 font-mono">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random()
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, Math.random(), 0]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* VIP Access Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1, type: 'spring' }}
        className="relative z-10 max-w-2xl w-full"
      >
        {/* Golden Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 blur-xl opacity-50 animate-pulse" />
        
        <div className="relative border-2 border-yellow-400 bg-black/90 backdrop-blur-xl p-12 shadow-2xl">
          {/* Crown Icon */}
          <motion.div
            className="flex justify-center mb-6"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Crown className="w-20 h-20 text-yellow-400 fill-yellow-400" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl font-bold text-center mb-4 uppercase tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400">
              VIP Judge Access
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-center text-gray-300 text-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Activating Premium Developer Mode...
          </motion.p>

          {/* Loading Animation */}
          <div className="space-y-4 mb-8">
            {[
              { icon: Unlock, text: 'Bypassing Authentication', delay: 0.2 },
              { icon: Zap, text: 'Pre-loading Perfect Metrics', delay: 0.5 },
              { icon: Crown, text: 'Unlocking Premium Features', delay: 0.8 }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 p-4 border border-yellow-400/30 bg-yellow-400/10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item.delay }}
              >
                <item.icon className="w-6 h-6 text-yellow-400" />
                <span className="text-sm uppercase tracking-wider">{item.text}</span>
                <motion.div
                  className="ml-auto w-2 h-2 bg-green-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: item.delay + 0.3 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-white/10 overflow-hidden mb-6">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </div>

          {/* Status */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-green-400 font-bold uppercase tracking-widest mb-2">
              ✓ Access Granted
            </p>
            <p className="text-sm text-gray-400">
              Redirecting to dashboard...
            </p>
          </motion.div>

          {/* VIP Badge */}
          <motion.div
            className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center border-4 border-black shadow-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
          >
            <span className="text-black font-bold text-lg">VIP</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
}
