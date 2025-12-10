import { motion } from 'framer-motion';
import { Activity, Brain, Target, Zap, TrendingUp, Calendar, Clock, Award, ArrowUpRight } from 'lucide-react';

interface AppleDashboardProps {
  performance: {
    technical: number;
    problemSolving: number;
    communication: number;
    stressManagement: number;
    domainKnowledge: number;
    creativity: number;
  };
  interviewSessionCount: number;
  onStartSession: () => void;
}

export default function AppleDashboard({ performance, interviewSessionCount, onStartSession }: AppleDashboardProps) {
  // MIT Average Benchmarks (Mock Data - could be fetched from API in future)
  const mitAvg = {
    technical: 75,
    problemsolving: 72,
    communication: 70,
    stressmanagement: 68,
    domainknowledge: 73,
    creativity: 65
  };

  const overallScore = Math.round(
    Object.values(performance).reduce((a, b) => a + b, 0) / 6
  );

  // Dynamic improvement calculation (mock logic for now, but based on session count)
  const improvement = interviewSessionCount > 0 ? Math.min(100, interviewSessionCount * 5) : 0;
  const avgStress = Math.max(1, 8 - (interviewSessionCount * 0.5)).toFixed(1);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 font-mono relative overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
              <h1 className="text-2xl font-bold uppercase tracking-widest">Performance_Matrix</h1>
            </div>
            <p className="text-gray-500 text-xs">USER_ID: CANDIDATE_01 // SESSION_CYCLE: {interviewSessionCount}</p>
          </div>
          
          <button
            onClick={onStartSession}
            className="mt-4 md:mt-0 px-6 py-3 bg-white text-black text-sm font-bold uppercase hover:bg-gray-200 transition-colors flex items-center gap-2 group"
          >
            Initialize_New_Session
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </header>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'OVERALL_SCORE', value: overallScore, suffix: '/100', icon: Activity },
            { label: 'SESSIONS_LOGGED', value: interviewSessionCount, suffix: '', icon: Calendar },
            { label: 'AVG_STRESS_LVL', value: avgStress, suffix: '/10', icon: Zap },
            { label: 'IMPROVEMENT', value: `+${improvement}`, suffix: '%', icon: TrendingUp, color: 'text-green-500' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a0a0a] border border-white/10 p-6 hover:border-white/30 transition-colors group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-3xl font-bold flex items-baseline gap-1">
                <span className={stat.color || 'text-white'}>{stat.value}</span>
                <span className="text-sm text-gray-600 font-normal">{stat.suffix}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Metrics */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Radar/Bar Chart Area */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Neural_Competency_Map
              </h3>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div> YOU
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-600"></div> MIT_AVG
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(performance).map(([key, value], i) => {
                const mitValue = mitAvg[key.toLowerCase() as keyof typeof mitAvg];
                return (
                  <div key={key} className="relative">
                    <div className="flex justify-between text-xs uppercase mb-2">
                      <span className="text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-bold">{(value as number)}%</span>
                    </div>
                    <div className="h-2 bg-gray-900 w-full relative overflow-hidden">
                      {/* MIT Marker */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-gray-600 z-10"
                        style={{ left: `${mitValue}%` }}
                      ></div>
                      {/* User Bar */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(value as number)}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className="h-full bg-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insights Panel */}
          <div className="space-y-4">
            {(() => {
              const sorted = Object.entries(performance).sort((a, b) => (a[1] as number) - (b[1] as number));
              const weakest = sorted[0];
              const strongest = sorted[sorted.length - 1];
              const potentialScore = Math.min(100, (weakest[1] as number) + 25);

              return [
                {
                  title: 'CRITICAL_FOCUS',
                  value: weakest[0].toUpperCase(),
                  desc: `Current rating ${(weakest[1] as number)}%. Immediate attention required.`,
                  icon: Target
                },
                {
                  title: 'PROJECTED_GROWTH',
                  value: `${Math.round(potentialScore)}%`,
                  desc: 'Estimated capability after 3-week adaptive cycle.',
                  icon: TrendingUp
                },
                {
                  title: 'CORE_STRENGTH',
                  value: strongest[0].toUpperCase(),
                  desc: `Exceeds baseline by ${Math.round((strongest[1] as number) - 70)}%.`,
                  icon: Award
                }
              ];
            })().map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="bg-[#0a0a0a] border border-white/10 p-6 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3 text-gray-400">
                  <insight.icon className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">{insight.title}</span>
                </div>
                <div className="text-xl font-bold text-white mb-2">{insight.value}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{insight.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
