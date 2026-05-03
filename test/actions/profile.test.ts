import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/lib/email', () => ({
  syncAudienceContact: vi.fn(),
}));

vi.mock('@/lib/database', () => ({
  db: { update: vi.fn(), transaction: vi.fn() },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/email', () => ({
  syncAudienceContact: vi.fn(),
}));

import { updateProfile, deleteAccount } from '@/actions/profile';
import { auth } from '@/lib/auth';
import { db } from '@/lib/database';

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type DbUpdateResult = ReturnType<(typeof db)['update']>;
type TxCallback = Parameters<(typeof db)['transaction']>[0];
type Tx = Parameters<TxCallback>[0];

const makeSelectChain = (resolvedValue: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(resolvedValue),
  }),
});

const makeDeleteChain = () => ({
  where: vi.fn().mockResolvedValue(undefined),
});

const makeTx = (
  cardPreviews: unknown[],
  adversaryPreviews: unknown[],
): Partial<Tx> => ({
  select: vi
    .fn()
    .mockReturnValueOnce(makeSelectChain(cardPreviews))
    .mockReturnValueOnce(makeSelectChain(adversaryPreviews)),
  delete: vi.fn().mockReturnValue(makeDeleteChain()),
});

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

describe('profile/deleteAccount', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns Unauthorized when session is missing', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await deleteAccount();

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unauthorized');
  });

  it('succeeds and runs 2 deletes when user has no cards or adversaries', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    const tx = makeTx([], []);
    vi.mocked(db.transaction).mockImplementationOnce((fn) =>
      fn(tx as unknown as Tx),
    );

    const result = await deleteAccount();

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
    expect(tx.delete).toHaveBeenCalledTimes(2);
  });

  it('succeeds and runs 4 deletes when user has cards and adversaries', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    const tx = makeTx([{ id: 'card-preview-1' }], [{ id: 'adv-preview-1' }]);
    vi.mocked(db.transaction).mockImplementationOnce((fn) =>
      fn(tx as unknown as Tx),
    );

    const result = await deleteAccount();

    expect(result.success).toBe(true);
    expect(tx.delete).toHaveBeenCalledTimes(4);
  });

  it('returns error when transaction throws', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.transaction).mockRejectedValueOnce(new Error('DB error'));

    const result = await deleteAccount();

    expect(result.success).toBe(false);
    expect(result.error).toBe('DB error');
  });
});
