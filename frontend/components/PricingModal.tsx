'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Crown, Sparkles, CreditCard, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/lib/store/gameStore';
import toast from 'react-hot-toast';

/**
 * Pricing Modal with Simulated Stripe Checkout
 * Demonstrates business model and monetization strategy
 * 
 * NOTE: This is DEMO MODE - no real payments processed
 * Perfect for hackathon judges to see business thinking
 */

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'nemesis' | 'biometric' | 'roast' | 'general';
  onUpgradeComplete?: () => void;
}

export default function PricingModal({ 
  isOpen, 
  onClose, 
  trigger = 'general',
  onUpgradeComplete 
}: PricingModalProps) {
import { useRazorpay } from '@/hooks/useRazorpay';

// ... inside component ...
  const [showSuccess, setShowSuccess] = useState(false);
  const gameStore = useGameStore();
  const { handlePayment, loading: isProcessing } = useRazorpay();

  const handleUpgrade = async () => {
    const userDataRaw = localStorage.getItem('user');
    const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
    const userId = userData?._id || userData?.uid || `guest_${Date.now()}`;

    try {
      await handlePayment(userId, () => {
        // Success Callback
        setShowSuccess(true);
        
        // Confetti
        confetti({
          particleCount: 100,
          spread: 70,
          colors: ['#a855f7', '#ec4899', '#f59e0b', '#10b981']
        });

        // Grant premium status locally
        localStorage.setItem('isPremium', 'true');
        if (userData) {
          userData.isPremium = true;
          localStorage.setItem('user', JSON.stringify(userData));
        }

        // Bonus XP
        gameStore.completeTask(500);
        toast.success('🎉 Upgraded to Pro! +500 Bonus XP!', { duration: 5000, icon: '👑' });

        setTimeout(() => {
          setShowSuccess(false);
          onClose();
          if (onUpgradeComplete) onUpgradeComplete();
        }, 3000);
      });
    } catch (error) {
      toast.error('Payment initialization failed');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-mono">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative z-10 max-w-5xl w-full"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="border-2 border-electric-blue bg-gradient-to-br from-black via-purple-950 to-black p-8">
            {/* Success Screen */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900 z-30 flex items-center justify-center p-8"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360]
                      }}
                      transition={{ duration: 1 }}
                      className="mb-6"
                    >
                      <Crown className="w-24 h-24 mx-auto text-yellow-400 fill-yellow-400" />
                    </motion.div>
                    
                    <h2 className="text-4xl font-bold uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-iconic-gold">
                      Welcome to Pro!
                    </h2>
                    
                    <p className="text-xl text-gray-300 mb-6">
                      All premium features unlocked
                    </p>

                    <div className="inline-flex items-center gap-2 px-6 py-3 border border-green-500 bg-green-500/20 text-green-400">
                      <Check className="w-5 h-5" />
                      <span className="font-bold">+500 Bonus XP Added</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 border border-electric-blue bg-electric-blue/20 mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 uppercase text-sm font-bold">
                  {triggerMessages[trigger]}
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">
                Choose Your Plan
              </h1>
              
              <p className="text-gray-400">
                Unlock your full potential with NeuroPrep AI Pro
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* FREE TIER */}
              <div className="border-2 border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold uppercase">Free</h3>
                  <div className="text-3xl font-bold">$0</div>
                </div>

                <p className="text-gray-400 text-sm mb-6">
                  Perfect for getting started
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    'Basic Interview Practice',
                    '224M+ Unique Questions',
                    '40+ Engineering Roles',
                    'Code Editor & Execution',
                    '3 Nemesis Mode Sessions',
                    '5 Resume Roasts',
                    'Community Support'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  disabled
                  className="w-full py-3 border-2 border-white/20 bg-white/5 text-gray-500 font-bold uppercase tracking-wider cursor-not-allowed"
                >
                  Current Plan
                </button>
              </div>

              {/* PRO TIER */}
              <div className="relative border-2 border-electric-blue bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6">
                {/* Popular Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-iconic-gold text-black text-xs font-bold uppercase">
                  Most Popular
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold uppercase">Pro</h3>
                    <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        ₹499
                      </div>
                      <div className="text-lg text-gray-500 line-through font-sans">
                        ₹1,999
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">/month</div>
                    <div className="text-xs text-green-400 font-bold">75% OFF • Limited Time</div>
                  </div>
                </div>

                <p className="text-purple-300 text-sm mb-6">
                  For serious career athletes
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    { text: 'Everything in Free', highlight: false },
                    { text: 'Unlimited Nemesis Mode', highlight: true },
                    { text: 'Advanced Biometric Analytics', highlight: true },
                    { text: 'Unlimited Resume Roasts', highlight: true },
                    { text: 'Emotion-Aware AI Interviews', highlight: true },
                    { text: 'Focus Dojo Pro (50min sessions)', highlight: true },
                    { text: 'Priority Support', highlight: false },
                    { text: 'Custom Trading Cards', highlight: false },
                    { text: 'Interview History & Analytics', highlight: false }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        feature.highlight ? 'text-yellow-400' : 'text-green-500'
                      }`} />
                      <span className={`text-sm ${
                        feature.highlight ? 'text-yellow-200 font-bold' : ''
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

            {/* UPI Payment Section */}
            {!isProcessing && !showSuccess && (
              <div className="space-y-4">
                 <div className="bg-white p-4 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-electric-blue/50">
                    <div className="w-48 h-48 bg-white p-2 flex items-center justify-center">
                       {/* QR Code Placeholder using CSS patterns to look like a QR */}
                       <div className="w-full h-full bg-black relative overflow-hidden" style={{
                          backgroundImage: `conic-gradient(from 0deg at 0% 0%, #fff 25%, #000 25%, #000 50%, #fff 50%, #fff 75%, #000 75%, #000 100%)`,
                          backgroundSize: '20px 20px'
                       }}>
                          <div className="absolute inset-[15%] bg-white flex items-center justify-center">
                             <div className="w-10 h-10 bg-electric-blue rounded flex items-center justify-center text-white font-bold">UPI</div>
                          </div>
                          {/* Corner markers */}
                          <div className="absolute top-0 left-0 w-10 h-10 border-4 border-black bg-white">
                             <div className="absolute inset-1 bg-black"></div>
                          </div>
                          <div className="absolute top-0 right-0 w-10 h-10 border-4 border-black bg-white">
                             <div className="absolute inset-1 bg-black"></div>
                          </div>
                           <div className="absolute bottom-0 left-0 w-10 h-10 border-4 border-black bg-white">
                             <div className="absolute inset-1 bg-black"></div>
                          </div>
                       </div>
                    </div>
                    <p className="text-black font-mono text-xs mt-2 font-bold">Scan with any UPI App</p>
                    <p className="text-gray-500 text-[10px]">neuroprep@upi</p>
                 </div>

                 <button
                  onClick={handleUpgrade}
                  className="w-full py-4 bg-gradient-to-r from-electric-blue to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  I have Paid (Verify)
                </button>
              </div>
            )}

            {isProcessing && (
                 <div className="text-center py-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-12 h-12 border-4 border-electric-blue border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-purple-300 font-mono animate-pulse">Verifying UPI Transaction...</p>
                 </div>
            )}

             <p className="text-center text-xs text-gray-500 mt-3">
               💳 Powered by Razorpay (UPI) • Secure 256-bit SSL
            </p>

            {/* Auto-Pay Notice */}
            <div className="mt-3 p-2 border border-green-500/30 bg-green-500/10">
              <p className="text-xs text-green-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Instant Activation • Refundable within 30 days
              </p>
            </div>
           </div>
          </div>

          {/* Demo Notice */}
          <div className="p-4 border-l-4 border-yellow-500 bg-yellow-500/10 flex items-start gap-3">
             <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
             <div>
               <p className="text-sm text-yellow-300 font-bold mb-1">
                 Hackathon Prototype Mode
               </p>
               <p className="text-xs text-gray-400">
                 This is a simulated UPI integration for the UpSkill India Challenge.
                 Clicking "I have Paid" will grant premium features for demonstration.
               </p>
             </div>
          </div>

            {/* Features Comparison */}
            <div className="mt-6 p-4 border border-white/10 bg-white/5">
              <h4 className="text-sm uppercase font-bold mb-3 text-gray-400">Why Upgrade?</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
                {[
                  { icon: Zap, label: 'Unlimited Access', color: 'text-yellow-400' },
                  { icon: Crown, label: 'Premium Features', color: 'text-purple-400' },
                  { icon: Sparkles, label: 'Priority Support', color: 'text-blue-400' },
                  { icon: Shield, label: 'Cancel Anytime', color: 'text-green-400' }
                ].map((item, i) => (
                  <div key={i}>
                    <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
                    <div className="text-gray-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Money Back Guarantee */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                🎯 Money-back guarantee within 30 days • 🔒 Secure payments • 🚀 Instant activation
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
