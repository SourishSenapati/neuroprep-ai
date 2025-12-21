'use client';

import React, { useState } from 'react';
import { useCompletion } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Flame, Zap, Sparkles, RotateCcw } from 'lucide-react';
import { useGameStore } from '@/lib/store/gameStore';
import toast from 'react-hot-toast';

/**
 * Resume Roast Battle Page
 * Witty AI career coaching with streaming responses
 * Gamification: Earn 50 XP per roast completion
 */

export default function RoastBattle() {
  const [resumeSnippet, setResumeSnippet] = useState('');
  const completeTask = useGameStore((state) => state.completeTask);

  const {
    completion,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
    stop
  } = useCompletion({
    api: '/api/chat/roast',
    body: {
      resumeSnippet: resumeSnippet
    },
    onFinish: (prompt, completion) => {
      // Award XP for completing roast
      completeTask(50);
      
      toast.success('🔥 +50 XP! Roast Complete!', {
        icon: '⚡',
        duration: 3000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(234, 179, 8, 0.3)'
        }
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate roast', {
        icon: '❌',
        duration: 4000
      });
    }
  });

  const handleRoast = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeSnippet.trim()) {
      toast.error('Please enter a resume snippet to roast!', {
        icon: '⚠️',
        duration: 3000
      });
      return;
    }

    handleSubmit(e);
  };

  const handleReset = () => {
    setResumeSnippet('');
    setInput('');
    stop();
  };

  // Example snippets for quick testing
  const exampleSnippets = [
    "I'm a passionate developer with extensive experience in various technologies. Hard worker, team player, detail-oriented.",
    "Responsible for managing multiple projects and coordinating with stakeholders to deliver results.",
    "Self-starter with excellent communication skills and proven track record of success in fast-paced environments."
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-10 h-10 text-orange-500 fill-current" />
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Resume Roast Battle
            </h1>
            <Flame className="w-10 h-10 text-orange-500 fill-current" />
          </div>
          <p className="text-gray-400 text-lg">
            Get brutally honest feedback from our AI career coach
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-yellow-500">
            <Zap className="w-4 h-4" />
            <span>Earn 50 XP per roast!</span>
          </div>
        </motion.div>

        {/* Split Screen Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Input Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Your Resume Snippet
            </h2>

            <form onSubmit={handleRoast} className="space-y-4">
              <textarea
                value={resumeSnippet}
                onChange={(e) => setResumeSnippet(e.target.value)}
                placeholder="Paste a snippet from your resume (max 500 chars)..."
                className="w-full h-64 bg-black/50 border border-white/10 p-4 text-white placeholder-gray-600 focus:outline-none focus:border-white resize-none font-mono text-sm"
                maxLength={500}
                disabled={isLoading}
              />

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{resumeSnippet.length}/500 characters</span>
                {resumeSnippet.length > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>

              {/* Example Snippets */}
              <div className="space-y-2">
                <p className="text-xs text-gray-600 uppercase tracking-wider">Quick Examples:</p>
                <div className="flex flex-wrap gap-2">
                  {exampleSnippets.map((snippet, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setResumeSnippet(snippet)}
                      className="text-xs px-3 py-1 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                      disabled={isLoading}
                    >
                      Example {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !resumeSnippet.trim()}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold uppercase tracking-widest hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Flame className="w-5 h-5" />
                    </motion.div>
                    Roasting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    Roast My Resume
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right: Roast Console */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-red-500/5 p-6"
          >
            <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2 text-orange-400">
              <Flame className="w-5 h-5 fill-current" />
              Roast Console
            </h2>

            <div className="bg-black/80 border border-orange-500/20 p-6 h-96 overflow-y-auto font-mono text-sm relative">
              <AnimatePresence mode="wait">
                {!completion && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-gray-600"
                  >
                    <Flame className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-center">
                      Paste your resume snippet and click "Roast My Resume" to get started
                    </p>
                  </motion.div>
                )}

                {isLoading && !completion && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-orange-400"
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      &gt;
                    </motion.span>
                    Preparing roast...
                  </motion.div>
                )}

                {completion && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-orange-400">&gt;</span>
                      <div className="flex-1">
                        <p className="text-orange-400 mb-2 text-xs uppercase tracking-wider">
                          AI Career Coach:
                        </p>
                        <p className="text-white leading-relaxed whitespace-pre-wrap">
                          {completion}
                        </p>
                      </div>
                    </div>

                    {!isLoading && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-4 border border-green-500/30 bg-green-500/10"
                      >
                        <div className="flex items-center gap-2 text-green-400 mb-2">
                          <Zap className="w-4 h-4" />
                          <span className="text-sm font-bold">+50 XP Earned!</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Keep roasting to level up your career game! 🔥
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cursor effect while streaming */}
              {isLoading && completion && (
                <motion.span
                  className="inline-block w-2 h-4 bg-orange-500 ml-1"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-center text-xs">
              <div className="p-3 border border-white/10 bg-white/5">
                <div className="text-2xl font-bold text-orange-400">{resumeSnippet.length > 0 ? '1' : '0'}</div>
                <div className="text-gray-500 uppercase tracking-wider">Snippets Analyzed</div>
              </div>
              <div className="p-3 border border-white/10 bg-white/5">
                <div className="text-2xl font-bold text-yellow-400">50 XP</div>
                <div className="text-gray-500 uppercase tracking-wider">Per Roast</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
