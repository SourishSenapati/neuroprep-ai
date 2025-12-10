import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Target, Zap } from 'lucide-react';

export default function ValueProposition({ onContinue }: { onContinue: () => void }) {
  const benefits = [
    {
      icon: Users,
      title: "ANY ROLE",
      desc: "From Frontend Dev to Systems Architect. We adapt to your target position."
    },
    {
      icon: BookOpen,
      title: "ANY SUBJECT",
      desc: "Data Structures, System Design, VLSI, Thermodynamics - we cover it all."
    },
    {
      icon: Target,
      title: "ANY FIELD",
      desc: "CS, Electrical, Mechanical, Civil. Tailored questions for your discipline."
    },
    {
      icon: Zap,
      title: "INSTANT FEEDBACK",
      desc: "Real-time analysis of your answers with actionable improvement tips."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-mono selection:bg-white selection:text-black flex flex-col">
       {/* Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 flex-grow flex flex-col justify-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto w-full"
        >
            <h1 className="text-3xl sm:text-5xl font-bold mb-8 tracking-tighter uppercase text-center">
                Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Excellence</span>
            </h1>
            
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto text-lg">
                &gt; UNIVERSAL ENGINEERING SUPPORT PROTOCOL INITIATED.<br/>
                &gt; OPTIMIZED FOR ALL DISCIPLINES AND ROLES.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {benefits.map((b, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.3 }}
                        className="border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors group"
                    >
                        <b.icon className="w-8 h-8 mb-4 text-gray-400 group-hover:text-white transition-colors" />
                        <h3 className="text-xl font-bold uppercase mb-2">{b.title}</h3>
                        <p className="text-sm text-gray-500">{b.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center">
                <motion.button
                    onClick={onContinue}
                    className="group relative px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="flex items-center gap-2">
                        Start Free Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                </motion.button>
            </div>
             <div className="text-center mt-4 text-xs text-gray-500">
                [ 5 FREE TRIES INCLUDED ]
            </div>
        </motion.div>
      </div>
    </div>
  );
}
