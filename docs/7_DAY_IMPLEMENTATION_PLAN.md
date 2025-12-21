# 7-DAY IMPLEMENTATION ROADMAP - EXPONENTIAL FEATURES

**Duration:** 7 days  
**Goal:** Build AI Voice Clone, Multiplayer Mode, AR Face Tracking  
**Score Impact:** +30 points (to 120/100)  
**Status:** All features are BUILDABLE

---

## DAY-BY-DAY BREAKDOWN

### **DAY 1-2: AI Voice Clone** (+8 points)

**Complexity:** Medium  
**Tech:** ElevenLabs API + Web Speech API  
**Time:** 16 hours  

**What You'll Build:**

- Voice recording interface (30 seconds)
- ElevenLabs API integration
- Voice cloning + text-to-speech
- Interview with YOUR voice

**Dependencies:**

```bash
npm install @11ty/eleventy-plugin-syntaxhighlight
# Use ElevenLabs free tier: 10,000 chars/month
```

**Implementation Steps:**

1. Create voice recording component
2. Send audio to ElevenLabs API
3. Clone voice (1-2 min processing)
4. Replace interview AI voice with clone
5. Store voice ID in localStorage

**Deliverable:** Working voice clone demo

---

### **DAY 3-4: Multiplayer Mode** (+10 points)

**Complexity:** High  
**Tech:** Supabase Realtime + WebRTC (optional)  
**Time:** 20 hours  

**What You'll Build:**

- Real-time collaboration
- Two users practice together
- Shared interview session
- Live cursor/typing indicators

**Dependencies:**

```bash
npm install @supabase/supabase-js socket.io-client
# Supabase free tier: Unlimited connections
```

**Implementation Steps:**

1. Set up Supabase project (10 min)
2. Create "rooms" table
3. Real-time sync with Supabase Realtime
4. Share interview state
5. Live presence indicators

**Deliverable:** 2-player interview session

---

### **DAY 5-7: AR Face Tracking** (+12 points)

**Complexity:** Very High  
**Tech:** MediaPipe Face Mesh + Three.js  
**Time:** 30 hours  

**What You'll Build:**

- 3D face model overlay
- Real-time micro-expression tracking
- Stress heatmap on face
- Eye-gaze tracking

**Dependencies:**

```bash
npm install @mediapipe/face_mesh @mediapipe/camera_utils
# Google MediaPipe: Free + runs in browser
```

**Implementation Steps:**

1. Replace face-api.js with MediaPipe
2. Get 468-point 3D face mesh
3. Create Three.js 3D overlay
4. Map stress to heatmap colors
5. Track eye gaze direction

**Deliverable:** AR face tracking with heatmap

---

## IMPLEMENTATION GUIDES (DETAILED)

### **FEATURE 1: AI VOICE CLONE**

#### **Architecture:**

```
User Records Voice (30s)
  ↓
Send to ElevenLabs API
  ↓
Voice Clone Created
  ↓
Use Clone for Interview AI
  ↓
Text → Speech (in your voice!)
```

#### **Code Scaffold:**

**File: `components/VoiceCloneSetup.tsx`**

```typescript
'use client';

import { useState } from 'react';

export default function VoiceCloneSetup() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [voiceId, setVoiceId] = useState<string | null>(null);
  
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setAudioBlob(blob);
    };
    
    mediaRecorder.start();
    setIsRecording(true);
    
    // Auto-stop after 30 seconds
    setTimeout(() => {
      mediaRecorder.stop();
      setIsRecording(false);
      stream.getTracks().forEach(track => track.stop());
    }, 30000);
  };
  
  const cloneVoice = async () => {
    if (!audioBlob) return;
    
    const formData = new FormData();
    formData.append('name', 'User Voice Clone');
    formData.append('files', audioBlob, 'voice-sample.webm');
    
    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY!
      },
      body: formData
    });
    
    const data = await response.json();
    setVoiceId(data.voice_id);
    localStorage.setItem('cloned_voice_id', data.voice_id);
  };
  
  const speak = async (text: string) => {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, model_id: 'eleven_monolingual_v1' })
      }
    );
    
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };
  
  return (
    <div className="p-6 border border-white/10 bg-white/5">
      <h3 className="text-xl font-bold mb-4">Clone Your Voice</h3>
      
      {!voiceId ? (
        <>
          <button onClick={startRecording} disabled={isRecording}>
            {isRecording ? 'Recording... (30s)' : 'Start Recording'}
          </button>
          
          {audioBlob && (
            <button onClick={cloneVoice}>
              Clone Voice
            </button>
          )}
        </>
      ) : (
        <div>
          <p className="text-green-400"> Voice Cloned!</p>
          <button onClick={() => speak('Hello, this is my cloned voice!')}>
            Test Voice
          </button>
        </div>
      )}
    </div>
  );
}
```

**API Route: `app/api/voice/clone/route.ts`**

```typescript
export async function POST(req: Request) {
  const formData = await req.formData();
  const audioFile = formData.get('audio') as File;
  
  // Forward to ElevenLabs
  const elevenlabsFormData = new FormData();
  elevenlabsFormData.append('name', 'User Clone');
  elevenlabsFormData.append('files', audioFile);
  
  const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY!
    },
    body: elevenlabsFormData
  });
  
  return Response.json(await response.json());
}
```

**Setup:**

1. Get ElevenLabs API key: <https://elevenlabs.io> (free tier)
2. Add to `.env.local`: `NEXT_PUBLIC_ELEVENLABS_API_KEY=your_key`
3. Implement component
4. Test recording + cloning

**Time:** 16 hours total

---

### **FEATURE 2: MULTIPLAYER MODE**

#### **Architecture:**

```
User 1 Creates Room
  ↓
Gets Room Code
  ↓
User 2 Joins Room
  ↓
Supabase Realtime Sync
  ↓
Both see same interview
```

#### **Code Scaffold:**

**File: `lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**File: `components/MultiplayerRoom.tsx`**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function MultiplayerRoom() {
  const [roomCode, setRoomCode] = useState('');
  const [participants, setParticipants] = useState<any[]>([]);
  const [sharedState, setSharedState] = useState<any>({});
  
  const createRoom = async () => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const { data } = await supabase
      .from('interview_rooms')
      .insert({
        code,
        created_at: new Date().toISOString(),
        state: {}
      })
      .select()
      .single();
    
    setRoomCode(code);
    subscribeToRoom(code);
  };
  
  const joinRoom = async (code: string) => {
    setRoomCode(code);
    subscribeToRoom(code);
  };
  
  const subscribeToRoom = (code: string) => {
    const channel = supabase
      .channel(`room:${code}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'interview_rooms',
        filter: `code=eq.${code}`
      }, (payload) => {
        setSharedState(payload.new.state);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setParticipants(Object.values(state).flat());
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: Math.random().toString(),
            online_at: new Date().toISOString()
          });
        }
      });
  };
  
  const updateState = async (newState: any) => {
    await supabase
      .from('interview_rooms')
      .update({ state: newState })
      .eq('code', roomCode);
  };
  
  return (
    <div>
      {!roomCode ? (
        <>
          <button onClick={createRoom}>Create Room</button>
          <input 
            placeholder="Or enter room code"
            onChange={(e) => joinRoom(e.target.value)}
          />
        </>
      ) : (
        <div>
          <h3>Room: {roomCode}</h3>
          <p>Participants: {participants.length}</p>
          {/* Shared interview UI here */}
        </div>
      )}
    </div>
  );
}
```

**Supabase Setup:**

1. Create Supabase project: <https://supabase.com>
2. Create table:

```sql
create table interview_rooms (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  state jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
```
1. Enable Realtime:

```sql
alter publication supabase_realtime add table interview_rooms;
```

**Time:** 20 hours total

---

### **FEATURE 3: AR FACE TRACKING**

#### **Architecture:**

```
MediaPipe Face Mesh
  ↓
468-point 3D mesh
  ↓
Three.js Overlay
  ↓
Color by stress level
```

#### **Code Scaffold:**

**File: `components/ARFaceTracking.tsx`**

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

export default function ARFaceTracking() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      }
    });
    
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    
    faceMesh.onResults(onResults);
    
    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current! });
        },
        width: 1280,
        height: 720
      });
      camera.start();
    }
  }, []);
  
  const onResults = (results: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        // Draw 3D mesh
        drawFaceMesh(ctx, landmarks);
        
        // Calculate stress (example: based on eyebrow position)
        const stress = calculateStress(landmarks);
        drawHeatmap(ctx, landmarks, stress);
      }
    }
  };
  
  const drawFaceMesh = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    // Draw all 468 points
    landmarks.forEach((point) => {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
      ctx.fillRect(
        point.x * ctx.canvas.width,
        point.y * ctx.canvas.height,
        2, 2
      );
    });
  };
  
  const calculateStress = (landmarks: any[]): number => {
    // Example: measure eyebrow raise (stress indicator)
    const leftEyebrow = landmarks[70];
    const leftEye = landmarks[33];
    const distance = Math.abs(leftEyebrow.y - leftEye.y);
    
    // Normalize to 0-1
    return Math.min(1, distance * 10);
  };
  
  const drawHeatmap = (ctx: CanvasRenderingContext2D, landmarks: any[], stress: number) => {
    // Color face based on stress
    const color = stress > 0.7 ? 'rgba(255, 0, 0, 0.3)' :
                  stress > 0.4 ? 'rgba(255, 255, 0, 0.3)' :
                  'rgba(0, 255, 0, 0.3)';
    
    // Draw semi-transparent overlay
    ctx.fillStyle = color;
    landmarks.forEach((point) => {
      ctx.fillRect(
        point.x * ctx.canvas.width - 5,
        point.y * ctx.canvas.height - 5,
        10, 10
      );
    });
  };
  
  return (
    <div className="relative">
      <video ref={videoRef} className="hidden" />
      <canvas 
        ref={canvasRef}
        width={1280}
        height={720}
        className="w-full"
      />
    </div>
  );
}
```

**Dependencies:**

```bash
npm install @mediapipe/face_mesh @mediapipe/camera_utils
```

**Time:** 30 hours total

---

## SUCCESS CHECKLIST

### **Week Plan:**

**Monday-Tuesday (Day 1-2): Voice Clone**

- [ ] Set up ElevenLabs account
- [ ] Build recording interface
- [ ] Integrate API
- [ ] Test voice cloning
- [ ] Replace AI voice

**Wednesday-Thursday (Day 3-4): Multiplayer**

- [ ] Set up Supabase project
- [ ] Create database tables
- [ ] Build room system
- [ ] Implement real-time sync
- [ ] Test with 2 browsers

**Friday-Sunday (Day 5-7): AR Face Tracking**

- [ ] Install MediaPipe
- [ ] Get 3D face mesh working
- [ ] Create heatmap overlay
- [ ] Calculate stress metrics
- [ ] Polish visualization

---

## MINIMUM VIABLE VERSIONS

### **If Short on Time:**

**Voice Clone MVP (4 hours):**

- Skip ElevenLabs
- Use Web Speech API only
- Record voice → Play back
- "Simulated clone" label

**Multiplayer MVP (6 hours):**

- Skip Supabase
- Use simple WebSocket
- One-way screen share
- "Watch mode" instead of collaborate

**AR Tracking MVP (8 hours):**

- Use existing face-api.js
- Add colored overlay
- Simple red/green stress indicator
- Skip 3D mesh

---

## DEPLOYMENT NOTES

**ElevenLabs Free Tier:**

- 10,000 characters/month
- 3 custom voices
- Good enough for demo

**Supabase Free Tier:**

- 500 MB database
- Unlimited API requests
- Real-time included

**MediaPipe:**

- Runs in browser (free)
- No API key needed
- Works offline

---

## FINAL SCORE PROJECTION

**Current:** 91/100

**After Mobile + Analytics:**

- Mobile: +2
- Analytics: +5
- **Score: 98/100**

**After Voice Clone:**

- Voice Clone: +8
- **Score: 106/100**

**After Multiplayer:**

- Multiplayer: +10
- **Score: 116/100**

**After AR Tracking:**

- AR Tracking: +12
- **Score: 128/100**

---

## TIPS FOR SUCCESS

1. **Start Simple:** Get MVP working first
2. **Test Early:** Don't wait till end
3. **Use Free Tiers:** All APIs have free plans
4. **Document:** Take screenshots for demo
5. **Backup Plan:** Have simpler versions ready

---

**You have 7 days. This is VERY doable.**

Start with Voice Clone (easiest), then Multiplayer, then AR (hardest).

**Let me know when you're ready to start and I'll help you build each feature!**
