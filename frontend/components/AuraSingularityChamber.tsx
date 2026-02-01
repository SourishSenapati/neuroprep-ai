'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
const Webcam = dynamic(() => import('react-webcam') as any, { ssr: false }) as any;
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, Brain, AlertTriangle, CheckCircle, XCircle, Scan, MessageSquare, Send, Sparkles, Volume2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';

import { multiAuraSync } from '../lib/multiAuraSync';
import ARProctorHUD from './ARProctorHUD';
import { useGameStore } from '../lib/store/gameStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-c7le0xxvj-sourish-sennapatis-projects.vercel.app';

export default function AuraSingularityChamber({ 
  role = 'Software Engineer',
  difficulty = 'Senior',
  persona = 'Professional'
}: { 
  role?: string;
  difficulty?: string;
  persona?: string;
  role = 'Software Engineer',
  difficulty = 'Senior',
  persona = 'Professional',
  mode = 'standard'
}: { 
  role?: string;
  difficulty?: string;
  persona?: string;
  mode?: string;
}) {
  const { gradeAnswer } = useGameStore();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  
  // Camera Selection State
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [showCameraMenu, setShowCameraMenu] = useState(false);

  useEffect(() => {
    const getDevices = async () => {
      try {
        // Trigger permission prompt if needed
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
        } catch(e) { 
            console.warn("Camera permission denied", e);
        }

        // Simple device enumeration - don't force selection unless user chooses
        if (!navigator?.mediaDevices?.enumerateDevices) return;
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setVideoDevices(cameras);
        
        // Filter out virtual cameras first if possible
        const realCameras = cameras.filter(c => {
            const l = c.label.toLowerCase();
            return !l.includes('virtual') && !l.includes('obs') && !l.includes('droidcam') && !l.includes('iriun'); 
        });
        
        const candidateCameras = realCameras.length > 0 ? realCameras : cameras;

        // STRICT: Prioritize Laptop/Integrated Camera, then any Webcam
        const priorityCam = candidateCameras.find(c => {
          const l = c.label.toLowerCase();
          return l.includes('integrated') || l.includes('facetime') || l.includes('front') || l.includes('built-in');
        });

        const webcam = candidateCameras.find(c => {
             const l = c.label.toLowerCase();
             return l.includes('webcam') || l.includes('camera') || l.includes('video');
        });
        
        if (priorityCam) {
           setSelectedDeviceId(priorityCam.deviceId);
        } else if (webcam) {
           setSelectedDeviceId(webcam.deviceId);
        } else if (candidateCameras.length > 0) {
           setSelectedDeviceId(candidateCameras[0].deviceId);
        }
      } catch (e) {
        console.error("Error enumerating devices:", e);
      }
    };
    getDevices();
  }, []);

  const [riftIntensity, setRiftIntensity] = useState(0);
  const [interviewerState, setInterviewerState] = useState<'idle' | 'speaking' | 'listening'>('idle');
  const [riftWarning, setRiftWarning] = useState<string | null>(null);
  const [aiThought, setAiThought] = useState<string>(`Initializing neural link for ${role}...`);
  
  // New State for Optional Bio-Analysis
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isBioAnalysisEnabled, setIsBioAnalysisEnabled] = useState<boolean | null>(false);
  
  // Ref to track bio-analysis state for socket listeners without stale closures
  const bioEnabledRef = useRef(isBioAnalysisEnabled);
  useEffect(() => { bioEnabledRef.current = isBioAnalysisEnabled; }, [isBioAnalysisEnabled]);
  
  // Configuration Modal State
  const [showConfigModal, setShowConfigModal] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  const handleManualStart = async () => {
      setShowConfigModal(false);
      setIsInitializing(true);
      if (!sessionId.current) {
         // Wait a moment if forge is still happening (rare race condition)
         await new Promise(resolve => setTimeout(resolve, 1000));
      }
      startSession();
  };

  // AR Proctor State
  const [isARMode, setIsARMode] = useState(false);
  const [arAnnotations, setArAnnotations] = useState<Array<{ x: number; y: number; type: 'circle' | 'arrow' | 'text'; content?: string }>>([]);

  // Chat State
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isStreaming || !sessionId.current) return;

    const userMsg = { role: 'user' as const, content: inputMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsStreaming(true);

    try {

      if (isOffline) {
        // Dynamic Offline Intelligence (Mock NLP)
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate "Thinking"

        // 1. Simulate Grammar/Understanding Correction (Simulated)
        let processedInput = inputMessage;
        let correctionNote = "";
        if (inputMessage.length > 5 && Math.random() < 0.3) {
           processedInput = inputMessage.charAt(0).toUpperCase() + inputMessage.slice(1); // naive fix
           correctionNote = "(Auto-Correcting syntax for clarity...) ";
        }

        // 2. Keyword Analysis & Contextual Response
        const lowerInput = processedInput.toLowerCase();
        let aiResponse = "";

        if (lowerInput.includes("don't know") || lowerInput.includes("not sure") || lowerInput.includes("no idea")) {
            aiResponse = "That is perfectly fine. Honesty is crucial. Let's try to derive the answer from first principles. What are the fundamental constraints here?";
        } else if (lowerInput.length < 20) {
            aiResponse = `I notice your answer is quite brief ("${processedInput}"). Could you elaborate more on your reasoning?`;
        } else if (lowerInput.includes("scale") || lowerInput.includes("traffic") || lowerInput.includes("load")) {
            aiResponse = "You mentioned scalability. How would you specifically handle database bottlenecks under high concurrent write loads in this architecture?";
        } else if (lowerInput.includes("database") || lowerInput.includes("sql") || lowerInput.includes("mongo")) {
            aiResponse = "Regarding the data layer, how would you ensure data consistency across multiple availability zones during a partition event?";
        } else if (lowerInput.includes("python") || lowerInput.includes("java") || lowerInput.includes("javascript")) {
            aiResponse = "In the context of that language, how would you manage memory effectively for a long-running background process?";
        } else if (lowerInput.includes("team") || lowerInput.includes("conflict")) {
            aiResponse = "Interpersonal dynamics are key. Can you give a specific example of a time you had to compromise on a technical decision for the greater good?";
        } else {
             const genericResponses = [
                `Interesting point about "${processedInput.substring(0, 15)}...". How does this approach impact the overall system latency?`,
                "I see. That's a valid approach. How would you modify this if latency was the primary constraint?",
                "Excellent point. Let's pivot slightly—how would you ensure data consistency in this distribuetd setup?",
                "Understood. Can you walk me through the trade-offs you considered when choosing this design pattern?",
                "How would you test this implementation to ensure it's robust against race conditions?"
            ];
            aiResponse = genericResponses[Math.floor(Math.random() * genericResponses.length)];
        }

        const finalResponse = correctionNote + aiResponse;

        setChatHistory(prev => [...prev, { role: 'ai', content: finalResponse }]);
        speakWithRadioEffect(finalResponse);
        return;
      }

      const res = await fetch(`${API_URL}/api/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatHistory, userMsg],
          sessionId: sessionId.current,
          role,
          difficulty,
          persona
        })
      });

      if (!res.ok) throw new Error(res.statusText);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';

      setChatHistory(prev => [...prev, { role: 'ai', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  aiContent += data.content;
                  setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].content = aiContent;
                    return newHistory;
                  });
                }
              } catch (e) {
                if (line.includes('[DONE]')) break;
              }
            }
          }
        }
      }

      
      // Speak response
      if (aiContent) {
        speakWithRadioEffect(aiContent);
      }

    } catch (e) {
      console.error('Chat error:', e);
    } finally {
      setIsStreaming(false);
    }
  };

  const socketRef = useRef<Socket | null>(null);
  const sessionId = useRef<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null); // State to trigger effects
  const userId = useRef<string>('user_' + Date.now());
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);


  // Defined early to be used in effects
  const speakWithRadioEffect = (text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Check if using Radio Persona
    const isRadio = persona === '1950s Radio Host';

    if (isRadio) {
      // 50s Radio Style Tuning
      utterance.rate = 1.15; 
      utterance.pitch = 0.9; 
    } else {
      // Standard Professional Tuning
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
    }

    // Attempt voice selection
    const voices = window.speechSynthesis.getVoices();
    const radioVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) || voices.find(v => v.lang === 'en-US');
    if (radioVoice) utterance.voice = radioVoice;

    // Audio Context for Static (Only if Radio Persona)
    let audioCtx: AudioContext | null = null;
    let noise: AudioBufferSourceNode | null = null;
    let gainNode: GainNode | null = null;

    if (isRadio) {
        try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
            const bufferSize = audioCtx.sampleRate * 2; 
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
            }

            noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;

            const bandpass = audioCtx.createBiquadFilter();
            bandpass.type = 'bandpass';
            bandpass.frequency.value = 1000;
            bandpass.Q.value = 1;

            gainNode = audioCtx.createGain();
            gainNode.gain.value = 0.015; // Subtle static

            noise.connect(bandpass);
            bandpass.connect(gainNode);
            gainNode.connect(audioCtx.destination);
        }
        } catch (e) {
        console.warn("AudioContext invalid", e);
        }
    }

    utterance.onstart = () => {
      if (noise && audioCtx) {
         try { noise.start(); } catch(e) {}
      }
      setInterviewerState('speaking');
    };

    const cleanup = () => {
      if (noise) {
        try { noise.stop(); } catch(e) {}
      }
      if (gainNode) gainNode.disconnect();
      if (audioCtx) {
         try { audioCtx.close(); } catch(e) {}
      }
      setInterviewerState('listening');
    };

    utterance.onend = cleanup;
    utterance.onerror = cleanup;

    window.speechSynthesis.speak(utterance);
  };

  const startSession = async () => {
    try {
      if (isOffline) {
        setAiThought("Low-Bandwidth Mode Active. Local Neural Core Engaged."); // Mobile-Ready messaging
        const mockQuestion = `Since we are operating in offline mode, let's proceed with a standard evaluation. Tell me about your experience with ${role} and a significant technical challenge you have overcome.`;
        setAiThought(mockQuestion);
        speakWithRadioEffect(mockQuestion);
        return;
      }

      setAiThought("Establishing Neural Handshake...");
      const res = await fetch(`${API_URL}/api/start-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userId.current,
          mode,
          role,
          difficulty,
          persona
        })
      });

      if (!res.ok) throw new Error('Session start failed');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullQuestion = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'chunk') {
                  fullQuestion += data.content;
                  setAiThought(fullQuestion);
                }
              } catch (e) {
                // Ignore parse errors for partial chunks
              }
            }
          }
        }
      }
      
      
      // Speak the question using helper
      speakWithRadioEffect(fullQuestion);

    } catch (e) {
      console.error("Start session failed", e);
      // CLOUD CORE FALLBACK
      setAiThought("Cloud Uplink Unstable. Switching to Local Neural Processor...");
      
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Use pseudo-random session ID for offline mode
        const offlineId = `local_${Date.now()}`;
        setActiveSessionId(offlineId);
        setIsOffline(true); // Enable Mock AI Logic
        setAiThought("Local Neural Processor Active. Privacy-First Mode Engaged.");
        
        // Connect Socket mock
        try {
          const newSocket = io(API_URL, {
              transports: ['websocket'],
              reconnectionAttempts: 0 // Don't try to reconnect if we are going offline
          });
          socketRef.current = newSocket;
        } catch (e) {
          console.warn("Socket init skipped in offline mode");
        }
        
      } catch (retryError) {
         setAiThought("Neural Core Initialization Failed.");
      }
    }
  };

  // Forge Link on Mount
  useEffect(() => {
    const forge = async () => {
      try {
        if (!userId.current) return;

        const res = await fetch(`${API_URL}/api/forge-link`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: userId.current, 
            mode, 
            role,
            difficulty,
            persona
          })
        });

        if (!res.ok) throw new Error(`Forge API failed: ${res.statusText}`);

        const data = await res.json();
        sessionId.current = data.sessionId;
        setActiveSessionId(data.sessionId);
        setAiThought(`Link Forged. Session ID: ${data.sessionId.substr(0, 8)}...`);
        
        // Ready for user initiation
        console.log("Link Forged. Waiting for user initiation.");
        setAiThought("Neural Link Established. Awaiting User Configuration.");
        
        // Connect Socket after forging
        try {
          socketRef.current = io(API_URL.replace('/api', ''), { // Remove /api if present for socket base
            path: '/nexus-sync',
            reconnectionAttempts: 3, 
            timeout: 5000 
          });
          
          socketRef.current.on('connect', () => {
            console.log('Connected to Nexus Sync');
            if (sessionId.current) {
              socketRef.current?.emit('join-chamber', sessionId.current);
            }
          });

          socketRef.current.on('connect_error', (err) => {
            console.warn("Nexus Socket Connection Error:", err);
          });
          
          // ... setup other listeners ...
          socketRef.current.on('rift-warning', (data: { message: string, intensity: number }) => {
            if (bioEnabledRef.current) {
              setRiftWarning(data.message);
              setRiftIntensity(data.intensity);
              setAiThought(`Rift Detected: ${data.message}`);
            }
          });

          socketRef.current.on('vad-silence', (data: { duration: number }) => {
            console.log(`Silence detected (${data.duration}ms)`);
          });

        } catch (socketError) {
          console.warn("Socket initialization failed (offline mode):", socketError);
        }

      } catch (e) {
        console.error("Forge failed", e);
        setAiThought("Neural Link Failed. Switching to Offline Mode.");
        setIsOffline(true);
        sessionId.current = "offline_session_" + Date.now();
        setActiveSessionId(sessionId.current);
        
        // Auto-start in offline mode
        setTimeout(() => startSession(), 1000);
      }
    };
    
    forge();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [role, difficulty, persona]); // IMPORTANT: Ensure deps are correct or use refs inside if specific behavior needed


  const [glitchActive, setGlitchActive] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Toggle Bio Mode Manually
  const toggleBioAnalysis = () => {
     const newState = !isBioAnalysisEnabled;
     setIsBioAnalysisEnabled(newState);
     setAiThought(newState ? "Bio-Analysis Modules Engaged." : "Bio-Analysis Modules Disengaged.");
  };

  // Glitch Logic
  useEffect(() => {
    if (riftIntensity > 0.8) {
      setGlitchActive(true);
      const timeout = setTimeout(() => setGlitchActive(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [riftIntensity]);

  const handleSimulatedLimit = () => {
    setShowUpgradeModal(true);
  };

  // ... existing state ...
  const [showReportModal, setShowReportModal] = useState(false);
  const [sessionReport, setSessionReport] = useState<any>(null);

  // Session Timer
  const [elapsedTime, setElapsedTime] = useState(0);
  useEffect(() => {
    if (!sessionId.current) return; // Only start when session exists
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSessionId]); // properly dep

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = async () => {
    try {
      setAiThought("Terminating Neural Link... Compiling Report...");
      
      if (isOffline) {
          // Offline Mock Report Generation
          await new Promise(resolve => setTimeout(resolve, 2000));
          const mockReport = {
              neuralResilience: Math.floor(Math.random() * 20) + 80, // 80-99
              scores: {
                  technicalScore: Math.floor(Math.random() * 30) + 70,
                  eqScore: Math.floor(Math.random() * 20) + 80,
                  authenticityScore: 95
              },
              insights: {
                  strengths: ["Clear Communication", "Good Technical Foundation", "Honesty"],
                  weaknesses: ["Could elaborate more on scalability", "Consider edge cases"],
                  improvementPlan: [
                       "Practice System Design depth",
                       "Review CAP Theorem applications", 
                       "Work on structured answers (STAR method)"
                  ]
              }
          };
          setSessionReport(mockReport);
          setShowReportModal(true);
          setAiThought("Session Terminated. Offline Report Generated.");
          return;
      }

      if (!sessionId.current) return;

      // CALL FEEDBACK API with history
      const res = await fetch(`${API_URL}/api/interview/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            history: chatHistory.map(m => ({ role: m.role, content: m.content })),
            role 
        })
      });
      const feedback = await res.json();
      
      // Map feedback to report format
      const data = {
          neuralResilience: Math.round(((feedback.technical_score || 0) + (feedback.communication_score || 0) + (feedback.system_design_score || 0)) / 3) || 85,
          scores: {
              technicalScore: feedback.technical_score || 75,
              eqScore: feedback.communication_score || 80,
              authenticityScore: feedback.system_design_score || 70
          },
          insights: {
              strengths: feedback.strengths || ["Communication", "Basics"],
              weaknesses: feedback.weaknesses || ["Depth"],
              improvementPlan: [
                  feedback.detailed_summary || "Candidate performed adequately.",
                  `Decision: ${feedback.hiring_decision || "Review Pending"}`
              ]
          }
      };
      
      // GAMIFICATION: Award XP based on scores
      const avgScore = data.neuralResilience;
      const { xpGained, newLevel } = gradeAnswer(avgScore);
      useGameStore.getState().completeTask(100); // Bonus for completing session
      
      setSessionReport(data);
      setShowReportModal(true);
      setAiThought(`Session Terminated. Report Generated. +${xpGained} XP Awarded.`);
    } catch (e) {
      console.error("End session failed", e);
      // Fallback report if online end fails
      setSessionReport({
          neuralResilience: 85,
          scores: { technicalScore: 80, eqScore: 85, authenticityScore: 90 },
          insights: { strengths: ["Resilience"], weaknesses: ["Connection Issues"], improvementPlan: ["Check internet connection"] }
      });
      setShowReportModal(true);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Neural Interface Configuration Modal (Start Screen) */}
      <AnimatePresence>
        {showConfigModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-gray-900 border border-electric-blue/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] text-center"
            >
              <div className="w-16 h-16 rounded-full bg-cyan-900/30 flex items-center justify-center mx-auto mb-6 border border-electric-blue/30 animate-pulse">
                <Brain className="w-8 h-8 text-electric-blue" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2 tracking-wide font-mono">NEURAL_INTERFACE_V2</h2>
              <p className="text-gray-400 mb-8 text-sm">
                 Establish link with {role} Persona. <br/>
                 Configure biometric telemetry options.
              </p>

              <div className="bg-black/40 rounded-xl p-4 mb-8 text-left space-y-4 border border-white/5 relative overflow-hidden">
                 
                 {/* Premium Grid Background */}
                 <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                 <div className="relative z-10">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Telemetry Modules</h3>

                     <label className="flex items-center justify-between cursor-pointer group mb-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isBioAnalysisEnabled ? 'bg-cyan-600' : 'bg-gray-700'}`}>
                              <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isBioAnalysisEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                           </div>
                           <div>
                              <span className={`text-sm font-bold block transition-colors ${isBioAnalysisEnabled ? 'text-white' : 'text-gray-400'}`}>Neuro-Physical Analysis</span>
                              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Body Language • Posture • Micro-expressions</span>
                           </div>
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={isBioAnalysisEnabled || false}
                          onChange={(e) => setIsBioAnalysisEnabled(e.target.checked)}
                        />
                        {isBioAnalysisEnabled && <Scan className="w-4 h-4 text-cyan-500 animate-pulse" />}
                     </label>

                     <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-6 rounded-full bg-emerald-500/20 p-1">
                                <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                             </div>
                             <div>
                                <span className="text-sm font-bold text-white block">Voice Spectrum Analysis</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Tone • Pitch • Confidence (Always On)</span>
                             </div>
                         </div>
                         <Volume2 className="w-4 h-4 text-emerald-500" />
                     </div>
                 </div>
              </div>

              <button
                onClick={handleManualStart}
                className="w-full py-4 bg-cyan-600 hover:bg-electric-blue text-white font-bold rounded-xl shadow-lg shadow-electric-blue/20 transition-all active:scale-95 tracking-widest text-sm flex items-center justify-center gap-2 group"
              >
                <span>INITIALIZE NEURAL LINK</span>
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glitch Overlay */}
      {glitchActive && (
        <div className="absolute inset-0 z-40 pointer-events-none mix-blend-exclusion bg-red-500/20">
          <div className="absolute top-0 left-0 w-full h-2 bg-white/50 animate-pulse" style={{ top: `${Math.random() * 100}%` }} />
          <div className="absolute top-0 left-0 w-full h-10 bg-blue-500/20" style={{ top: `${Math.random() * 100}%` }} />
        </div>
      )}

      {/* AR Proctor HUD */}
      {isARMode && (
        <ARProctorHUD 
          stressLevel={riftIntensity * 10}
          gazeStatus={riftWarning ? 'averted' : 'stable'}
          isScanning={true}
          integrityScore={95 - (riftIntensity * 20)}
          annotations={arAnnotations}
        />
      )}

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-iconic-gold/50 p-8 rounded-2xl max-w-lg w-full shadow-[0_0_100px_rgba(245,158,11,0.3)] text-center"
            >
              <div className="mx-auto w-16 h-16 bg-iconic-gold/20 rounded-full flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-iconic-gold" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Singularity Limit Reached</h2>
              <p className="text-gray-400 mb-8">
                Your neural field has exhausted its free quantum states (5/5). 
                <br/>
                Entangle with the <span className="text-iconic-gold font-bold">Pinnacle Edition</span> for infinite simulations.
              </p>
              
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-4 bg-amber-600 hover:bg-iconic-gold text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-iconic-gold/25"
              >
                Unlock Infinite Rift ($29/mo)
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-300"
              >
                Return to Stasis
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Holo-Panel (Interviewer Area) */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Gaussian Splat Interviewer Avatar (Abstract Representation) */}
        <div className="relative w-96 h-96">
          <motion.div
            animate={{
              scale: interviewerState === 'speaking' ? [1, 1.05, 1] : 1,
              filter: `blur(${20 + riftIntensity * 20}px) hue-rotate(${riftIntensity * 90}deg)`,
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-t from-electric-blue to-blue-500 rounded-full opacity-60 mix-blend-screen"
          />
          <motion.div
            animate={{
              scale: interviewerState === 'speaking' ? [1, 1.1, 1] : 1,
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-10 bg-gradient-to-b from-pink-500 to-electric-blue rounded-full opacity-40 mix-blend-screen"
          />
          
          {/* AR Gaze Overlay (Only if Enabled) */}
          {isBioAnalysisEnabled && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-12 text-center">
              <div className={`text-xs font-mono tracking-widest mb-1 ${riftWarning ? 'text-red-500' : 'text-green-400'}`}>
                {riftWarning ? 'GAZE_TRACK: UNSTABLE' : 'GAZE_TRACK: LOCKED'}
              </div>
              <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${riftWarning ? 'bg-red-500' : 'bg-green-400'}`}
                  animate={{ width: `${(1 - riftIntensity) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Rift Warning */}
        <AnimatePresence>
          {riftWarning && isBioAnalysisEnabled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/50 px-6 py-3 rounded-lg backdrop-blur-sm">
                <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                <span className="text-red-400 font-mono font-bold tracking-widest uppercase">{riftWarning}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Bar (Center Bottom) */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-gray-900/80 backdrop-blur-xl p-3 pr-5 pl-5 rounded-full border border-white/10 shadow-2xl z-50">
           
           <button 
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full transition-all ${isMicOn ? 'bg-electric-blue hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
           >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
           </button>

           <button 
              onClick={() => setIsCamOn(!isCamOn)}
              className={`p-3 rounded-full transition-all ${isCamOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500/20 text-red-400'}`}
           >
              {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
           </button>

           {/* Camera Selector (Hidden unless multiple) */}
           {/* End Session */}
           <button
             onClick={handleEndSession}
             className="ml-4 px-5 py-2 rounded-full bg-red-600/90 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
           >
             Terminate
           </button>
      </div>

      {/* Chat / Thought Stream on Right */}
      <AnimatePresence>
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="absolute right-8 top-24 bottom-24 w-80 pointer-events-none flex flex-col items-end gap-3 z-30"
        >
             {/* AI Thought Bubble (Always visible) */}
             <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-electric-blue/30 max-w-xs text-right shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                 <div className="flex items-center justify-end gap-2 text-electric-blue mb-2">
                     <Brain className="w-3 h-3 animate-pulse" />
                     <span className="text-[10px] font-mono uppercase tracking-widest">Neural Stream</span>
                 </div>
                 <p className="text-white/90 text-sm font-light leading-relaxed font-mono">
                     {aiThought}
                 </p>
             </div>

             {/* User Chat Input (Interactive) */}
             <div className="pointer-events-auto mt-auto w-full">
                  <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex gap-2 shadow-2xl">
                     <input
                       type="text"
                       value={inputMessage}
                       onChange={(e) => setInputMessage(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                       placeholder="Type your response..."
                       className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-gray-500 font-mono"
                     />
                     <button 
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isStreaming}
                        className="p-2 bg-electric-blue rounded-xl text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
                     >
                        <Send className="w-4 h-4" />
                     </button>
                  </div>
             </div>
        </motion.div>
      </AnimatePresence>

      {/* User Camera (Picture-in-Picture) */}
      <motion.div 
         drag
         className="absolute top-8 left-8 w-64 aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 z-40 group"
      >
          {/* Bio-Analysis Overlay */}
          {isBioAnalysisEnabled && (
                <div className="absolute inset-0 z-20 pointer-events-none border-[2px] border-cyan-500/30">
                     <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <div className="bg-black/70 px-2 py-1 rounded text-[8px] text-cyan-400 font-mono flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                              TRACKING: ACTIVE
                          </div>
                          <div className="bg-black/70 px-2 py-1 rounded text-[8px] text-green-400 font-mono">
                              STRESS: LOW
                          </div>
                          <div className="bg-black/70 px-2 py-1 rounded text-[8px] text-purple-400 font-mono">
                              PITCH: 140Hz
                          </div>
                     </div>

                     {/* Face Landmarks (Simulated) */}
                     <svg className="absolute inset-0 opacity-30">
                         <circle cx="50%" cy="40%" r="5" fill="none" stroke="cyan" strokeWidth="1" />
                         <circle cx="35%" cy="35%" r="2" fill="cyan" />
                         <circle cx="65%" cy="35%" r="2" fill="cyan" />
                         <path d="M 40 60 Q 50 70 60 60" stroke="cyan" fill="none" />
                     </svg>
                </div>
          )}

          {isCamOn ? (
             <Webcam
               audio={false}
               className="w-full h-full object-cover transform scale-x-[-1]"
               videoConstraints={{
                   deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined
               }}
             />
          ) : (
             <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                   <div className="w-8 h-8 rounded-full bg-white/20" />
                </div>
             </div>
          )}
          
          <div className="absolute bottom-2 right-2 flex gap-1 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => setShowCameraMenu(!showCameraMenu)} className="p-1.5 bg-black/60 rounded text-white hover:bg-white/20">
                   <Settings className="w-3 h-3" />
               </button>
          </div>
          
          {/* Camera Menu */}
          {showCameraMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-black/90 border border-white/20 rounded-lg p-2 z-50">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 pl-1">Select Camera</div>
                  {videoDevices.map((device, idx) => (
                      <button
                          key={device.deviceId}
                          onClick={() => { setSelectedDeviceId(device.deviceId); setShowCameraMenu(false); }}
                          className={`w-full text-left px-2 py-1.5 text-xs truncate rounded ${selectedDeviceId === device.deviceId ? 'bg-electric-blue text-white' : 'text-gray-300 hover:bg-white/10'}`}
                      >
                          {device.label || `Camera ${idx + 1}`}
                      </button>
                  ))}
              </div>
          )}
      </motion.div>
      
    </div>
  );
}

// Helper icons
import { Settings } from 'lucide-react';
