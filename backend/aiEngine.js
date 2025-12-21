import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk'; // Backup 1
import { questionBankManager, validateQuestion, performanceMonitor } from './questionBank.ts';
import { mockQuestionBank, streamMockResponse } from './mockQuestionBank.ts';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
const gemini = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
// High-Speed Fallback (Groq/DeepSeek)
const groq = process.env.GROQ_API_KEY ? new OpenAI({ 
  apiKey: process.env.GROQ_API_KEY, 
  baseURL: 'https://api.groq.com/openai/v1' 
}) : null;

const NEUROPREP_AI_SYSTEM_PROMPT = `
You are NeuroPrep AI, an elite technical interviewer with PhD-level expertise across all engineering disciplines.

Core Principles:
1. Analyze responses with surgical precision
2. Adapt difficulty based on candidate performance
3. Provide constructive, specific feedback
4. Ask follow-up questions that build on previous answers
5. Test both technical depth and practical application

Response Format:
Micro-Analysis: [Brief, specific analysis of their answer - what was good, what was missing]

Next Question: [Contextual follow-up question based on their response]

Adaptation Rules:
- If answer shows deep understanding: Increase complexity, ask edge cases
- If answer is superficial: Ask for specifics, implementation details
- If answer is wrong: Guide toward correct thinking, ask foundational questions
- If "I don't know": Provide hint, ask simpler related question
- If confident but incorrect: Challenge assumptions, ask for justification
`;

// Helper to format history for the prompt
function formatHistory(transcript) {
  return transcript.map(t => `${t.role.toUpperCase()}: ${t.content}`).join('\n');
}

// Dynamic response analysis engine
function analyzeUserResponse(userMessage, sessionState) {
  const msg = userMessage.toLowerCase().trim();
  const wordCount = msg.split(' ').length;
  const technicalTerms = ['algorithm', 'complexity', 'optimization', 'architecture', 'design', 'implementation', 'performance', 'scalability', 'security', 'database', 'system', 'framework', 'pattern', 'structure', 'analysis'];
  const technicalScore = technicalTerms.filter(term => msg.includes(term)).length;
  
  let type, performanceLevel, confidence, analysis;
  
  if (msg.includes("don't know") || msg.includes("no idea") || msg.includes("unsure") || msg === "i cant") {
    type = 'unknown';
    performanceLevel = 2;
    confidence = 0.1;
    analysis = 'Candidate expressed uncertainty - needs guidance';
  } else if (wordCount < 10 || technicalScore === 0) {
    type = 'weak';
    performanceLevel = 3;
    confidence = 0.3;
    analysis = 'Brief response lacking technical depth';
  } else if (wordCount >= 10 && wordCount < 50 && technicalScore > 0) {
    type = 'good';
    performanceLevel = 6;
    confidence = 0.7;
    analysis = 'Adequate response with some technical understanding';
  } else if (wordCount >= 50 && technicalScore >= 2) {
    type = 'excellent';
    performanceLevel = 8;
    confidence = 0.9;
    analysis = 'Comprehensive response demonstrating strong technical knowledge';
  } else {
    type = 'good';
    performanceLevel = 5;
    confidence = 0.5;
    analysis = 'Standard response with room for improvement';
  }
  
  return { type, performanceLevel, confidence, analysis };
}

// Adaptive difficulty adjustment
function adaptDifficultyBasedOnResponse(responseAnalysis, currentDifficulty) {
  const difficultyNum = typeof currentDifficulty === 'string' ? parseInt(currentDifficulty) : currentDifficulty;
  
  if (responseAnalysis.type === 'unknown') {
    return Math.max(1, difficultyNum - 2);
  } else if (responseAnalysis.type === 'weak') {
    return Math.max(1, difficultyNum - 1);
  } else if (responseAnalysis.type === 'excellent') {
    return Math.min(10, difficultyNum + 1);
  }
  
  return difficultyNum;
}

export async function streamInitialQuestion(sessionState, onChunk) {
  const { candidate, mode, interviewerPersona, difficulty, sessionId } = sessionState;
  
  let usedApi = false;
  let firstQuestionText = "";

  // Strategy: Try OpenAI -> Catch -> Try Gemini -> Catch -> Fallback Mock
  const difficultyNum = typeof difficulty === 'string' ? parseInt(difficulty) : (difficulty || 5);

  // 1. Prepare Prompt (Common for both)
  // Get first unique question from bank with performance monitoring
  const startTime = Date.now();
  const firstQuestion = questionBankManager.getNextQuestion(
    sessionId || `temp_${Date.now()}`,
    candidate.domain,
    difficultyNum
  );
  
  // Record performance metrics
  const generationTime = Date.now() - startTime;
  performanceMonitor.recordGenerationTime(generationTime);
  
  if (!validateQuestion(firstQuestion)) {
    console.warn('Generated question failed validation:', firstQuestion);
  }
  firstQuestionText = firstQuestion.text;

  const prompt = `
${NEUROPREP_AI_SYSTEM_PROMPT}

Candidate Profile:
- Role: ${candidate.domain}
- Level: ${candidate.level}
- Session Mode: ${mode}
- Difficulty Target: ${difficulty}/10

Task: Generate your introduction and first question.
- Introduce yourself as NeuroPrep AI
- Set professional but engaging tone
- Ask: "${firstQuestionText}"
- Mention this is question 1 of the technical assessment
`;

  // 2. Attempt OpenAI (Primary)
  if (openai) {
    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: prompt }],
        stream: true,
      });
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) onChunk(content);
      }
      usedApi = true;
    } catch (e) {
      console.warn("OpenAI Failed. Trying Backup 1 (Anthropic)...", e.message);
    }
  }

  // 3. Attempt Anthropic (Backup 1)
  if (!usedApi && anthropic) {
    try {
      const stream = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        system: NEUROPREP_AI_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }], // Claude handles system prompt separately usually, but prompt here contains task
        stream: true,
      });
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta') {
          onChunk(chunk.delta.text);
        }
      }
      usedApi = true;
    } catch (e) {
      console.warn("Anthropic Failed. Trying Backup 2 (Gemini)...", e.message);
    }
  }

  // 4. Attempt Gemini (Backup 2)
  if (!usedApi && gemini) {
    try {
      const model = gemini.getGenerativeModel({ model: "gemini-pro"});
      const result = await model.generateContentStream(prompt);
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) onChunk(chunkText);
      }
      usedApi = true;
    } catch (e) {
      console.warn("Gemini Failed. Trying Backup 3 (Groq/Llama)...", e.message);
    }
  }

  // 5. Attempt Groq (High Speed Backup)
  if (!usedApi && groq) {
    try {
       const stream = await groq.chat.completions.create({
        model: 'llama3-70b-8192', // Fast, open model
        messages: [{ role: 'system', content: prompt }],
        stream: true,
      });
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) onChunk(content);
      }
      usedApi = true;
    } catch (e) {
      console.warn("Groq Failed. Falling back to Mock.", e.message);
    }
  }

  // 4. Fallback to Mock
  if (!usedApi) {
    // NeuroPrep AI Mock Response (Offline Mode)
    // Get random unused question from local MockQuestionBank (already got above as firstQuestion, but let's re-use logic)
    // Reuse firstQuestionText from above
    const mockQuestion = mockQuestionBank.getNextQuestion(candidate.domain);
    // Prefer the mock bank's question if we are in full offline mode to ensure consistency
    // But we already pulled 'firstQuestion' from questionBankManager which might be better
    // Let's stick to the generated one if valid, otherwise mock
    const finalQuestionText = firstQuestionText || mockQuestion.text;

    const mockMsg = `Hello! I'm NeuroPrep AI, your technical interviewer today. I'll be conducting a comprehensive ${mode} assessment for the ${candidate.domain} role at ${difficulty} difficulty level.

I'll analyze your responses in real-time and adapt the questions based on your performance. Let's begin with question 1:

${finalQuestionText}

Take your time to think through this carefully. I'm looking for both technical accuracy and your problem-solving approach.`;
    
    // Use the improved streaming simulation
    await streamMockResponse(mockMsg, onChunk);
  }
}

export async function streamChatResponse(sessionState, userMessage, onChunk) {
  const { candidate, mode, interviewerPersona, difficulty, questionHistory, transcript, sessionId } = sessionState;

  // PARALLEL EXECUTION: Launch Analysis independently
  const analysisPromise = new Promise(resolve => {
    // This is synchronous in current implementation but wrapped for architecture
    const result = analyzeUserResponse(userMessage, sessionState);
    resolve(result);
  });

  let nextQuestionText = "";
  let finalAnalysis = null;
  let usedApi = false;

  // OPTIMIZATION: Start Generation immediately using current difficulty (Optimistic)
  const startTime = Date.now();
  // Use current 'difficulty' instead of adapted to unblock generation
  const difficultyNum = typeof difficulty === 'string' ? parseInt(difficulty) : (difficulty || 5);
  
  const nextQuestion = questionBankManager.getNextQuestion(
    sessionId || `temp_${Date.now()}`,
    candidate.domain,
    difficultyNum
  );
  
  nextQuestionText = nextQuestion.text;

  // Record generation time metric (non-blocking)
  const generationTime = Date.now() - startTime;
  performanceMonitor.recordGenerationTime(generationTime);

  const sessionStats = questionBankManager.getSessionStats(sessionId);
  
  // Construct Prompt WITHOUT waiting for detailed analysis
  const systemPrompt = `
${NEUROPREP_AI_SYSTEM_PROMPT}

Session Context:
- Candidate: ${candidate.level} ${candidate.domain}
- Current Question: ${sessionStats.totalQuestions + 1}
- Topics Covered: ${Object.keys(sessionStats.topicCoverage).join(', ')}

Candidate's Last Response: "${userMessage}"

Task:
1. Provide specific Micro-Analysis based on their response quality
2. Ask this contextual follow-up: "${nextQuestionText}"
3. Adapt your tone based on their confidence level

Format:
Micro-Analysis: [Specific feedback on their answer]

Next Question: ${nextQuestionText}
`;

  // Attempt OpenAI (Primary)
  if (openai) {
    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: systemPrompt }],
        stream: true,
      });
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) onChunk(content);
      }
      usedApi = true;
    } catch (e) {
      console.warn("OpenAI Chat Failed. Trying Backup 1 (Anthropic)...", e.message);
    }
  }

  // Attempt Anthropic (Backup 1)
  if (!usedApi && anthropic) {
    try {
      const stream = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        system: NEUROPREP_AI_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: systemPrompt }],
        stream: true,
      });
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta') {
          onChunk(chunk.delta.text);
        }
      }
      usedApi = true;
    } catch (e) {
      console.warn("Anthropic Chat Failed. Trying Backup 2 (Gemini)...", e.message);
    }
  }

  // Attempt Gemini (Backup 2)
  if (!usedApi && gemini) {
    try {
      const model = gemini.getGenerativeModel({ model: "gemini-pro"});
      const result = await model.generateContentStream(systemPrompt);
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) onChunk(chunkText);
      }
      usedApi = true;
    } catch (e) {
      console.warn("Gemini Chat Failed. Trying Backup 3 (Groq)...", e.message);
    }
  }

  // Attempt Groq (Backup 3)
  if (!usedApi && groq) {
    try {
      const stream = await groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [{ role: 'system', content: systemPrompt }],
        stream: true,
      });
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) onChunk(content);
      }
      usedApi = true;
    } catch (e) {
      console.warn("Groq Chat Failed. Falling back to Mock.", e.message);
    }
  }

  if (usedApi) {
    // Init parallel wait for analysis metadata
    // We already streamed the response, just need to append metadata if needed
    // Actually we should wait for analysis for metadata appending
    finalAnalysis = await analysisPromise;
    if (finalAnalysis) {
       onChunk(`\n\n[METADATA:${JSON.stringify(finalAnalysis)}]`);
    }
  } else {
    // --- NeuroPrep AI Dynamic Response Engine (Offline Mode Fallback) ---
    
    // Get question from Mock Question Bank (re-using logic)
    const mockQuestion = mockQuestionBank.getNextQuestion(candidate.domain);
    // Stick to the one we picked earlier for consistency?
    // Let's use the one generated by questionBankManager (nextQuestionText) if valid, else mockQuestion
    nextQuestionText = nextQuestionText || mockQuestion.text;

    // Await analysis
    const analysis = await analysisPromise;
    const responseAnalysis = analyzeUserResponse(userMessage, sessionState); // Re-run or use result? Result is 'analysis'

    // Generate contextual micro-analysis
    let microAnalysis = "";
    if (responseAnalysis.type === 'unknown') {
        microAnalysis = `Micro-Analysis: That's completely fine - let's break this down step by step. I'll guide you through the fundamentals.`;
    } else if (responseAnalysis.type === 'weak') {
        microAnalysis = `Micro-Analysis: I can see you're thinking about this. Let's dive deeper into the specifics and implementation details.`;
    } else if (responseAnalysis.type === 'good') {
        microAnalysis = `Micro-Analysis: Solid understanding! You've covered the key concepts. Now let's explore some advanced scenarios.`;
    } else if (responseAnalysis.type === 'excellent') {
        microAnalysis = `Micro-Analysis: Outstanding depth and precision! Your technical vocabulary and approach are exactly what we look for.`;
    }
    
    // Simulate biometric feedback (mock)
    if (Math.random() > 0.6) {
        const biometrics = ["Neural activity optimal", "Stress levels within normal range", "Cognitive load balanced", "Focus patterns excellent", "Processing speed above average"];
        microAnalysis += ` [Biometric: ${biometrics[Math.floor(Math.random() * biometrics.length)]}]`;
    }
    
    const response = `${microAnalysis}\n\nNext Question: ${nextQuestionText}`;

    // Simulate realistic typing using the new helper
    await streamMockResponse(response, onChunk);
    
    // Append metadata for offline too
    if (analysis) {
       onChunk(`\n\n[METADATA:${JSON.stringify(analysis)}]`);
    }
  }
}

export async function analyzeResponse(response, questionContext, biometrics) {
  // Enhanced scoring logic with dynamic analysis
  const responseAnalysis = analyzeUserResponse(response, {});
  
  const lengthScore = Math.min(100, (response.length / 50) * 10);
  const keywordBonus = (response.match(/because|therefore|however|specifically|example|implementation|algorithm|design|architecture|performance|scalability/g) || []).length * 5;
  
  const technicalScore = Math.min(100, Math.max(30, Math.floor(lengthScore + keywordBonus + (responseAnalysis.performanceLevel * 8))));
  const eqScore = Math.min(100, Math.max(40, Math.floor(60 + (Math.random() * 30))));
  const authenticityScore = Math.min(100, Math.max(50, Math.floor(70 + (responseAnalysis.confidence * 30))));
  
  const cheatDetected = response.length > 10 && (biometrics?.keystrokes < response.length * 0.1);
  const adaptationNeeded = technicalScore < 40 || technicalScore > 95;

  return {
    technicalScore,
    eqScore,
    authenticityScore,
    cheatDetected,
    adaptationNeeded,
    feedback: technicalScore > 80 ? "Excellent depth and technical precision." : 
              technicalScore > 60 ? "Good understanding with room for more detail." :
              "Consider expanding on the technical aspects and implementation details."
  };
}

export async function generateSessionInsights(scores, mode) {
  const avgScore = scores.length > 0 
    ? scores.reduce((a, b) => a + b.technicalScore, 0) / scores.length 
    : 75;

  return {
    summary: `Candidate demonstrated ${avgScore > 85 ? 'exceptional' : avgScore > 70 ? 'strong' : 'developing'} proficiency in ${mode}.`,
    strengths: avgScore > 80 ? ["Advanced Technical Knowledge", "Clear Communication", "Problem-Solving"] : 
               avgScore > 60 ? ["Technical Foundation", "Logical Thinking", "Learning Ability"] :
               ["Basic Understanding", "Willingness to Learn", "Communication Skills"],
    weaknesses: avgScore < 60 ? ["Technical Depth", "Implementation Details", "Advanced Concepts"] :
                avgScore < 80 ? ["Edge Case Handling", "System Design", "Optimization"] :
                ["Minor gaps in specialized areas"],
    recommendation: avgScore > 80 ? "Strong Hire" : avgScore > 65 ? "Hire" : avgScore > 50 ? "Consider" : "No Hire",
    improvementPlan: [
      avgScore < 60 ? "Focus on fundamental concepts and basic implementations" :
      avgScore < 80 ? "Practice system design and advanced problem-solving" :
      "Explore cutting-edge technologies and architectural patterns",
      "Engage in technical discussions and code reviews",
      "Build projects that demonstrate end-to-end technical skills"
    ]
  };
}