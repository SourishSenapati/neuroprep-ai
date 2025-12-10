import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Note: The backend doesn't explicitly list /api/end-session in the snippet I saw,
    // but the frontend calls it. I should check if backend handles it or if I need to add it to backend.
    // Assuming backend handles specific logic or we use /api/sim/end or similar.
    // Looking at server.js, there is NO /api/end-session!
    // However, there is /api/rift-exit which seems to be the session ender (generating insights).
    // Or maybe it's missing.
    // I will map it to /api/rift-exit for now if logic matches, or create a mock pending backend fix.
    
    // Changing strategy: Proxy to /api/rift-exit as it generates insights which is what end-session usually does.
    const response = await fetch(`${BACKEND_URL}/api/rift-exit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Proxy Error (end-session):', error);
    return NextResponse.json({ error: 'Failed to connect to AI Service' }, { status: 500 });
  }
}
