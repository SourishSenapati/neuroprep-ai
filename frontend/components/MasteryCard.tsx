import { motion } from 'framer-motion';
import { ArrowRight, Trophy } from 'lucide-react';

interface MasteryCardProps {
  title: string;
  slug: string;
  description: string;
  companyTags: string[];
  difficulty: string;
  salaryRange: string;
  icon: string;
  skills: string[];
}

export default function MasteryCard({
  title,
  slug,
  description,
  companyTags,
  difficulty,
  salaryRange,
  icon,
  skills
}: MasteryCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-[#4ADE80] transition-colors group relative overflow-hidden h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <span className="text-6xl">{icon}</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
            <span className="text-4xl mb-2 block">{icon}</span>
            <span className={`px-2 py-1 rounded text-xs font-mono border ${
                difficulty === 'Beginner' ? 'border-blue-500 text-blue-400' :
                difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-400' :
                'border-red-500 text-red-400'
            }`}>
                {difficulty}
            </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#4ADE80] transition-colors">{title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
      </div>

      <div className="space-y-4 mb-6 flex-grow">
        <div>
           <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Target Companies</p>
           <div className="flex flex-wrap gap-2">
             {companyTags.slice(0, 3).map((tag, i) => (
               <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded text-gray-300 border border-white/5">
                 {tag}
               </span>
             ))}
             {companyTags.length > 3 && <span className="text-xs text-gray-500 px-1">+{companyTags.length - 3}</span>}
           </div>
        </div>
        
        <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Key Skills</p>
            <div className="flex flex-wrap gap-1">
                {skills.slice(0, 4).map((skill, i) => (
                <span key={i} className="text-[10px] text-[#4ADE80]/80 bg-[#4ADE80]/5 px-1.5 py-0.5 rounded">
                    {skill}
                </span>
                ))}
            </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
        <div>
            <p className="text-xs text-gray-500">Avg. Salary</p>
            <p className="font-mono text-[#F0F0F0]">{salaryRange}</p>
        </div>
        <button aria-label="View Details" className="p-2 rounded-full bg-[#4ADE80]/10 text-[#4ADE80] group-hover:bg-[#4ADE80] group-hover:text-black transition-all">
            <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
