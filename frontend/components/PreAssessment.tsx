import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Brain, Target, Shield } from 'lucide-react';

interface PreAssessmentProps {
  onComplete: (results: any) => void;
}

export default function PreAssessment({ onComplete }: PreAssessmentProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const questions = [
    {
      id: 'technical',
      title: 'TECHNICAL_PROFICIENCY',
      question: 'Rate your confidence in core algorithms and data structures.',
      options: [
        { label: 'NOVICE [0-20%]', value: 20 },
        { label: 'INTERMEDIATE [21-60%]', value: 60 },
        { label: 'ADVANCED [61-80%]', value: 80 },
        { label: 'EXPERT [81-100%]', value: 95 }
      ]
    },
    {
      id: 'communication',
      title: 'COMMUNICATION_PROTOCOL',
      question: 'How effectively can you articulate complex technical concepts?',
      options: [
        { label: 'STRUGGLING', value: 30 },
        { label: 'AVERAGE', value: 60 },
        { label: 'CLEAR & CONCISE', value: 85 },
        { label: 'PERSUASIVE', value: 95 }
      ]
    },
    {
      id: 'stress',
      title: 'STRESS_RESILIENCE',
      question: 'How do you handle high-pressure interview scenarios?',
      options: [
        { label: 'PANIC PRONE', value: 40 },
        { label: 'SOME ANXIETY', value: 65 },
        { label: 'COMPOSED', value: 85 },
        { label: 'THRIVING', value: 95 }
      ]
    }
  ];

  const handleAnswer = (value: number) => {
    const currentQ = questions[step];
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate baseline metrics
      const results = {
        technical: newAnswers.technical || 50,
        problemSolving: (newAnswers.technical || 50) - 5,
        communication: newAnswers.communication || 50,
        stressManagement: newAnswers.stress || 50,
        domainKnowledge: (newAnswers.technical || 50) + 5,
        creativity: 60 // Baseline
      };
      
      // Save to local storage
      localStorage.setItem('assessmentCompleted', 'true');
      localStorage.setItem('assessmentResults', JSON.stringify(results));
      
      onComplete(results);
    }
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
        className="max-w-2xl w-full bg-[#0a0a0a] border border-white/10 p-8 sm:p-12 relative z-10 shadow-2xl"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-white/10 w-full">
          <motion.div 
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
            <span className="text-xs text-gray-500 tracking-widest uppercase">
              CALIBRATION_SEQUENCE {step + 1}/{questions.length}
            </span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold uppercase mb-2 text-white">
            {questions[step].title}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            {questions[step].question}
          </p>
        </div>

        <div className="space-y-3">
          {questions[step].options.map((option, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleAnswer(option.value)}
              className="w-full p-4 border border-white/10 bg-white/5 hover:bg-white hover:text-black text-left transition-all group flex items-center justify-between"
            >
              <span className="text-sm font-bold uppercase tracking-wider">{option.label}</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </motion.button>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex justify-between text-[10px] text-gray-600 uppercase tracking-widest">
          <span>NEUROPREP_AI // V.2.0.4</span>
          <span>SECURE_CONNECTION</span>
        </div>
      </motion.div>
    </div>
  );
}
