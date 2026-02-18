import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/lib/database', () => ({
  db: { update: vi.fn() },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { updateProfile } from '@/actions/profile';
import { auth } from '@/lib/auth';
import { db } from '@/lib/database';

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type DbUpdateResult = ReturnType<(typeof db)['update']>;

const makeFormData = (fields: Record<string, string>) => {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
};

const mockSession = { user: { id: 'user-1', email: 'user@example.com' } };

describe('profile/updateProfile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns validation error for invalid email', async () => {
    const result = await updateProfile(
      { success: false },
      makeFormData({ email: 'not-an-email', name: 'Test' }),
    );
    expect(result.success).toBe(false);
    expect(result.errors?.validation?.email).toBeDefined();
  });

  it('returns action error when session email does not match form email', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      ...mockSession,
      user: { ...mockSession.user, email: 'other@example.com' },
    } as unknown as GetSessionResult);

    const result = await updateProfile(
      { success: false },
      makeFormData({ email: 'user@example.com', name: 'Test' }),
    );
    expect(result.success).toBe(false);
    expect(result.errors?.action).toBe('Unauthorized');
  });

  it('returns success when profile is updated', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([]),
    } as unknown as DbUpdateResult);

    const result = await updateProfile(
      { success: false },
      makeFormData({ email: 'user@example.com', name: 'New Name' }),
    );
    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('returns action error when db throws', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockRejectedValue(new Error('DB error')),
    } as unknown as DbUpdateResult);

    const result = await updateProfile(
      { success: false },
      makeFormData({ email: 'user@example.com', name: 'New Name' }),
    );
    expect(result.success).toBe(false);
    expect(result.errors?.action).toBe('DB error');
  });
});
