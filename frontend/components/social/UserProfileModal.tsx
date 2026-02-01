import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, LogIn, Share2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { CareerCard } from './CareerCard';
import Auth from '../Auth';
import { useRazorpay } from '@/hooks/useRazorpay';
import toast from 'react-hot-toast';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useGameStore } from '@/lib/store/gameStore';

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { data: session, status } = useSession();
  const [showAuth, setShowAuth] = useState(false);
  const { handlePayment, loading: paymentLoading } = useRazorpay();
  
  // Game Store Data
  const { level, xp } = useGameStore();
  
  // Initialize Pro status from Store (persisted) or Session
  const [isPro, setIsPro] = useState(() => {
     if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('isPremium');
        return stored === 'true';
     }
     return false;
  });

  const handleUpgrade = async () => {
    if (!session) {
      setShowAuth(true);
      return;
    }
    
    // Trigger Payment
    await handlePayment(session.user?.email || 'user', () => {
        setIsPro(true);
        localStorage.setItem('isPremium', 'true');
        useGameStore.getState().upgradeToPremium();
        toast.success("Welcome to Pro Tier! Career Card Upgraded.");
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {showAuth ? (
             <div className="w-full h-[600px] relative">
                <button 
                  onClick={() => setShowAuth(false)}
                  aria-label="Close Authentication"
                  className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-white/10"
                >
                   <X className="w-5 h-5" />
                </button>
                <Auth onAuthSuccess={() => setShowAuth(false)} onClose={() => setShowAuth(false)} />
             </div>
          ) : (
             <>
                {/* Left Side: Career Card Preview */}
                <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-[#121212] to-[#050505] relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
                   <CareerCard 
                      level={isPro ? 5 : 1} 
                      rank={isPro ? "Top 0.1%" : "Top 10%"} 
                      xp={isPro ? 12500 : 450}
                   />
                </div>

                {/* Right Side: Actions */}
                <div className="w-full md:w-80 p-8 bg-[#050505] border-l border-white/5 flex flex-col">
                   <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Career Profile</h3>
                        <p className="text-xs text-[#737373]">Manage your athlete status</p>
                      </div>
                      <button onClick={onClose} aria-label="Close Profile" className="text-[#525252] hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                   </div>

                   <div className="space-y-4 flex-1">
                      {!session ? (
                        <div className="p-4 rounded-xl bg-[#121212] border border-white/5">
                            <p className="text-xs text-[#A3A3A3] mb-3 leading-relaxed">
                                Sign in to save your streak, XP, and interview progress.
                            </p>
                            <button 
                                onClick={() => setShowAuth(true)}
                                className="w-full py-2.5 bg-white text-black font-semibold rounded-lg text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-3 h-3" />
                                Authenticate
                            </button>
                        </div>
                      ) : (
                         <div className="p-4 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs text-[#3B82F6] font-bold uppercase tracking-wider">Online</span>
                            </div>
                            <p className="text-sm text-white font-medium">{session.user?.email}</p>
                         </div>
                      )}

                      {!isPro && (
                          <div className="p-4 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 relative overflow-hidden group">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EAB308]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                              
                              <div className="flex items-center gap-2 mb-2">
                                  <Crown className="w-4 h-4 text-[#EAB308]" />
                                  <h4 className="text-sm font-bold text-[#EAB308] uppercase tracking-wider">Pro Athlete</h4>
                              </div>
                              <p className="text-[10px] text-[#D4D4D4] mb-3 leading-relaxed">
                                  Unlock infinite mock interviews, advanced analytics, and "Caltech" difficulty mode.
                              </p>
                              <button 
                                  onClick={handleUpgrade}
                                  disabled={paymentLoading}
                                  className="w-full py-2.5 bg-[#EAB308] text-black font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-[#FACC15] transition-colors shadow-lg shadow-[#EAB308]/20 flex items-center justify-center gap-2"
                              >
                                  {paymentLoading ? 'Processing...' : 'Upgrade Now'}
                              </button>
                          </div>
                      )}
                   </div>
                   
                   <div className="pt-6 border-t border-white/5 mt-auto">
                      <p className="text-[10px] text-[#525252] text-center font-mono">
                        ID: {session?.user?.email?.split('@')[0].toUpperCase() || 'GUEST-8X92'}
                        <br/>
                        NEUROPREP AI v2.0
                      </p>
                   </div>
                </div>
             </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
