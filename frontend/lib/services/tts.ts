/**
 * Intelligent Text-to-Speech Service
 * Automatically uses cloned voice if available, otherwise falls back to browser TTS
 */

import { useGameStore } from '@/lib/store/gameStore';

export class TTSService {
  private static audioContext: AudioContext | null = null;
  private static currentAudio: HTMLAudioElement | null = null;

  /**
   * Speak text using best available method
   * Priority: ElevenLabs (cloned voice) > Browser speechSynthesis
   */
  static async speak(text: string): Promise<void> {
    // Get user's cloned voice ID from game store or localStorage
    const voiceId = localStorage.getItem('user_voice_id');
    
    if (voiceId) {
      // Use ElevenLabs with cloned voice (streaming)
      console.log('🎤 Using cloned voice:', voiceId.substring(0, 20) + '...');
      await this.speakWithElevenLabs(text, voiceId);
    } else {
      // Fallback to browser speech synthesis
      console.log('🔊 Using browser TTS (no cloned voice)');
      this.speakWithBrowser(text);
    }
  }

  /**
   * ElevenLabs streaming TTS (instant playback)
   */
  private static async speakWithElevenLabs(text: string, voiceId: string): Promise<void> {
    try {
      // Stop any currently playing audio
      this.stop();

      // Call our API route which streams from ElevenLabs
      const response = await fetch('/api/voice/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voiceId }),
      });

      if (!response.ok) {
        console.error('❌ ElevenLabs TTS failed, falling back to browser TTS');
        this.speakWithBrowser(text);
        return;
      }

      // Get audio blob from streaming response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play audio immediately
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      // Play promise
      await audio.play();

      // Cleanup after playback
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
      };

      console.log('✅ Cloned voice playing');

    } catch (error) {
      console.error('❌ ElevenLabs TTS error:', error);
      // Fallback to browser TTS on any error
      this.speakWithBrowser(text);
    }
  }

  /**
   * Browser speech synthesis (fallback)
   */
  private static speakWithBrowser(text: string): void {
    if (!('speechSynthesis' in window)) {
      console.error('❌ Speech synthesis not supported');
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to use a good quality voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Microsoft') ||
      v.lang.startsWith('en')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
    console.log('✅ Browser TTS playing');
  }

  /**
   * Stop all audio playback
   */
  static stop(): void {
    // Stop ElevenLabs audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    // Stop browser speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Check if cloned voice is available
   */
  static hasClonedVoice(): boolean {
    return !!localStorage.getItem('user_voice_id');
  }
}

// Export singleton instance
export const tts = TTSService;
