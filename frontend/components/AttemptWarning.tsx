'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface AttemptWarningProps {
  onSignUpClick: () => void;
}

export default function AttemptWarning({ onSignUpClick }: AttemptWarningProps) {
  const [attemptInfo, setAttemptInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkAttempts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/attempts');
        const data = await response.json();
        setAttemptInfo(data);
        
        // Show warning if 2 or fewer attempts remaining, or if auth required
        if (data.requiresAuth || data.remaining <= 2) {
          setIsVisible(true);
        }
      } catch (error) {
        console.warn('Could not check attempt status:', error);
      }
    };
    
    checkAttempts();
  }, []);

  if (!isVisible || !attemptInfo || attemptInfo.unlimited) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
      >
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-lg border border-orange-500/30 rounded-lg p-4 text-white">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                {attemptInfo.requiresAuth ? 'Free Attempts Exhausted' : 'Limited Attempts Remaining'}
              </h3>
              <p className="text-xs text-gray-300 mb-3">
                {attemptInfo.requiresAuth ? (
                  'You\'ve used all 5 free attempts. Sign up to continue with unlimited access.'
                ) : (
                  `Only ${attemptInfo.remaining} free attempt${attemptInfo.remaining !== 1 ? 's' : ''} left. Sign up for unlimited access.`
                )}
              </p>
              <button
                onClick={onSignUpClick}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1.5 rounded hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Sign Up Now
              </button>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close Warning"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}