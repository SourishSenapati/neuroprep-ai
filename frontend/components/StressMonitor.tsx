'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StressMonitorProps {
  stressLevel: number;
  onStressChange: (level: number) => void;
}

export default function StressMonitor({ stressLevel, onStressChange }: StressMonitorProps) {
  const [history, setHistory] = useState<{ time: string; stress: number }[]>([]);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setHistory(prev => {
        const newHistory = [...prev, { time: timeStr, stress: stressLevel }].slice(-10);
        
        // Calculate trend
        if (newHistory.length >= 3) {
          const recent = newHistory.slice(-3);
          const avg = recent.reduce((sum, item) => sum + item.stress, 0) / recent.length;
          const prevAvg = newHistory.slice(-6, -3).reduce((sum, item) => sum + item.stress, 0) / 3;
          
          if (avg > prevAvg + 0.5) setTrend('up');
          else if (avg < prevAvg - 0.5) setTrend('down');
          else setTrend('stable');
        }
        
        return newHistory;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [stressLevel]);

  const getStressColor = (level: number) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStressLabel = (level: number) => {
    if (level <= 3) return 'Relaxed';
    if (level <= 6) return 'Moderate';
    return 'High Stress';
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-800">Stress Monitor</h3>
        </div>
        {trend === 'up' && <TrendingUp className="w-5 h-5 text-red-500" />}
        {trend === 'down' && <TrendingDown className="w-5 h-5 text-green-500" />}
      </div>

      {/* Current Stress Level */}
      <div className="text-center">
        <div className={`text-5xl font-bold mb-2 ${getStressColor(stressLevel)}`}>
          {stressLevel.toFixed(1)}
        </div>
        <div className="text-sm text-gray-600 font-medium">
          {getStressLabel(stressLevel)}
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Adjust Stress Level</label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={stressLevel}
          onChange={(e) => onStressChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Calm</span>
          <span>Stressed</span>
        </div>
      </div>

      {/* Chart */}
      {history.length > 0 && (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#9333ea" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="#9333ea" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid #e9d5ff',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="stress" 
                stroke="#9333ea" 
                strokeWidth={2}
                dot={{ fill: '#c026d3', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* AI Adaptation Info */}
      <div className="bg-purple-50 rounded-lg p-4 text-sm">
        <p className="font-medium text-purple-900 mb-1">AI Adaptation Active</p>
        <p className="text-purple-700">
          {stressLevel > 7 
            ? 'Simplifying questions and providing more guidance'
            : stressLevel > 4
            ? 'Balanced difficulty with clear explanations'
            : 'Challenging with advanced concepts'}
        </p>
      </div>
    </div>
  );
}
