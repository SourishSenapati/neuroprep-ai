import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, TrendingUp } from 'lucide-react';

export default function LiveAnalytics() {
  const [activeUsers, setActiveUsers] = useState(3854);
  const [activities, setActivities] = useState([
    { text: 'Priya S. completed System Design interview', time: '2s ago', location: 'Mumbai' },
    { text: 'Rahul K. achieved Level 7', time: '8s ago', location: 'Bangalore' },
    { text: 'Ananya M. defeated Nemesis Mode', time: '15s ago', location: 'Delhi' }
  ]);

  useEffect(() => {
    // Poll for real activity
    const interval = setInterval(async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/activity`);
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                 setActivities(data.map((a: any) => ({
                     text: `${a.userName || 'User'} ${a.action}`,
                     time: 'Just now',
                     location: a.location || 'India'
                 })));
            }
        } catch (e) {
            // silent fail, keep mock
        }
        
        // Randomly fluctuate active users
        setActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-24 right-8 w-80 z-40 hidden xl:block">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Live Analytics
          </h3>
          <span className="text-xs text-gray-500">Real-time platform metrics</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white/5 p-3 rounded-lg text-center">
             <p className="text-xs text-gray-400 mb-1">Active Now</p>
             <p className="text-xl font-bold text-white flex items-center justify-center gap-1">
                {activeUsers.toLocaleString()}
                <Users className="w-3 h-3 text-green-400" />
             </p>
             <span className="text-[10px] text-green-400">+23%</span>
          </div>
          <div className="bg-white/5 p-3 rounded-lg text-center">
             <p className="text-xs text-gray-400 mb-1">Total Sessions</p>
             <p className="text-xl font-bold text-white">+12%</p>
             <span className="text-[10px] text-gray-400">vs last week</span>
          </div>
        </div>

        <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Recent Activity</p>
            <div className="space-y-3">
                <AnimatePresence mode='popLayout'>
                    {activities.slice(0, 4).map((activity, i) => (
                        <motion.div 
                           key={i} // In production use unique ID
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           className="flex items-start gap-3 text-sm"
                        >
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                            <div>
                                <p className="text-gray-200 text-xs leading-relaxed">{activity.text}</p>
                                <p className="text-[10px] text-gray-500">{activity.time} • {activity.location}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
}
