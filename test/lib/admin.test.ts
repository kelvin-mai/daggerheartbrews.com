import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

const envMock = vi.hoisted(() => ({
  env: { ADMIN_USER_EMAIL: 'admin@test.com' as string | undefined },
}));
vi.mock('@/lib/env', () => envMock);

import { headers } from 'next/headers';

import { isAdmin, isDevelopment } from '@/lib/admin';
import { auth } from '@/lib/auth';

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;

const sessionFor = (email: string) =>
  ({ user: { id: 'u1', email } }) as unknown as GetSessionResult;

describe('isDevelopment', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ['production', false],
    ['test', false],
    ['development', true],
  ])('NODE_ENV=%s returns %s', (nodeEnv, expected) => {
    vi.stubEnv('NODE_ENV', nodeEnv);
    expect(isDevelopment()).toBe(expected);
  });
});

describe('isAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    envMock.env.ADMIN_USER_EMAIL = 'admin@test.com';
    vi.stubEnv('NODE_ENV', 'development');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each(['production', 'test'])(
    'returns false in %s without reading headers or session',
    async (nodeEnv) => {
      vi.stubEnv('NODE_ENV', nodeEnv);
      vi.mocked(auth.api.getSession).mockResolvedValue(
        sessionFor('admin@test.com'),
      );

      expect(await isAdmin()).toBe(false);
      expect(auth.api.getSession).not.toHaveBeenCalled();
      expect(headers).not.toHaveBeenCalled();
    },
  );

  it('returns false in development with no session', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);
    expect(await isAdmin()).toBe(false);
  });

  it('returns false in development for a non-admin email', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(
      sessionFor('user@test.com'),
    );
    expect(await isAdmin()).toBe(false);
  });

  it('returns false in development when ADMIN_USER_EMAIL is unset', async () => {
    envMock.env.ADMIN_USER_EMAIL = undefined;
    vi.mocked(auth.api.getSession).mockResolvedValue(
      sessionFor('admin@test.com'),
    );
    expect(await isAdmin()).toBe(false);
  });

  it('returns true in development for the admin email', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(
      sessionFor('admin@test.com'),
    );
    expect(await isAdmin()).toBe(true);
    expect(auth.api.getSession).toHaveBeenCalledTimes(1);
  });
});
