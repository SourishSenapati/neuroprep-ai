import React from 'react';
import { motion } from 'framer-motion';
import { Share2, QrCode } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface CareerCardProps {
  level?: number;
  streak?: number;
  xp?: number;
  rank?: string;
  focusAreas?: string[];
}

export const CareerCard: React.FC<CareerCardProps> = ({
  level = 1,
  streak = 0,
  xp = 0,
  rank = "Top 1%",
  focusAreas = ['System Design', 'Algorithms', 'Frontend', 'Backend', 'Focus', 'Leadership']
}) => {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Guest User";
  
  const handleShare = () => {
    const text = `🚀 I'm training as a Career Athlete on NeuroPrep AI! \n\n🏆 Level: ${level}\n🔥 Streak: ${streak} Days\n⚡ XP: ${xp}\n\nJoin me in mastering engineering interviews: https://neuroprep-ai.vercel.app`;
    const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
    window.open(linkedinUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-[360px] h-[600px] bg-[#0A0A0A] rounded-[32px] overflow-hidden shadow-2xl border border-[#333] group select-none"
      >
         {/* Noise Texture */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none mix-blend-overlay"></div>
         
         {/* Top Gradient Blob */}
         <div className="absolute top-[-20%] right-[-20%] w-[300px] h-[300px] bg-purple-600/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>

         <div className="relative z-10 flex flex-col h-full p-8 font-sans">
            
            {/* Header Section */}
            <div className="flex justify-between items-start mb-12">
               <div>
                  <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">Career Athlete</h2>
                  <p className="text-gray-500 text-lg font-medium">{userName}</p>
               </div>
               
               {/* Vertical Stats Stack */}
               <div className="flex flex-col gap-6 text-right">
                  <div>
                      <div className="text-4xl font-bold text-white leading-none">{level}</div>
                      <div className="text-xs text-gray-500 uppercase font-mono tracking-widest mt-1">Level</div>
                  </div>
                  <div>
                      <div className="text-4xl font-bold text-white leading-none">{streak}</div>
                      <div className="text-xs text-gray-500 uppercase font-mono tracking-widest mt-1">Streak</div>
                  </div>
                  <div>
                      <div className="text-4xl font-bold text-white leading-none">{xp}</div>
                      <div className="text-xs text-gray-500 uppercase font-mono tracking-widest mt-1">XP</div>
                  </div>
                   <div>
                      <div className="text-xl font-bold text-[#4ADE80]">{rank}</div>
                      <div className="text-xs text-gray-500 uppercase font-mono tracking-widest mt-1">Rank</div>
                  </div>
               </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-auto">
                {focusAreas.slice(0, 6).map((skill, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"></div>
                        <span className="text-gray-300 text-sm font-medium">{skill}</span>
                    </div>
                ))}
            </div>

            {/* Footer Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-end border-t border-white/10 pt-6">
                    <div>
                         <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Scan to Join</div>
                         <div className="text-xl font-bold text-white tracking-widest">NeuroPrep <span className="text-gray-500">AI</span></div>
                    </div>
                    
                    <div className="p-2 bg-white rounded-xl">
                        <QrCode className="w-12 h-12 text-black" />
                    </div>
                </div>
            </div>

         </div>

         {/* Shine Effect */}
         <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:animate-shine pointer-events-none" />
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0077b5] hover:bg-[#006396] text-white rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Share2 className="w-4 h-4" />
          Share on LinkedIn
        </button>
      </div>
    </div>
  );
};
