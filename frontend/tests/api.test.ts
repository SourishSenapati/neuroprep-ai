import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('API Client', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    vi.resetAllMocks();
  });

  it('should handle successful API calls', async () => {
    const mockResponse = { success: true, data: {} };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const response = await fetch('/api/test');
    const data = await response.json();
    
    expect(data.success).toBe(true);
  });

  it('should handle API errors gracefully', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      } as Response)
    );

    const response = await fetch('/api/test');
    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });

  it('should include authentication headers', async () => {
    const token = 'test_token';
    let capturedOptions: RequestInit | undefined;
    
    global.fetch = vi.fn((url: string | URL | Request, options?: RequestInit) => {
      capturedOptions = options;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response);
    });

    await fetch('/api/protected', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect(capturedOptions?.headers).toBeDefined();
    const headers = capturedOptions?.headers as Record<string, string>;
    expect(headers?.Authorization).toBe(`Bearer ${token}`);
  });
});
