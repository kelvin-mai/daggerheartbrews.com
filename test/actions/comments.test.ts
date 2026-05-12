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
  createCardComment,
  deleteCardComment,
  createAdversaryComment,
  deleteAdversaryComment,
} from '@/actions/comments';
import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type DbSelectResult = ReturnType<(typeof db)['select']>;
type DbInsertResult = ReturnType<(typeof db)['insert']>;
type DbDeleteResult = ReturnType<(typeof db)['delete']>;

const mockSession = { user: { id: 'user-1', email: 'user@example.com' } };

const CARD_ID = '00000000-0000-0000-0000-000000000001';
const ADVERSARY_ID = '00000000-0000-0000-0000-000000000002';
const COMMENT_ID = '00000000-0000-0000-0000-000000000003';

const makeSelectChain = (resolveValue: unknown) =>
  ({
    from: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValueOnce(resolveValue),
  }) as unknown as DbSelectResult;

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(headers).mockResolvedValue(new Headers());
});

// ─────────────────────────────────────────────
// createCardComment
// ─────────────────────────────────────────────
describe('comments/createCardComment', () => {
  it('returns error when session is missing', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await createCardComment({ userCardId: CARD_ID, body: 'hi' });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Unauthorized');
  });

  it('returns error when userCardId is not a valid UUID', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );

    const result = await createCardComment({
      userCardId: 'not-a-uuid',
      body: 'hi',
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to post comment');
  });

  it('returns error when body is empty', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );

    const result = await createCardComment({ userCardId: CARD_ID, body: '' });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to post comment');
  });

  it('inserts comment and returns it on success', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );

    const mockComment = {
      id: COMMENT_ID,
      userId: 'user-1',
      userCardId: CARD_ID,
      body: 'Great card!',
    };

    vi.mocked(db.insert).mockReturnValueOnce({
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValueOnce([mockComment]),
    } as unknown as DbInsertResult);

    const result = await createCardComment({
      userCardId: CARD_ID,
      body: 'Great card!',
    });

    expect(result.data).toEqual({ comment: mockComment });
    expect(result.error).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith(`/community/cards/${CARD_ID}`);
  });

  it('returns error when db throws', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.insert).mockReturnValueOnce({
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockRejectedValueOnce(new Error('DB error')),
    } as unknown as DbInsertResult);

    const result = await createCardComment({
      userCardId: CARD_ID,
      body: 'hello',
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to post comment');
  });
});

// ─────────────────────────────────────────────
// deleteCardComment
// ─────────────────────────────────────────────
describe('comments/deleteCardComment', () => {
  it('returns error when session is missing', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await deleteCardComment({ commentId: COMMENT_ID });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Unauthorized');
  });

  it('returns error when commentId is not a valid UUID', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );

    const result = await deleteCardComment({ commentId: 'bad-id' });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to delete comment');
  });

  it('returns error when comment does not belong to the user', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([
        { id: COMMENT_ID, userId: 'other-user', userCardId: CARD_ID },
      ]),
    );

    const result = await deleteCardComment({ commentId: COMMENT_ID });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Not found');
  });

  it('returns error when comment is not found', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(makeSelectChain([]));

    const result = await deleteCardComment({ commentId: COMMENT_ID });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Not found');
  });

  it('deletes comment and returns commentId on success', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([
        { id: COMMENT_ID, userId: 'user-1', userCardId: CARD_ID },
      ]),
    );
    vi.mocked(db.delete).mockReturnValueOnce({
      where: vi.fn().mockResolvedValueOnce(undefined),
    } as unknown as DbDeleteResult);

    const result = await deleteCardComment({ commentId: COMMENT_ID });

    expect(result.data).toEqual({ commentId: COMMENT_ID });
    expect(result.error).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith(`/community/cards/${CARD_ID}`);
  });
});

// ─────────────────────────────────────────────
// createAdversaryComment
// ─────────────────────────────────────────────
describe('comments/createAdversaryComment', () => {
  it('returns error when session is missing', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await createAdversaryComment({
      userAdversaryId: ADVERSARY_ID,
      body: 'hi',
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Unauthorized');
  });

  it('returns error when userAdversaryId is not a valid UUID', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );

    const result = await createAdversaryComment({
      userAdversaryId: 'bad-id',
      body: 'hi',
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to post comment');
  });

  it('inserts comment and revalidates adversary path', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );

    const mockComment = {
      id: COMMENT_ID,
      userId: 'user-1',
      userAdversaryId: ADVERSARY_ID,
      body: 'Scary!',
    };

    vi.mocked(db.insert).mockReturnValueOnce({
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValueOnce([mockComment]),
    } as unknown as DbInsertResult);

    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([{ type: 'adversary' }]),
    );

    const result = await createAdversaryComment({
      userAdversaryId: ADVERSARY_ID,
      body: 'Scary!',
    });

    expect(result.data).toEqual({ comment: mockComment });
    expect(result.error).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith(
      `/community/adversaries/${ADVERSARY_ID}`,
    );
  });

  it('revalidates environment path when adversary type is environment', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );

    vi.mocked(db.insert).mockReturnValueOnce({
      values: vi.fn().mockReturnThis(),
      returning: vi
        .fn()
        .mockResolvedValueOnce([
          {
            id: COMMENT_ID,
            userId: 'user-1',
            userAdversaryId: ADVERSARY_ID,
            body: 'Nice env',
          },
        ]),
    } as unknown as DbInsertResult);

    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([{ type: 'environment' }]),
    );

    const result = await createAdversaryComment({
      userAdversaryId: ADVERSARY_ID,
      body: 'Nice env',
    });

    expect(result.error).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith(
      `/community/environments/${ADVERSARY_ID}`,
    );
  });
});

// ─────────────────────────────────────────────
// deleteAdversaryComment
// ─────────────────────────────────────────────
describe('comments/deleteAdversaryComment', () => {
  it('returns error when session is missing', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await deleteAdversaryComment({ commentId: COMMENT_ID });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Unauthorized');
  });

  it('returns error when comment does not belong to the user', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([
        { id: COMMENT_ID, userId: 'other-user', userAdversaryId: ADVERSARY_ID },
      ]),
    );

    const result = await deleteAdversaryComment({ commentId: COMMENT_ID });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Not found');
  });

  it('deletes comment and revalidates adversary path', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select)
      .mockReturnValueOnce(
        makeSelectChain([
          { id: COMMENT_ID, userId: 'user-1', userAdversaryId: ADVERSARY_ID },
        ]),
      )
      .mockReturnValueOnce(makeSelectChain([{ type: 'adversary' }]));

    vi.mocked(db.delete).mockReturnValueOnce({
      where: vi.fn().mockResolvedValueOnce(undefined),
    } as unknown as DbDeleteResult);

    const result = await deleteAdversaryComment({ commentId: COMMENT_ID });

    expect(result.data).toEqual({ commentId: COMMENT_ID });
    expect(result.error).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith(
      `/community/adversaries/${ADVERSARY_ID}`,
    );
  });

  it('revalidates environment path when adversary type is environment', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select)
      .mockReturnValueOnce(
        makeSelectChain([
          { id: COMMENT_ID, userId: 'user-1', userAdversaryId: ADVERSARY_ID },
        ]),
      )
      .mockReturnValueOnce(makeSelectChain([{ type: 'environment' }]));

    vi.mocked(db.delete).mockReturnValueOnce({
      where: vi.fn().mockResolvedValueOnce(undefined),
    } as unknown as DbDeleteResult);

    const result = await deleteAdversaryComment({ commentId: COMMENT_ID });

    expect(result.error).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith(
      `/community/environments/${ADVERSARY_ID}`,
    );
  });

  it('returns error when db throws', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockRejectedValueOnce(new Error('DB error')),
    } as unknown as DbSelectResult);

    const result = await deleteAdversaryComment({ commentId: COMMENT_ID });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to delete comment');
  });
});
