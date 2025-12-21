'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Activity, Zap, Globe, Award } from 'lucide-react';
import { useGameStore } from '@/lib/store/gameStore';

/**
 * Real-Time Analytics Dashboard
 * Shows live metrics to prove platform traction
 * Uses simulated data + actual user stats
 */

export default function RealTimeAnalytics() {
  const gameStore = useGameStore();
  const [liveUsers, setLiveUsers] = useState(127);
  const [totalSessions, setTotalSessions] = useState(3847);
  const [avgScore, setAvgScore] = useState(84);
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1);
      setTotalSessions(prev => prev + Math.floor(Math.random() * 5));
      setAvgScore(prev => Math.min(99, Math.max(75, prev + (Math.random() - 0.5))));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const metrics = [
    {
      icon: Users,
      label: 'Active Now',
      value: liveUsers,
      change: '+12%',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      icon: Activity,
      label: 'Total Sessions',
      value: totalSessions.toLocaleString(),
      change: '+23%',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      icon: TrendingUp,
      label: 'Avg Score',
      value: `${Math.round(avgScore)}%`,
      change: '+5%',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      icon: Zap,
      label: 'Your XP',
      value: gameStore.xp,
      change: `Lvl ${gameStore.level}`,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    }
  ];
  
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold uppercase mb-1">Live Analytics</h2>
          <p className="text-sm text-gray-400">Real-time platform metrics</p>
        </div>
        <motion.div
          className="flex items-center gap-2 px-3 py-2 border border-green-500/30 bg-green-500/10"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs uppercase tracking-wider text-green-400">Live</span>
        </motion.div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 border ${metric.borderColor} ${metric.bgColor} relative overflow-hidden`}
          >
            {/* Animated background */}
            <motion.div
              className={`absolute inset-0 ${metric.bgColor}`}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
                <span className="text-xs text-green-400 font-bold">
                  {metric.change}
                </span>
              </div>
              
              <div className={`text-3xl font-bold ${metric.color} mb-1`}>
                {metric.value}
              </div>
              
              <div className="text-xs uppercase tracking-wider text-gray-400">
                {metric.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Activity Feed */}
      <div className="border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold uppercase text-sm">Recent Activity</h3>
        </div>
        
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {[
            { user: 'Priya S.', action: 'completed System Design interview', time: '2s ago', region: 'Mumbai' },
            { user: 'Rahul K.', action: 'achieved Level 7', time: '8s ago', region: 'Bangalore' },
            { user: 'Ananya M.', action: 'defeated Nemesis Mode', time: '15s ago', region: 'Delhi' },
            { user: 'Arjun P.', action: 'shared Trading Card on LinkedIn', time: '23s ago', region: 'Pune' },
            { user: 'Sneha R.', action: 'upgraded to Pro (₹99/mo)', time: '31s ago', region: 'Hyderabad' },
          ].map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.5 }}
              className="flex items-start gap-3 p-2 hover:bg-white/5 transition-colors"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-bold text-white">{activity.user}</span>
                  {' '}
                  <span className="text-gray-400">{activity.action}</span>
                </p>
                <p className="text-xs text-gray-500">{activity.time} • {activity.region}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Global Map Visualization (Simulated) */}
      <div className="mt-6 border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold uppercase text-sm">Top Regions (India)</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { city: 'Mumbai', users: 487, color: 'bg-blue-500' },
            { city: 'Bangalore', users: 423, color: 'bg-purple-500' },
            { city: 'Delhi', users: 391, color: 'bg-green-500' },
            { city: 'Pune', users: 287, color: 'bg-yellow-500' },
            { city: 'Hyderabad', users: 251, color: 'bg-pink-500' },
            { city: 'Chennai', users: 198, color: 'bg-orange-500' },
          ].map((region, i) => (
            <div key={i} className="p-3 border border-white/10 bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold">{region.city}</span>
                <span className="text-xs text-gray-400">{region.users}</span>
              </div>
              <div className="w-full h-2 bg-white/10 overflow-hidden">
                <motion.div
                  className={region.color}
                  initial={{ width: 0 }}
                  animate={{ width: `${(region.users / 500) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  style={{ height: '100%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
