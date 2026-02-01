
import { pipeline, env } from '@xenova/transformers';
import { INTERVIEW_CONCEPTS, SYSTEM_PROMPTS } from './KnowledgeBase';

// Skip local model checks if needed (optional config)
// env.allowLocalModels = false; 

/**
 * LocalInferenceEngine
 * 
 * A browser-based AI core that uses Transformer.js to run 
 * semantic analysis and text generation directly in the client.
 * 
 * Capabilities:
 * 1. Semantic Classification (Zero-Shot or Embedding Similarity)
 * 2. Response Generation (Retrieval Augmented)
 */
export class LocalInferenceEngine {
    private static instance: LocalInferenceEngine;
    private pipe: any = null;
    private isInitialized = false;
    private modelStatus = 'idle'; // idle, loading, ready, error

    private constructor() {}

    static getInstance(): LocalInferenceEngine {
        if (!LocalInferenceEngine.instance) {
            LocalInferenceEngine.instance = new LocalInferenceEngine();
        }
        return LocalInferenceEngine.instance;
    }

    /**
     * Initialize the local model (Feature Extraction for Similarity)
     * We use 'all-MiniLM-L6-v2' (approx 45MB) - very light and fast.
     */
    async init() {
        if (this.isInitialized) return;
        
        try {
            this.modelStatus = 'loading';
            console.log("Loading Local Neural Core [all-MiniLM-L6-v2]...");
            
            // Feature extraction pipeline for semantic similarity
            this.pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            
            this.isInitialized = true;
            this.modelStatus = 'ready';
            console.log("Local Neural Core Online.");
        } catch (error) {
            console.error("Failed to load Local Neural Core:", error);
            this.modelStatus = 'error';
        }
    }

    /**
     * Calculate Cosine Similarity
     */
    private cosineSimilarity(v1: number[], v2: number[]) {
        let dot = 0;
        let mag1 = 0;
        let mag2 = 0;
        for (let i = 0; i < v1.length; i++) {
            dot += v1[i] * v2[i];
            mag1 += v1[i] * v1[i];
            mag2 += v2[i] * v2[i];
        }
        return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
    }

    /**
     * Generate a response based on user input
     * Uses Hybrid Strategy: Keyword Matching + (Optional) Semantic Similarity
     */
    async generateResponse(userInput: string, role: string): Promise<string> {
        // Quick Heuristic Check (Fast Path)
        const lowerInput = userInput.toLowerCase();
        
        // Find best matching concept
        let bestMatch = 'generic';
        let maxScore = 0;

        // 1. Keyword Overlap Score (Simple & Robust)
        for (const [key, data] of Object.entries(INTERVIEW_CONCEPTS)) {
             let score = 0;
             data.patterns.forEach(pattern => {
                 if (lowerInput.includes(pattern)) score += 1;
             });
             
             if (score > maxScore) {
                 maxScore = score;
                 bestMatch = key;
             }
        }

        // 2. Semantic Refinement (If model is loaded)
        // Note: For this simplified implementation, we rely on the strong keyword baseline
        // because running embedding calculation on every keystroke/message might be heavy depending on device.
        // If we wanted to use the model:
        /*
        if (this.isInitialized && this.pipe) {
            const output = await this.pipe(userInput, { pooling: 'mean', normalize: true });
            const userEmbedding = output.data;
            // Compare against pre-computed embeddings of concepts...
        }
        */

        // Construct Response
        const ConceptData = INTERVIEW_CONCEPTS[bestMatch];
        const responseTemplate = ConceptData.responses[Math.floor(Math.random() * ConceptData.responses.length)];
        const questionTemplate = ConceptData.followups[Math.floor(Math.random() * ConceptData.followups.length)];

        // Simulate "Thinking" delay for natural feel
        const delay = Math.max(1000, userInput.length * 20); 
        await new Promise(r => setTimeout(r, delay));

        return `${responseTemplate} ${questionTemplate}`;
    }

    getStatus() {
        return this.modelStatus;
    }
}
