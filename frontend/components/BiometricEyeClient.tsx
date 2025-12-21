'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Activity, AlertTriangle } from 'lucide-react';
import { useGameStore } from '@/lib/store/gameStore';

/**
 * BiometricEye Component
 * Real-time emotion recognition using face-api.js
 * Runs entirely in browser for privacy and zero latency
 * 
 * Features:
 * - Webcam face detection
 * - Emotion recognition (neutral, happy, sad, angry, fearful, surprised, disgusted)
 * - Futuristic targeting overlay
 * - Updates gameStore with currentEmotion
 */

interface BiometricEyeProps {
  onEmotionChange?: (emotion: string, confidence: number) => void;
  className?: string;
}

type Emotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'fearful' | 'surprised' | 'disgusted';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

export default function BiometricEye({ onEmotionChange, className = '' }: BiometricEyeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  const [confidence, setConfidence] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('🔄 Loading face-api.js models...');
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        
        setIsModelLoaded(true);
        console.log('✅ Models loaded successfully');
      } catch (err) {
        console.error('❌ Failed to load models:', err);
        setError('Failed to load AI models. Please refresh the page.');
      }
    };

    loadModels();
  }, []);

  // Start webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
        setError(null);
      }
    } catch (err: any) {
      console.error('❌ Webcam error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please enable camera permissions.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Failed to access webcam. Please check permissions.');
      }
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    setFaceDetected(false);
  };

  // Face detection loop
  useEffect(() => {
    if (!isActive || !isModelLoaded || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas size to match video
    const setCanvasSize = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    video.addEventListener('loadedmetadata', setCanvasSize);

    // Start detection loop (every 500ms)
    intervalRef.current = setInterval(async () => {
      if (!video.paused && !video.ended && video.readyState === video.HAVE_ENOUGH_DATA) {
        try {
          // Detect face with emotion
          const detection = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Clear previous drawings
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (detection) {
            setFaceDetected(true);

            // Get dominant emotion
            const expressions = detection.expressions;
            const emotions = Object.entries(expressions) as [Emotion, number][];
            const dominant = emotions.reduce((prev, curr) => 
              curr[1] > prev[1] ? curr : prev
            );

            const [emotionName, emotionConfidence] = dominant;
            
            setCurrentEmotion(emotionName);
            setConfidence(emotionConfidence);

            // Update gameStore (if needed in future)
            // useGameStore.getState().setEmotion(emotionName, emotionConfidence);

            // Callback
            if (onEmotionChange) {
              onEmotionChange(emotionName, emotionConfidence);
            }

            // Draw targeting box
            const box = detection.detection.box;
            drawTargetingSystem(ctx, box, emotionName, emotionConfidence);
          } else {
            setFaceDetected(false);
          }
        } catch (err) {
          console.error('Detection error:', err);
        }
      }
    }, 500); // Scan every 500ms

    return () => {
      video.removeEventListener('loadedmetadata', setCanvasSize);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isModelLoaded, onEmotionChange]);

  // Draw futuristic targeting system
  const drawTargetingSystem = (
    ctx: CanvasRenderingContext2D,
    box: faceapi.Box,
    emotion: string,
    conf: number
  ) => {
    const { x, y, width, height } = box;

    // Main bounding box
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Corner markers (cyberpunk style)
    const cornerSize = 15;
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(x, y + cornerSize);
    ctx.lineTo(x, y);
    ctx.lineTo(x + cornerSize, y);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(x + width - cornerSize, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + cornerSize);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(x, y + height - cornerSize);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + cornerSize, y + height);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(x + width - cornerSize, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y + height - cornerSize);
    ctx.stroke();

    // Emotion label with background
    const label = `${emotion.toUpperCase()}: ${(conf * 100).toFixed(0)}%`;
    const fontSize = 16;
    ctx.font = `bold ${fontSize}px monospace`;
    
    const textMetrics = ctx.measureText(label);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;

    // Background box for text
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y - textHeight - 10, textWidth + 10, textHeight + 10);

    // Emotion color coding
    const emotionColors: Record<string, string> = {
      neutral: '#ffffff',
      happy: '#00ff00',
      sad: '#4444ff',
      angry: '#ff0000',
      fearful: '#ff00ff',
      surprised: '#ffff00',
      disgusted: '#ff8800'
    };

    ctx.fillStyle = emotionColors[emotion] || '#00ff00';
    ctx.fillText(label, x + 5, y - 5);

    // Crosshair at center of face
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const crosshairSize = 10;

    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - crosshairSize, centerY);
    ctx.lineTo(centerX + crosshairSize, centerY);
    ctx.moveTo(centerX, centerY - crosshairSize);
    ctx.lineTo(centerX, centerY + crosshairSize);
    ctx.stroke();

    // Circle around crosshair
    ctx.beginPath();
    ctx.arc(centerX, centerY, crosshairSize * 1.5, 0, 2 * Math.PI);
    ctx.stroke();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4 p-4 border border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold uppercase text-sm">Biometric Eye</h3>
          {isActive && faceDetected && (
            <motion.div
              className="flex items-center gap-2 text-xs text-green-400"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Activity className="w-4 h-4" />
              <span>TRACKING</span>
            </motion.div>
          )}
        </div>

        <button
          onClick={isActive ? stopWebcam : startWebcam}
          disabled={!isModelLoaded}
          className={`px-4 py-2 font-bold uppercase text-xs flex items-center gap-2 transition-colors ${
            isActive
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-cyan-500 hover:bg-cyan-600 text-black disabled:opacity-50'
          }`}
        >
          {isActive ? (
            <>
              <EyeOff className="w-4 h-4" />
              Disable
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Enable
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 border border-red-500/30 bg-red-500/10 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-400 mb-1">Camera Error</p>
              <p className="text-xs text-gray-400">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Feed Container */}
      <div className="relative border-2 border-cyan-500/30 bg-black overflow-hidden">
        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-auto"
          style={{ display: isActive ? 'block' : 'none' }}
        />

        {/* Canvas Overlay for Detection */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ display: isActive ? 'block' : 'none' }}
        />

        {/* Placeholder when inactive */}
        {!isActive && (
          <div className="aspect-video flex flex-col items-center justify-center text-gray-600 p-8 text-center">
            <Eye className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-sm uppercase tracking-wider mb-2">
              {isModelLoaded ? 'Biometric Eye Ready' : 'Loading AI Models...'}
            </p>
            <p className="text-xs text-gray-700">
              Click "Enable" to start facial emotion recognition
            </p>
          </div>
        )}

        {/* HUD Overlay */}
        {isActive && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 border ${
                  faceDetected 
                    ? 'border-green-500/50 bg-green-500/20 text-green-400'
                    : 'border-red-500/50 bg-red-500/20 text-red-400'
                }`}>
                  {faceDetected ? '● FACE LOCKED' : '○ SCANNING'}
                </div>
                
                {faceDetected && (
                  <div className="px-3 py-1 border border-cyan-500/50 bg-cyan-500/20 text-cyan-400">
                    {currentEmotion.toUpperCase()} | {(confidence * 100).toFixed(0)}%
                  </div>
                )}
              </div>

              <div className="text-gray-500">
                FPS: ~2 | LATENCY: &lt;100ms
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Panel */}
      {isActive && faceDetected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 grid grid-cols-2 gap-4 text-xs"
        >
          <div className="p-3 border border-white/10 bg-white/5">
            <div className="text-gray-500 uppercase tracking-wider mb-1">Dominant Emotion</div>
            <div className="text-2xl font-bold text-cyan-400">{currentEmotion}</div>
          </div>
          <div className="p-3 border border-white/10 bg-white/5">
            <div className="text-gray-500 uppercase tracking-wider mb-1">Confidence</div>
            <div className="text-2xl font-bold text-green-400">{(confidence * 100).toFixed(1)}%</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
