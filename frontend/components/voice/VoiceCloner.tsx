'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useGameStore } from '@/lib/store/gameStore';
import toast from 'react-hot-toast';

/**
 * Voice Cloner Component
 * Allows users to record their voice and clone it using ElevenLabs API
 * Stores voice_id in game store for later use
 */

const SAMPLE_TEXT = "I am ready to become a career athlete and master my future. This is my journey to success.";
const MIN_RECORDING_SECONDS = 30;

export default function VoiceCloner() {
  const gameStore = useGameStore();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [voiceId, setVoiceId] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('user_voice_id') : null
  );
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.success('🎤 Recording started! Read the text below.', {
        icon: '🎙️'
      });
      
    } catch (error: any) {
      console.error('❌ Microphone access error:', error);
      toast.error('Failed to access microphone. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (recordingTime < MIN_RECORDING_SECONDS) {
        toast.error(`Recording too short! Please record at least ${MIN_RECORDING_SECONDS} seconds.`);
      } else {
        toast.success(`✅ Recording complete! ${recordingTime}s captured.`);
      }
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const uploadAndClone = async () => {
    if (!audioBlob) {
      toast.error('No audio recorded!');
      return;
    }

    if (recordingTime < MIN_RECORDING_SECONDS) {
      toast.error(`Please record at least ${MIN_RECORDING_SECONDS} seconds!`);
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('🚀 Cloning your voice... This may take 30-60 seconds.');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-sample.webm');

      const response = await axios.post('/api/voice/clone', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes timeout
      });

      const { voice_id } = response.data;
      
      // Save to localStorage
      localStorage.setItem('user_voice_id', voice_id);
      setVoiceId(voice_id);


      toast.success('🎉 Voice cloned successfully! You can now use your voice for interviews.', {
        id: toastId,
        duration: 5000,
      });

      // Bonus XP for voice cloning
      gameStore.completeTask(200);
      
    } catch (error: any) {
      console.error('❌ Voice cloning error:', error);
      const errorMsg = error.response?.data?.error || 'Failed to clone voice. Please try again.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 border-2 border-purple-500 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold uppercase mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Clone Your Voice
        </h2>
        <p className="text-gray-400 text-sm">
          Interview with AI... in YOUR voice! Record 30+ seconds.
        </p>
      </div>

      {/* Status */}
      {voiceId ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 border border-green-500 bg-green-500/10 mb-6 flex items-center gap-3"
        >
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-400">✓ Voice Cloned Successfully!</p>
            <p className="text-xs text-gray-400 mt-1">Voice ID: {voiceId.substring(0, 20)}...</p>
          </div>
        </motion.div>
      ) : (
        <div className="p-4 border border-yellow-500/30 bg-yellow-500/10 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-yellow-400 text-sm">No voice clone yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Record your voice to enable personalized AI interviews
            </p>
          </div>
        </div>
      )}

      {/* Sample Text */}
      <div className="p-4 border border-white/10 bg-white/5 mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Read This Text:</p>
        <p className="text-lg leading-relaxed text-purple-300">
          "{SAMPLE_TEXT}"
        </p>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Speak clearly and naturally. Minimum {MIN_RECORDING_SECONDS} seconds required.
        </p>
      </div>

      {/* Recording Controls */}
      <div className="space-y-4">
        {/* Timer Display */}
        {(isRecording || recordingTime > 0) && (
          <div className="text-center">
            <div className={`text-4xl font-bold font-mono ${
              recordingTime < MIN_RECORDING_SECONDS ? 'text-red-400' : 'text-green-400'
            }`}>
              {formatTime(recordingTime)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {recordingTime < MIN_RECORDING_SECONDS 
                ? `${MIN_RECORDING_SECONDS - recordingTime}s more needed`
                : '✓ Minimum duration reached'
              }
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {!isRecording ? (
            <motion.button
              onClick={startRecording}
              disabled={isUploading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-4 px-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5" />
              Start Recording
            </motion.button>
          ) : (
            <motion.button
              onClick={stopRecording}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-4 px-6 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 animate-pulse"
            >
              <Square className="w-5 h-5" />
              Stop Recording
            </motion.button>
          )}

          {audioBlob && !isRecording && (
            <motion.button
              onClick={playAudio}
              disabled={isUploading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-4 px-6 border-2 border-blue-500 bg-blue-500/10 hover:bg-blue-500/20 text-white font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Play Recording
            </motion.button>
          )}
        </div>

        {/* Upload Button */}
        {audioBlob && !isRecording && recordingTime >= MIN_RECORDING_SECONDS && (
          <motion.button
            onClick={uploadAndClone}
            disabled={isUploading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Cloning Voice...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Clone My Voice
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Progress Indicator */}
      {isRecording && (
        <div className="mt-4">
          <div className="h-2 bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min(100, (recordingTime / MIN_RECORDING_SECONDS) * 100)}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-3 border-l-4 border-purple-500 bg-purple-500/10">
        <p className="text-xs text-purple-300">
          <strong>🎙️ How it works:</strong> Your voice sample is securely sent to ElevenLabs AI 
          for instant voice cloning. The AI will learn your unique voice characteristics and create 
          a digital clone that sounds exactly like you. This is used ONLY for your personalized 
          interview experience. (+200 XP bonus!)
        </p>
      </div>
    </div>
  );
}
