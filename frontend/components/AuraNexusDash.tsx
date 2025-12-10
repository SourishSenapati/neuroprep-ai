'use client';

import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Activity, Brain, Eye, Zap } from 'lucide-react';

const MOCK_DATA_RADAR = [
  { subject: 'Technical', A: 120, fullMark: 150 },
  { subject: 'System Design', A: 98, fullMark: 150 },
  { subject: 'Communication', A: 86, fullMark: 150 },
  { subject: 'Authenticity', A: 99, fullMark: 150 },
  { subject: 'Resilience', A: 85, fullMark: 150 },
  { subject: 'Creativity', A: 65, fullMark: 150 },
];

const MOCK_DATA_RIFT = [
  { name: '0s', rift: 10 },
  { name: '10s', rift: 15 },
  { name: '20s', rift: 8 },
  { name: '30s', rift: 45 }, // Spike
  { name: '40s', rift: 20 },
  { name: '50s', rift: 12 },
  { name: '60s', rift: 5 },
];

export default function AuraNexusDash() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-mono relative overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <header className="relative z-10 flex justify-between items-end mb-12 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            NEXUS MANIFOLD
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            QUANTUM ENTANGLEMENT STATUS: <span className="text-green-400">COHERENT</span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-600">BENCHMARK 2025</div>
          <div className="text-xl font-bold text-purple-400">Aura &gt; Caltech Avg</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Neural Manifold (Radar) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold">READINESS HEATMAP</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_DATA_RADAR}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} />
                <Radar
                  name="Candidate"
                  dataKey="A"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fill="#a855f7"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Longitudinal Rift Timeline */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Eye className="w-5 h-5 text-pink-400" />
            <h2 className="text-lg font-bold">GAZE AVERSION / RIFT TIMELINE</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA_RIFT}>
                <defs>
                  <linearGradient id="colorRift" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                  itemStyle={{ color: '#ec4899' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="rift" 
                  stroke="#ec4899" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRift)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Real-time Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { label: 'NEURAL_SYNC', value: '98.4%', icon: Zap, color: 'text-yellow-400' },
            { label: 'STRESS_RESILIENCE', value: 'HIGH', icon: Activity, color: 'text-green-400' },
            { label: 'AURA_COHERENCE', value: 'STABLE', icon: Brain, color: 'text-blue-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group hover:bg-white/10 transition-colors">
              <div>
                <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
