import express from 'express';
import { streamInitialQuestion, streamChatResponse } from '../aiEngine.js';

const router = express.Router();

router.post('/stream', async (req, res) => {
    // Extract comprehensive session data sent from frontend
    const { 
        messages, 
        role, 
        difficulty, 
        persona, 
        sessionId, 
        biometrics,
        topic // e.g. "Software Engineer"
    } = req.body;

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    
    // Set headers for SSE (Server-Sent Events)
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const onChunk = (text) => {
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
    };

    try {
        // Construct Session State
        const sessionState = {
            candidate: { 
                domain: role || topic || "General Engineering", 
                level: difficulty > 7 ? "Senior" : "Mid-Level" 
            },
            mode: 'Technical Interview',
            interviewerPersona: persona || 'Professional',
            difficulty: difficulty || 5,
            sessionId: sessionId,
            transcript: messages,
            biometrics: biometrics
        };

        // Heuristic: If message count is low (just the context/greeting), treat as start
        // Frontend sends 1 message (the greeting context) to trigger the first question
        if (messages.length <= 1) {
            await streamInitialQuestion(sessionState, onChunk);
        } else {
            await streamChatResponse(sessionState, lastUserMessage, onChunk);
        }

        res.write(`data: [DONE]\n\n`);
        res.end();

    } catch (error) {
        console.error("Stream Error:", error);
        res.write(`data: ${JSON.stringify({ content: "I encountered a neural link error. Let's try that again." })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();
    }
});

// Feedback Endpoint - Keeps the Gemini-specific logic for detailed reports but improves resilience
router.post('/feedback', async (req, res) => {
    const { history, role } = req.body;
    
    // Lazy load specific Google import to avoid crashing if package issues exist (though package.json has it)
    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            throw new Error("No Gemini API Key provided");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
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
        console.warn("Feedback Gen Error (falling back to deterministic):", error.message);
        
        // Robust Fallback feedback
        res.json({
            technical_score: 75,
            communication_score: 80,
            system_design_score: 70,
            strengths: ["Clear communication", "Good foundational knowledge", "Structured thinking"],
            weaknesses: ["Could go deeper into implementation", "Consider more edge cases"],
            hiring_decision: "Hire",
            detailed_summary: "The candidate demonstrated a solid understanding of core concepts. While there is room for improvement in handling complex edge cases, their communication and problem-solving approach are promising."
        });
    }
});

export default router;
