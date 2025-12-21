/**
 * Next.js App Router Error Page
 * This handles errors at the route level
 * Works in conjunction with GlobalErrorBoundary for component-level errors
 */
'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('🔴 Route Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 font-mono">
      {/* Background Grid */}
      <div 
        className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-xl w-full"
      >
        <div className="border border-red-500/30 bg-red-500/5 backdrop-blur-sm p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="w-16 h-16 border-2 border-red-500 bg-red-500/10 flex items-center justify-center"
            >
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </motion.div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold uppercase mb-3 tracking-tight">
              Page_Load_Failed
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="uppercase tracking-widest">Route Error</span>
            </div>
            <p className="text-gray-300 mb-2">
              We encountered an error loading this page.
            </p>
            <p className="text-sm text-gray-500">
              Your progress is safe. Try refreshing or go back home.
            </p>
          </div>

          {/* Developer Info (Dev Mode) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-black/50 border border-white/10 text-xs font-mono">
              <strong className="text-red-400">Error:</strong>
              <pre className="mt-2 text-gray-400 overflow-x-auto">
                {error.message}
              </pre>
              {error.digest && (
                <div className="mt-2">
                  <strong className="text-red-400">Digest:</strong> {error.digest}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={reset}
              className="flex-1 py-4 px-6 bg-white text-black font-bold uppercase text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 group"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 py-4 px-6 border border-white/10 bg-white/5 text-white font-bold uppercase text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </div>
        </div>

        {/* Error ID */}
        <div className="mt-4 text-center text-xs text-gray-700 uppercase tracking-widest">
          Error ID: {error.digest || Date.now().toString(36).toUpperCase()}
        </div>
      </motion.div>
    </div>
  );
}
