'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, Target, Clock, Award, Brain, Zap, Users, Calendar,
  ChevronRight, Play, BarChart3, PieChart as PieChartIcon, Activity, Sparkles, User
} from 'lucide-react';
import Link from 'next/link';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useAuth } from '@/hooks/useAuth';
import { useGameStore } from '@/lib/store/gameStore';
import { CareerCard } from './social/CareerCard';
import { UserProfileModal } from './social/UserProfileModal';

interface DashboardProps {
  onStartInterview?: () => void;
}

export default function Dashboard({ onStartInterview }: DashboardProps) {
  const { user, loading: authLoading } = useAuth();
  const { handlePayment, loading: paymentProcessing } = useRazorpay();
  const { level, xp, streak, getXpToNextLevel, sessionsCompleted } = useGameStore();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching advanced stats or usage of real API
    // For now, we mix GameStore (local) with API (history)
    if (user?.uid) {
        fetchDashboardData(user.uid);
    } else if (!authLoading && !user) {
        setLoading(false);
    }
  }, [user, authLoading]);

  const fetchDashboardData = async (userId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/dashboard?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
       // Fallback for demo
       setDashboardData({
           recentSessions: [
               { id: 1, role: 'Software Engineer', avg_score: 85, started_at: '2024-01-15', difficulty: 7 },
               { id: 2, role: 'System Architect', avg_score: 72, started_at: '2024-01-18', difficulty: 9 },
               { id: 3, role: 'Frontend Dev', avg_score: 92, started_at: '2024-01-20', difficulty: 6 }
           ],
           stats: {
               avgTechnical: 78,
               avgCommunication: 85,
               avgProblemSolving: 80
           }
       });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 rounded-full border-t-2 border-electric-blue animate-spin" />
             <div className="text-gray-400 font-mono text-sm tracking-widest">LOADING COMMAND CENTER...</div>
        </div>
      </div>
    );
  }

  if (!user) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white p-6">
            <div className="text-center max-w-md border border-white/10 bg-[#121212] p-8 rounded-2xl">
                <Brain className="w-12 h-12 text-[#EAB308] mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Neural Link Required</h2>
                <p className="text-gray-400 mb-8">Establish a connection to access your command center.</p>
                <Link href="/login" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                    Authenticate
                </Link>
            </div>
        </div>
      );
  }

  const performanceData = dashboardData?.recentSessions?.map((session: any, index: number) => ({
    session: `S${index + 1}`,
    score: session.avg_score,
  })) || [];

  const skillRadarData = [
    { skill: 'Algo', score: dashboardData?.stats?.avgTechnical || 75, fullMark: 100 },
    { skill: 'Design', score: 70, fullMark: 100 },
    { skill: 'Code', score: 85, fullMark: 100 },
    { skill: 'Comms', score: dashboardData?.stats?.avgCommunication || 80, fullMark: 100 },
    { skill: 'Creativity', score: 75, fullMark: 100 },
    { skill: 'Speed', score: 65, fullMark: 100 }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-electric-blue/30 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl z-50 flex items-center justify-between px-6">
         <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-[#EAB308]" />
            <span className="font-bold text-lg tracking-tight">NeuroPrep<span className="text-[#A3A3A3]">AI</span></span>
         </div>
         <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#121212] rounded-full border border-white/10">
                 <Zap className="w-3 h-3 text-[#EAB308]" />
                 <span className="text-xs font-mono text-[#EAB308]">{xp} XP</span>
             </div>
             <button onClick={() => setIsProfileOpen(true)} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#333] to-[#111] border border-white/20 flex items-center justify-center hover:border-white/50 transition-colors">
                 <User className="w-4 h-4 text-gray-400" />
             </button>
         </div>
      </header>
      
      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
         
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Identity & Actions (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
                {/* Career Card Preview */}
                <div onClick={() => setIsProfileOpen(true)} className="cursor-pointer group perspective-1000">
                     <CareerCard 
                        level={level} 
                        rank={user.isPro ? "Top 1%" : "Top 20%"} 
                        xp={xp}
                     />
                     <p className="text-center text-xs text-gray-500 mt-2 group-hover:text-white transition-colors">Click to Manage Identity</p>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Neural Operations</h3>
                    <div className="space-y-3">
                        <Link href="/interview/setup" className="block">
                            <button className="w-full flex items-center justify-between p-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl transition-all shadow-lg hover:shadow-[#3B82F6]/25 group">
                                <span className="flex items-center gap-3 font-bold">
                                    <Play className="w-5 h-5 fill-current" />
                                    Start Simulation
                                </span>
                                <ChevronRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        
                        <button className="w-full flex items-center justify-between p-4 bg-[#1A1A1A] hover:bg-[#222] text-gray-300 border border-white/5 rounded-xl transition-colors group">
                             <span className="flex items-center gap-3">
                                 <Target className="w-5 h-5 text-[#EAB308]" />
                                 Focus Training
                             </span>
                             <span className="text-xs px-2 py-0.5 bg-black rounded text-gray-500">SOON</span>
                        </button>
                    </div>
                </div>

                {/* Streak Status */}
                <div className="bg-gradient-to-br from-[#121212] to-black border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Zap className="w-24 h-24 text-[#EAB308]" />
                     </div>
                     <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Active Streak</h3>
                     <div className="flex items-baseline gap-2 mb-4">
                         <span className="text-4xl font-bold text-white">{streak}</span>
                         <span className="text-sm text-gray-500">days</span>
                     </div>
                     <div className="w-full bg-[#333] h-1.5 rounded-full overflow-hidden">
                         <div className="h-full bg-[#EAB308]" style={{ width: `${Math.min(streak * 10, 100)}%` }} />
                     </div>
                </div>
            </div>

            {/* Right Column: Analytics & History (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Sessions', value: sessionsCompleted, icon: Activity, color: '#3B82F6' },
                        { label: 'Avg Score', value: `${(dashboardData?.stats?.avgTechnical || 0).toFixed(0)}%`, icon: Award, color: '#EAB308' },
                        { label: 'Time Spent', value: '4.2h', icon: Clock, color: '#10B981' },
                        { label: 'Next Level', value: getXpToNextLevel(), icon: TrendingUp, color: '#8B5CF6' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#121212] border border-white/5 p-4 rounded-xl hover:border-white/10 transition-colors">
                            <stat.icon className="w-5 h-5 mb-3" style={{ color: stat.color }} />
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main Chart Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Performance Trend */}
                    <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Performance Trend
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="session" stroke="#555" tick={{fontSize: 12}} />
                                    <YAxis stroke="#555" tick={{fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#3B82F6" fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Skill Radar */}
                    <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl">
                         <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Skill Matrix
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={skillRadarData}>
                                    <PolarGrid stroke="#333" />
                                    <PolarAngleAxis dataKey="skill" tick={{ fill: '#777', fontSize: 10 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Skills" dataKey="score" stroke="#EAB308" fill="#EAB308" fillOpacity={0.2} />
                                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent History Table */}
                <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Recent Simulations</h3>
                    </div>
                    <div>
                        {dashboardData?.recentSessions?.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">No simulations recorded yet.</div>
                        ) : (
                            dashboardData?.recentSessions?.map((s: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs ring-1 ring-blue-500/20">
                                            {(s.avg_score || 0).toFixed(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{s.role}</div>
                                            <div className="text-xs text-gray-500">{new Date(s.started_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-xs px-2 py-1 rounded bg-[#222] text-gray-400 border border-white/5">
                                            Lvl {s.difficulty || 5}
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-600" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
         </div>
         
         <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      </main>
    </div>
  );
}