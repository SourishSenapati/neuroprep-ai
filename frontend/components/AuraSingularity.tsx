'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AuraSingularity({ onForge }: { onForge: (params: { role: string; difficulty: string; persona: string }) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Senior');
  const [persona, setPersona] = useState('Professional');

  const handleForge = () => {
    // Prosody TTS Mock
    const utterance = new SpeechSynthesisUtterance(`Sync initiating for ${difficulty} ${role}. Persona: ${persona}. Gaze calibration sequence active.`);
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    window.speechSynthesis.speak(utterance);
    onForge({ role, difficulty, persona });
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900/20 to-black pointer-events-none" />

      {/* UI Overlay */}
      <div className="relative z-10 text-center flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            AURA NEUROPREP
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 tracking-widest font-mono mb-4">
            PINNACLE EDITION // 2025
          </p>
        </motion.div>

        {/* Configuration Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 px-4"
        >
          {/* Role Input */}
          <div className="md:col-span-2">
            <label className="block text-left text-xs text-purple-400 font-mono mb-1 ml-1">TARGET ROLE</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Civil Engineer"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-purple-500 transition-all placeholder-gray-600"
            />
          </div>

          {/* Difficulty Select */}
          <div>
            <label className="block text-left text-xs text-purple-400 font-mono mb-1 ml-1">DIFFICULTY LEVEL</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
            >
              <option value="Junior">Junior (L3)</option>
              <option value="Mid">Mid-Level (L4)</option>
              <option value="Senior">Senior (L5)</option>
              <option value="Staff">Staff (L6)</option>
              <option value="Principal">Principal (L7)</option>
            </select>
          </div>

          {/* Persona Select */}
          <div>
            <label className="block text-left text-xs text-purple-400 font-mono mb-1 ml-1">INTERVIEWER PERSONA</label>
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
            >
              <option value="Professional">Professional (Standard)</option>
              <option value="Socratic">Socratic (Deep Dive)</option>
              <option value="Aggressive">Aggressive (Stress Test)</option>
              <option value="Encouraging">Encouraging (Supportive)</option>
            </select>
          </div>
        </motion.div>

        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, textShadow: "0 0 8px rgb(255,255,255)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleForge}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="pointer-events-auto px-12 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white font-bold tracking-widest uppercase hover:bg-white/10 hover:border-purple-500 transition-all duration-300 group relative overflow-hidden"
        >
          <span className="relative z-10">Forge Neural Link</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20"
            layoutId="glow"
          />
          {/* Gaussian Splat Effect on Hover */}
          {isHovered && (
            <motion.div
              layoutId="splat"
              className="absolute inset-0 bg-purple-500 blur-xl opacity-20"
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          )}
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-0 right-0 text-center text-xs text-gray-600 font-mono"
        >
          SYSTEM: ONLINE // ENTANGLEMENT: STABLE // NN_WEB_GPU: STANDBY
        </motion.div>
      </div>
    </div>
  );
}
