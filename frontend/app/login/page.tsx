'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Shield } from 'lucide-react';
import '@/styles/apple-glass.css';

export default function LoginPage() {
  const { user, loginWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen w-full bg-void-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-terminal-green/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-electric-blue/10 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-card p-8 border border-white/10 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-terminal-green to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-silver text-sm">
            Sign in to continue your engineering mastery journey.
          </p>
        </div>

        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full py-4 bg-white text-black font-bold text-lg rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-[0.98] shadow-xl"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-6 h-6" />
          <span>Continue with Google</span>
          <ArrowRight className="w-5 h-5 opacity-60" />
        </button>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                <Shield className="w-3 h-3" />
                Secure Enforcement • Enterprise Encryption
            </p>
        </div>
      </motion.div>
    </div>
  );
}
