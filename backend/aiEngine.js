import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { questionBankManager, validateQuestion, performanceMonitor } from './questionBank.ts';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const gemini = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

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
  
  // Get first unique question from bank with performance monitoring
  const startTime = Date.now();
  const difficultyNum = typeof difficulty === 'string' ? parseInt(difficulty) : (difficulty || 5);
  const firstQuestion = questionBankManager.getNextQuestion(
    sessionId || `temp_${Date.now()}`,
    candidate.domain,
    difficultyNum
  );
  
  // Record performance metrics
  const generationTime = Date.now() - startTime;
  performanceMonitor.recordGenerationTime(generationTime);
  
  // Validate question quality
  if (!validateQuestion(firstQuestion)) {
    console.warn('Generated question failed validation:', firstQuestion);
  }
  
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
- Ask: "${firstQuestion.text}"
- Mention this is question 1 of the technical assessment
`;

  if (openai) {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      stream: true,
    });
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) onChunk(content);
    }
  } else if (gemini) {
    const model = gemini.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) onChunk(chunkText);
    }
  } else {
    // NeuroPrep AI Mock Response
    const mockMsg = `Hello! I'm NeuroPrep AI, your technical interviewer today. I'll be conducting a comprehensive ${mode} assessment for the ${candidate.domain} role at ${difficulty} difficulty level.

I'll analyze your responses in real-time and adapt the questions based on your performance. Let's begin with question 1:

${firstQuestion.text}

Take your time to think through this carefully. I'm looking for both technical accuracy and your problem-solving approach.`;
    
    for (let i = 0; i < mockMsg.length; i += Math.floor(Math.random() * 3) + 2) {
      const chunk = mockMsg.substr(i, Math.floor(Math.random() * 3) + 2);
      onChunk(chunk);
      await new Promise(r => setTimeout(r, Math.random() * 30 + 10));
    }
  }
}

export async function streamChatResponse(sessionState, userMessage, onChunk) {
  const { candidate, mode, interviewerPersona, difficulty, questionHistory, transcript, sessionId } = sessionState;

  // Analyze user response for dynamic adaptation
  const responseAnalysis = analyzeUserResponse(userMessage, sessionState);
  
  // Get next question with adaptive difficulty
  const startTime = Date.now();
  const adaptedDifficulty = adaptDifficultyBasedOnResponse(responseAnalysis, difficulty);
  const nextQuestion = questionBankManager.getNextQuestion(
    sessionId || `temp_${Date.now()}`,
    candidate.domain,
    adaptedDifficulty
  );
  
  // Record performance metrics
  const generationTime = Date.now() - startTime;
  performanceMonitor.recordGenerationTime(generationTime);
  
  // Validate question quality
  if (!validateQuestion(nextQuestion)) {
    console.warn('Generated question failed validation:', nextQuestion);
  }

  const sessionStats = questionBankManager.getSessionStats(sessionId);
  const systemPrompt = `
${NEUROPREP_AI_SYSTEM_PROMPT}

Session Context:
- Candidate: ${candidate.level} ${candidate.domain}
- Current Question: ${sessionStats.totalQuestions + 1}
- Average Performance: ${responseAnalysis.performanceLevel}/10
- Adapted Difficulty: ${adaptedDifficulty}/10
- Topics Covered: ${Object.keys(sessionStats.topicCoverage).join(', ')}

Candidate's Last Response: "${userMessage}"
Response Analysis: ${responseAnalysis.analysis}

Task:
1. Provide specific Micro-Analysis based on their response quality
2. Ask this contextual follow-up: "${nextQuestion.text}"
3. Adapt your tone based on their confidence level

Format:
Micro-Analysis: [Specific feedback on their answer]

Next Question: ${nextQuestion.text}
`;

  if (openai) {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: systemPrompt }],
      stream: true,
    });
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) onChunk(content);
    }
  } else if (gemini) {
    const model = gemini.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContentStream(systemPrompt);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) onChunk(chunkText);
    }
  } else {
    // --- NeuroPrep AI Dynamic Response Engine ---
    
    const analysis = responseAnalysis.analysis;
    const performanceLevel = responseAnalysis.performanceLevel;
    const confidence = responseAnalysis.confidence;
    
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
    
    // Add performance context
    const questionCount = sessionStats.totalQuestions;
    if (questionCount > 5) {
        const avgDifficulty = sessionStats.averageDifficulty;
        microAnalysis += ` [Session Progress: ${questionCount} questions, avg difficulty ${avgDifficulty.toFixed(1)}/10]`;
    }
    
    // Simulate biometric feedback (mock)
    if (Math.random() > 0.6) {
        const biometrics = [
            "Neural activity optimal",
            "Stress levels within normal range",
            "Cognitive load balanced",
            "Focus patterns excellent",
            "Processing speed above average"
        ];
        microAnalysis += ` [Biometric: ${biometrics[Math.floor(Math.random() * biometrics.length)]}]`;
    }
    
    const response = `${microAnalysis}\n\nNext Question: ${nextQuestion.text}`;

    // Simulate realistic typing with variable speed
    for (let i = 0; i < response.length; i += Math.floor(Math.random() * 3) + 2) {
      const chunk = response.substr(i, Math.floor(Math.random() * 3) + 2);
      onChunk(chunk);
      await new Promise(r => setTimeout(r, Math.random() * 30 + 10));
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