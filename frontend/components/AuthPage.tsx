'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Phone, User, Briefcase, TrendingUp, Chrome, Linkedin, Twitter, AlertTriangle } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
  showAttemptLimit?: boolean;
  attemptsRemaining?: number;
}

interface AttemptInfo {
  remaining: number;
  requiresAuth: boolean;
  unlimited?: boolean;
}

export default function AuthPage({ onAuthSuccess, showAttemptLimit = false, attemptsRemaining = 0 }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'Software Engineer',
    level: 'Senior'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attemptInfo, setAttemptInfo] = useState<AttemptInfo | null>(null);
  const [showAttemptWarning, setShowAttemptWarning] = useState(false);

  const roles = [
    'Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer',
    'DevOps Engineer', 'Data Engineer', 'Machine Learning Engineer', 'Security Engineer',
    'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Chemical Engineer',
    'Aerospace Engineer', 'Biomedical Engineer', 'Industrial Engineer'
  ];

  const levels = ['Junior', 'Mid-Level', 'Senior', 'Staff', 'Principal', 'Director'];

  // Check attempt status on component mount
  useEffect(() => {
    const checkAttempts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/attempts`);
        const data = await response.json();
        setAttemptInfo(data);
        
        if (data.requiresAuth || data.remaining <= 1) {
          setShowAttemptWarning(true);
          if (data.requiresAuth) {
            setIsLogin(false); // Force to sign up mode
          }
        }
      } catch (error) {
        console.warn('Could not check attempt status:', error);
      }
    };
    
    checkAttempts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        onAuthSuccess(data.user);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider: string) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          >
            <span className="text-2xl font-bold text-white">N</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">NeuroPrep AI</h1>
          <p className="text-gray-300 text-sm">Elite Technical Interview Preparation</p>
          
          {/* Attempt warning */}
          {showAttemptWarning && attemptInfo && !attemptInfo.unlimited && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-200 text-sm flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              {attemptInfo.requiresAuth ? (
                <span>Free attempts exhausted. Please sign up to continue.</span>
              ) : (
                <span>{attemptInfo.remaining} free attempt{attemptInfo.remaining !== 1 ? 's' : ''} remaining</span>
              )}
            </motion.div>
          )}
        </div>

        {/* Auth form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          {/* Toggle buttons */}
          <div className="flex mb-6 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              disabled={attemptInfo?.requiresAuth}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white'
              } ${attemptInfo?.requiresAuth ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                      required={!isLogin}
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      placeholder="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        aria-label="Select Role"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors appearance-none"
                      >
                        {roles.map(role => (
                          <option key={role} value={role} className="bg-gray-800">{role}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        aria-label="Select Level"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors appearance-none"
                      >
                        {levels.map(level => (
                          <option key={level} value={level} className="bg-gray-800">{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          {/* Social login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialAuth('google')}
                className="flex justify-center items-center py-3 px-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Chrome className="w-5 h-5 text-white" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialAuth('linkedin')}
                className="flex justify-center items-center py-3 px-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-blue-400" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialAuth('twitter')}
                className="flex justify-center items-center py-3 px-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
              </motion.button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}