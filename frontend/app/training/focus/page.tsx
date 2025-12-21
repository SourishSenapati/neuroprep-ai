'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, Coffee, Zap } from 'lucide-react';
import { useGameStore } from '@/lib/store/gameStore';
import toast from 'react-hot-toast';

/**
 * Focus Dojo - Pomodoro Timer with Binaural Audio
 * Deep work mode with immersive audio and breathing animations
 * Gamification: Earn XP for completed focus sessions
 */

const FOCUS_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

// Public CDN audio sources (royalty-free)
const AUDIO_SOURCES = {
  brownNoise: 'https://cdn.pixabay.com/download/audio/2022/05/13/audio_0b1ab63f8c.mp3?filename=brown-noise-8888.mp3',
  rain: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8a780c1c6.mp3?filename=rain-and-thunder-16705.mp3',
  ocean: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=ocean-wave-5433.mp3'
};

type TimerMode = 'focus' | 'break';

export default function FocusDojo() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [audioSource, setAudioSource] = useState<keyof typeof AUDIO_SOURCES>('brownNoise');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deepWorkMode, setDeepWorkMode] = useState(false);
  
  const audioRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const completeTask = useGameStore((state) => state.completeTask);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Audio generation using Web Audio API (no external files needed)
  useEffect(() => {
    if (!audioRef.current) return;

    if (isActive && isAudioEnabled) {
      try {
        // Create AudioContext for generating sounds
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Generate brown noise
        const bufferSize = 4096;
        const brownNoise = audioContext.createScriptProcessor(bufferSize, 1, 1);
        let lastOut = 0.0;
        
        brownNoise.onaudioprocess = function(e) {
          const output = e.outputBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 0.3; // Reduce volume
          }
        };
        
        // Create gain node for volume control
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0;
        
        // Connect nodes
        brownNoise.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Fade in
        let vol = 0;
        const fadeIn = setInterval(() => {
          if (vol < 0.3) {
            vol += 0.02;
            gainNode.gain.value = vol;
          } else {
            clearInterval(fadeIn);
          }
        }, 100);
        
        // Store for cleanup
        (audioRef.current as any).audioContext = audioContext;
        (audioRef.current as any).brownNoise = brownNoise;
        (audioRef.current as any).gainNode = gainNode;
        
        console.log('✓ Audio started (Web Audio API)');
      } catch (error) {
        console.error('Audio generation failed:', error);
        toast.error('Audio not available in your browser', { duration: 2000 });
      }
    } else {
      // Stop audio
      const context = (audioRef.current as any).audioContext;
      const noise = (audioRef.current as any).brownNoise;
      const gain = (audioRef.current as any).gainNode;
      
      if (gain) {
        // Fade out
        let vol = gain.gain.value;
        const fadeOut = setInterval(() => {
          if (vol > 0) {
            vol -= 0.02;
            gain.gain.value = Math.max(0, vol);
          } else {
            if (noise) noise.disconnect();
            if (gain) gain.disconnect();
            if (context) context.close();
            clearInterval(fadeOut);
          }
        }, 100);
      }
    }
  }, [isActive, isAudioEnabled]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (mode === 'focus') {
      // Award XP for completed focus session
      completeTask(100);
      
      toast.success('🎯 Focus Session Complete! +100 XP', {
        icon: '✅',
        duration: 5000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }
      });
      
      // Switch to break mode
      setMode('break');
      setTimeLeft(BREAK_DURATION);
    } else {
      toast.success('Break Complete! Ready for another round?', {
        icon: '☕',
        duration: 3000
      });
      
      // Switch back to focus mode
      setMode('focus');
      setTimeLeft(FOCUS_DURATION);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION);
  };

  const toggleDeepWorkMode = () => {
    if (!deepWorkMode) {
      setDeepWorkMode(true);
      // Auto-start timer in deep work mode
      if (!isActive) {
        setIsActive(true);
      }
      // Enable audio by default
      setIsAudioEnabled(true);
      
      toast.success('Deep Work Mode Activated', {
        icon: '✓',
        duration: 3000,
        style: {
          background: '#7c3aed',
          color: 'white'
        }
      });
      
      // Try fullscreen (optional - won't break if it fails)
      if (containerRef.current) {
        containerRef.current.requestFullscreen().catch(() => {
          console.log('Fullscreen not available, using CSS mode');
        });
      }
    } else {
      setDeepWorkMode(false);
      
      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      }
      
      toast('Deep Work Mode Deactivated', {
        icon: '✓',
        duration: 2000
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus' 
    ? (1 - timeLeft / FOCUS_DURATION) * 100
    : (1 - timeLeft / BREAK_DURATION) * 100;

  // Dynamic gradient colors
  const gradientStart = mode === 'focus' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)';
  const gradientEnd = mode === 'focus' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(22, 163, 74, 0.1)';

  return (
    <div
      ref={containerRef}
      className={`min-h-screen text-white font-mono p-4 md:p-8 transition-all duration-1000 ${
        deepWorkMode ? 'fixed inset-0 z-50 bg-black' : ''
      }`}
      style={{
        background: deepWorkMode 
          ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, #000 100%)'
          : `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`
      }}
    >
      {/* Background pattern */}
      <div 
        className="fixed inset-0 z-0 opacity-5 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            Focus Dojo 🧘
          </h1>
          <p className="text-gray-400 text-lg">
            {mode === 'focus' ? 'Deep work time. Eliminate distractions.' : 'Take a break. Recharge your mind.'}
          </p>
        </motion.div>

        {/* Timer Circle */}
        <div className="flex justify-center mb-12">
          <motion.div
            className="relative"
            animate={{
              scale: isActive ? [1, 1.05, 1] : 1
            }}
            transition={{
              duration: 4,
              repeat: isActive ? Infinity : 0,
              ease: 'easeInOut'
            }}
          >
            {/* Progress ring */}
            <svg className="w-80 h-80 transform -rotate-90">
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="20"
                fill="none"
              />
              <motion.circle
                cx="160"
                cy="160"
                r="140"
                stroke={mode === 'focus' ? '#3b82f6' : '#22c55e'}
                strokeWidth="20"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 140}`}
                strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 140 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 140 * (1 - progress / 100) }}
                transition={{ duration: 0.5 }}
              />
            </svg>

            {/* Timer display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl md:text-7xl font-bold mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm uppercase tracking-widest text-gray-500">
                {mode === 'focus' ? '🎯 Focus Mode' : '☕ Break Time'}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={toggleTimer}
            className="px-8 py-4 bg-white text-black font-bold uppercase flex items-center gap-3 hover:bg-gray-200 transition-colors"
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                Start
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="px-8 py-4 border border-white/10 bg-white/5 font-bold uppercase flex items-center gap-3 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>

          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`px-8 py-4 border font-bold uppercase flex items-center gap-3 transition-colors ${
              isAudioEnabled 
                ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' 
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="w-5 h-5" />
                Audio On
              </>
            ) : (
              <>
                <VolumeX className="w-5 h-5" />
                Audio Off
              </>
            )}
          </button>
        </div>

        {/* Audio Source Selector */}
        {isAudioEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 flex justify-center gap-4"
          >
            {(Object.keys(AUDIO_SOURCES) as Array<keyof typeof AUDIO_SOURCES>).map((source) => (
              <button
                key={source}
                onClick={() => setAudioSource(source)}
                className={`px-4 py-2 text-sm font-bold uppercase transition-colors ${
                  audioSource === source
                    ? 'bg-blue-500 text-white'
                    : 'border border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {source.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </motion.div>
        )}

        {/* Deep Work Mode */}
        <div className="flex justify-center mb-8">
          <button
            onClick={toggleDeepWorkMode}
            className={`px-8 py-4 border-2 font-bold uppercase flex items-center gap-3 transition-all ${
              deepWorkMode
                ? 'border-purple-500 bg-purple-500/20 text-purple-400 scale-105'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            {deepWorkMode ? (
              <>
                <Minimize2 className="w-5 h-5" />
                Exit Deep Work
              </>
            ) : (
              <>
                <Maximize2 className="w-5 h-5" />
                Deep Work Mode
              </>
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 border border-white/10 bg-white/5">
            <div className="text-3xl font-bold mb-1">{Math.floor(progress)}%</div>
            <div className="text-xs uppercase text-gray-500">Complete</div>
          </div>
          <div className="p-4 border border-white/10 bg-white/5">
            <div className="text-3xl font-bold text-blue-400 mb-1">100 XP</div>
            <div className="text-xs uppercase text-gray-500">Per Session</div>
          </div>
          <div className="p-4 border border-white/10 bg-white/5">
            <div className="text-3xl font-bold text-green-400 mb-1">{mode === 'focus' ? '25' : '5'}</div>
            <div className="text-xs uppercase text-gray-500">Minutes</div>
          </div>
          <div className="p-4 border border-white/10 bg-white/5">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {mode === 'focus' ? '🎯' : '☕'}
            </div>
            <div className="text-xs uppercase text-gray-500">{mode}</div>
          </div>
        </div>
      </div>

      {/* Store audio context reference */}
      <div ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
}
