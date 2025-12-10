import { generateProceduralQuestion, analyzeResponse, generateSessionInsights } from '../aiEngine.js';

jest.mock('openai', () => ({
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: '{"eqScore":8,"technicalScore":85,"authenticityScore":90,"feedback":"Excellent depth"}' } }]
        })
      }
    }
  }))
}));

describe('AI Engine - Adaptive Flow', () => {
  test('generates procedural question for specific role', () => {
    const result = generateProceduralQuestion('Software Engineer', 'Senior');
    
    expect(result.text).toBeDefined();
    expect(result.difficulty).toBe('Senior');
    expect(typeof result.id).toBe('string');
    // Ensure the question text contains reasonable keywords
    const keywords = ['Design', 'Debug', 'Implement', 'Analyze', 'Optimize', 'Secure'];
    const hasKeyword = keywords.some(k => result.text.includes(k));
    expect(hasKeyword).toBe(true);
  });

  test('generates distinct questions for different roles', () => {
    const swResult = generateProceduralQuestion('Software Engineer', 'Senior');
    const civilResult = generateProceduralQuestion('Civil Engineer', 'Senior');
    
    expect(swResult.text).not.toBe(civilResult.text);
  });

  test('analyzes response with scoring logic', async () => {
    const analysis = await analyzeResponse(
      'To scale neural nets, use gradient compression and pipeline parallelism because it reduces communicating overhead.',
      'How to scale neural nets?',
      { stressLevel: 5, responseTime: 120, keystrokes: 450 }
    );

    expect(analysis.technicalScore).toBeGreaterThanOrEqual(0);
    expect(analysis.technicalScore).toBeLessThanOrEqual(100);
    expect(analysis.eqScore).toBeGreaterThanOrEqual(0);
    expect(analysis.authenticityScore).toBeGreaterThanOrEqual(0);
    expect(analysis.cheatDetected).toBe(false);
  });

  test('detects potential cheating (low keystrokes)', async () => {
    // fast paste
    const pastedResponse = 'This is a very long response that was definitely pasted because the keystroke count is way too low for this length.';
    const analysis = await analyzeResponse(pastedResponse, 'Test question', { keystrokes: 2 });

    expect(analysis.cheatDetected).toBe(true);
  });

  test('calculates session insights correctly', async () => {
    const mockScores = [
      { technicalScore: 90, eqScore: 80, authenticityScore: 85 },
      { technicalScore: 85, eqScore: 85, authenticityScore: 90 }
    ];

    const insights = await generateSessionInsights(mockScores, 'Software Engineer');
    
    expect(insights.recommendation).toBe('Hire'); // Avg > 75
    expect(insights.strengths).toContain('System Design');
    expect(insights.improvementPlan.length).toBeGreaterThan(0);
  });
  
  test('generates large number of unique questions (Parameter check)', () => {
      const generated = new Set();
      for (let i = 0; i < 1000; i++) {
          const q = generateProceduralQuestion('Software Engineer', 'Senior');
          generated.add(q.text);
      }
      // With the expanded arrays, collisions should be very low in 1000 samples
      expect(generated.size).toBeGreaterThan(900); 
  });
});
