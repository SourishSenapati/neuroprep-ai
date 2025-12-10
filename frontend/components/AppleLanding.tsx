import { motion, useScroll, useTransform } from 'framer-motion';
import { Brain, Sparkles, Zap, Shield, ArrowRight, Terminal, Cpu, Globe } from 'lucide-react';
import { useRef } from 'react';

export default function AppleLanding({ onStartSession }: { onStartSession: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-mono selection:bg-white selection:text-black">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10"
      >
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="border border-white/20 bg-black/50 backdrop-blur-sm p-8 sm:p-12 relative overflow-hidden"
          >
            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-3 h-3 bg-green-500 animate-pulse"></div>
              <span className="text-xs tracking-[0.2em] text-gray-400">SYSTEM_ONLINE // V.2.0.4</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tighter mb-6 uppercase">
              NeuroPrep<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">_AI</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
              &gt; ELITE INTERVIEW SIMULATION PROTOCOL.<br/>
              &gt; ADAPTIVE INTELLIGENCE ENGINE.<br/>
              &gt; REAL-TIME NEURAL ANALYSIS.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <motion.button
                onClick={onStartSession}
                className="group relative px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  Initialize_Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              
              <div className="text-xs text-gray-500 font-mono">
                [ 5 FREE SESSIONS AVAILABLE ]<br/>
                [ NO CREDENTIALS REQUIRED ]
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {[
              {
                icon: Terminal,
                title: 'ADAPTIVE_CORE',
                desc: 'Dynamic difficulty adjustment based on real-time performance metrics.'
              },
              {
                icon: Cpu,
                title: 'CODE_EXEC',
                desc: 'Live Python/JS execution environment with instant feedback loops.'
              },
              {
                icon: Globe,
                title: 'GLOBAL_BENCHMARK',
                desc: 'Compare neural patterns against MIT/Caltech engineering standards.'
              },
              {
                icon: Shield,
                title: 'SECURE_VAULT',
                desc: 'End-to-end encrypted session data. Zero-knowledge architecture.'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0a0a0a] p-8 hover:bg-[#111] transition-colors group"
              >
                <feature.icon className="w-8 h-8 mb-6 text-gray-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-white">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-mono">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-mono">
          <p>NEUROPREP_AI © 2024 // ALL RIGHTS RESERVED</p>
          <div className="flex gap-8">
            <span>STATUS: OPERATIONAL</span>
            <span>LATENCY: 12ms</span>
            <span>REGION: US-WEST</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
