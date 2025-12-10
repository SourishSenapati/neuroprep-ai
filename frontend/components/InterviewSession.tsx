import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Send, Code, X, Play, Square, SkipForward, CheckCircle, Activity } from 'lucide-react';
import CodeEditor from './CodeEditor';
import RegistrationModal from './RegistrationModal';

interface InterviewSessionProps {
  onEndSession: () => void;
  initialConfig: any;
}

export default function InterviewSession({ onEndSession, initialConfig }: InterviewSessionProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [code, setCode] = useState('// Write your solution here\n');
  const [isMuted, setIsMuted] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [biometrics, setBiometrics] = useState({
    stressLevel: 5,
    heartRate: 75,
    emotion: 'neutral',
    gazeVariance: 0.3,
    voiceTremor: 0.2
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis;
      
      // Generate session ID
      setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      
      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          handleSendMessage(transcript);
        };

        recognitionRef.current.onend = () => setIsListening(false);
      }
      
      // NeuroPrep AI greeting
      const initialGreeting = `Hello! I'm NeuroPrep AI, your elite technical interviewer. I'll be conducting a comprehensive assessment for the ${initialConfig.role} position. I analyze responses in real-time and adapt questions based on your performance. Let's begin this technical evaluation.`;
      
      // Add initial message only if empty
      if (messages.length === 0) {
          setMessages([{ role: 'assistant', content: initialGreeting }]);
          speakText(initialGreeting);
          
          // Start biometric monitoring
          startBiometricMonitoring();
          
          // Fetch first question after greeting
          setTimeout(() => fetchQuestion(initialGreeting), 3000);
      }
      
      // Load session count
      const count = parseInt(localStorage.getItem('interviewSessionCount') || '0');
      setSessionCount(count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Biometric monitoring simulation
  const startBiometricMonitoring = () => {
    const interval = setInterval(() => {
      setBiometrics(prev => ({
        stressLevel: Math.max(1, Math.min(10, prev.stressLevel + (Math.random() - 0.5) * 2)),
        heartRate: Math.max(60, Math.min(120, prev.heartRate + (Math.random() - 0.5) * 10)),
        emotion: ['calm', 'focused', 'stressed', 'confident', 'nervous'][Math.floor(Math.random() * 5)],
        gazeVariance: Math.max(0, Math.min(1, prev.gazeVariance + (Math.random() - 0.5) * 0.2)),
        voiceTremor: Math.max(0, Math.min(1, prev.voiceTremor + (Math.random() - 0.5) * 0.1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = (text: string) => {
    if (isMuted || !synthesisRef.current) return;

    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthesisRef.current.getVoices();
    
    // Improved voice selection logic
    const preferredVoice = voices.find(voice => 
        voice.name.includes('Google US English') || 
        voice.name.includes('Google UK English Male') ||
        voice.name.includes('Microsoft David') || 
        voice.name.includes('Daniel')
    );

    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    // Dynamic pitch/rate based on persona (simple heuristic)
    if (initialConfig.persona === 'Strict') {
        utterance.rate = 1.0;
        utterance.pitch = 0.8;
    } else if (initialConfig.persona === 'Friendly') {
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
    } else {
        utterance.rate = 0.95;
        utterance.pitch = 0.9;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthesisRef.current.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const fetchQuestion = async (context: string) => {
    try {
      // The new system automatically handles question uniqueness and repetition
      // No need to send previous questions as the backend tracks them
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            messages: [{ role: 'user', content: context }],
            role: initialConfig.role, 
            difficulty: initialConfig.difficulty,
            persona: initialConfig.persona,
            sessionId: sessionId || `session_${Date.now()}`
        }),
      });
      
      // Check if response indicates attempt limit exceeded
      if (response.status === 403) {
        const errorData = await response.json();
        if (errorData.requiresAuth) {
          // Redirect to auth page
          onEndSession();
          return;
        }
      }
      
      if (!response.body) return;
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';
      
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                aiResponse += parsed.content;
                
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  const others = prev.slice(0, -1);
                  return [...others, { ...last, content: aiResponse }];
                });
              }
            } catch (e) {
              // Ignore parse errors for partial chunks
            }
          }
        }
      }
      
      speakText(aiResponse);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInputText('');

    try {
        // Stream response
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                messages: newMessages, 
                role: initialConfig.role,
                difficulty: initialConfig.difficulty,
                persona: initialConfig.persona,
                topic: initialConfig.topic,
                sessionId: sessionId,
                biometrics: biometrics
            }),
        });
        
        // Check if response indicates attempt limit exceeded
        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.requiresAuth) {
            // Show registration modal and end session
            setShowRegistration(true);
            setTimeout(() => onEndSession(), 2000);
            return;
          }
        }

        if (!response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponse = '';
        
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') break;
                    
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.content) {
                            aiResponse += parsed.content;
                            
                            setMessages(prev => {
                                const last = prev[prev.length - 1];
                                const others = prev.slice(0, -1);
                                return [...others, { ...last, content: aiResponse }];
                            });
                        }
                    } catch (e) {
                        // Ignore parse errors for partial chunks
                    }
                }
            }
        }
        
        speakText(aiResponse);
        
        // Check if session should trigger registration (every session)
        setShowRegistration(true);
        
        // Increment session count in local storage
        const newCount = sessionCount + 1;
        localStorage.setItem('interviewSessionCount', newCount.toString());
        setSessionCount(newCount);

    } catch (error) {
        console.error('Error sending message:', error);
    }
  };

  const handleEndInterview = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsInterviewEnded(true);
    
    // Increment session count
    const currentCount = parseInt(localStorage.getItem('interviewSessionCount') || '0');
    const newCount = currentCount + 1;
    localStorage.setItem('interviewSessionCount', newCount.toString());
    setSessionCount(newCount);
  };

  const handleNextQuestion = async () => {
      // Logic to skip current question and get a new one
      // For now, we can just trigger a fetch with a "skip" context
      if (synthesisRef.current) synthesisRef.current.cancel();
      const skipPrompt = "Let's move to the next question.";
      await handleSendMessage(skipPrompt); 
  };

  // Mock score calculation
  const calculateScore = () => {
      return Math.floor(Math.random() * (95 - 70) + 70); // Random score between 70 and 95
  };

  if (isInterviewEnded) {
      const score = calculateScore();
      return (
          <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 font-mono">
              <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-2xl w-full bg-[#0a0a0a] border border-white/10 p-8 sm:p-12 relative shadow-2xl"
              >
                  <div className="text-center mb-12">
                      <div className="w-16 h-16 bg-white text-black flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-8 h-8" />
                      </div>
                      <h2 className="text-3xl font-bold uppercase mb-2">SESSION_TERMINATED</h2>
                      <p className="text-gray-500 text-sm">ANALYSIS_COMPLETE // DATA_ARCHIVED</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                      <div className="bg-white/5 border border-white/10 p-6 text-center">
                          <div className="text-xs text-gray-500 uppercase mb-2">SESSION_SCORE</div>
                          <div className="text-4xl font-bold text-white">{score}/100</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-6 text-center">
                          <div className="text-xs text-gray-500 uppercase mb-2">PERFORMANCE</div>
                          <div className="text-4xl font-bold text-green-500">HIGH</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-6 text-center">
                          <div className="text-xs text-gray-500 uppercase mb-2">NEXT_LEVEL</div>
                          <div className="text-4xl font-bold text-blue-500">UNLOCKED</div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="p-4 border border-white/10 bg-white/5">
                          <h3 className="text-sm font-bold uppercase mb-2 flex items-center gap-2">
                              <Activity className="w-4 h-4" /> NEUROPREP_ANALYSIS
                          </h3>
                          <p className="text-xs text-gray-400 leading-relaxed">
                              NeuroPrep AI Assessment: Strong technical foundation with excellent problem-solving approach. 
                              Biometric analysis shows optimal stress management. 
                              Recommendation: Ready for senior-level technical challenges.
                          </p>
                      </div>
                  </div>

                  <div className="mt-12 flex gap-4">
                      <button 
                          onClick={onEndSession}
                          className="flex-1 py-4 bg-white text-black font-bold uppercase hover:bg-gray-200 transition-colors"
                      >
                          RETURN_TO_BASE
                      </button>
                  </div>
                  
                  {/* Registration Modal Trigger */}
                  <RegistrationModal 
                      isOpen={true} // Always show after session
                      onClose={() => {}} // No-op, handled by modal internal logic or return to base
                      forced={sessionCount >= 5}
                  />
              </motion.div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white font-mono relative overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Header */}
      <header className="flex-none p-4 border-b border-white/10 bg-[#0a0a0a] z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest">NEUROPREP_AI // {initialConfig.topic.toUpperCase()}</span>
          <div className="ml-4 flex items-center gap-2 text-xs">
            <span className="text-gray-400">STRESS:</span>
            <span className={`font-mono ${
              biometrics.stressLevel <= 3 ? 'text-green-400' :
              biometrics.stressLevel <= 6 ? 'text-yellow-400' : 'text-red-400'
            }`}>{biometrics.stressLevel.toFixed(1)}/10</span>
            <span className="text-gray-400 ml-2">HR:</span>
            <span className="text-blue-400 font-mono">{biometrics.heartRate}</span>
            <span className="text-gray-400 ml-2">STATE:</span>
            <span className="text-purple-400 font-mono uppercase">{biometrics.emotion}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
              onClick={handleNextQuestion}
              className="px-4 py-2 border border-white/10 text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors flex items-center gap-2"
          >
              NEXT_QUERY <SkipForward className="w-3 h-3" />
          </button>
          <button 
              onClick={handleEndInterview}
              className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase hover:bg-red-700 transition-colors flex items-center gap-2"
          >
              TERMINATE <Square className="w-3 h-3 fill-current" />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative z-10 scroll-smooth">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 border ${
              msg.role === 'user' 
                ? 'bg-white text-black border-white' 
                : 'bg-[#0a0a0a] text-white border-white/10'
            }`}>
              <div className="text-[10px] font-bold uppercase mb-2 opacity-50">
                  {msg.role === 'user' ? 'CANDIDATE' : 'NEUROPREP_AI'}
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
            </div>
          </motion.div>
        ))}
        {isSpeaking && (
           <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
           >
              <div className="flex gap-1 items-end h-4">
                  {[1,2,3].map(i => (
                      <motion.div
                          key={i}
                          animate={{ height: [4, 16, 4] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                          className="w-1 bg-white"
                      />
                  ))}
              </div>
           </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Code Editor Overlay */}
      <AnimatePresence>
        {showCodeEditor && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="absolute inset-0 bg-[#0a0a0a] z-20 flex flex-col p-4"
          >
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
              <h3 className="font-mono text-sm uppercase text-white">&gt;&gt; CODE_ENVIRONMENT</h3>
              <button onClick={() => setShowCodeEditor(false)} className="p-2 hover:bg-white/10 text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 border border-white/10">
              <CodeEditor code={code} onChange={setCode} language="javascript" />
            </div>
            <div className="mt-4 flex justify-end">
               <button 
                  onClick={() => {
                      handleSendMessage(`Here is my code solution:\n\`\`\`javascript\n${code}\n\`\`\``);
                      setShowCodeEditor(false);
                  }}
                  className="px-6 py-3 bg-white text-black font-bold uppercase text-sm hover:bg-gray-200"
               >
                  SUBMIT_SOLUTION
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex-none p-4 border-t border-white/10 bg-[#0a0a0a] z-10">
          <div className="max-w-4xl mx-auto flex gap-4">
              <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-3 border border-white/10 text-gray-400 hover:text-white hover:border-white transition-colors"
              >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              <button
                  onClick={() => setShowCodeEditor(true)}
                  className="p-3 border border-white/10 text-gray-400 hover:text-white hover:border-white transition-colors"
              >
                  <Code className="w-5 h-5" />
              </button>

              <div className="flex-1 relative">
                  <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                      placeholder="ENTER_RESPONSE..."
                      className="w-full bg-transparent border border-white/10 p-3 text-white placeholder-gray-600 focus:outline-none focus:border-white font-mono text-sm"
                  />
              </div>

              <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-3 border transition-colors ${
                      isListening 
                          ? 'bg-red-600 border-red-600 text-white animate-pulse' 
                          : 'border-white/10 text-gray-400 hover:text-white hover:border-white'
                  }`}
              >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                  onClick={() => handleSendMessage(inputText)}
                  disabled={!inputText.trim()}
                  className="p-3 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                  <Send className="w-5 h-5" />
              </button>
          </div>
      </div>

      {/* Registration Modal (Toast) */}
      <RegistrationModal 
          isOpen={showRegistration} 
          onClose={() => setShowRegistration(false)} 
          forced={sessionCount >= 5}
      />
    </div>
  );
}
