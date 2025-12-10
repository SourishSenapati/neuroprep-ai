'use client';

import { motion } from 'framer-motion';
import { Brain, Zap, Target, TrendingUp, ArrowRight } from 'lucide-react';

export default function SimpleLanding({ onStartSession }: { onStartSession: () => void }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-8"
          >
            <Brain className="w-24 h-24 text-purple-300 mx-auto" />
          </motion.div>

          <motion.h1
            className="text-7xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            NeuroPrep AI
          </motion.h1>

          <motion.p
            className="text-3xl text-purple-100 mb-4 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Neural Optimizer for Elite Technical Interviews
          </motion.p>

          <motion.p
            className="text-xl text-purple-200 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Caltech/MIT PhD-level simulations with adaptive AI, live code execution, and real-time neural optimization
          </motion.p>

          <motion.button
            onClick={onStartSession}
            className="group relative px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full overflow-hidden"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Start Free Session
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { icon: Brain, title: 'Adaptive AI', desc: 'PhD-level questions with RAG from arXiv', color: 'purple' },
            { icon: Zap, title: 'Live Execution', desc: 'In-browser Python via Pyodide', color: 'pink' },
            { icon: Target, title: 'Stress Optimization', desc: 'Real-time difficulty adjustment', color: 'purple' },
            { icon: TrendingUp, title: 'Neural Analytics', desc: 'Track performance vs MIT/Caltech', color: 'pink' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 h-full">
                <feature.icon className={`w-12 h-12 mb-4 text-${feature.color}-300`} />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-200 text-sm">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-4xl mx-auto text-center"
        >
          {[
            { value: '10K+', label: 'PhD Simulations' },
            { value: '95%', label: 'Success Rate' },
            { value: '50+', label: 'Research Topics' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-purple-300 mb-2">{stat.value}</div>
              <div className="text-purple-200">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
