import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * Resume Parser API Route (Next.js App Router)
 * Proxies to backend parse-resume endpoint
 * 
 * Usage:
 * POST /api/parse-resume
 * Body: FormData with 'resume' file field (PDF)
 * 
 * Returns: JSON with extracted resume data
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'NO_FILE', message: 'No resume file provided' },
        { status: 400 }
      );
    }
    
    // Check file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'INVALID_TYPE', message: 'Only PDF files are supported' },
        { status: 400 }
      );
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'FILE_TOO_LARGE', message: 'Resume file must be less than 5MB' },
        { status: 400 }
      );
    }
    
    // Convert to buffer and forward to backend
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const response = await fetch(`${BACKEND_URL}/api/parse-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: buffer.toString('base64'),
        fileName: file.name
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Parse resume error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'SERVER_ERROR', 
        message: 'Failed to parse resume. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
