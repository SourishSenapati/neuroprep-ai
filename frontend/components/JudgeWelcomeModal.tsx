'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Sparkles, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Judge Welcome Modal
 * Appears after judge login to explain premium access
 */

export default function JudgeWelcomeModal() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if judge just logged in
    const shouldShow = sessionStorage.getItem('show_judge_welcome');
    if (shouldShow === 'true') {
      setIsVisible(true);
      sessionStorage.removeItem('show_judge_welcome'); // Only show once
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleExplore = () => {
    setIsVisible(false);
    router.push('/interview/setup');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="relative max-w-2xl w-full font-mono"
        >
          {/* Golden Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 blur-2xl opacity-30 animate-pulse" />

          <div className="relative border-2 border-yellow-400 bg-gradient-to-br from-black via-purple-950 to-black p-8 md:p-12 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>

            {/* Crown Icon */}
            <motion.div
              className="flex justify-center mb-6"
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <div className="relative">
                <Crown className="w-16 h-16 text-yellow-400 fill-yellow-400" />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 uppercase tracking-wider">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400">
                Welcome, Honorable Judge
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-center text-gray-300 text-lg mb-8">
              You have been granted <strong className="text-yellow-400">Premium Developer Access</strong>
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: Crown,
                  title: 'No Setup Required',
                  description: 'Authentication bypassed. Pre-loaded with sample data.',
                  color: 'text-yellow-400'
                },
                {
                  icon: Award,
                  title: 'Perfect Metrics',
                  description: '2450 XP, 14-day streak, Level 8 - Dashboard looks alive!',
                  color: 'text-purple-400'
                },
                {
                  icon: Sparkles,
                  title: 'VIP Experience',
                  description: 'All premium features unlocked. Zero friction.',
                  color: 'text-blue-400'
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4 p-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  <feature.icon className={`w-6 h-6 flex-shrink-0 ${feature.color}`} />
                  <div>
                    <h3 className="font-bold uppercase text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pre-loaded Data Info */}
            <div className="p-4 border-l-4 border-green-500 bg-green-500/10 mb-8">
              <p className="text-sm text-green-300 mb-2">
                <strong>✓ Pre-loaded Sample Data:</strong>
              </p>
              <ul className="text-xs text-gray-300 space-y-1 ml-4">
                <li>• <strong>Name:</strong> Steve Jobs</li>
                <li>• <strong>Role:</strong> Senior Software Engineer</li>
                <li>• <strong>Skills:</strong> 15+ tech skills loaded</li>
                <li>• <strong>Metrics:</strong> 7 interview sessions with growth trend</li>
                <li>• <strong>Gamification:</strong> Level 8, 2450 XP, 14-day streak</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleExplore}
                className="flex-1 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold uppercase tracking-widest hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Exploring
              </button>
              
              <button
                onClick={handleClose}
                className="flex-1 py-4 border-2 border-white/20 bg-white/5 hover:bg-white/10 font-bold uppercase tracking-widest transition-colors"
              >
                View Dashboard
              </button>
            </div>

            {/* Footer Note */}
            <p className="text-center text-xs text-gray-500 mt-6">
              This is a demonstration mode for hackathon evaluation.
              <br />
              All features are fully functional with sample data.
            </p>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-yellow-400/30" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-yellow-400/30" />
          </div>
        </motion.div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -50]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeOut'
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatePresence>
  );
}
