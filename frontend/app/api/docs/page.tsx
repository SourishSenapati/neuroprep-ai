'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import '@/styles/apple-glass.css';

export default function ApiDocsPage() {
  return (
    <div className="apple-bg min-h-screen overflow-y-auto">
      <div className="apple-container py-20">
        <motion.div
           className="glass-card max-w-4xl mx-auto p-12"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="heading-lg">API Documentation</h1>
              <p className="text-white/60"> Integrate NeuroPrep AI into your applications</p>
            </div>
          </div>

          <div className="space-y-8">
             <div className="p-6 bg-black/40 rounded-xl border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Authentication</h2>
                <p className="text-gray-400 mb-4">
                  Authenticate requests using your API key in the header.
                </p>
                <code className="block bg-black/60 p-4 rounded text-sm font-mono text-green-400">
                  Authorization: Bearer YOUR_API_KEY
                </code>
             </div>

             <div className="p-6 bg-black/40 rounded-xl border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Endpoints</h2>
                
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">POST</span>
                    <span className="font-mono text-gray-300">/v1/interview/start</span>
                  </div>
                  <p className="text-sm text-gray-500">Initialize a new interview session.</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">GET</span>
                    <span className="font-mono text-gray-300">/v1/analytics/report/:sessionId</span>
                  </div>
                  <p className="text-sm text-gray-500">Retrieve detailed performance analytics.</p>
                </div>
             </div>

             <div className="flex justify-end">
                <Link href="/pricing" className="glass-button-primary px-6 py-2">
                   Get API Key
                </Link>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
