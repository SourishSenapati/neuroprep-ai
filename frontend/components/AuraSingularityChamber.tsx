'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
const Webcam = dynamic(() => import('react-webcam') as any, { ssr: false }) as any;
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, Brain, AlertTriangle, CheckCircle, XCircle, Scan, MessageSquare, Send, Sparkles } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';

import { multiAuraSync } from '../lib/multiAuraSync';
import ARProctorHUD from './ARProctorHUD';

export default function AuraSingularityChamber({ 
  role = 'Software Engineer',
  difficulty = 'Senior',
  persona = 'Professional'
}: { 
  role?: string;
  difficulty?: string;
  persona?: string;
}) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  
  // Camera Selection State
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [showCameraMenu, setShowCameraMenu] = useState(false);

  useEffect(() => {
    const getDevices = async () => {
      try {
        if (!navigator?.mediaDevices?.enumerateDevices) {
          console.warn("Media devices not supported");
          return;
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setVideoDevices(cameras);

        // Prefer laptop/integrated camera
        const laptopCamera = cameras.find(camera => 
          camera.label.toLowerCase().includes('integrated') || 
          camera.label.toLowerCase().includes('facetime') ||
          camera.label.toLowerCase().includes('front')
        );

        if (laptopCamera) {
          setSelectedDeviceId(laptopCamera.deviceId);
        } else if (cameras.length > 0) {
          setSelectedDeviceId(cameras[0].deviceId);
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
  
  // Auto-start session if no modal
  useEffect(() => {
     if (!sessionId.current) {
         // wait for forge then start
         const check = setInterval(() => {
             if (sessionId.current) {
                 clearInterval(check);
                 startSession();
             }
         }, 500);
         return () => clearInterval(check);
     }
  }, []);

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
      const res = await fetch('http://localhost:5000/api/stream', {
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

  // ... existing state ...

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
      setAiThought("Establishing Neural Handshake...");
      const res = await fetch('http://localhost:5000/api/start-session', {
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

      if (!res.ok) {
        if (res.status === 403) {
          setShowLoginModal(true);
          setAiThought("Access Denied. Authentication Required.");
          return;
        }
        throw new Error('Session start failed');
      }

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
      setAiThought("Neural Handshake Failed.");
    }
  };

  // Forge Link on Mount
  useEffect(() => {
    const forge = async () => {
      try {
        if (!userId.current) return;

        const res = await fetch('http://localhost:5000/api/forge-link', {
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
        setActiveSessionId(data.sessionId); // Trigger updates
        setAiThought(`Link Forged. Session ID: ${data.sessionId.substr(0, 8)}...`);
        
        // Auto-start if no consent modal
        if (!showConsentModal) {
             console.log("Auto-starting session...");
             startSession();
        }
        
        // Connect Socket after forging
        try {
          socketRef.current = io('http://localhost:5000/nexus-sync', {
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
        setAiThought("Neural Link Failed. Offline Mode.");
      }
    };
    
    forge();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [role, difficulty, persona]); // IMPORTANT: Ensure deps are correct or use refs inside if specific behavior needed


  const handleConsent = async (allowed: boolean) => {
    setIsBioAnalysisEnabled(allowed);
    setShowConsentModal(false);
    
    if (allowed) {
      setAiThought('Bio-Analysis Enabled. Calibrating...');
    } else {
      setAiThought('Bio-Analysis Disabled. Standard Mode Active.');
    }

    // Small delay to allow UI to update
    setTimeout(() => {
        startSession();
    }, 500);
  };

  const [glitchActive, setGlitchActive] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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

  const handleEndSession = async () => {
    if (!sessionId.current) return;
    try {
      setAiThought("Terminating Neural Link... Compiling Report...");
      const res = await fetch('http://localhost:5000/api/end-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId.current, userId: userId.current })
      });
      const data = await res.json();
      setSessionReport(data);
      setShowReportModal(true);
      setAiThought("Session Terminated. Report Generated.");
    } catch (e) {
      console.error("End session failed", e);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
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
              className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/50 p-8 rounded-2xl max-w-lg w-full shadow-[0_0_100px_rgba(245,158,11,0.3)] text-center"
            >
              <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Singularity Limit Reached</h2>
              <p className="text-gray-400 mb-8">
                Your neural field has exhausted its free quantum states (5/5). 
                <br/>
                Entangle with the <span className="text-amber-400 font-bold">Pinnacle Edition</span> for infinite simulations.
              </p>
              
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/25"
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

      {/* Consent Modal */}
      {/* Consent Modal - Simplified to ensure removal */}
      {showConsentModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-purple-500/30 p-8 rounded-2xl max-w-md w-full shadow-[0_0_50px_rgba(168,85,247,0.2)]">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-500" />
                Neural Calibration
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                To enhance your interview simulation, Aura can analyze your 
                <span className="text-purple-400 font-bold"> body language, gaze patterns, and micro-expressions</span>.
                <br/><br/>
                This data is used solely to provide real-time feedback on your confidence and engagement.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleConsent(true)}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle className="w-5 h-5" />
                  Enable Bio-Analysis
                </button>
                <button
                  onClick={() => handleConsent(false)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-400 font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <XCircle className="w-5 h-5" />
                  Disable (Audio Only)
                </button>
              </div>
            </div>
          </div>
      )}

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
            className="absolute inset-0 bg-gradient-to-t from-purple-600 to-blue-500 rounded-full opacity-60 mix-blend-screen"
          />
          <motion.div
            animate={{
              scale: interviewerState === 'speaking' ? [1, 1.1, 1] : 1,
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-10 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full opacity-40 mix-blend-screen"
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
             <div className="absolute bottom-1 left-1 text-[10px] text-gray-500 font-mono">BIO-HASH: DISABLED</div>
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
            onClick={() => setIsARMode(!isARMode)}
            className={`p-4 rounded-full border ${isARMode ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/10 border-white/20 text-gray-400'} hover:scale-105 transition-all`}
            title="Toggle AR Proctor HUD"
          >
            <Scan className="w-6 h-6" />
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
                        Gemini
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
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Areas for Growth
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sessionReport.insights?.weaknesses?.map((w: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-sm border border-amber-500/20">{w}</span>
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
                   className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                 >
                   View Dashboard
                 </button>
                 <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all font-bold shadow-lg shadow-purple-500/20">
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
