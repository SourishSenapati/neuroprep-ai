import express from 'express';
const router = express.Router();

import { GoogleGenerativeAI } from "@google/generative-ai";

const KNOWLEDGE_GRAPH = {
    'logic-precision': { // Formerly TCS/Data
        concepts: ['Bayesian Inference', 'Combinatorics', 'Graph Theory', 'Bit Manipulation'], 
        depths: {
            'Combinatorics': ['Pigeonhole Principle', 'Permutations vs Combinations', 'Derangements'],
            'Graph Theory': ['Dijkstra', 'A*', 'Minimum Spanning Trees', 'Topological Sort']
        }
    },
    'complexity-decoded': { // Formerly Infosys/System Design
         concepts: ['Distributed Transactions', 'Event Sourcing', 'CQRS', 'Consistent Hashing'],
         depths: {
             'Distributed Transactions': ['2PC', 'SAGA Pattern', 'TCC'],
             'Consistent Hashing': ['Virtual Nodes', 'Replication Factor', 'Chord Ring']
         }
    },
    'total-versatility': { // Product/General
        concepts: ['Design Patterns', 'SOLID Principles', 'Microservices', 'Clean Architecture'],
        depths: {
            'Design Patterns': ['Singleton', 'Factory', 'Observer', 'Strategy'],
            'Microservices': ['Service Discovery', 'Circuit Breaker', 'API Gateway']
        }
    }
};

// sophisticated "AI" logic without external dependency
function generateAIResponse(history, role, lastUserMessage) {
    const contextSize = history.length;
    const analysis = analyzeInput(lastUserMessage);
    
    // 2. Determine Interview Phase
    let phase = 'intro';
    if (contextSize > 2) phase = 'technical_screening';
    if (contextSize > 8) phase = 'deep_dive';
    if (contextSize > 15) phase = 'closing';

    let content = "";
    let type = "question";

    // 3. Generate Response
    if (analysis.isShort && phase !== 'intro') {
       content = `Your answer was quite concise ("${lastUserMessage.substring(0, 20)}..."). In a real interview, you'd want to calculate the trade-offs explicitly. Could you expand on the time complexity implications of your approach?`;
       type = 'probe';
    } else if (analysis.uncertainty > 0.6) {
       content = `That's a fair point to be unsure about. Let's reason from first principles. If we assume infinite horizontal scaling, what becomes the new bottleneck?`;
       type = 'guidance';
    } else {
        const topic = selectNextTopic(role, history);
        content = constructQuestion(topic, phase);
    }
    
    return { content, type };
}

function analyzeInput(text) {
    const lower = text.toLowerCase();
    return {
        length: text.length,
        isShort: text.length < 30,
        uncertainty: (lower.match(/don't know|unsure|guess|maybe|probably/g) || []).length / 5, 
        keywords: lower.match(/\b(scale|database|latency|cache|user|api|design|algorithm)\b/g) || []
    };
}

function selectNextTopic(role, history) {
    let graphKey = 'total-versatility';
    if (role?.toLowerCase().includes('logic')) graphKey = 'logic-precision';
    if (role?.toLowerCase().includes('complexity')) graphKey = 'complexity-decoded';

    const domain = KNOWLEDGE_GRAPH[graphKey] || KNOWLEDGE_GRAPH['total-versatility'];
    const concepts = domain.concepts;
    const index = history?.length ? history.length % concepts.length : 0;
    return concepts[index];
}

function constructQuestion(topic, phase) {
    const templates = [
        `Moving on to ${topic}. Can you explain how you would apply this concept to optimize a high-frequency trading engine?`,
        `Let's dive into ${topic}. What are the theoretical limits of this approach in a distributed environment?`,
        `Scenario: You are designing a system heavily reliant on ${topic}. How do you handle failure states?`,
        `Describe ${topic} to a non-technical stakeholder, focusing on business value.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
}

router.post('/stream', async (req, res) => {
    const { messages, role } = req.body;
    const lastUserMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, -1);

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    try {
        if (process.env.GEMINI_API_KEY) {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `
            You are an expert Senior Engineering Interviewer at a top tech company (FAANG level).
            Your Role: ${role}.
            Current Phase: ${history.length < 3 ? 'Intro' : 'Technical Deep Dive'}.
            
            Context: The user is a candidate. 
            History: ${JSON.stringify(history.map(m => m.content).join('\n'))}
            
            User's last Answer: "${lastUserMessage}"
            
            Task: 
            1. Analyze the user's answer for technical depth, correctness, and clarity.
            2. If the answer is weak, probe deeper.
            3. If the answer is good, move to a related advanced concept or a new topic from the domain of ${role}.
            4. Be professional, slightly challenging, but encouraging.
            5. Keep response under 100 words.
            
            Response:
            `;

            const result = await model.generateContentStream(prompt);
            
            // Stream the result
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
            }

        } else {
            // Fallback Logic
            const responseData = generateAIResponse(history, role, lastUserMessage);
            const text = responseData.content;
            
            let i = 0;
            // Simulate streaming at reading speed
            const interval = setInterval(() => {
                const chunk = text.slice(i, i + 5); 
                res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
                i += 5;
                
                if (i >= text.length) {
                    res.write(`data: [DONE]\n\n`);
                    clearInterval(interval);
                    res.end();
                }
            }, 20); 
            return; // Return so we don't hit the res.write below
        }
    } catch (error) {
        console.error("AI Generation Error:", error);
        // Emergency Fallback
        res.write(`data: ${JSON.stringify({ content: "I apologize, I'm processing a high volume of data. Let's continue. " + constructQuestion("Scalability", "recovery") })}\n\n`);
    }

    if (process.env.GEMINI_API_KEY) {
        res.write(`data: [DONE]\n\n`);
        res.end();
    }
});

router.post('/feedback', async (req, res) => {
    const { history, role } = req.body;
    
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.json({
                technical_score: 78,
                communication_score: 85,
                system_design_score: 70,
                strengths: ["Clear communication", "Good grasp of basics", "Polite demeanor"],
                weaknesses: ["Lacked depth in distributed systems", "Missed edge cases", "Could prove assertions with math"],
                hiring_decision: "Leaning No Hire",
                detailed_summary: "Candidate showed promise but lacked the senior-level depth required for this specific role. Recommended for a mid-level position. (Simulated Analysis - Add API Key for Real AI)"
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Act as a Bar Raiser Interviewer for a High-Level ${role} position.
        Analyze this interview transcript strictly:
        ${JSON.stringify(history)}

        Generate a detailed JSON feedback report following this exact schema:
        {
            "technical_score": (0-100 integer),
            "communication_score": (0-100 integer),
            "system_design_score": (0-100 integer),
            "strengths": ["point 1", "point 2", "point 3"],
            "weaknesses": ["point 1", "point 2", "point 3"],
            "hiring_decision": "Strong Hire" | "Hire" | "Leaning No Hire" | "No Hire",
            "detailed_summary": "A professional paragraph summarizing the candidate's performance, highlighting key moments."
        }
        Return ONLY valid JSON. Do not use Markdown code blocks.
        `;
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        res.json(JSON.parse(cleanJson));

    } catch (error) {
        console.error("Feedback Gen Error:", error);
        res.status(500).json({ error: "Feedback generation failed" });
    }
});

export default router;
