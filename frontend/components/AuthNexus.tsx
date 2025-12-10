'use client';

import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { Scan, ShieldCheck, Fingerprint } from 'lucide-react';

export default function AuthNexus({ onAuthComplete }: { onAuthComplete: () => void }) {
  const [scanProgress, setScanProgress] = useState(0);
  const [authStage, setAuthStage] = useState<'idle' | 'scanning' | 'verified'>('idle');

  const startScan = () => {
    setAuthStage('scanning');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setAuthStage('verified');
        setTimeout(onAuthComplete, 1000);
      }
    }, 50);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle at center, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-widest mb-2 flex items-center justify-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-500" />
            AUTH_NEXUS
          </h2>
          <p className="text-xs text-gray-500">QUANTUM BIO-HASH VERIFICATION</p>
        </div>

        <div className="relative w-64 h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white/5 group">
          <Webcam
            audio={false}
            className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"
            mirrored
            onUserMedia={() => console.log('AuthNexus: Webcam access granted')}
            onUserMediaError={(err) => console.error('AuthNexus: Webcam access denied', err)}
          />
          
          {/* Scanning Overlay */}
          {authStage === 'scanning' && (
            <motion.div 
              className="absolute inset-0 bg-green-500/20"
              initial={{ top: '-100%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-full h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]"></div>
            </motion.div>
          )}

          {/* Reticle */}
          <div className="absolute inset-0 border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full"></div>
          
          {authStage === 'verified' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60"
            >
              <Fingerprint className="w-16 h-16 text-green-500" />
            </motion.div>
          )}
        </div>

        {authStage === 'idle' && (
          <button
            onClick={startScan}
            className="w-full py-4 bg-white text-black font-bold tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group"
          >
            <Scan className="w-4 h-4 group-hover:scale-110 transition-transform" />
            INITIATE SCAN
          </button>
        )}

        {authStage === 'scanning' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-green-400">
              <span>BIO-METRICS ANALYZING...</span>
              <span>{scanProgress}%</span>
            </div>
            <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-green-500"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {authStage === 'verified' && (
          <div className="text-center text-green-500 font-bold tracking-widest animate-pulse">
            ACCESS GRANTED
          </div>
        )}
      </div>
    </div>
  );
}
