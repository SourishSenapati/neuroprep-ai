process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = 'sk-test-key';
process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

jest.setTimeout(10000);
