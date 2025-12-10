import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Brain, Target, Shield, Code, Zap } from 'lucide-react';

interface InterviewSetupProps {
  onStart: (config: any) => void;
}

export default function InterviewSetup({ onStart }: InterviewSetupProps) {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    topic: '',
    role: '',
    difficulty: 5,
    persona: '1950s Radio Host'
  });

  const topics = [
    'Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer', 'DevOps Engineer',
    'SRE', 'Security Engineer', 'Mobile Engineer', 'QA Engineer', 'Data Engineer', 'Machine Learning Engineer',
    'Civil Engineer', 'Electrical Engineer', 'Mechanical Engineer', 'Chemical Engineer', 'Aerospace Engineer',
    'Biomedical Engineer', 'Industrial Engineer', 'Environmental Engineer', 'Petroleum Engineer', 'Nuclear Engineer',
    'Materials Engineer'
  ];

  const roles = [
    'Student', 'Intern', 'Junior Engineer', 'Senior Engineer', 
    'Lead Engineer', 'Engineering Manager', 'Researcher', 'Architect'
  ];

  const personas = [
    { id: '1950s Radio Host', label: '1950s RADIO HOST', desc: 'Vintage Transatlantic accent. Charismatic, energetic, and old-school.' },
    { id: 'Professional', label: 'PROFESSIONAL', desc: 'Standard corporate interviewer. Polite but rigorous.' },
    { id: 'Friendly', label: 'COLLABORATIVE', desc: 'Helpful and encouraging. Good for practice.' },
    { id: 'Strict', label: 'RUTHLESS', desc: 'High pressure. No hints. Simulates worst-case scenarios.' },
    { id: 'Socratic', label: 'SOCRATIC', desc: 'Asks probing questions to test deep understanding.' }
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onStart(config);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 font-mono relative overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full bg-[#0a0a0a] border border-white/10 p-8 sm:p-12 relative z-10 shadow-2xl"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-white/10 w-full">
          <motion.div 
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
            <span className="text-xs text-gray-500 tracking-widest uppercase">
              CONFIGURATION_PHASE {step + 1}/4
            </span>
          </div>
          
          <h2 className="text-3xl font-bold uppercase mb-2 text-white">
            {step === 0 && 'SELECT_ENGINEERING_FIELD'}
            {step === 1 && 'TARGET_ROLE'}
            {step === 2 && 'INTERVIEWER_MODE'}
            {step === 3 && 'DIFFICULTY_LEVEL'}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {step === 0 && 'Choose the engineering discipline for this simulation.'}
            {step === 1 && 'Specify the position or level you are targeting.'}
            {step === 2 && 'Configure the AI personality and interaction style.'}
            {step === 3 && 'Set the complexity threshold for generated problems.'}
          </p>
        </div>

        {/* Step 0: Topic (Field) */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => { setConfig({ ...config, topic: t }); handleNext(); }}
                  className={`p-4 border text-left transition-all group hover:bg-white hover:text-black ${
                    config.topic === t ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-300'
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider mb-2">FIELD</div>
                  <div className="text-sm font-bold">{t}</div>
                </button>
              ))}
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="OR ENTER CUSTOM FIELD..." 
                className="w-full bg-transparent border border-white/10 p-4 text-white placeholder-gray-600 focus:outline-none focus:border-white font-mono text-sm uppercase"
                value={config.topic}
                onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && config.topic && handleNext()}
              />
              <button 
                onClick={handleNext}
                disabled={!config.topic}
                className="absolute right-2 top-2 px-4 py-2 bg-white text-black text-xs font-bold uppercase disabled:opacity-50"
              >
                CONFIRM
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Role */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => { setConfig({ ...config, role: r }); handleNext(); }}
                  className={`p-4 border text-left transition-all group hover:bg-white hover:text-black ${
                    config.role === r ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-300'
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider mb-2">ROLE</div>
                  <div className="text-sm font-bold">{r}</div>
                </button>
              ))}
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="OR ENTER CUSTOM ROLE..." 
                className="w-full bg-transparent border border-white/10 p-4 text-white placeholder-gray-600 focus:outline-none focus:border-white font-mono text-sm uppercase"
                value={config.role}
                onChange={(e) => setConfig({ ...config, role: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && config.role && handleNext()}
              />
              <button 
                onClick={handleNext}
                disabled={!config.role}
                className="absolute right-2 top-2 px-4 py-2 bg-white text-black text-xs font-bold uppercase disabled:opacity-50"
              >
                CONFIRM
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Persona */}
        {step === 2 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => { setConfig({ ...config, persona: p.id }); handleNext(); }}
                className={`p-6 border text-left transition-all group hover:bg-white hover:text-black ${
                  config.persona === p.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-300'
                }`}
              >
                <div className="text-sm font-bold uppercase mb-2">{p.label}</div>
                <div className="text-xs opacity-70 leading-relaxed">{p.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Difficulty */}
        {step === 3 && (
          <div className="space-y-12">
            <div className="relative pt-12 pb-4">
              <input
                type="range"
                min="1"
                max="10"
                value={config.difficulty}
                onChange={(e) => setConfig({ ...config, difficulty: parseInt(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black"
              />
              <div className="flex justify-between mt-4 text-xs font-bold uppercase text-gray-500">
                <span>ENTRY_LEVEL [1]</span>
                <span>SENIOR [5]</span>
                <span>PRINCIPAL [10]</span>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl font-bold text-white">
                LVL_{config.difficulty}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-3"
            >
              <Zap className="w-5 h-5" />
              INITIATE_SIMULATION
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

