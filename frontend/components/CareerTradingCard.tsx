import { motion } from 'framer-motion';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer 
} from 'recharts';
import { Share2, Download, Linkedin, Twitter } from 'lucide-react';

export default function CareerTradingCard({ user }: { user: any }) {
    const data = [
        { subject: 'System Design', A: 85, fullMark: 100 },
        { subject: 'Algorithms', A: 92, fullMark: 100 },
        { subject: 'Frontend', A: 78, fullMark: 100 },
        { subject: 'Backend', A: 88, fullMark: 100 },
        { subject: 'Focus', A: 65, fullMark: 100 },
        { subject: 'Leadership', A: 70, fullMark: 100 },
    ];

    return (
        <div className="relative group perspective-1000 w-full max-w-sm mx-auto">
            <motion.div 
                className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
                whileHover={{ rotateY: 5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* Holographic Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />
                
                <div className="flex justify-between items-center mb-6 z-20 relative">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-widest uppercase">Career Athlete</h3>
                        <p className="text-[#4ADE80] text-sm font-mono">{user?.name || 'Candidate'}</p>
                    </div>
                    <div className="text-right">
                        <span className="block text-3xl font-bold text-white">{user?.level || 1}</span>
                        <span className="text-[10px] text-gray-500 uppercase">Level</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-6 z-20 relative">
                    <div className="bg-white/5 rounded p-2 text-center border border-white/5">
                        <span className="block text-white font-bold">{user?.streak || 0}</span>
                        <span className="text-[8px] text-gray-500 uppercase">Streak</span>
                    </div>
                    <div className="bg-white/5 rounded p-2 text-center border border-white/5">
                        <span className="block text-white font-bold">{user?.xp || 0}</span>
                        <span className="text-[8px] text-gray-500 uppercase">XP</span>
                    </div>
                    <div className="bg-white/5 rounded p-2 text-center border border-white/5">
                        <span className="block text-[#4ADE80] font-bold">Top 1%</span>
                        <span className="text-[8px] text-gray-500 uppercase">Rank</span>
                    </div>
                </div>

                {/* Radar Chart */}
                <div className="h-48 mb-6 relative z-20">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                            <PolarGrid stroke="#333" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10 }} />
                            <Radar
                                name="Skills"
                                dataKey="A"
                                stroke="#4ADE80"
                                strokeWidth={2}
                                fill="#4ADE80"
                                fillOpacity={0.2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Footer / QR Code Placeholder */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-20">
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Share2 className="w-4 h-4 text-gray-400" /></button>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Linkedin className="w-4 h-4 text-blue-400" /></button>
                    </div>
                    <div className="text-right">
                         <p className="text-[10px] text-gray-600">Scan to Join</p>
                         <p className="text-xs font-bold text-white">NeuroPrep AI</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
