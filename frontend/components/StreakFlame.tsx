'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Trophy } from 'lucide-react';
import { useGameStore } from '@/lib/store/gameStore';
import toast from 'react-hot-toast';

/**
 * StreakFlame Component
 * Displays current streak with visual feedback
 * SSR-safe: Renders null on server, hydrates on client
 */

interface StreakFlameProps {
  className?: string;
  showTooltip?: boolean;
}

export default function StreakFlame({ className = '', showTooltip = true }: StreakFlameProps) {
  const [mounted, setMounted] = useState(false);
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const streak = useGameStore((state) => state.streak);
  const xp = useGameStore((state) => state.xp);
  const level = useGameStore((state) => state.level);

  // SSR Safety: Only render on client after hydration
  useEffect(() => {
    setMounted(true);
    
    // Show celebration banner for high streaks
    if (streak >= 7 && streak % 7 === 0) {
      setShowStreakBanner(true);
      setTimeout(() => setShowStreakBanner(false), 3000);
      
      toast.success(`${streak} Day Streak! You're on fire!`, {
        icon: '✓',
        duration: 4000
      });
    } else if (streak === 7) {
      toast(`Week Streak achieved! Keep going!`, {
        icon: '✓',
        duration: 3000
      });
    } else if (streak % 5 === 0 && streak > 0) {
      toast(`${streak} days and counting!`, {
        icon: '✓',
        duration: 2000
      });
    }
  }, [streak]);

  // Don't render on server
  if (!mounted) {
    return null;
  }

  // Don't render if no streak
  if (streak === 0) {
    return null;
  }

  // Determine flame intensity based on streak
  const getFlameColor = () => {
    if (streak >= 30) return 'text-purple-500'; // Purple flame (legendary)
    if (streak >= 14) return 'text-orange-500'; // Orange flame (hot)
    if (streak >= 7) return 'text-yellow-500'; // Yellow flame (warm)
    return 'text-red-500'; // Red flame (starter)
  };

  const getFlameSize = () => {
    if (streak >= 30) return 'w-8 h-8';
    if (streak >= 14) return 'w-7 h-7';
    if (streak >= 7) return 'w-6 h-6';
    return 'w-5 h-5';
  };

  const getMessage = () => {
    if (streak >= 30) return 'Legendary Streak! 🏆';
    if (streak >= 14) return 'You\'re unstoppable! 🚀';
    if (streak >= 7) return 'Keep the fire burning! 🔥';
    return 'Train daily to keep the fire alive!';
  };

  return (
    <>
      {/* Main Streak Display */}
      <div className={`relative group ${className}`}>
        <motion.div
          className="flex items-center gap-2 px-3 py-2 border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Flame Icon */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -5, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Flame className={`${getFlameSize()} ${getFlameColor()} fill-current`} />
          </motion.div>

          {/* Streak Number */}
          <div className="flex flex-col">
            <span className="text-lg font-bold font-mono">{streak}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500">Day Streak</span>
          </div>

          {/* XP & Level (optional) */}
          <div className="hidden sm:flex flex-col items-end ml-4 pl-4 border-l border-white/10">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-mono">{xp} XP</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-mono">Lvl {level}</span>
            </div>
          </div>
        </motion.div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            <div className="bg-black border border-white/20 px-3 py-2 whitespace-nowrap text-xs">
              <p className="font-bold mb-1">{getMessage()}</p>
              <p className="text-gray-400">
                {streak >= 30 ? 'You\'re a legend!' : `${30 - streak} more days to legendary status`}
              </p>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
          </div>
        )}

        {/* Particle Effects for high streaks */}
        {streak >= 7 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-orange-500 rounded-full"
                initial={{ 
                  x: '50%', 
                  y: '50%',
                  scale: 0
                }}
                animate={{
                  x: `${50 + Math.random() * 100 - 50}%`,
                  y: `${50 - Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Celebration Banner for Milestones */}
      <AnimatePresence>
        {showStreakBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 border-2 border-white text-white font-bold uppercase text-lg shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 fill-current animate-bounce" />
              <div>
                <div className="text-2xl">{streak} Day Streak!</div>
                <div className="text-sm opacity-90">You're absolutely crushing it! 🔥</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Compact Streak Display (for headers)
 */
export function StreakFlameCompact() {
  const [mounted, setMounted] = useState(false);
  const streak = useGameStore((state) => state.streak);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || streak === 0) {
    return null;
  }

  return (
    <motion.div
      className="flex items-center gap-1 text-sm"
      whileHover={{ scale: 1.1 }}
    >
      <Flame className="w-4 h-4 text-orange-500 fill-current" />
      <span className="font-mono font-bold">{streak}</span>
    </motion.div>
  );
}
