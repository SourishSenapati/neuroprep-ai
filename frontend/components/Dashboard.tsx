'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, Target, Clock, Award, Brain, Zap, Users, Calendar,
  ChevronRight, Play, BarChart3, PieChart as PieChartIcon, Activity
} from 'lucide-react';

interface DashboardProps {
  user: any;
  onStartInterview: () => void;
}

export default function Dashboard({ user, onStartInterview }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/dashboard?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Mock data for development
      setDashboardData({
        totalSessions: 12,
        averageScore: 78.5,
        avgTechnical: 82.3,
        avgEQ: 75.8,
        recentSessions: [
          { id: 1, role: 'Software Engineer', difficulty: 7, avg_score: 85, started_at: '2024-01-15' },
          { id: 2, role: 'Frontend Engineer', difficulty: 6, avg_score: 78, started_at: '2024-01-14' },
          { id: 3, role: 'Backend Engineer', difficulty: 8, avg_score: 92, started_at: '2024-01-13' }
        ],
        topicPerformance: [
          { topic: 'Algorithms', question_count: 15, avg_score: 88 },
          { topic: 'System Design', question_count: 12, avg_score: 75 },
          { topic: 'Data Structures', question_count: 18, avg_score: 82 },
          { topic: 'Databases', question_count: 8, avg_score: 79 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const performanceData = dashboardData?.recentSessions?.map((session: any, index: number) => ({
    session: `Session ${index + 1}`,
    score: session.avg_score,
    technical: session.technical_score || session.avg_score + Math.random() * 10 - 5,
    difficulty: session.difficulty * 10
  })) || [];

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Performance Dashboard</h1>
              <p className="text-gray-300 mt-1">Welcome back, {user.name}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartInterview}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <Play className="w-5 h-5" />
              Start New Interview
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Sessions</p>
                <p className="text-3xl font-bold text-white">{dashboardData.totalSessions}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">+12%</span>
              <span className="text-gray-400 ml-1">from last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Average Score</p>
                <p className="text-3xl font-bold text-white">{dashboardData.averageScore.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-pink-500/20 rounded-lg">
                <Award className="w-6 h-6 text-pink-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">+5.2%</span>
              <span className="text-gray-400 ml-1">improvement</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Technical Score</p>
                <p className="text-3xl font-bold text-white">{dashboardData.avgTechnical.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">Strong</span>
              <span className="text-gray-400 ml-1">performance</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">EQ Score</p>
                <p className="text-3xl font-bold text-white">{dashboardData.avgEQ.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Users className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Activity className="w-4 h-4 text-blue-400 mr-1" />
              <span className="text-blue-400">Balanced</span>
              <span className="text-gray-400 ml-1">communication</span>
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Performance Trend</h3>
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="session" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }} />
                <Line type="monotone" dataKey="technical" stroke="#EC4899" strokeWidth={2} dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Skill Radar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Skill Assessment</h3>
              <Activity className="w-5 h-5 text-pink-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillRadarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Topic Distribution</h3>
              <PieChartIcon className="w-5 h-5 text-blue-400" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topicPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {topicPieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Sessions</h3>
              <Calendar className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-4">
              {dashboardData.recentSessions.map((session: any, index: number) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{session.role}</p>
                      <p className="text-gray-400 text-sm">Difficulty: {session.difficulty}/10</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{session.avg_score}%</p>
                    <p className="text-gray-400 text-sm">{new Date(session.started_at).toLocaleDateString()}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={onStartInterview}
              className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <Play className="w-5 h-5" />
              New Interview
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-white/5 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
              <BarChart3 className="w-5 h-5" />
              View Analytics
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-white/5 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
              <Zap className="w-5 h-5" />
              Practice Mode
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}