import { NextRequest, NextResponse } from 'next/server';

/**
 * ElevenLabs Voice Cloning API Route
 * Accepts audio file, sends to ElevenLabs for instant voice cloning
 * Returns voice_id for later use in text-to-speech
 */

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Prepare FormData for ElevenLabs
    const elevenlabsFormData = new FormData();
    elevenlabsFormData.append('name', 'NeuroPrep User Voice');
    elevenlabsFormData.append('description', 'User voice clone for personalized interview');
    elevenlabsFormData.append('files', audioFile, 'voice-sample.webm');

    console.log('🎤 Sending voice sample to ElevenLabs...');

    // Send to ElevenLabs Instant Voice Cloning API
    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: elevenlabsFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ ElevenLabs API error:', errorData);
      
      // Handle specific errors
      if (response.status === 400) {
        return NextResponse.json(
          { error: 'Audio sample too short or invalid. Please record at least 30 seconds.' },
          { status: 400 }
        );
      }
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: `Voice cloning failed: ${errorData.detail || 'Unknown error'}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('✅ Voice cloned successfully! Voice ID:', data.voice_id);

    return NextResponse.json({
      success: true,
      voice_id: data.voice_id,
      message: 'Voice cloned successfully! You can now use your voice for interviews.',
    });

  } catch (error: any) {
    console.error('❌ Voice cloning error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to clone voice' },
      { status: 500 }
    );
  }
}

// Edge runtime for faster cold starts
export const runtime = 'edge';
