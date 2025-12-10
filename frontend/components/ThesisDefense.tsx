'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle, Trophy } from 'lucide-react';

interface ThesisDefenseProps {
  topic: string;
  duration: number; // minutes
  onComplete: (score: number) => void;
}

export default function ThesisDefense({ topic, duration, onComplete }: ThesisDefenseProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'questions' | 'defense' | 'complete'>('intro');
  const [questions, setQuestions] = useState<Array<{ question: string; answered: boolean }>>([
    { question: 'Explain the theoretical foundation of your quantum error correction approach', answered: false },
    { question: 'How does your method compare to surface codes in terms of threshold?', answered: false },
    { question: 'Defend your choice of stabilizer measurements', answered: false },
    { question: 'What are the experimental challenges in implementing your scheme?', answered: false }
  ]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (currentPhase === 'intro') {
      const timer = setTimeout(() => setCurrentPhase('questions'), 3000);
      return () => clearTimeout(timer);
    }

    if (currentPhase === 'questions' || currentPhase === 'defense') {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setCurrentPhase('complete');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentPhase]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerQuestion = (index: number) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, answered: true } : q));
    setScore(prev => prev + 25);
    
    if (questions.filter(q => !q.answered).length === 1) {
      setTimeout(() => setCurrentPhase('complete'), 2000);
    }
  };

  if (currentPhase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="text-center text-white"
        >
          <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
          <h1 className="text-5xl font-bold mb-4">PhD Thesis Defense</h1>
          <p className="text-2xl text-purple-200 mb-2">{topic}</p>
          <p className="text-xl text-purple-300">Duration: {duration} minutes</p>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="mt-8 text-lg text-yellow-400"
          >
            Preparing committee...
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  if (currentPhase === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          className="glass-morphism rounded-3xl p-12 text-center max-w-2xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <Trophy className="w-32 h-32 mx-auto mb-6 text-yellow-400" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">Defense Complete!</h2>
          <div className="text-6xl font-bold text-yellow-400 mb-6">{score}/100</div>
          <p className="text-xl text-purple-200 mb-8">
            {score >= 80 ? 'Outstanding defense! Committee recommends approval.' :
             score >= 60 ? 'Good defense. Minor revisions required.' :
             'Defense needs improvement. Major revisions required.'}
          </p>
          <button
            onClick={() => onComplete(score)}
            className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xl font-bold hover:shadow-2xl"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 z-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Timer Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-morphism rounded-2xl p-6 mb-8 flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">PhD Thesis Defense</h2>
            <p className="text-gray-600">{topic}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
              timeRemaining < 60 ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
            }`}>
              <Clock className="w-6 h-6" />
              <span className="text-2xl font-bold">{formatTime(timeRemaining)}</span>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
        </motion.div>

        {/* Questions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {questions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-morphism rounded-2xl p-6 ${
                  q.answered ? 'border-2 border-green-400' : 'border-2 border-purple-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-gray-800 flex-1">Question {i + 1}</h3>
                  {q.answered ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <p className="text-gray-700 mb-4">{q.question}</p>
                {!q.answered ? (
                  <button
                    onClick={() => handleAnswerQuestion(i)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg"
                  >
                    Answer Question
                  </button>
                ) : (
                  <div className="text-center text-green-600 font-medium">
                    ✓ Answered Successfully
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass-morphism rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Defense Progress</span>
            <span className="text-sm font-medium text-purple-600">
              {questions.filter(q => q.answered).length}/{questions.length} Questions
            </span>
          </div>
          <div className="w-full h-4 bg-purple-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
              initial={{ width: 0 }}
              animate={{ width: `${(questions.filter(q => q.answered).length / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
