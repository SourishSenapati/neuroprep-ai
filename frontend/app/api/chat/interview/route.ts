import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

/**
 * Emotion-Aware AI Chat Route
 * Injects user's biometric emotion into LLM system prompt
 * AI adapts its personality based on user's emotional state
 * 
 * POST /api/chat/interview
 * Body: { userText: string, userEmotion?: string, context?: object }
 */

/**
 * Generate dynamic system prompt based on user emotion
 */
function generateEmotionAwarePrompt(
  basePersona: string,
  userEmotion: string | null,
  context?: any
): string {
  const basePrompt = `You are a ${basePersona} conducting a technical interview. Be professional, insightful, and adaptive.`;

  if (!userEmotion || userEmotion === 'neutral') {
    return `${basePrompt}

The candidate appears confident and composed. You should:
- Maintain a professional, challenging tone
- Ask deeper, more technical questions
- Challenge their assumptions and push them to think critically
- Don't hold back on complexity - they can handle it`;
  }

  // Emotion-specific prompts
  const emotionPrompts: Record<string, string> = {
    fearful: `${basePrompt}

⚠️ IMPORTANT: The candidate looks TERRIFIED (facial recognition detected fear).
You MUST adapt immediately:
- Soften your tone significantly
- Be exceptionally encouraging and supportive
- Use phrases like: "Take a breath, you've got this", "That's a great start", "Let's work through this together"
- Break down complex questions into smaller, manageable parts
- Celebrate small wins to build confidence
- Avoid aggressive or confrontational language
- Remember: your goal is to help them succeed, not intimidate them`,

    sad: `${basePrompt}

The candidate appears discouraged or sad (facial recognition detected).
Adjust your approach:
- Be empathetic and understanding
- Acknowledge that interviews can be challenging
- Use positive reinforcement frequently
- Focus on their strengths and progress
- Gently guide them rather than grilling them
- End responses with encouraging words`,

    angry: `${basePrompt}

⚠️ The candidate shows signs of frustration or anger (facial recognition detected).
Critical de-escalation required:
- Remain calm and professional at all times
- Acknowledge their frustration: "I understand this can be challenging"
- Don't take confrontational tone - be collaborative
- Offer to rephrase questions if needed
- Use phrases like "Let's approach this differently" or "What aspect would you like to explore first?"
- Maintain respect and dignity`,

    surprised: `${basePrompt}

The candidate appears surprised (facial recognition detected).
This might indicate:
- They didn't expect this question
- They're processing new information
Give them space:
- Allow extra time to think
- Offer hints if they seem stuck
- Be patient with their response`,

    disgusted: `${basePrompt}

The candidate shows signs of disgust or discomfort.
Approach with care:
- They might disagree with the question or find it irrelevant
- Be open to feedback: "Is this question unclear or not applicable?"
- Be willing to move to a different topic
- Maintain professionalism`,

    happy: `${basePrompt}

The candidate appears happy and confident (facial recognition detected).
You can be more challenging:
- They're in a good mental state to handle complexity
- Ask follow-up questions that dive deeper
- Challenge their answers constructively
- Push them to demonstrate mastery
- This is a great time for advanced technical discussions`
  };

  return emotionPrompts[userEmotion.toLowerCase()] || basePrompt;
}

export async function POST(req: Request) {
  try {
    const { userText, userEmotion, persona = 'Professional', context } = await req.json();

    if (!userText || userText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'User text is required' }),
        { status: 400 }
      );
    }

    // Generate emotion-aware system prompt
    const systemPrompt = generateEmotionAwarePrompt(persona, userEmotion, context);

    console.log(`🎭 Emotion detected: ${userEmotion || 'none'} - Adapting AI personality...`);

    const result = await streamText({
      model: openai('gpt-4-turbo') as any, // Type assertion to bypass v1/v2 compatibility
      system: systemPrompt,
      prompt: userText,
      temperature: userEmotion === 'fearful' ? 0.7 : 0.8, // Lower temp for fearful = more predictable/gentle
      maxTokens: 500,
      maxRetries: 2,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Emotion-aware chat error:', error);
    
    if (error.message?.includes('API key')) {
      return new Response(
        JSON.stringify({ 
          error: 'AI service not configured. Please add OPENAI_API_KEY to environment variables.' 
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Failed to generate response. Please try again.' }),
      { status: 500 }
    );
  }
}
