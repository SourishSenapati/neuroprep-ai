'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import CareerTradingCard from './CareerTradingCard';
import { useAuth } from '@/hooks/useAuth';

/**
 * Floating Share Button
 * Appears in bottom-right corner for easy access to trading card
 */

export default function ShareButton() {
  const [showCard, setShowCard] = useState(false);
  const { user } = useAuth();

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setShowCard(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-2xl group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <div className="relative">
          <Share2 className="w-6 h-6 text-white" />
          
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 bg-purple-400 rounded-full -z-10"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/90 text-white text-sm whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Share Your Achievement
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
        </div>
      </motion.button>

      {/* Trading Card Modal */}
      {showCard && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowCard(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
             <CareerTradingCard user={user || { name: 'Guest User', level: 1, xp: 0, streak: 0 }} />
             <button 
               onClick={() => setShowCard(false)}
               className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
             >
               Close
             </button>
          </div>
        </div>
      )}
    </>
  );
}
