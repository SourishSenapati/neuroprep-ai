'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const questions = [
  {
    id: 1,
    question: "How comfortable are you with technical interviews?",
    options: ["Very uncomfortable", "Somewhat uncomfortable", "Neutral", "Comfortable", "Very comfortable"]
  },
  {
    id: 2,
    question: "How do you typically handle stress during interviews?",
    options: ["I get very anxious", "I feel some pressure", "I stay mostly calm", "I perform well under pressure", "I thrive under pressure"]
  },
  {
    id: 3,
    question: "Rate your problem-solving confidence",
    options: ["Not confident", "Slightly confident", "Moderately confident", "Confident", "Very confident"]
  },
  {
    id: 4,
    question: "How would you rate your communication skills?",
    options: ["Need improvement", "Below average", "Average", "Good", "Excellent"]
  },
  {
    id: 5,
    question: "How familiar are you with your technical domain?",
    options: ["Beginner", "Some knowledge", "Intermediate", "Advanced", "Expert"]
  }
];

export default function AppleAssessment({ onComplete }: { onComplete: (results: any) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers, selectedOption];
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Calculate scores based on answers
        const avgScore = newAnswers.reduce((a, b) => a + b, 0) / newAnswers.length;
        const results = {
          technical: 50 + avgScore * 10,
          problemSolving: 45 + avgScore * 11,
          communication: 40 + avgScore * 12,
          stressManagement: 60 + avgScore * 8,
          domainKnowledge: 55 + avgScore * 9,
          creativity: 50 + avgScore * 10
        };
        onComplete(results);
      }
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 sm:p-6 font-mono relative overflow-hidden">
       {/* Grid Background */}
       <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex justify-between text-xs text-gray-400 mb-3 uppercase tracking-wider">
            <span>Question {currentQuestion + 1} / {questions.length}</span>
            <span>{Math.round(progress)}% COMPLETE</span>
          </div>
          <div className="h-1 bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-8 sm:mb-12 uppercase tracking-tight">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`w-full text-left p-4 sm:p-6 border transition-all group ${
                  selectedOption === index
                    ? 'bg-white text-black border-white'
                    : 'bg-black/50 border-white/20 text-gray-400 hover:border-white/50 hover:text-white'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold uppercase tracking-wider">{option}</span>
                  {selectedOption === index && (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Next Button */}
        <motion.button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="w-full px-8 py-4 sm:py-5 bg-white text-black text-sm font-bold uppercase tracking-widest disabled:bg-white/10 disabled:text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          whileHover={{ scale: selectedOption !== null ? 1.02 : 1 }}
          whileTap={{ scale: selectedOption !== null ? 0.98 : 1 }}
        >
          {currentQuestion < questions.length - 1 ? 'Next Sequence' : 'Finalize Analysis'}
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <p className="text-center text-xs text-gray-500 mt-6 font-mono uppercase tracking-widest">
          &gt; CALIBRATING NEURAL MODEL...
        </p>
      </div>
    </div>
  );
}

