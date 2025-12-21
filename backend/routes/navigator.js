import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
const router = express.Router();

router.post('/', async (req, res) => {
    const { message } = req.body;
    try {
        const apiKey = process.env.GEMINI_API_KEY || 'AlzaSyAW-YXJ6P8TMUoKAlZwskSN9IXkryhwMzk';
        if (!apiKey) {
            return res.json({ 
                text: "I can help you navigate! (Note: Gemini API Key missing). Try 'Go to Dashboard'.", 
                action: message.toLowerCase().includes('dashboard') ? { type: 'navigate', path: '/dashboard' } : null 
            });
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `
        You are the 'NeuroPrep Navigator', a helpful high-tech assistant for the NeuroPrep AI Interviewer platform.
        User Input: "${message}"
        
        Capabilities:
        - Explain features (Mock Interviews, Mastery Paths, Resume Roast).
        - Navigate the user to specific pages.
        
        Site Map:
        - /dashboard : User Dashboard, Progress, History.
        - /pricing : Pricing, Pro Plan, Upgrade.
        - /interview/setup : Start a new interview, Select Role.
        - /login : Sign In / Register.
        - / : Home Page.
        
        Instructions:
        1. If text implies navigation (e.g., "I want to practice", "Go to charts"), set "action": { "type": "navigate", "path": "..." }.
        2. If text is a question about the app, answer it natively in "text".
        3. Keep "text" concise (under 50 words).
        4. Tone: Helpful, Professional, slightly futuristic.
        
        Output Schema (JSON Only):
        {
          "text": "string",
          "action": { "type": "navigate", "path": "/..." } | null
        }
        `;
        
        const result = await model.generateContent(prompt);
        const raw = result.response.text();
        const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const json = JSON.parse(jsonStr);
        
        res.json(json);
        
    } catch (e) {
        console.error("Navigator Error:", e);
        res.status(500).json({ text: "Navigation systems offline.", action: null });
    }
});

export default router;
