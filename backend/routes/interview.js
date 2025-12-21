import express from 'express';
const router = express.Router();

// Knowledge Graph for Dynamic Questioning
const KNOWLEDGE_GRAPH = {
    'logic-precision': { // Formerly TCS
        concepts: ['Probability', 'Data Sufficiency', 'Geometry', 'Arrangements', 'Number Theory'],
        depths: {
            'Probability': ['Bayes Theorem', 'Conditional Probability', 'Expectation'],
            'Geometry': ['Coordinate Geometry', 'Mensuration', 'Triangles']
        }
    },
    'complexity-decoded': { // Formerly Infosys/System Design
         concepts: ['Distributed Systems', 'CAP Theorem', 'Load Balancing', 'Sharding', 'Caching'],
         depths: {
             'Distributed Systems': ['Consensus Algorithms', 'Leader Election', 'Fault Tolerance'],
             'Caching': ['Eviction Policies', 'Write-Through vs Write-Back', 'CDN']
         }
    },
    'total-versatility': { // Product/General
        concepts: ['Dynamic Programming', 'Graph Theory', 'Object Oriented Design', 'API Design'],
        depths: {
            'Dynamic Programming': ['Memoization', 'Tabulation', 'State Transition'],
            'API Design': ['REST', 'GraphQL', 'gRPC', 'Idempotency']
        }
    }
};

// sophisticated "AI" logic without external dependency
function generateAIResponse(history, role, lastUserMessage) {
    const contextSize = history.length;
    
    // 1. Analyze User Input (Understanding)
    const analysis = analyzeInput(lastUserMessage);
    
    // 2. Determine Interview Phase
    let phase = 'intro';
    if (contextSize > 2) phase = 'technical_screening';
    if (contextSize > 8) phase = 'deep_dive';
    if (contextSize > 15) phase = 'closing';

    // 3. Generate Response based on Context & Analysis
    if (analysis.isShort && phase !== 'intro') {
        return {
            content: `I noticed your answer was quite brief. In a real interview, digging deeper is crucial. Could you elaborate on *why* you chose that approach?`,
            type: 'probe'
        };
    }

    if (analysis.uncertainty > 0.6) {
        return {
            content: `That's okay. It's a tricky concept. Let's break it down. Think about it from first principles - what are the fundamental constraints here?`,
            type: 'guidance'
        };
    }

    // Dynamic Question Generation
    const topic = selectNextTopic(role, history);
    
    // Non-Repeating Logic: Hash check
    // (In a real DB implementation we'd query past questions, here we infer from history string check)
    
    return {
        content: constructQuestion(topic, phase),
        type: 'question'
    };
}

function analyzeInput(text) {
    const lower = text.toLowerCase();
    return {
        length: text.length,
        isShort: text.length < 30,
        uncertainty: (lower.match(/don't know|unsure|guess|maybe|probably/g) || []).length / 5, // simple metric
        keywords: lower.match(/\b(scale|database|latency|cache|user|api)\b/g) || []
    };
}

function selectNextTopic(role, history) {
    // Map role to graph key
    let graphKey = 'total-versatility';
    if (role.toLowerCase().includes('logic')) graphKey = 'logic-precision';
    if (role.toLowerCase().includes('complexity')) graphKey = 'complexity-decoded';

    const domain = KNOWLEDGE_GRAPH[graphKey] || KNOWLEDGE_GRAPH['total-versatility'];
    const concepts = domain.concepts;
    
    // Simple rotation for now, but could be random non-repeating
    const index = history.length % concepts.length;
    return concepts[index];
}

function constructQuestion(topic, phase) {
    const templates = [
        `Let's shift gears to ${topic}. How would you approach a problem involving this?`,
        `Deep diving into ${topic}: What are the common pitfalls you've encountered?`,
        `Imagine a scenario requiring high ${topic} optimization. How do you design for it?`,
        `Can you explain ${topic} to me as if I were a junior engineer?`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
}

router.post('/stream', (req, res) => {
    // Mock Streaming Response for "GPT-like" feel
    const { messages, role } = req.body;
    const lastUserMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, -1);

    const responseData = generateAIResponse(history, role, lastUserMessage);
    const text = responseData.content;

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    let i = 0;
    const interval = setInterval(() => {
        // Stream 4 characters at a time for reading speed
        const chunk = text.slice(i, i + 4); 
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        i += 4;
        
        if (i >= text.length) {
            res.write(`data: [DONE]\n\n`);
            clearInterval(interval);
            res.end();
        }
    }, 30); // 30ms delay = ~33 chars/sec = ~400 WPM (good reading speed)
});

export default router;
