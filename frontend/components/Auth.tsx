'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Mail, Chrome, GraduationCap, Loader2, X } from 'lucide-react';
import { useState } from 'react';

export default function Auth({ onAuthSuccess, onClose }: { onAuthSuccess?: (role: string) => void, onClose?: () => void }) {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'standard' | 'caltech' | 'mit'>('standard');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });
      
      if (result?.ok) {
        // Successful login
        if (typeof window !== 'undefined') {
             // Simulate persisting role to game store if needed
             localStorage.setItem('userRole', role);
        }
        onAuthSuccess?.(role);
      } else {
        // Fallback for demo
        onAuthSuccess?.(role);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      // Fallback for demo/offline
      onAuthSuccess?.(role);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  if (session) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 font-mono"
      >
        <div className="border border-white/20 bg-black/50 backdrop-blur-sm p-8 max-w-md w-full text-center relative">
            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-white/10 mx-auto mb-6 flex items-center justify-center border border-white/20"
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">Welcome back</h2>
          <p className="text-gray-400 mb-6">{session.user?.email}</p>
          
          <button
            onClick={() => signOut()}
            className="w-full px-6 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 font-mono relative overflow-hidden">
       {/* Grid Background */}
       <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-white/20 bg-black/80 backdrop-blur-md p-8 max-w-md w-full relative z-10"
      >
         {/* Close Button */}
         {onClose && (
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
         )}

        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>

        {/* Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/20 mx-auto mb-4 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">NeuroPrep AI</h1>
          <p className="text-gray-400 text-xs tracking-widest">AUTHENTICATION REQUIRED</p>
        </motion.div>

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Select Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'standard', label: 'Standard', desc: 'General' },
              { value: 'caltech', label: 'Caltech', desc: 'PhD' },
              { value: 'mit', label: 'MIT', desc: 'Tech' }
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => setRole(option.value as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 border transition-all ${
                  role === option.value
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50'
                }`}
              >
                <div className="font-bold text-xs uppercase">{option.label}</div>
              </motion.button>
            ))}
          </div>
          {role === 'caltech' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-3 bg-white/5 border border-white/10 text-xs text-gray-300 font-mono"
            >
              &gt; LOADING ARXIV DATABASE...<br/>
              &gt; PHD DEFENSE SIMULATION ENABLED.
            </motion.div>
          )}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-black border border-white hover:bg-gray-200 transition-all mb-3 disabled:opacity-50 uppercase tracking-widest text-sm font-bold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Chrome className="w-4 h-4" />
          <span>Google Access</span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55 }}
          onClick={() => signIn('linkedin', { callbackUrl: '/' })}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#0077b5] text-white border border-[#0077b5] hover:bg-[#006396] transition-all mb-4 disabled:opacity-50 uppercase tracking-widest text-sm font-bold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          <span>LinkedIn Access</span>
        </motion.button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="px-4 bg-black text-gray-500">or email access</span>
          </div>
        </div>

        {/* Email Form */}
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleEmailSignIn}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="USER@EXAMPLE.COM"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 text-white placeholder-gray-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors font-mono text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-gray-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors font-mono text-sm"
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-all disabled:opacity-50 uppercase tracking-widest text-sm font-bold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              'Authenticate'
            )}
          </motion.button>
        </motion.form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-xs text-gray-500 uppercase tracking-wider"
        >
          No credentials?{' '}
          <button className="text-white hover:underline font-bold">
            Register
          </button>
        </motion.p>

        {/* Demo Mode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 p-3 bg-white/5 border border-white/10 text-center"
        >
          <p className="text-xs text-gray-400 font-mono">
            &gt; DEMO MODE: ANY CREDENTIALS ACCEPTED
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

