import { describe, it, expect, vi, afterEach } from 'vitest';
import { getBaseUrl } from '@/lib/utils/url';

describe('getBaseUrl', () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    globalThis.window = originalWindow;
    vi.unstubAllEnvs();
  });

  it('should return empty string in browser environment', () => {
    expect(getBaseUrl()).toBe('');
  });

  it('should return VERCEL_URL when on server with VERCEL_URL set', () => {
    // @ts-expect-error - simulating server environment
    delete globalThis.window;
    vi.stubEnv('VERCEL_URL', 'my-app.vercel.app');

    expect(getBaseUrl()).toBe('https://my-app.vercel.app');
  });

  it('should return localhost with PORT when on server without VERCEL_URL', () => {
    // @ts-expect-error - simulating server environment
    delete globalThis.window;
    vi.stubEnv('VERCEL_URL', '');
    vi.stubEnv('PORT', '4000');

    expect(getBaseUrl()).toBe('http://localhost:4000');
  });

  it('should default to port 3000 when PORT is not set', () => {
    // @ts-expect-error - simulating server environment
    delete globalThis.window;
    vi.stubEnv('VERCEL_URL', '');
    delete process.env.PORT;

    expect(getBaseUrl()).toBe('http://localhost:3000');
  });
});
