'use client';

// Auth Guardian - Client-side authenticity checking

export function calculateEntropy(text: string): number {
  if (!text || text.length === 0) return 0;

  const freq: { [key: string]: number } = {};
  for (const char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }

  let entropy = 0;
  const len = text.length;

  for (const char in freq) {
    const p = freq[char] / len;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

export function detectAIPatterns(text: string): {
  isAI: boolean;
  confidence: number;
  flags: string[];
} {
  const flags: string[] = [];
  let aiScore = 0;

  // Pattern 1: Generic LLM phrases
  const llmPhrases = [
    /\bfurthermore\b/gi,
    /\bmoreover\b/gi,
    /\bin conclusion\b/gi,
    /\bit is important to note\b/gi,
    /\bit's worth noting\b/gi,
    /\badditionally\b/gi,
    /\bnevertheless\b/gi,
    /\bconsequently\b/gi
  ];

  llmPhrases.forEach(pattern => {
    if (pattern.test(text)) {
      aiScore += 0.15;
      flags.push('Generic LLM phrase detected');
    }
  });

  // Pattern 2: Overly formal structure
  const formalPatterns = [
    /^(Firstly|Secondly|Thirdly|Finally),/gm,
    /\bIn summary,\b/gi,
    /\bTo summarize,\b/gi
  ];

  formalPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      aiScore += 0.1;
      flags.push('Overly formal structure');
    }
  });

  // Pattern 3: Lack of personal pronouns
  const personalPronouns = /\b(I|my|me|I'm|I've)\b/gi;
  const pronounCount = (text.match(personalPronouns) || []).length;
  const wordCount = text.split(/\s+/).length;

  if (wordCount > 50 && pronounCount < 2) {
    aiScore += 0.2;
    flags.push('Lack of personal voice');
  }

  // Pattern 4: Perfect grammar (no typos)
  if (wordCount > 100 && !/\b(teh|hte|adn|taht|waht)\b/i.test(text)) {
    aiScore += 0.1;
    flags.push('Suspiciously perfect grammar');
  }

  // Pattern 5: Entropy check
  const entropy = calculateEntropy(text);
  const normalizedEntropy = entropy / Math.log2(256); // Normalize to 0-1

  if (normalizedEntropy < 0.5 && wordCount > 50) {
    aiScore += 0.25;
    flags.push(`Low entropy (${normalizedEntropy.toFixed(2)})`);
  }

  const confidence = Math.min(1, aiScore);
  const isAI = confidence > 0.5;

  return { isAI, confidence, flags };
}

export function analyzeResponseAuthenticity(response: string, timeSpent: number): {
  authentic: boolean;
  score: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let authenticityScore = 1.0;

  // Check 1: AI patterns
  const aiCheck = detectAIPatterns(response);
  if (aiCheck.isAI) {
    authenticityScore -= aiCheck.confidence * 0.5;
    reasons.push(...aiCheck.flags);
  }

  // Check 2: Response time vs length
  const wordCount = response.split(/\s+/).length;
  const expectedTime = wordCount * 2; // 2 seconds per word (typing + thinking)

  if (timeSpent < expectedTime * 0.3) {
    authenticityScore -= 0.3;
    reasons.push('Response too fast for length');
  }

  // Check 3: Copy-paste detection (perfect formatting)
  if (/```[\s\S]*```/.test(response) && wordCount > 100) {
    authenticityScore -= 0.2;
    reasons.push('Code block formatting suggests copy-paste');
  }

  // Check 4: Entropy
  const entropy = calculateEntropy(response);
  if (entropy < 3.5 && wordCount > 50) {
    authenticityScore -= 0.2;
    reasons.push('Low text entropy');
  }

  authenticityScore = Math.max(0, Math.min(1, authenticityScore));

  return {
    authentic: authenticityScore > 0.6,
    score: authenticityScore,
    reasons
  };
}
