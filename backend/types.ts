export interface SessionData {
  userId: string;
  mode: 'standard' | 'caltech-phd' | 'mit-ai';
  startTime: number;
  questions: Array<{
    question: string;
    response: string;
    timestamp: number;
  }>;
  scores: Array<{
    eqScore: number;
    technicalScore: number;
    authenticityScore: number;
  }>;
  biometrics: Array<{
    stressLevel: number;
    responseTime: number;
    timestamp: number;
  }>;
  flags: string[];
}

export interface AnalysisResult {
  eqScore: number;
  authenticityScore: number;
  technicalScore: number;
  adaptationNeeded: boolean;
  feedback: string;
  cheatDetected: boolean;
}

export interface Biometrics {
  stressLevel: number;
  responseTime: number;
  keystrokes: number;
  heartRate?: number;
}

export interface KnowledgeDoc {
  id: string;
  content: string;
  topic: string;
  source: string;
}
