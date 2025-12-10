'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import '@/styles/apple-glass.css';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Simulate payment processing if needed
  }, []);

  const handlePayment = () => {
     setProcessing(true);
     setTimeout(() => {
         router.push('/dashboard?upgraded=true');
     }, 2000);
  };

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full p-8"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Secure Checkout</h1>
        <p className="text-gray-400 mb-6">Upgrading to <span className="text-purple-400 font-bold capitalize">{plan}</span> Plan</p>
        
        <div className="bg-white/5 p-4 rounded-lg mb-6 border border-white/10">
           <div className="flex justify-between mb-2">
              <span className="text-gray-300">NeuroPrep AI {plan === 'pro' ? 'Pro' : 'Enterprise'}</span>
              <span className="text-white font-bold">₹2,499.00</span>
           </div>
           <div className="flex justify-between text-sm text-gray-500">
              <span>Tax (18% GST)</span>
              <span>₹449.82</span>
           </div>
           <div className="border-t border-white/10 my-2 pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹2,948.82</span>
           </div>
        </div>

        <button 
          onClick={handlePayment}
          disabled={processing}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {processing ? (
             <>Processing...</>
          ) : (
             <>Pay Now (Secure)</>
          )}
        </button>
        
        <p className="text-center text-xs text-gray-500 mt-4">
            Encrypted by Stripe (Simulated)
        </p>
      </motion.div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="apple-bg min-h-screen flex items-center justify-center p-4">
       <Suspense fallback={<div className="text-white">Loading Secure Gateway...</div>}>
          <CheckoutContent />
       </Suspense>
    </div>
  );
}
