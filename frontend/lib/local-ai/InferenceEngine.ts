
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
        let bestMatch = 'generic'; // Default match
        let maxScore = -1; // Score determines confidence

        // 0. Init Pipeline if not ready (Lazy Load)
        if (!this.isInitialized || !this.pipe) {
             await this.init();
        }

        // 1. Semantic Analysis (Neural)
        if (this.isInitialized && this.pipe) {
             try {
                // Generate embedding for user input
                const output = await this.pipe(userInput, { pooling: 'mean', normalize: true });
                const userEmbedding = Array.from(output.data) as number[];

                // Compare against concept embeddings (We generate them on the fly for this lightweight demo)
                // In production, these would be pre-calculated in KnowledgeBase
                for (const [key, data] of Object.entries(INTERVIEW_CONCEPTS)) {
                     // Check similarity with the concept content/description patterns
                     // We take the first pattern as the "centroid" representation for speed
                     const conceptText = data.patterns.join(' '); 
                     const conceptOutput = await this.pipe(conceptText, { pooling: 'mean', normalize: true });
                     const conceptEmbedding = Array.from(conceptOutput.data) as number[];

                     const similarity = this.cosineSimilarity(userEmbedding, conceptEmbedding);
                     
                     // Boost score if direct keywords match
                     const keywordBoost = data.patterns.some(p => lowerInput.includes(p)) ? 0.3 : 0;
                     const finalScore = similarity + keywordBoost;

                     if (finalScore > maxScore) {
                         maxScore = finalScore;
                         bestMatch = key;
                     }
                }
             } catch (neuralError) {
                 console.warn("Neural inference hiccup, falling back to symbolic:", neuralError);
                 // Fallthrough to keyword matching
             }
        }

        // 2. Fallback: Keyword Overlap Score (Symbolic)
        if (maxScore < 0.2) { // logic if neural failed or confidence low
            let maxKeywordScore = 0;
            for (const [key, data] of Object.entries(INTERVIEW_CONCEPTS)) {
                let score = 0;
                data.patterns.forEach(pattern => {
                    if (lowerInput.includes(pattern)) score += 1;
                });
                
                if (score > maxKeywordScore) {
                    maxKeywordScore = score;
                    bestMatch = key;
                }
            }
        }

        // Construct Response
        const ConceptData = INTERVIEW_CONCEPTS[bestMatch] || INTERVIEW_CONCEPTS['generic'];
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
