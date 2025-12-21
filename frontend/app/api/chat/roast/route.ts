import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

/**
 * Resume Roast API Route
 * Streams witty career coaching feedback using Vercel AI SDK
 * 
 * POST /api/chat/roast
 * Body: { resumeSnippet: string }
 */

export async function POST(req: Request) {
  try {
    const { resumeSnippet } = await req.json();

    if (!resumeSnippet || typeof resumeSnippet !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid resume snippet' }),
        { status: 400 }
      );
    }

    // Limit snippet length to prevent abuse
    const snippet = resumeSnippet.slice(0, 500);

    const result = await streamText({
      model: openai('gpt-4-turbo') as any, // Type assertion to bypass v1/v2 compatibility
      system: `You are a witty, brutally honest career coach with a sense of humor. Your job is to roast resumes in exactly 2-3 sentences. Be funny but helpful. Point out red flags, buzzwords, or gaps. End with one actionable tip. Keep it under 100 words. Use emojis sparingly (max 2).`,
      prompt: `Roast this resume snippet:\n\n"${snippet}"`,
      temperature: 0.9, // Higher creativity for funnier roasts
      maxTokens: 150,
    });

    return result.toDataStreamResponse();
    
  } catch (error: any) {
    console.error('Resume roast error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate roast' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
