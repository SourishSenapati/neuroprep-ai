import { z } from 'zod';
export const startSessionSchema = z.object({
    userId: z.string().min(1),
    mode: z.enum(['standard', 'caltech-phd', 'mit-ai'])
});
export const interviewResponseSchema = z.object({
    sessionId: z.string(),
    response: z.string().min(10),
    questionContext: z.string(),
    biometrics: z.object({
        stressLevel: z.number().min(0).max(10),
        responseTime: z.number().positive(),
        keystrokes: z.number().nonnegative(),
        heartRate: z.number().optional()
    })
});
export const endSessionSchema = z.object({
    sessionId: z.string()
});
export const biometricsSchema = z.object({
    sessionId: z.string(),
    stressLevel: z.number().min(0).max(10),
    heartRate: z.number().optional()
});
