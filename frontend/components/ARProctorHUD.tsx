import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, AlertTriangle, Eye, Activity, ShieldCheck, ShieldAlert } from 'lucide-react';

interface ARProctorHUDProps {
  stressLevel: number; // 0-10
  gazeStatus: 'stable' | 'averted' | 'erratic';
  isScanning: boolean;
  integrityScore: number; // 0-100
  annotations: Array<{ x: number; y: number; type: 'circle' | 'arrow' | 'text'; content?: string }>;
}

export default function ARProctorHUD({ 
  stressLevel, 
  gazeStatus, 
  isScanning, 
  integrityScore,
  annotations 
}: ARProctorHUDProps) {
  
  // Dynamic color based on stress
  const stressColor = stressLevel > 7 ? 'rgba(239, 68, 68, 0.5)' : stressLevel > 4 ? 'rgba(245, 158, 11, 0.5)' : 'rgba(34, 197, 94, 0.5)';
  const integrityColor = integrityScore > 80 ? 'text-green-400' : integrityScore > 50 ? 'text-amber-400' : 'text-red-500';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {/* AR Grid Overlay (Scanning Effect) */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-20" // Assuming a grid pattern or use CSS gradient
            style={{ 
              backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          >
            <motion.div 
              className="w-full h-1 bg-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Biometric Aura (Stress Halo) */}
      <motion.div 
        className="absolute inset-0 border-[20px] border-transparent transition-colors duration-1000"
        animate={{ 
          boxShadow: `inset 0 0 ${stressLevel * 10}px ${stressColor}` 
        }}
      />

      {/* HUD Corners */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg" />

      {/* Floating Stats Panel (Top Right) */}
      <div className="absolute top-8 right-8 flex flex-col gap-2 items-end font-mono text-xs">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded border border-cyan-500/30 text-cyan-400">
          <Activity className="w-3 h-3" />
          <span>NEURO_SYNC: {100 - stressLevel * 5}%</span>
        </div>
        <div className={`flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded border border-white/10 ${integrityColor}`}>
          {integrityScore > 80 ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
          <span>INTEGRITY: {integrityScore}%</span>
        </div>
        <div className={`flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded border border-white/10 ${gazeStatus === 'stable' ? 'text-green-400' : 'text-red-400'}`}>
          <Eye className="w-3 h-3" />
          <span>GAZE: {gazeStatus.toUpperCase()}</span>
        </div>
      </div>

      {/* Center Reticle (Gaze Tracking) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full flex items-center justify-center opacity-30">
        <div className="w-1 h-1 bg-cyan-500 rounded-full" />
      </div>

      {/* Dynamic Annotations (Telestration) */}
      <svg className="absolute inset-0 w-full h-full">
        <AnimatePresence>
          {annotations.map((ann, i) => (
            <motion.g 
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              {ann.type === 'circle' && (
                <circle cx={`${ann.x}%`} cy={`${ann.y}%`} r="40" stroke="yellow" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-spin-slow" />
              )}
              {ann.type === 'text' && (
                <text x={`${ann.x}%`} y={`${ann.y}%`} fill="cyan" fontSize="14" fontFamily="monospace" textAnchor="middle" className="drop-shadow-md">
                  {ann.content}
                </text>
              )}
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>

      {/* Warnings */}
      <AnimatePresence>
        {gazeStatus !== 'stable' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded font-mono text-sm flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            GAZE AVERSION DETECTED
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
