import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      signInEmail: vi.fn(),
      signUpEmail: vi.fn(),
    },
  },
}));

import { login, register } from '@/actions/auth';
import { auth } from '@/lib/auth';

type SignInResult = Awaited<ReturnType<typeof auth.api.signInEmail>>;
type SignUpResult = Awaited<ReturnType<typeof auth.api.signUpEmail>>;

const makeFormData = (fields: Record<string, string>) => {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
};

describe('auth/login', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns validation error for invalid email', async () => {
    const result = await login(
      { success: false },
      makeFormData({ email: 'not-an-email', password: 'password123' }),
    );
    expect(result.success).toBe(false);
    expect(result.errors?.validation?.email).toBeDefined();
  });

  it('returns validation error for short password', async () => {
    const result = await login(
      { success: false },
      makeFormData({ email: 'user@example.com', password: 'short' }),
    );
    expect(result.success).toBe(false);
    expect(result.errors?.validation?.password).toBeDefined();
  });

  it('returns validation error for password exceeding max length', async () => {
    const result = await login(
      { success: false },
      makeFormData({ email: 'user@example.com', password: 'a'.repeat(129) }),
    );
    expect(result.success).toBe(false);
    expect(result.errors?.validation?.password).toBeDefined();
  });

  it('returns success on valid credentials', async () => {
    vi.mocked(auth.api.signInEmail).mockResolvedValueOnce(
      undefined as unknown as SignInResult,
    );
    const result = await login(
      { success: false },
      makeFormData({ email: 'user@example.com', password: 'password123' }),
    );
    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('returns action error when auth throws', async () => {
    vi.mocked(auth.api.signInEmail).mockRejectedValueOnce(
      new Error('Invalid credentials'),
    );
    const result = await login(
      { success: false },
      makeFormData({ email: 'user@example.com', password: 'password123' }),
    );
    expect(result.success).toBe(false);
    expect(result.errors?.action).toBe('Invalid credentials');
  });
});

describe('auth/register', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns validation error when passwords do not match', async () => {
    const result = await register(
      { success: false },
      makeFormData({
        name: 'Test User',
        email: 'user@example.com',
        password: 'password123',
        'confirm-password': 'different123',
      }),
    );
    expect(result.success).toBe(false);
    expect(result.errors?.validation?.confirmPassword).toBeDefined();
  });

  it('returns validation error for missing name', async () => {
    const result = await register(
      { success: false },
      makeFormData({
        name: '',
        email: 'user@example.com',
        password: 'password123',
        'confirm-password': 'password123',
      }),
    );
    expect(result.success).toBe(false);
    expect(result.errors?.validation?.name).toBeDefined();
  });

  it('returns validation error for invalid email', async () => {
    const result = await register(
      { success: false },
      makeFormData({
        name: 'Test User',
        email: 'bad-email',
        password: 'password123',
        'confirm-password': 'password123',
      }),
    );
    expect(result.success).toBe(false);
    expect(result.errors?.validation?.email).toBeDefined();
  });

  it('returns success on valid registration', async () => {
    vi.mocked(auth.api.signUpEmail).mockResolvedValueOnce(
      undefined as unknown as SignUpResult,
    );
    const result = await register(
      { success: false },
      makeFormData({
        name: 'Test User',
        email: 'user@example.com',
        password: 'password123',
        'confirm-password': 'password123',
      }),
    );
    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('returns action error when auth throws', async () => {
    vi.mocked(auth.api.signUpEmail).mockRejectedValueOnce(
      new Error('Email already exists'),
    );
    const result = await register(
      { success: false },
      makeFormData({
        name: 'Test User',
        email: 'user@example.com',
        password: 'password123',
        'confirm-password': 'password123',
      }),
    );
    expect(result.success).toBe(false);
    expect(result.errors?.action).toBe('Email already exists');
  });
});
