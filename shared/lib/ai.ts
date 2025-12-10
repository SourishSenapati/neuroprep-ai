/**
 * Shared AI utilities for adaptive prompting and model configuration
 */

export interface AdaptivePromptConfig {
  stressLevel: number;
  difficulty: number;
  topic: string;
  category: 'quantum' | 'ml' | 'algorithms' | 'physics';
}

export interface ModelConfig {
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-opus' | 'claude-3-sonnet';
  temperature: number;
  maxTokens: number;
  topP?: number;
}

/**
 * Generate adaptive system prompt based on stress level and difficulty
 */
export function generateAdaptiveSystemPrompt(config: AdaptivePromptConfig): string {
  const { stressLevel, difficulty, topic, category } = config;
  
  const basePrompt = `You are an elite technical interviewer from MIT/Caltech conducting a PhD-level interview.`;
  
  // Stress-based adaptation
  let stressGuidance = '';
  if (stressLevel > 7) {
    stressGuidance = `
IMPORTANT: The candidate is experiencing high stress (${stressLevel}/10). 
- Start with fundamental concepts and build up gradually
- Use clear analogies and real-world examples
- Break down complex ideas into digestible steps
- Provide encouragement and positive reinforcement
- If they struggle, offer hints before full explanations`;
  } else if (stressLevel > 4) {
    stressGuidance = `
The candidate is moderately stressed (${stressLevel}/10).
- Balance technical rigor with clarity
- Provide structured explanations
- Use examples when introducing new concepts
- Allow time for the candidate to think through problems`;
  } else {
    stressGuidance = `
The candidate is confident (${stressLevel}/10).
- Challenge them with advanced concepts and edge cases
- Expect rigorous mathematical derivations
- Probe deeper into theoretical foundations
- Ask follow-up questions that test understanding limits`;
  }
  
  // Category-specific guidance
  const categoryGuidance = getCategoryGuidance(category);
  
  return `${basePrompt}

${stressGuidance}

Topic: ${topic}
Category: ${category}
Target Difficulty: ${difficulty}/10

${categoryGuidance}

Remember: Adapt your questioning style based on the candidate's responses. If they demonstrate strong understanding, increase complexity. If they struggle, provide scaffolding.`;
}

function getCategoryGuidance(category: string): string {
  const guidance: Record<string, string> = {
    quantum: `Focus on:
- Quantum mechanics fundamentals (superposition, entanglement, measurement)
- Mathematical formalism (Hilbert spaces, operators, density matrices)
- Applications (quantum computing, cryptography, teleportation)
- Experimental implications and Bell inequalities`,
    
    ml: `Focus on:
- Deep learning architectures (transformers, CNNs, RNNs)
- Optimization algorithms and convergence properties
- Theoretical foundations (PAC learning, VC dimension)
- Practical considerations (regularization, generalization)`,
    
    algorithms: `Focus on:
- Time and space complexity analysis
- Algorithm design paradigms (DP, greedy, divide-and-conquer)
- Data structures and their trade-offs
- Proof techniques and correctness arguments`,
    
    physics: `Focus on:
- Classical mechanics and Lagrangian formalism
- Electromagnetism and field theory
- Statistical mechanics and thermodynamics
- General relativity and spacetime geometry`
  };
  
  return guidance[category] || guidance.quantum;
}

/**
 * Get optimal model configuration based on use case
 */
export function getModelConfig(useCase: 'interview' | 'explanation' | 'evaluation'): ModelConfig {
  const configs: Record<string, ModelConfig> = {
    interview: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      topP: 0.9
    },
    explanation: {
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 3000,
      topP: 0.85
    },
    evaluation: {
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 1500,
      topP: 0.8
    }
  };
  
  return configs[useCase];
}

/**
 * Calculate adaptive difficulty adjustment
 */
export function calculateDifficultyAdjustment(
  currentDifficulty: number,
  stressLevel: number,
  performanceScore: number
): number {
  let adjustment = 0;
  
  if (stressLevel > 7) {
    adjustment -= 2;
  } else if (stressLevel > 5) {
    adjustment -= 1;
  } else if (stressLevel < 3) {
    adjustment += 1;
  }
  
  if (performanceScore > 80) {
    adjustment += 1;
  } else if (performanceScore < 40) {
    adjustment -= 1;
  }
  
  return Math.max(1, Math.min(10, currentDifficulty + adjustment));
}

export default {
  generateAdaptiveSystemPrompt,
  getModelConfig,
  calculateDifficultyAdjustment
};
