'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Send, Zap, X, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AINavigator() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/navigate`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ message: userMsg })
        });
        const data = await res.json();
        
        setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
        
        if (data.action?.type === 'navigate') {
            setMessages(prev => [...prev, { role: 'ai', text: `✨ Transporting to ${data.action.path}...` }]);
            setTimeout(() => {
                router.push(data.action.path);
                // Optional: Close navigator on successful nav
                // setIsOpen(false); 
            }, 1500);
        }
    } catch (e) {
        setMessages(prev => [...prev, { role: 'ai', text: "Navigation systems offline. Please try again." }]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] transition-all z-50 border border-white/20 group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
         {isOpen ? <X className="text-white w-6 h-6" /> : <Sparkles className="text-white w-6 h-6 animate-pulse" />}
         
         {/* Tooltip */}
         {!isOpen && (
            <span className="absolute right-full mr-4 bg-black/80 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                Ask AI Navigator
            </span>
         )}
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
            <motion.div 
               initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
               animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
               exit={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
               className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden font-sans"
            >
               {/* Header */}
               <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-bold text-white text-sm tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        NEURO_NAVIGATOR
                      </span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">ONLINE</div>
               </div>
               
               {/* Messages */}
               <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
                  {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                              <MapPin className="w-8 h-8 text-purple-400" />
                          </div>
                          <div className="text-gray-400 text-sm">
                              <p className="font-bold text-white mb-1">Where would you like to go?</p>
                              "Take me to the practice arena"<br/>
                              "How do I create an account?"<br/>
                              "Show me my stats"
                          </div>
                      </div>
                  )}
                  {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                              m.role === 'user' 
                                ? 'bg-purple-600 text-white rounded-br-none' 
                                : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
                          }`}>
                             {m.text}
                          </div>
                      </div>
                  ))}
                  {loading && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 ml-2">
                          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100" />
                          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200" />
                      </div>
                  )}
                  <div ref={messagesEndRef} />
               </div>
               
               {/* Input */}
               <div className="p-4 bg-white/5 border-t border-white/10">
                  <div className="relative flex items-center bg-black/50 rounded-xl border border-white/10 focus-within:border-purple-500/50 transition-colors">
                      <input 
                        className="flex-1 bg-transparent border-none outline-none text-white text-sm px-4 py-3 placeholder:text-gray-600"
                        placeholder="Type command..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        autoFocus
                      />
                      <button 
                        onClick={handleSend} 
                        disabled={loading}
                        className="p-2 mr-1 hover:bg-white/10 rounded-lg transition-colors text-purple-400 disabled:opacity-50"
                      >
                         <Send className="w-4 h-4" />
                      </button>
                  </div>
               </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
