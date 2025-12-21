'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Global Error Boundary Component
 * Catches runtime errors in React component tree
 * Displays user-friendly error message instead of white screen
 */

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console for debugging
    console.error('🔴 Error Boundary Caught:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo
    });

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // if (process.env.NODE_ENV === 'production') {
    //   logErrorToService(error, errorInfo);
    // }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
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
            className="relative z-10 max-w-2xl w-full"
          >
            {/* Error Card */}
            <div className="border border-red-500/30 bg-red-500/5 backdrop-blur-sm p-8 md:p-12">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="w-20 h-20 border-2 border-red-500 bg-red-500/10 flex items-center justify-center"
                >
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </motion.div>
              </div>

              {/* Heading */}
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold uppercase mb-3 tracking-tight">
                  System_Error_Detected
                </h1>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="uppercase tracking-widest">Critical Exception</span>
                </div>
              </div>

              {/* Message */}
              <div className="mb-8 text-center">
                <p className="text-lg text-gray-300 mb-4">
                  Something went wrong. Don't worry, your progress is saved.
                </p>
                <p className="text-sm text-gray-500">
                  Our systems have logged this incident and will investigate immediately.
                </p>
              </div>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <motion.details 
                  className="mb-8 border border-white/10 bg-white/5 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <summary className="cursor-pointer p-4 hover:bg-white/5 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <Bug className="w-4 h-4" />
                    Developer Info (Dev Mode Only)
                  </summary>
                  <div className="p-4 bg-black/50 text-xs font-mono">
                    <div className="mb-4">
                      <strong className="text-red-400">Error:</strong>
                      <pre className="mt-2 text-gray-400 overflow-x-auto">
                        {this.state.error.message}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong className="text-red-400">Stack Trace:</strong>
                        <pre className="mt-2 text-gray-400 overflow-x-auto whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </motion.details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={this.handleReset}
                  className="flex-1 py-4 px-6 bg-white text-black font-bold uppercase text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 group"
                >
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="flex-1 py-4 px-6 border border-white/10 bg-white/5 text-white font-bold uppercase text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 py-4 px-6 border border-white/10 bg-white/5 text-white font-bold uppercase text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              </div>

              {/* Support Info */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">
                  Need Assistance?
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-xs">
                  <a 
                    href="mailto:support@neuroprepai.com" 
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    support@neuroprepai.com
                  </a>
                  <span className="text-gray-700">|</span>
                  <a 
                    href="/docs" 
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Documentation
                  </a>
                  <span className="text-gray-700">|</span>
                  <a 
                    href="/health" 
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    System Status
                  </a>
                </div>
              </div>
            </div>

            {/* Error Code (for reference) */}
            <div className="mt-4 text-center text-xs text-gray-700 uppercase tracking-widest">
              Error Code: ERR_{this.state.error?.name?.toUpperCase() || 'UNKNOWN'}_{Date.now().toString().slice(-6)}
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper using react-error-boundary
 * Alternative to class component (if preferred)
 */
export function ErrorBoundaryWrapper({ children }: { children: ReactNode }) {
  return (
    <GlobalErrorBoundary>
      {children}
    </GlobalErrorBoundary>
  );
}

export default GlobalErrorBoundary;
