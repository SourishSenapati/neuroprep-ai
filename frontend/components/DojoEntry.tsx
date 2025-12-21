'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Trophy, ArrowRight, Sparkles, Target } from 'lucide-react';
import { useGameStore } from '@/lib/store/gameStore';
import Link from 'next/link';

/**
 * Dojo Entry Portal
 * Gateway to gamification features (Roast Battle, Focus Dojo)
 * Displays user's XP and Streak from gameStore
 */

export default function DojoEntry() {
  const [mounted, setMounted] = useState(false);
  const xp = useGameStore((state) => state.xp);
  const streak = useGameStore((state) => state.streak);
  const level = useGameStore((state) => state.level);
  const sessionsCompleted = useGameStore((state) => state.sessionsCompleted);

  // SSR Safety
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="border border-white/10 bg-white/5 p-8 animate-pulse">
        <div className="h-8 bg-white/10 mb-4 w-1/3" />
        <div className="h-4 bg-white/10 mb-8 w-2/3" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-2 border-white/20 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent p-8 md:p-12 mb-8 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500 to-blue-500 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-500 to-red-500 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
            Enter the Career Dojo
          </h2>
        </div>

        <p className="text-gray-400 mb-8 text-lg">
          Level up your skills, earn XP, and build your daily streak
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* XP */}
          <div className="border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm uppercase tracking-wider text-gray-400">XP</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{xp}</div>
          </div>

          {/* Streak */}
          <div className="border border-orange-500/30 bg-orange-500/10 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500 fill-current" />
              <span className="text-sm uppercase tracking-wider text-gray-400">Streak</span>
            </div>
            <div className="text-3xl font-bold text-orange-400">{streak} Days</div>
          </div>

          {/* Level */}
          <div className="border border-purple-500/30 bg-purple-500/10 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              <span className="text-sm uppercase tracking-wider text-gray-400">Level</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">{level}</div>
          </div>

          {/* Sessions */}
          <div className="border border-blue-500/30 bg-blue-500/10 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-sm uppercase tracking-wider text-gray-400">Sessions</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">{sessionsCompleted}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Roast Battle */}
          <Link href="/training/roast">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group border-2 border-orange-500/50 bg-gradient-to-br from-orange-500/20 to-red-500/10 p-8 cursor-pointer transition-all hover:border-orange-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Flame className="w-8 h-8 text-orange-500 fill-current" />
                    <h3 className="text-2xl font-bold uppercase">Roast Battle</h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Get brutally honest AI feedback on your resume
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-orange-500 group-hover:translate-x-2 transition-transform" />
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-400">Earn <strong className="text-yellow-400">50 XP</strong> per roast</span>
              </div>
            </motion.div>
          </Link>

          {/* Focus Pod */}
          <Link href="/training/focus">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group border-2 border-blue-500/50 bg-gradient-to-br from-blue-500/20 to-purple-500/10 p-8 cursor-pointer transition-all hover:border-blue-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-8 h-8 text-blue-500" />
                    <h3 className="text-2xl font-bold uppercase">Focus Pod</h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Pomodoro timer with binaural audio for deep work
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-500 group-hover:translate-x-2 transition-transform" />
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-400">Earn <strong className="text-yellow-400">100 XP</strong> per session</span>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Motivational Message */}
        {streak === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 border border-yellow-500/30 bg-yellow-500/5 text-center"
          >
            <p className="text-sm text-gray-400">
              💡 <strong className="text-yellow-400">Pro Tip:</strong> Start a daily streak to unlock bonus XP multipliers!
            </p>
          </motion.div>
        )}

        {streak >= 7 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/5 text-center"
          >
            <p className="text-lg font-bold text-orange-400 mb-2">
              🔥 {streak} Day Streak! You're on fire!
            </p>
            <p className="text-sm text-gray-400">
              Keep training daily to maintain your legendary status
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
