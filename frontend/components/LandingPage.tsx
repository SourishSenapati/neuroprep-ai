'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, TrendingUp, ArrowRight } from 'lucide-react';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function NeuralParticles() {
  const count = 1000;
  const particlesRef = useRef<THREE.Points>(null);
  
  const [positions, connections] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const conn: number[][] = [];
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      if (i > 0 && Math.random() > 0.95) {
        conn.push([i, Math.floor(Math.random() * i)]);
      }
    }
    
    return [pos, conn];
  }, []);

  return (
    <group>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#a855f7" transparent opacity={0.8} />
      </points>
      {connections.map(([a, b], i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2],
                positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#d946ef" transparent opacity={0.2} />
        </line>
      ))}
    </group>
  );
}

export default function LandingPage({ onStartSession }: { onStartSession: () => void }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      {/* 3D Neural Network Background */}
      <div className="absolute inset-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <NeuralParticles />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
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
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
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

      {/* Animated Waves */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30"
          animate={{
            x: [0, 100, 0],
            scaleY: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: 'bottom' }}
        />
      </div>
    </div>
  );
}
