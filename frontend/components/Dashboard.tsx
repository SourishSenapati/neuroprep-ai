'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, Target, Clock, Award, Brain, Zap, Users, Calendar,
  ChevronRight, Play, BarChart3, PieChart as PieChartIcon, Activity
} from 'lucide-react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useAuth } from '@/hooks/useAuth';

interface DashboardProps {
  // onStartInterview provided by wrapper or page if needed, normally routed via Link
  onStartInterview?: () => void;
}

export default function Dashboard({ onStartInterview }: DashboardProps) {
  const { user, loading: authLoading } = useAuth();
  const { handlePayment, loading: paymentProcessing } = useRazorpay();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
        fetchDashboardData(user.uid);
    } else if (!authLoading && !user) {
        setLoading(false); // No user, stop loading to show "Login" msg
    }
  }, [user, authLoading]);

  const fetchDashboardData = async (userId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/dashboard?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': ... (Add JWT if using middleware)
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.warn('Dashboard fetch error, using local fallback:', error);
      // Fallback
      setDashboardData({
        totalSessions: 0,
        averageScore: 0,
        avgTechnical: 0,
        avgEQ: 0,
        recentSessions: [],
        topicPerformance: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your career center...</div>
      </div>
    );
  }

  if (!user) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <div className="text-center">
                <h2 className="text-2xl mb-4">Access Denied</h2>
                <p>Please log in to view your dashboard.</p>
            </div>
        </div>
      );
  }

  // Determine Pro Status (from DB stats or user object fallback)
  const isPro = user.stats?.isPro || user.isPro || false;

  // ... (Mapping data remains similar, handling nulls) 
  const performanceData = dashboardData?.recentSessions?.map((session: any, index: number) => ({
    session: `Session ${index + 1}`,
    score: session.avg_score,
    technical: session.technical_score || session.avg_score,
    difficulty: session.difficulty * 10
  })) || [];
  
  // Hardcoded for visual for now if empty
  const skillRadarData = [
    { skill: 'Algorithms', score: 85, fullMark: 100 },
    { skill: 'System Design', score: 75, fullMark: 100 },
    { skill: 'Coding', score: 90, fullMark: 100 },
    { skill: 'Problem Solving', score: 82, fullMark: 100 },
    { skill: 'Communication', score: 78, fullMark: 100 },
    { skill: 'Architecture', score: 73, fullMark: 100 }
  ];

  const topicPieData = dashboardData?.topicPerformance?.map((topic: any, index: number) => ({
    name: topic.topic,
    value: topic.question_count,
    score: topic.avg_score
  })) || [];

  const COLORS = ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Performance Dashboard</h1>
              <p className="text-gray-300 mt-1">Welcome back, {user.name}</p>
            </div>
            
            <div className="flex items-center gap-4">
                {/* PRO Upgrade Button */}
                {!isPro ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePayment(user.uid || user._id, () => window.location.reload())}
                        disabled={paymentProcessing}
                        className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full shadow-lg shadow-orange-500/20"
                    >
                        {paymentProcessing ? 'Processing...' : '⚡ Upgrade to PRO (₹99)'}
                    </motion.button>
                ) : (
                    <div className="px-4 py-2 border border-green-500 text-green-400 rounded-full font-bold text-sm bg-green-500/10">
                        PRO MEMBER
                    </div>
                )}
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    // onClick={} // Link to interview setup
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                    <Play className="w-5 h-5" />
                    Start New Interview
                </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Sessions</p>
                <p className="text-3xl font-bold text-white">{dashboardData?.totalSessions || 0}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg"><Target className="w-6 h-6 text-purple-400" /></div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div>
                 <p className="text-gray-300 text-sm">Average Score</p>
                 <p className="text-3xl font-bold text-white">{(dashboardData?.averageScore || 0).toFixed(1)}</p>
              </div>
          </div>
          {/* ... More stats if needed ... */}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           {/* Performance Trend */}
           <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
             <h3 className="text-xl font-semibold text-white mb-6">Performance Trend</h3>
             <ResponsiveContainer width="100%" height={300}>
               <LineChart data={performanceData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                 <XAxis dataKey="session" stroke="#9CA3AF" />
                 <YAxis stroke="#9CA3AF" />
                 <Tooltip contentStyle={{ backgroundColor: '#1F2937' }} />
                 <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={3} />
               </LineChart>
             </ResponsiveContainer>
           </div>
           
           {/* Skill Radar */}
           <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
             <h3 className="text-xl font-semibold text-white mb-6">Skill Assessment</h3>
             <ResponsiveContainer width="100%" height={300}>
               <RadarChart data={skillRadarData}>
                 <PolarGrid stroke="#374151" />
                 <PolarAngleAxis dataKey="skill" tick={{ fill: '#9CA3AF' }} />
                 <Radar name="Score" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
               </RadarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}