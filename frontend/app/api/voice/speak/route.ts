import { NextRequest, NextResponse } from 'next/server';

/**
 * ElevenLabs Text-to-Speech Streaming API
 * Converts text to speech using user's cloned voice
 * Streams audio for instant playback
 */

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    if (!voiceId) {
      return NextResponse.json(
        { error: 'No voice ID provided' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    console.log('🎤 Generating speech with voice ID:', voiceId);

    // Call ElevenLabs TTS API with streaming
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ ElevenLabs TTS error:', errorData);
      return NextResponse.json(
        { error: `TTS failed: ${errorData.detail || 'Unknown error'}` },
        { status: response.status }
      );
    }

    // Stream the audio response directly to client
    const audioStream = response.body;
    
    if (!audioStream) {
      return NextResponse.json(
        { error: 'No audio stream received' },
        { status: 500 }
      );
    }

    console.log('✅ Audio stream ready');

    // Return streaming audio response
    return new NextResponse(audioStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error: any) {
    console.error('❌ TTS error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate speech' },
      { status: 500 }
    );
  }
}

// Edge runtime for faster streaming
export const runtime = 'edge';
