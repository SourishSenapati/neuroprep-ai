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

  // ... (rest of code)

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
          mode: 'standard',
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
            mode: 'standard', 
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
      
      setSessionReport(data);
      setShowReportModal(true);
      setAiThought("Session Terminated. Comprehensive Report Generated.");
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

              <div className="bg-black/40 rounded-xl p-4 mb-8 text-left space-y-4 border border-white/5">
                 <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isBioAnalysisEnabled ? 'bg-cyan-600' : 'bg-gray-700'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isBioAnalysisEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                       </div>
                       <div>
                          <span className="text-sm font-bold text-gray-200 block">Bio-Metric Analysis</span>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Gaze Tracking • Stress Detection</span>
                       </div>
                    </div>
                    
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={isBioAnalysisEnabled || false}
                      onChange={(e) => setIsBioAnalysisEnabled(e.target.checked)}
                    />
                 </label>
                 
                 <div className="flex items-center gap-3 opacity-50 cursor-not-allowed">
                     <div className="w-10 h-6 rounded-full bg-cyan-900/20 p-1">
                        <div className="w-4 h-4 bg-gray-600 rounded-full" />
                     </div>
                     <div>
                        <span className="text-sm font-bold text-gray-500 block">Voice Spectrum Analysis</span>
                        <span className="text-[10px] text-gray-600 uppercase tracking-wider">Tone • Pitch (Always On)</span>
                     </div>
                 </div>
              </div>

              <button
                onClick={handleManualStart}
                className="w-full py-4 bg-cyan-600 hover:bg-electric-blue text-white font-bold rounded-xl shadow-lg shadow-electric-blue/20 transition-all active:scale-95 tracking-widest text-sm"
              >
                INITIALIZE SESSION
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

      {/* Consent Modal Removed - Auto-Start Enabled */}


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
              className="absolute top-10 text-red-500 flex items-center gap-2 bg-red-500/10 px-6 py-2 rounded-full border border-red-500/20 backdrop-blur-md"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="font-mono font-bold tracking-widest">{riftWarning.toUpperCase()}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User HUD (Bottom) */}
      <div className="h-1/3 bg-gradient-to-t from-black via-black/90 to-transparent p-8 flex justify-between items-end relative z-20">
        {/* Session Timer */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-electric-blue font-mono text-xl font-bold tracking-widest bg-black/40 px-4 py-1 rounded border border-electric-blue/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            {formatTime(elapsedTime)}
        </div>
        {/* User Cam Feed (Quantum Bio-Hash) */}
        <div className="relative w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border border-white/10 group">
          {isCamOn ? (
            <Webcam
              audio={false}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              mirrored
              videoConstraints={{ deviceId: selectedDeviceId }}
              onUserMedia={() => console.log('Webcam: User media access granted')}
              onUserMediaError={(err: any) => console.error('Webcam: User media access denied', err)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <VideoOff className="w-8 h-8" />
            </div>
          )}
          
          {/* Camera Selector Overlay (on hover) */}
          <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
               onClick={() => setShowCameraMenu(!showCameraMenu)}
               className="p-1 bg-black/50 rounded hover:bg-black/80 text-xs text-white flex items-center gap-1"
             >
               <Video className="w-3 h-3" />
               Change Cam
             </button>
             {showCameraMenu && (
               <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-white/10 rounded-lg p-1 min-w-[150px] shadow-xl">
                 {videoDevices.map((device, idx) => (
                   <button
                     key={device.deviceId}
                     onClick={() => {
                       setSelectedDeviceId(device.deviceId);
                       setShowCameraMenu(false);
                     }}
                     className={`w-full text-left px-2 py-1 text-xs rounded hover:bg-white/10 ${selectedDeviceId === device.deviceId ? 'text-purple-400' : 'text-gray-300'}`}
                   >
                     {device.label || `Camera ${idx + 1}`}
                   </button>
                 ))}
               </div>
             )}
          </div>
          
          {/* Eye Tracking Overlay (Only if Enabled) */}
          {isBioAnalysisEnabled ? (
            <>
              <div className={`absolute inset-0 border-2 rounded-lg pointer-events-none ${riftWarning ? 'border-red-500/30' : 'border-green-500/30'}`}>
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse ${riftWarning ? 'bg-red-500' : 'bg-green-500'}`} />
              </div>
              <div className={`absolute bottom-1 left-1 text-[10px] font-mono ${riftWarning ? 'text-red-500' : 'text-green-500'}`}>
                BIO-HASH: {riftWarning ? 'UNSTABLE' : 'ACTIVE'}
              </div>
            </>
          ) : (
             <div className="absolute bottom-1 left-1 text-[10px] text-gray-600 font-mono opacity-50">BIO-AUTH: OFF</div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-4 rounded-full border ${isMicOn ? 'bg-white/10 border-white/20 text-white' : 'bg-red-500/20 border-red-500/50 text-red-500'} hover:scale-105 transition-all`}
          >
            {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>
          <button
            onClick={() => setIsCamOn(!isCamOn)}
            className={`p-4 rounded-full border ${isCamOn ? 'bg-white/10 border-white/20 text-white' : 'bg-red-500/20 border-red-500/50 text-red-500'} hover:scale-105 transition-all`}
          >
            {isCamOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>
          
          {/* AR Toggle */}
          <button
            onClick={toggleBioAnalysis}
            className={`p-4 rounded-full border ${isBioAnalysisEnabled ? 'bg-electric-blue/20 border-electric-blue text-electric-blue' : 'bg-white/10 border-white/20 text-gray-400'} hover:scale-105 transition-all`}
            title={isBioAnalysisEnabled ? "Disable Bio-Analysis" : "Enable Bio-Analysis (Body Language)"}
          >
            <Scan className="w-6 h-6" />
          </button>

          {/* Read Aloud Toggle */}
          <button
            onClick={() => speakWithRadioEffect(aiThought)}
            className={`p-4 rounded-full border bg-white/10 border-white/20 text-white hover:scale-105 transition-all`}
            title="Read Question Aloud"
          >
            <Volume2 className="w-6 h-6" />
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`p-4 rounded-full border ${isChatOpen ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/10 border-white/20 text-gray-400'} hover:scale-105 transition-all`}
            title="Toggle Neural Chat"
          >
            <MessageSquare className="w-6 h-6" />
          </button>

          {/* End Session Button */}
          <button
            onClick={handleEndSession}
            className="p-4 rounded-full border bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all"
            title="Terminate Session"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Live Transcript / AI Thought Process */}
        <div className="w-1/3 h-32 bg-white/5 border border-white/10 rounded-xl p-4 overflow-hidden relative">
          <div className="absolute top-2 left-2 flex items-center gap-2 text-xs text-purple-400 font-bold mb-2">
            <Brain className="w-3 h-3" />
            NEURAL_PROCESSOR
          </div>
          <div className="mt-6 text-sm text-gray-300 font-mono leading-relaxed">
            <span className="text-purple-500">{">"}</span> {aiThought} <br/>
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>

      {/* Chat Panel (Gemini Style) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 h-full w-full sm:w-[450px] bg-[#131314] border-l border-[#303132] shadow-2xl flex flex-col z-30 font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#303132]">
              <div className="flex items-center gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 font-medium text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" fill="currentColor" /> 
                  NEUROPREP AI
                </span>
                <span className="text-xs bg-[#1e1f20] text-gray-400 px-2 py-0.5 rounded-full border border-[#303132]">
                  {role} • {difficulty}
                </span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-[#303132]">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-[#303132] scrollbar-track-transparent">
               {/* Welcome Message (Implicit) */}
               {chatHistory.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                   <Brain className="w-12 h-12 mb-4 text-purple-400/50" />
                   <p className="text-sm">Ready to begin your simulation.</p>
                 </div>
               )}

              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'ai' ? 'mt-1' : 'bg-[#303132] mt-auto'
                  }`}>
                    {msg.role === 'ai' ? (
                      <Sparkles className="w-5 h-5 text-blue-400" />
                    ) : (
                      <div className="text-xs font-bold text-gray-300">YOU</div> 
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.role === 'ai' && (
                      <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold mb-1 ml-1">
                        NeuroPrep AI
                      </span>
                    )}
                    <div className={`px-5 py-3 text-[15px] leading-relaxed tracking-wide ${
                      msg.role === 'user' 
                        ? 'bg-[#303132] text-gray-100 rounded-2xl rounded-tr-sm' 
                        : 'text-gray-100' // AI has no bubble background, just authentic text
                    }`}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isStreaming && (
                 <div className="flex gap-4">
                     <div className="w-8 h-8 mt-1 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-blue-400 animate-spin-slow" />
                     </div>
                     <div className="flex items-center gap-1 h-8">
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                       <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                       <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                     </div>
                 </div>
              )}
            </div>

            {/* Input Area (Gemini Floating Pill) */}
            <div className="p-4 bg-[#131314]">
              <div className="relative bg-[#1e1f20] rounded-full border border-[#303132] focus-within:border-gray-500 focus-within:bg-[#252627] transition-all duration-200 flex items-center pr-2 pl-4 py-2 shadow-lg">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your response here..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none py-2 text-sm font-medium"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isStreaming || !inputMessage.trim()}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    inputMessage.trim() && !isStreaming 
                      ? 'bg-white text-black hover:bg-gray-200 rotate-0 scale-100' 
                      : 'bg-transparent text-gray-600 rotate-90 scale-75 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
              <div className="text-center mt-2 pb-1">
                 <p className="text-[10px] text-gray-500">Gemini may display inaccurate info, including about people, so double-check its responses.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && sessionReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-900 border border-white/10 p-8 rounded-2xl max-w-4xl w-full h-[80vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">NEURAL AUDIT REPORT</h2>
                  <p className="text-gray-400 font-mono text-sm">SESSION_ID: {sessionId.current}</p>
                </div>
                <div className="text-right">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    {sessionReport.neuralResilience || 0}%
                  </div>
                  <div className="text-xs text-gray-500 tracking-widest uppercase mt-1">Overall Proficiency</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                  <h3 className="text-gray-400 text-xs tracking-widest mb-2">TECHNICAL</h3>
                  <div className="text-2xl font-bold text-blue-400">{Math.round(sessionReport.scores?.technicalScore || 0)}/100</div>
                </div>
                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                  <h3 className="text-gray-400 text-xs tracking-widest mb-2">COMMUNICATION</h3>
                  <div className="text-2xl font-bold text-green-400">{Math.round(sessionReport.scores?.eqScore || 0)}/100</div>
                </div>
                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                  <h3 className="text-gray-400 text-xs tracking-widest mb-2">AUTHENTICITY</h3>
                  <div className="text-2xl font-bold text-purple-400">{Math.round(sessionReport.scores?.authenticityScore || 0)}/100</div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" /> Strengths
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sessionReport.insights?.strengths?.map((s: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm border border-green-500/20">{s}</span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-iconic-gold" /> Areas for Growth
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sessionReport.insights?.weaknesses?.map((w: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-iconic-gold/10 text-iconic-gold rounded-full text-sm border border-iconic-gold/20">{w}</span>
                    ))}
                  </div>
                </div>

                {sessionReport.insights?.improvementPlan && (
                   <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-500" /> Neural Optimization Path
                    </h3>
                    <ul className="space-y-3">
                      {sessionReport.insights.improvementPlan.map((step: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300 bg-white/5 p-4 rounded-lg">
                          <span className="text-blue-500 font-bold">{i+1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                   </div>
                )}
              </div>
              
              <div className="mt-auto pt-6 border-t border-white/10 flex justify-end gap-4">
                 <button 
                   onClick={() => window.location.href = '/dashboard'}
                   className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/10"
                 >
                   Save Progress to Dashboard
                 </button>
                 <button 
                   onClick={() => window.location.href = '/pricing'}
                   className="px-6 py-3 bg-electric-blue hover:bg-purple-500 text-white rounded-lg transition-all font-bold shadow-lg shadow-purple-500/20"
                 >
                   Unlock Detailed Analysis (Pro)
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-900 border border-purple-500/30 p-8 rounded-2xl max-w-md w-full shadow-2xl text-center"
            >
              <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Neural Link Limit Reached</h2>
              <p className="text-gray-400 mb-8">
                You have exhausted your free anonymous sessions. 
                <br/>
                Authenticate to restore neural entanglement.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => signIn('google')}
                  className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <Image src="https://authjs.dev/img/providers/google.svg" width={20} height={20} className="w-5 h-5" alt="Google" unoptimized />
                  Continue with Google
                </button>
                <button
                  onClick={() => signIn('github')}
                  className="w-full py-3 bg-[#24292e] text-white font-bold rounded-lg hover:bg-[#2f363d] transition-all flex items-center justify-center gap-2"
                >
                  <Image src="https://authjs.dev/img/providers/github.svg" width={20} height={20} className="w-5 h-5 invert" alt="GitHub" unoptimized />
                  Continue with GitHub
                </button>
                <button
                  onClick={() => signIn('linkedin')}
                  className="w-full py-3 bg-[#0077b5] text-white font-bold rounded-lg hover:bg-[#006097] transition-all flex items-center justify-center gap-2"
                >
                  <span className="font-bold text-xl">in</span>
                  Continue with LinkedIn
                </button>
                <button
                  onClick={() => signIn('credentials')}
                  className="w-full py-3 bg-gray-800 text-gray-300 font-bold rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  Use Phone Number
                </button>
              </div>
              
              <button
                onClick={() => setShowLoginModal(false)}
                className="mt-6 text-sm text-gray-500 hover:text-gray-300"
              >
                Cancel Transmission
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
