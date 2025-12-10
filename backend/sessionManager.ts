import Redis from 'ioredis';

interface SessionData {
  userId: string;
  mode: string;
  startTime: number;
  questions: Array<{ question: string; response: string; timestamp: number }>;
  scores: Array<{ eqScore: number; technicalScore: number; authenticityScore: number }>;
  biometrics: Array<{ stressLevel: number; responseTime: number; timestamp: number }>;
  flags: string[];
}

export class SessionManager {
  private redis: Redis | null;
  private sessions: Map<string, SessionData> = new Map();

  constructor(redisUrl?: string) {
    this.redis = redisUrl ? new Redis(redisUrl) : null;
  }

  async createSession(sessionId: string, userId: string, mode: string): Promise<void> {
    const sessionData: SessionData = {
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
      await this.redis.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        'EX',
        7200 // 2 hours
      );
    }
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    if (this.sessions.has(sessionId)) {
      return this.sessions.get(sessionId)!;
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

  async updateSession(sessionId: string, updates: Partial<SessionData>): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    Object.assign(session, updates);
    this.sessions.set(sessionId, session);

    if (this.redis) {
      await this.redis.set(
        `session:${sessionId}`,
        JSON.stringify(session),
        'EX',
        7200
      );
    }
  }

  async addResponse(
    sessionId: string,
    question: string,
    response: string,
    scores: { eqScore: number; technicalScore: number; authenticityScore: number },
    biometrics: { stressLevel: number; responseTime: number }
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    session.questions.push({ question, response, timestamp: Date.now() });
    session.scores.push(scores);
    session.biometrics.push({ ...biometrics, timestamp: Date.now() });

    await this.updateSession(sessionId, session);
  }

  async flagSession(sessionId: string, flag: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    session.flags.push(flag);
    await this.updateSession(sessionId, session);
  }

  async endSession(sessionId: string): Promise<SessionData> {
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    this.sessions.delete(sessionId);

    if (this.redis) {
      await this.redis.del(`session:${sessionId}`);
    }

    return session;
  }

  async publishEvent(channel: string, event: any): Promise<void> {
    if (this.redis) {
      await this.redis.publish(channel, JSON.stringify(event));
    }
  }
}
