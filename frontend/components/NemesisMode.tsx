'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Volume2, VolumeX, Trophy, AlertTriangle, Target } from 'lucide-react';
import { useGameStore } from '@/lib/store/gameStore';
import toast from 'react-hot-toast';

/**
 * Nemesis Mode Component
 * Ultimate challenge mode that tests user's composure under pressure
 * 
 * Features:
 * - Voice stress detection (volume analysis)
 * - AI interruption on pauses >3s
 * - Win condition: Maintain neutral/happy face for 60s
 * - Text-to-speech for AI interruptions
 */

interface NemesisModeProps {
  isActive: boolean;
  onToggle: () => void;
  currentEmotion: string;
  onInterrupt: () => void;
  className?: string;
}

export default function NemesisMode({ 
  isActive, 
  onToggle, 
  currentEmotion,
  onInterrupt,
  className = '' 
}: NemesisModeProps) {
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [pauseDuration, setPauseDuration] = useState(0);
  const [calmStreak, setCalmStreak] = useState(0); // Seconds of neutral/happy
  const [hasWon, setHasWon] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const streakIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const completeTask = useGameStore((state) => state.completeTask);

  // TTS function for AI interruptions (uses cloned voice if available)
  const speak = useCallback(async (text: string) => {
    try {
      // Import TTS service dynamically
      const { tts } = await import('@/lib/services/tts');
      await tts.speak(text);
    } catch (error) {
      console.error('TTS error:', error);
      // Fallback to browser speech if service fails
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.2;
        utterance.pitch = 0.8;
        utterance.volume = 1;
        
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google UK English Male')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        speechSynthesis.speak(utterance);
      }
    }
  }, []);

  // Voice stress detection
  useEffect(() => {
    if (!isActive || !isListening) return;

    const startVoiceDetection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        
        analyser.fftSize = 256;
        microphone.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const detectVoice = () => {
          if (!analyserRef.current) return;

          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          const normalizedLevel = average / 255;

          setVoiceLevel(normalizedLevel);

          // Detect mumbling (too low)
          if (normalizedLevel > 0.05 && normalizedLevel < 0.15) {
            toast.error('Speak up! You are mumbling.', {
              id: 'mumbling',
              duration: 2000
            });
          }

          // Detect pause (very low volume for extended period)
          if (normalizedLevel < 0.05) {
            if (!pauseTimerRef.current) {
              pauseTimerRef.current = setTimeout(() => {
                speak('You are hesitating. Do you not know the answer?');
                onInterrupt();
                toast('🤖 Nemesis interrupted you!', {
                  icon: '⚡',
                  duration: 3000
                });
                pauseTimerRef.current = null;
              }, 3000); // 3 second pause triggers interruption
            }
          } else {
            // Clear pause timer if speaking
            if (pauseTimerRef.current) {
              clearTimeout(pauseTimerRef.current);
              pauseTimerRef.current = null;
              setPauseDuration(0);
            }
          }

          requestAnimationFrame(detectVoice);
        };

        detectVoice();
      } catch (error) {
        console.error('Microphone access error:', error);
        toast.error('Microphone access denied for Nemesis Mode', {
          duration: 3000
        });
      }
    };

    startVoiceDetection();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, [isActive, isListening, onInterrupt, speak]);

  // Calm streak tracker (win condition)
  useEffect(() => {
    if (!isActive) {
      setCalmStreak(0);
      return;
    }

    // Check if emotion is neutral or happy
    const isCalmEmotion = currentEmotion === 'neutral' || currentEmotion === 'happy';

    if (isCalmEmotion) {
      // Start or continue streak
      if (!streakIntervalRef.current) {
        streakIntervalRef.current = setInterval(() => {
          setCalmStreak(prev => {
            const newStreak = prev + 1;
            
            // Check for win condition (60 seconds)
            if (newStreak >= 60 && !hasWon) {
              setHasWon(true);
              completeTask(500); // Massive XP reward
              speak('Impressive. You have defeated the Nemesis.');
              toast.success('🏆 YOU DEFEATED THE NEMESIS! +500 XP!', {
                icon: '👑',
                duration: 6000,
                style: {
                  background: '#1a1a1a',
                  color: '#fff',
                  border: '2px solid gold'
                }
              });
              
              // Auto-disable Nemesis Mode after win
              setTimeout(() => onToggle(), 3000);
            }

            return newStreak;
          });
        }, 1000);
      }
    } else {
      // Break streak if not calm
      if (streakIntervalRef.current) {
        clearInterval(streakIntervalRef.current);
        streakIntervalRef.current = null;
      }
      
      if (calmStreak > 0) {
        toast(`Streak broken at ${calmStreak}s! Maintain composure to win.`, {
          icon: '⚠️',
          duration: 2000
        });
      }
      
      setCalmStreak(0);
    }

    return () => {
      if (streakIntervalRef.current) {
        clearInterval(streakIntervalRef.current);
      }
    };
  }, [isActive, currentEmotion, calmStreak, hasWon, completeTask, onToggle, speak]);

  const progress = (calmStreak / 60) * 100;

  return (
    <div className={className}>
      {/* Toggle Button */}
      <button
        onClick={() => {
          onToggle();
          if (!isActive) {
            setIsListening(true);
            setHasWon(false);
            setCalmStreak(0);
            speak('Nemesis Mode activated. I will test your composure.');
            toast('💀 Nemesis Mode Activated!', {
              icon: '⚡',
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#ff0000',
                border: '2px solid #ff0000'
              }
            });
          } else {
            setIsListening(false);
          }
        }}
        className={`w-full py-4 px-6 font-bold uppercase text-sm flex items-center justify-center gap-3 transition-all ${
          isActive
            ? 'bg-red-600 hover:bg-red-700 text-white border-2 border-red-400 shadow-lg shadow-red-500/50'
            : 'border-2 border-white/10 bg-white/5 hover:bg-white/10'
        }`}
      >
        <Skull className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
        {isActive ? 'Disable Nemesis Mode' : 'Activate Nemesis Mode'}
        {isActive && <AlertTriangle className="w-4 h-4 text-yellow-400 animate-bounce" />}
      </button>

      {/* Nemesis HUD */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 border-2 border-red-500/50 bg-red-500/10 p-6"
          >
            {/* Win Condition Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold uppercase flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Win Condition: 60s Calm
                </span>
                <span className="text-lg font-mono font-bold">
                  {calmStreak}s / 60s
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-3 bg-black/50 border border-white/20 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Maintain a <strong className="text-green-400">neutral</strong> or <strong className="text-yellow-400">happy</strong> face for 60 seconds to defeat the Nemesis
              </p>
            </div>

            {/* Voice Level Meter */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold uppercase flex items-center gap-2">
                  {isListening ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  Voice Stress Monitor
                </span>
                <span className="text-xs text-gray-500">
                  {(voiceLevel * 100).toFixed(0)}%
                </span>
              </div>

              <div className="h-2 bg-black/50 border border-white/20 overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${
                    voiceLevel < 0.15 ? 'bg-red-500' : voiceLevel > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${voiceLevel * 100}%` }}
                />
              </div>

              <p className="text-xs text-gray-400 mt-1">
                {voiceLevel < 0.05 && 'Silence detected - interruption imminent'}
                {voiceLevel >= 0.05 && voiceLevel < 0.15 && '⚠️ Speaking too low (mumbling)'}
                {voiceLevel >= 0.15 && voiceLevel <= 0.5 && '✓ Good voice level'}
                {voiceLevel > 0.5 && '⚠️ High volume detected'}
              </p>
            </div>

            {/* Current Emotion Display */}
            <div className="p-4 border border-white/10 bg-white/5">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Emotion</div>
              <div className={`text-2xl font-bold ${
                currentEmotion === 'neutral' || currentEmotion === 'happy' 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {currentEmotion.toUpperCase()}
              </div>
            </div>

            {/* Win notification */}
            {hasWon && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-4 p-6 border-2 border-gold bg-gold/20 text-center"
              >
                <Trophy className="w-12 h-12 mx-auto mb-3 text-gold" />
                <div className="text-2xl font-bold uppercase mb-2">Victory!</div>
                <div className="text-sm text-gray-300">
                  You maintained composure under extreme pressure.
                  <br />
                  +500 XP awarded!
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
