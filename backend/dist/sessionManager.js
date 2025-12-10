import Redis from 'ioredis';
export class SessionManager {
    constructor(redisUrl) {
        this.sessions = new Map();
        this.redis = redisUrl ? new Redis(redisUrl) : null;
    }
    async createSession(sessionId, userId, mode) {
        const sessionData = {
            userId,
            mode,
            startTime: Date.now(),
            questions: [],
            scores: [],
            biometrics: [],
            flags: []
        };
        this.sessions.set(sessionId, sessionData);
        if (this.redis) {
            await this.redis.set(`session:${sessionId}`, JSON.stringify(sessionData), 'EX', 7200 // 2 hours
            );
        }
    }
    async getSession(sessionId) {
        if (this.sessions.has(sessionId)) {
            return this.sessions.get(sessionId);
        }
        if (this.redis) {
            const data = await this.redis.get(`session:${sessionId}`);
            if (data) {
                const sessionData = JSON.parse(data);
                this.sessions.set(sessionId, sessionData);
                return sessionData;
            }
        }
        return null;
    }
    async updateSession(sessionId, updates) {
        const session = await this.getSession(sessionId);
        if (!session)
            throw new Error('Session not found');
        Object.assign(session, updates);
        this.sessions.set(sessionId, session);
        if (this.redis) {
            await this.redis.set(`session:${sessionId}`, JSON.stringify(session), 'EX', 7200);
        }
    }
    async addResponse(sessionId, question, response, scores, biometrics) {
        const session = await this.getSession(sessionId);
        if (!session)
            throw new Error('Session not found');
        session.questions.push({ question, response, timestamp: Date.now() });
        session.scores.push(scores);
        session.biometrics.push({ ...biometrics, timestamp: Date.now() });
        await this.updateSession(sessionId, session);
    }
    async flagSession(sessionId, flag) {
        const session = await this.getSession(sessionId);
        if (!session)
            throw new Error('Session not found');
        session.flags.push(flag);
        await this.updateSession(sessionId, session);
    }
    async endSession(sessionId) {
        const session = await this.getSession(sessionId);
        if (!session)
            throw new Error('Session not found');
        this.sessions.delete(sessionId);
        if (this.redis) {
            await this.redis.del(`session:${sessionId}`);
        }
        return session;
    }
    async publishEvent(channel, event) {
        if (this.redis) {
            await this.redis.publish(channel, JSON.stringify(event));
        }
    }
}
