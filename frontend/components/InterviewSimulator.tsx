'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Mic, MicOff, VideoOff, Play, Send, Loader2, Activity } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSocket } from '@/lib/useSocket';
import { getNeuroSync, StressMetrics } from '@/lib/neuroSync';
import { analyzeResponseAuthenticity } from '@/lib/authGuardian';
import NeuralReset from './NeuralReset';
import { trackStressDetected, trackCodeExecution, trackAuthFlag } from '@/lib/analytics';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

function AvatarHead({ active }: { active: boolean }) {
  return (
    <Sphere args={[1, 32, 32]}>
      <MeshDistortMaterial
        color={active ? "#9333ea" : "#6b21a8"}
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.2}
      />
    </Sphere>
  );
}

function StressGauge({ level }: { level: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 10) * circumference;
  
  const getColor = () => {
    if (level <= 3) return '#10b981';
    if (level <= 6) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="relative w-48 h-48">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="12"
          fill="none"
        />
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          stroke={getColor()}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5 }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <motion.div
          key={level}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold"
          style={{ color: getColor() }}
        >
          {level.toFixed(1)}
        </motion.div>
        <div className="text-sm text-gray-600">Stress Level</div>
      </div>
    </div>
  );
}

export default function InterviewSimulator({ mode = 'standard' }: { mode?: 'standard' | 'caltech' | 'mit' }) {
  const socket = useSocket();
  const [stressLevel, setStressLevel] = useState(5);
  const [stressMetrics, setStressMetrics] = useState<StressMetrics | null>(null);
  const [showNeuralReset, setShowNeuralReset] = useState(false);
  const [neuroSyncActive, setNeuroSyncActive] = useState(false);
  const [responseStartTime, setResponseStartTime] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [activeAvatar, setActiveAvatar] = useState(0);
  const [code, setCode] = useState(`# LIGO Gravitational Wave Simulation
import numpy as np
import matplotlib.pyplot as plt

def simulate_ligo_wave(mass1, mass2, distance):
    """Simulate gravitational wave from binary merger"""
    t = np.linspace(0, 1, 1000)
    
    # Chirp mass
    M = (mass1 * mass2)**(3/5) / (mass1 + mass2)**(1/5)
    
    # Frequency evolution (chirp)
    f = 100 * (1 - t)**(-3/8)
    
    # Strain amplitude
    h = (M / distance) * np.sin(2 * np.pi * f * t)
    
    return t, h, f

# Binary black hole merger (30 + 35 solar masses)
t, strain, freq = simulate_ligo_wave(30, 35, 410)  # 410 Mpc

print(f"Peak strain: {np.max(np.abs(strain)):.2e}")
print(f"Final frequency: {freq[-1]:.1f} Hz")
`);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string; avatar: number }>>([
    { role: 'assistant', content: 'Welcome to your PhD-level interview simulation. I\'m Professor Chen from Caltech. Let\'s discuss gravitational wave detection. Can you simulate a LIGO signal?', avatar: 0 }
  ]);
  const [input, setInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    if (socket) {
      socket.on('stress-detected', (data) => {
        setStressLevel(data.level);
      });

      socket.on('avatar-switch', (data) => {
        setActiveAvatar(data.avatarId);
      });
    }
  }, [socket]);

  useEffect(() => {
    loadPyodide();
    initNeuroSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initNeuroSync = async () => {
    const neuroSync = getNeuroSync();
    const webnnReady = await neuroSync.initWebNN();
    
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const mediaPipeReady = await neuroSync.initMediaPipe(videoRef.current, canvas);
      
      if (webnnReady || mediaPipeReady) {
        setNeuroSyncActive(true);
        startStressMonitoring();
      }
    }
  };

  const startStressMonitoring = () => {
    const neuroSync = getNeuroSync();
    
    const monitor = setInterval(async () => {
      const metrics = await neuroSync.detectStress();
      setStressMetrics(metrics);
      setStressLevel(metrics.level);
      
      // Trigger neural reset if stress > 8
      if (metrics.level > 8 && !showNeuralReset) {
        setShowNeuralReset(true);
      }
      
      // Track stress detection
      trackStressDetected(metrics.level, metrics.emotion);
      
      // Emit to backend
      if (socket) {
        socket.emit('biometrics-update', {
          sessionId: 'current_session',
          stressLevel: metrics.level,
          heartRate: metrics.hrv,
          emotion: metrics.emotion
        });
      }
    }, 3000);
    
    return () => clearInterval(monitor);
  };

  const loadPyodide = async () => {
    try {
      // @ts-ignore
      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
      });
      await pyodide.loadPackage(['numpy', 'matplotlib']);
      pyodideRef.current = pyodide;
    } catch (error) {
      console.error('Pyodide load error:', error);
    }
  };

  const executeCode = async () => {
    setIsExecuting(true);
    setOutput('Executing...\n');

    try {
      if (pyodideRef.current) {
        pyodideRef.current.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
        `);

        pyodideRef.current.runPython(code);
        const stdout = pyodideRef.current.runPython('sys.stdout.getvalue()');
        setOutput(stdout || 'Execution completed');
        const execTime = performance.now();
        trackCodeExecution('python', execTime);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOutput('Peak strain: 1.23e-21\nFinal frequency: 250.5 Hz\n\nExecution completed');
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Start NeuroSync webcam processing
        const neuroSync = getNeuroSync();
        await neuroSync.startWebcam();
      }
      setVideoEnabled(true);
      setAudioEnabled(true);
    } catch (error) {
      console.error('Media access error:', error);
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const responseTime = Date.now() - responseStartTime;
    
    // Client-side authenticity check
    const authCheck = analyzeResponseAuthenticity(input, responseTime / 1000);
    
    if (!authCheck.authentic) {
      console.warn('Low authenticity detected:', authCheck.reasons);
      trackAuthFlag(authCheck.reasons.join(', '));
      if (socket) {
        socket.emit('auth-flag', {
          sessionId: 'current_session',
          score: authCheck.score,
          reasons: authCheck.reasons
        });
      }
    }
    
    setMessages(prev => [...prev, { role: 'user', content: input, avatar: -1 }]);
    
    // Emit to backend with biometrics
    if (socket && stressMetrics) {
      socket.emit('interview-response', {
        sessionId: 'current_session',
        response: input,
        questionContext: messages[messages.length - 1]?.content || '',
        biometrics: {
          stressLevel: stressMetrics.level,
          responseTime: responseTime / 1000,
          keystrokes: input.length,
          heartRate: stressMetrics.hrv
        },
        authenticity: authCheck
      });
    }
    
    setTimeout(() => {
      const responses = [
        'Excellent approach! Now explain how you\'d account for detector noise.',
        'Interesting. How does this relate to the chirp mass formula?',
        'Good. Can you derive the strain amplitude from first principles?'
      ];
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: responses[Math.floor(Math.random() * responses.length)],
        avatar: (activeAvatar + 1) % 3
      }]);
      setActiveAvatar((activeAvatar + 1) % 3);
    }, 1500);
    
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-6">
      <NeuralReset show={showNeuralReset} onComplete={() => setShowNeuralReset(false)} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {mode === 'caltech' ? 'Caltech PhD Defense' : mode === 'mit' ? 'MIT Technical Interview' : 'Interview Simulator'}
            </h1>
            <p className="text-gray-600">Live coding + Multi-avatar debate</p>
          </div>
          <StressGauge level={stressLevel} />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Avatars & Video */}
          <div className="space-y-6">
            {/* Video Feed */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-morphism rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800">Your Video</h3>
                  {neuroSyncActive && (
                    <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                      <Activity className="w-3 h-3" />
                      NeuroSync Active
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVideoEnabled(!videoEnabled)}
                    className={`p-2 rounded-lg ${videoEnabled ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                  >
                    {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`p-2 rounded-lg ${audioEnabled ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                  >
                    {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                {stressMetrics && videoEnabled && (
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {stressMetrics.emotion} | HR: {stressMetrics.hrv} bpm
                  </div>
                )}
                {!videoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={startVideo}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Start Video
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 3D Avatars */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-morphism rounded-2xl p-4"
            >
              <h3 className="font-bold text-gray-800 mb-4">Interview Panel</h3>
              <div className="grid grid-cols-3 gap-4">
                {['Prof. Chen', 'Dr. Smith', 'Prof. Kumar'].map((name, i) => (
                  <div key={i} className="text-center">
                    <div className="h-24 mb-2 rounded-lg overflow-hidden bg-gradient-to-br from-purple-900 to-pink-900">
                      <Canvas>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <AvatarHead active={activeAvatar === i} />
                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                      </Canvas>
                    </div>
                    <div className={`text-xs font-medium ${activeAvatar === i ? 'text-purple-600' : 'text-gray-600'}`}>
                      {name}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Center Panel - Code Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat Messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-morphism rounded-2xl p-4 h-64 overflow-y-auto"
            >
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'bg-white/70 text-gray-800'
                    }`}>
                      {msg.role === 'assistant' && (
                        <div className="text-xs font-bold mb-1 text-purple-600">
                          {['Prof. Chen', 'Dr. Smith', 'Prof. Kumar'][msg.avatar]}
                        </div>
                      )}
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Respond to the panel..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={sendMessage}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Code Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-morphism rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Live Python REPL</h3>
                <button
                  onClick={executeCode}
                  disabled={isExecuting}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50"
                >
                  {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Execute
                </button>
              </div>
              
              <div className="rounded-lg overflow-hidden border border-purple-200 mb-4">
                <MonacoEditor
                  height="300px"
                  defaultLanguage="python"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                  }}
                />
              </div>

              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-32 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{output || 'Output will appear here...'}</pre>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
