'use client';

import { motion } from 'framer-motion';
import { Send, Mic, Code, Brain } from 'lucide-react';
import { useState } from 'react';

export default function AppleInterview({ 
  mode, 
  onComplete 
}: { 
  mode: string;
  onComplete: (data: any) => void;
}) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Welcome to your interview session. Let\'s start with a warm-up question: Can you explain the difference between supervised and unsupervised learning?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: 'ai',
        content: 'Great explanation! Let\'s dive deeper. Can you provide a real-world example of when you would choose one over the other?'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4 sm:p-6 backdrop-blur-xl bg-black/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Interview Session</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Mode: {mode}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm text-green-400">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] sm:max-w-[75%] ${
                msg.role === 'user'
                  ? 'bg-blue-500/20 border-blue-500/30'
                  : 'bg-white/5 border-white/10'
              } backdrop-blur-xl border rounded-3xl p-4 sm:p-6`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" strokeWidth={1.5} />
                    <span className="text-xs sm:text-sm text-gray-400">AI Interviewer</span>
                  </div>
                )}
                <p className="text-sm sm:text-base text-gray-100 leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4 sm:p-6 backdrop-blur-xl bg-black/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 sm:gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your response..."
                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
            <motion.button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-white/5 disabled:text-gray-600 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm text-gray-500">
            <button className="flex items-center gap-2 hover:text-gray-400 transition-colors">
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">Voice</span>
            </button>
            <button className="flex items-center gap-2 hover:text-gray-400 transition-colors">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Code</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
