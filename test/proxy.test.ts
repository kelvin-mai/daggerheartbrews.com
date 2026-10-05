// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('better-auth/cookies', () => ({
  getSessionCookie: vi.fn(),
}));

import { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

import { proxy } from '@/proxy';

const request = (path: string) =>
  new NextRequest(new URL(path, 'http://localhost:3000'));

describe('proxy', () => {
  beforeEach(() => {
    vi.mocked(getSessionCookie).mockReturnValue('session-token');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  describe('outside development', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'production');
    });

    it('rewrites /admin to a 404 without checking the session', async () => {
      const res = await proxy(request('/admin'));

      expect(res.status).toBe(404);
      expect(res.headers.get('x-middleware-rewrite')).toBe(
        'http://localhost:3000/404',
      );
      expect(getSessionCookie).not.toHaveBeenCalled();
    });

    it('rewrites nested admin paths to a 404', async () => {
      const res = await proxy(request('/admin/users'));

      expect(res.status).toBe(404);
    });

    it('still lets signed-in users through to profile routes', async () => {
      const res = await proxy(request('/profile/homebrew'));

      expect(res.headers.get('x-middleware-next')).toBe('1');
    });

    it('redirects signed-out users on profile routes to /login', async () => {
      vi.mocked(getSessionCookie).mockReturnValue(null);

      const res = await proxy(request('/profile'));

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/login');
    });
  });

  describe('in development', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'development');
    });

    it('lets signed-in users through to /admin', async () => {
      const res = await proxy(request('/admin'));

      expect(res.headers.get('x-middleware-next')).toBe('1');
    });

    it('redirects signed-out users on /admin to /login', async () => {
      vi.mocked(getSessionCookie).mockReturnValue(null);

      const res = await proxy(request('/admin/inbox'));

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/login');
    });
  });
});
