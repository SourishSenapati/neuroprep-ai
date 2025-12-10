'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, X } from 'lucide-react';

interface NeuralResetProps {
  show: boolean;
  onComplete: () => void;
}

export default function NeuralReset({ show, onComplete }: NeuralResetProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!show) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance('Neural reset activated. Follow the breathing pattern.');
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    synth.speak(utterance);

    return () => synth.cancel();
  }, [show]);

  useEffect(() => {
    if (!show) return;

    const timer = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === 'inhale') {
            setPhase('hold');
            speak('Hold');
            return 7;
          } else if (phase === 'hold') {
            setPhase('exhale');
            speak('Exhale');
            return 8;
          } else {
            setCycle(prev => prev + 1);
            if (cycle >= 2) {
              speak('Neural reset complete');
              setTimeout(onComplete, 2000);
              return 0;
            }
            setPhase('inhale');
            speak('Inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show, phase, cycle, onComplete]);

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    synth.speak(utterance);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative"
          >
            <button
              onClick={onComplete}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <motion.div
                animate={{
                  scale: phase === 'inhale' ? [1, 1.5] : phase === 'hold' ? 1.5 : [1.5, 1],
                  opacity: phase === 'hold' ? [1, 0.8, 1] : 1
                }}
                transition={{
                  duration: phase === 'inhale' ? 4 : phase === 'hold' ? 7 : 8,
                  ease: 'easeInOut'
                }}
                className="mb-8"
              >
                <Wind className="w-32 h-32 text-purple-400 mx-auto" />
              </motion.div>

              <motion.h2
                key={phase}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold text-white mb-4"
              >
                {phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
              </motion.h2>

              <motion.div
                key={count}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-8xl font-bold text-purple-400 mb-8"
              >
                {count}
              </motion.div>

              <div className="text-white/60 text-lg">
                4-7-8 Breathing Technique
              </div>
              <div className="text-white/40 text-sm mt-2">
                Cycle {cycle + 1} of 3
              </div>

              <div className="mt-8 flex justify-center gap-2">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i <= cycle ? 'bg-purple-400' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
