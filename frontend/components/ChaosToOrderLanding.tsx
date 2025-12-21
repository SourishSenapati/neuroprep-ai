'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';

/**
 * "Chaos to Order" Landing Page
 * A visually stunning entry point with floating elements that snap into place
 * Demonstrates the journey from scattered potential to structured excellence
 */

export default function ChaosToOrderLanding() {
  const [isOrdered, setIsOrdered] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    // Trigger chaos-to-order animation after 1 second
    const timer = setTimeout(() => {
      setIsOrdered(true);
      controls.start('ordered');
    }, 1000);

    return () => clearTimeout(timer);
  }, [controls]);

  // Chaos positions (random scatter)
  const chaosVariants = {
    hidden: { opacity: 0, scale: 0 },
    chaos: (i: number) => ({
      opacity: 0.3,
      scale: 0.8,
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
      rotate: Math.random() * 360,
      transition: {
        duration: 0.8,
        delay: i * 0.1
      }
    }),
    ordered: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const floatingElements = [
    { icon: '🎯', label: 'Target Role', color: 'from-blue-500 to-cyan-500' },
    { icon: '🧠', label: 'AI Interview', color: 'from-purple-500 to-pink-500' },
    { icon: '💻', label: 'Code Execution', color: 'from-green-500 to-emerald-500' },
    { icon: '📊', label: 'Performance', color: 'from-orange-500 to-red-500' },
    { icon: '🎙️', label: 'Voice Input', color: 'from-indigo-500 to-violet-500' },
    { icon: '⚡', label: 'Real-time AI', color: 'from-yellow-500 to-amber-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] text-white font-mono relative overflow-hidden">
      {/* Animated Background Grid */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-widest">System: Online</span>
          </div>
          
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 uppercase tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Neuro<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Prep</span>
          </motion.h1>
          
          <motion.p
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Transform chaos into mastery. 224 million unique questions. Zero repetition. Infinite potential.
          </motion.p>
        </motion.div>

        {/* Chaos to Order Animation */}
        <div className="relative w-full max-w-4xl h-96 mb-12">
          <motion.div
            className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 md:gap-8"
            initial="hidden"
            animate={controls}
          >
            {floatingElements.map((element, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={chaosVariants}
                initial="hidden"
                animate={isOrdered ? 'ordered' : 'chaos'}
                className={`
                  relative p-6 border border-white/10 bg-white/5 backdrop-blur-sm
                  flex flex-col items-center gap-3 w-32 h-32
                  ${isOrdered ? 'cursor-pointer hover:bg-white/10' : ''}
                `}
                whileHover={isOrdered ? { scale: 1.05, borderColor: 'rgba(255,255,255,0.3)' } : {}}
              >
                <div className={`text-4xl ${!isOrdered ? 'blur-sm' : ''}`}>
                  {element.icon}
                </div>
                <div className="text-xs text-center uppercase tracking-wider">
                  {element.label}
                </div>
                {isOrdered && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${element.color} opacity-0 group-hover:opacity-10`}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Center Pulse Effect */}
          {isOrdered && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 30, 1],
                opacity: [0.8, 0, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          )}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <Link href="/interview/setup">
            <motion.button
              className="px-12 py-4 bg-white text-black font-bold uppercase tracking-widest text-lg border-2 border-white relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center gap-3">
                Begin Simulation
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Counter */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          {[
            { value: '224M+', label: 'Unique Questions' },
            { value: '40+', label: 'Engineering Roles' },
            { value: '99.9%', label: 'Zero Repetition' },
            { value: '<50ms', label: 'Response Time' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="border border-white/10 bg-white/5 backdrop-blur-sm p-4"
              whileHover={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-500">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Alert */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm text-yellow-300 text-sm uppercase tracking-wide"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
      >
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚠
          </motion.span>
          Production Environment: Vercel Edge Network
        </div>
      </motion.div>
    </div>
  );
}
