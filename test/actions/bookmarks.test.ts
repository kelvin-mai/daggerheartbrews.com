import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/lib/database', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import {
  toggleAdversaryBookmark,
  toggleCardBookmark,
} from '@/actions/bookmarks';
import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type DbSelectResult = ReturnType<(typeof db)['select']>;
type DbDeleteResult = ReturnType<(typeof db)['delete']>;
type DbInsertResult = ReturnType<(typeof db)['insert']>;

const mockSession = { user: { id: 'user-1', email: 'user@example.com' } };

const CARD_ID = '00000000-0000-0000-0000-000000000001';
const ADVERSARY_ID = '00000000-0000-0000-0000-000000000002';
const BOOKMARK_ID = '00000000-0000-0000-0000-000000000003';

const makeSelectChain = (resolveValue: unknown) =>
  ({
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValueOnce(resolveValue),
  }) as unknown as DbSelectResult;

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(headers).mockResolvedValue(new Headers());
});

describe('bookmarks/toggleCardBookmark', () => {
  it('returns error when session is missing', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await toggleCardBookmark({ userCardId: CARD_ID });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Unauthorized');
  });

  it('returns error when userCardId is not a valid UUID', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );

    const result = await toggleCardBookmark({ userCardId: 'not-a-uuid' });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to update bookmark');
  });

  it('inserts bookmark and returns bookmarked: true when none exists', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(makeSelectChain([]));
    vi.mocked(db.insert).mockReturnValueOnce({
      values: vi.fn().mockResolvedValue(undefined),
    } as unknown as DbInsertResult);

    const result = await toggleCardBookmark({ userCardId: CARD_ID });

    expect(result.data).toEqual({ bookmarked: true });
    expect(result.error).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith('/profile/bookmarks');
  });

  it('deletes bookmark and returns bookmarked: false when one exists', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([{ id: BOOKMARK_ID }]),
    );
    vi.mocked(db.delete).mockReturnValueOnce({
      where: vi.fn().mockResolvedValue(undefined),
    } as unknown as DbDeleteResult);

    const result = await toggleCardBookmark({ userCardId: CARD_ID });

    expect(result.data).toEqual({ bookmarked: false });
    expect(result.error).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith('/profile/bookmarks');
  });

  it('returns error when db throws', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockRejectedValueOnce(new Error('DB error')),
    } as unknown as DbSelectResult);

    const result = await toggleCardBookmark({ userCardId: CARD_ID });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to update bookmark');
  });
});

describe('bookmarks/toggleAdversaryBookmark', () => {
  it('returns error when session is missing', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await toggleAdversaryBookmark({
      userAdversaryId: ADVERSARY_ID,
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Unauthorized');
  });

  it('returns error when userAdversaryId is not a valid UUID', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );

    const result = await toggleAdversaryBookmark({
      userAdversaryId: 'not-a-uuid',
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to update bookmark');
  });

  it('inserts bookmark and returns bookmarked: true when none exists', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(makeSelectChain([]));
    vi.mocked(db.insert).mockReturnValueOnce({
      values: vi.fn().mockResolvedValue(undefined),
    } as unknown as DbInsertResult);

    const result = await toggleAdversaryBookmark({
      userAdversaryId: ADVERSARY_ID,
    });

    expect(result.data).toEqual({ bookmarked: true });
    expect(result.error).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith('/profile/bookmarks');
  });

  it('deletes bookmark and returns bookmarked: false when one exists', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([{ id: BOOKMARK_ID }]),
    );
    vi.mocked(db.delete).mockReturnValueOnce({
      where: vi.fn().mockResolvedValue(undefined),
    } as unknown as DbDeleteResult);

    const result = await toggleAdversaryBookmark({
      userAdversaryId: ADVERSARY_ID,
    });

    expect(result.data).toEqual({ bookmarked: false });
    expect(result.error).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith('/profile/bookmarks');
  });

  it('returns error when db throws', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockRejectedValueOnce(new Error('DB error')),
    } as unknown as DbSelectResult);

    const result = await toggleAdversaryBookmark({
      userAdversaryId: ADVERSARY_ID,
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to update bookmark');
  });
});
