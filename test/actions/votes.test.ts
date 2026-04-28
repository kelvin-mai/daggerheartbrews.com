import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/lib/database', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

import { toggleCardVote, toggleAdversaryVote } from '@/actions/votes';
import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import { headers } from 'next/headers';

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type DbSelectResult = ReturnType<(typeof db)['select']>;
type DbInsertResult = ReturnType<(typeof db)['insert']>;
type DbDeleteResult = ReturnType<(typeof db)['delete']>;
type DbUpdateResult = ReturnType<(typeof db)['update']>;

const mockSession = { user: { id: 'user-1', email: 'user@example.com' } };

const CARD_ID = '00000000-0000-0000-0000-000000000001';
const ADVERSARY_ID = '00000000-0000-0000-0000-000000000002';
const VOTE_ID = '00000000-0000-0000-0000-000000000003';

const makeSelectChain = (resolveValue: unknown) =>
  ({
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValueOnce(resolveValue),
  }) as unknown as DbSelectResult;

// update(votesTable).set().where() — terminal, no returning
const makeVoteUpdateChain = () => {
  const chain = { set: vi.fn(), where: vi.fn() };
  chain.set.mockReturnValue(chain);
  chain.where.mockResolvedValueOnce(undefined);
  return chain as unknown as DbUpdateResult;
};

// update(itemTable).set().where().returning() — returns updated counts
const makeCounterUpdateChain = (upvotes: number, downvotes: number) => {
  const chain = { set: vi.fn(), where: vi.fn(), returning: vi.fn() };
  chain.set.mockReturnValue(chain);
  chain.where.mockReturnValue(chain);
  chain.returning.mockResolvedValueOnce([{ upvotes, downvotes }]);
  return chain as unknown as DbUpdateResult;
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(headers).mockResolvedValue(new Headers());
});

// ---------------------------------------------------------------------------
// toggleCardVote
// ---------------------------------------------------------------------------

describe('votes/toggleCardVote', () => {
  it('returns error when session is missing', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await toggleCardVote({ userCardId: CARD_ID, vote: 'up' });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Unauthorized');
  });

  it('returns error when userCardId is not a valid UUID', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );

    const result = await toggleCardVote({
      userCardId: 'not-a-uuid',
      vote: 'up',
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to update vote');
  });

  it('inserts upvote and returns incremented counts when no prior vote exists', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(makeSelectChain([]));
    vi.mocked(db.insert).mockReturnValueOnce({
      values: vi.fn().mockResolvedValueOnce(undefined),
    } as unknown as DbInsertResult);
    vi.mocked(db.update).mockReturnValueOnce(makeCounterUpdateChain(1, 0));

    const result = await toggleCardVote({ userCardId: CARD_ID, vote: 'up' });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ upvotes: 1, downvotes: 0, userVote: 'up' });
  });

  it('inserts downvote and returns incremented counts when no prior vote exists', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(makeSelectChain([]));
    vi.mocked(db.insert).mockReturnValueOnce({
      values: vi.fn().mockResolvedValueOnce(undefined),
    } as unknown as DbInsertResult);
    vi.mocked(db.update).mockReturnValueOnce(makeCounterUpdateChain(0, 1));

    const result = await toggleCardVote({ userCardId: CARD_ID, vote: 'down' });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ upvotes: 0, downvotes: 1, userVote: 'down' });
  });

  it('removes upvote and returns decremented counts when same upvote is cast again', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([{ id: VOTE_ID, vote: 'up' }]),
    );
    vi.mocked(db.delete).mockReturnValueOnce({
      where: vi.fn().mockResolvedValueOnce(undefined),
    } as unknown as DbDeleteResult);
    vi.mocked(db.update).mockReturnValueOnce(makeCounterUpdateChain(0, 0));

    const result = await toggleCardVote({ userCardId: CARD_ID, vote: 'up' });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ upvotes: 0, downvotes: 0, userVote: null });
  });

  it('removes downvote and returns decremented counts when same downvote is cast again', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([{ id: VOTE_ID, vote: 'down' }]),
    );
    vi.mocked(db.delete).mockReturnValueOnce({
      where: vi.fn().mockResolvedValueOnce(undefined),
    } as unknown as DbDeleteResult);
    vi.mocked(db.update).mockReturnValueOnce(makeCounterUpdateChain(0, 0));

    const result = await toggleCardVote({ userCardId: CARD_ID, vote: 'down' });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ upvotes: 0, downvotes: 0, userVote: null });
  });

  it('swaps upvote to downvote when opposite vote is cast', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([{ id: VOTE_ID, vote: 'up' }]),
    );
    vi.mocked(db.update)
      .mockReturnValueOnce(makeVoteUpdateChain())
      .mockReturnValueOnce(makeCounterUpdateChain(0, 1));

    const result = await toggleCardVote({ userCardId: CARD_ID, vote: 'down' });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ upvotes: 0, downvotes: 1, userVote: 'down' });
  });

  it('swaps downvote to upvote when opposite vote is cast', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([{ id: VOTE_ID, vote: 'down' }]),
    );
    vi.mocked(db.update)
      .mockReturnValueOnce(makeVoteUpdateChain())
      .mockReturnValueOnce(makeCounterUpdateChain(1, 0));

    const result = await toggleCardVote({ userCardId: CARD_ID, vote: 'up' });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ upvotes: 1, downvotes: 0, userVote: 'up' });
  });

  it('returns error when db throws', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockRejectedValueOnce(new Error('DB error')),
    } as unknown as DbSelectResult);

    const result = await toggleCardVote({ userCardId: CARD_ID, vote: 'up' });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to update vote');
  });
});

// ---------------------------------------------------------------------------
// toggleAdversaryVote
// ---------------------------------------------------------------------------

describe('votes/toggleAdversaryVote', () => {
  it('returns error when session is missing', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const result = await toggleAdversaryVote({
      userAdversaryId: ADVERSARY_ID,
      vote: 'up',
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Unauthorized');
  });

  it('returns error when userAdversaryId is not a valid UUID', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );

    const result = await toggleAdversaryVote({
      userAdversaryId: 'not-a-uuid',
      vote: 'up',
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to update vote');
  });

  it('inserts upvote and returns incremented counts when no prior vote exists', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(makeSelectChain([]));
    vi.mocked(db.insert).mockReturnValueOnce({
      values: vi.fn().mockResolvedValueOnce(undefined),
    } as unknown as DbInsertResult);
    vi.mocked(db.update).mockReturnValueOnce(makeCounterUpdateChain(1, 0));

    const result = await toggleAdversaryVote({
      userAdversaryId: ADVERSARY_ID,
      vote: 'up',
    });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ upvotes: 1, downvotes: 0, userVote: 'up' });
  });

  it('inserts downvote and returns incremented counts when no prior vote exists', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(makeSelectChain([]));
    vi.mocked(db.insert).mockReturnValueOnce({
      values: vi.fn().mockResolvedValueOnce(undefined),
    } as unknown as DbInsertResult);
    vi.mocked(db.update).mockReturnValueOnce(makeCounterUpdateChain(0, 1));

    const result = await toggleAdversaryVote({
      userAdversaryId: ADVERSARY_ID,
      vote: 'down',
    });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ upvotes: 0, downvotes: 1, userVote: 'down' });
  });

  it('removes upvote when same upvote is cast again', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([{ id: VOTE_ID, vote: 'up' }]),
    );
    vi.mocked(db.delete).mockReturnValueOnce({
      where: vi.fn().mockResolvedValueOnce(undefined),
    } as unknown as DbDeleteResult);
    vi.mocked(db.update).mockReturnValueOnce(makeCounterUpdateChain(0, 0));

    const result = await toggleAdversaryVote({
      userAdversaryId: ADVERSARY_ID,
      vote: 'up',
    });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ upvotes: 0, downvotes: 0, userVote: null });
  });

  it('swaps upvote to downvote when opposite vote is cast', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([{ id: VOTE_ID, vote: 'up' }]),
    );
    vi.mocked(db.update)
      .mockReturnValueOnce(makeVoteUpdateChain())
      .mockReturnValueOnce(makeCounterUpdateChain(0, 1));

    const result = await toggleAdversaryVote({
      userAdversaryId: ADVERSARY_ID,
      vote: 'down',
    });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ upvotes: 0, downvotes: 1, userVote: 'down' });
  });

  it('swaps downvote to upvote when opposite vote is cast', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([{ id: VOTE_ID, vote: 'down' }]),
    );
    vi.mocked(db.update)
      .mockReturnValueOnce(makeVoteUpdateChain())
      .mockReturnValueOnce(makeCounterUpdateChain(1, 0));

    const result = await toggleAdversaryVote({
      userAdversaryId: ADVERSARY_ID,
      vote: 'up',
    });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ upvotes: 1, downvotes: 0, userVote: 'up' });
  });

  it('returns error when db throws', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockRejectedValueOnce(new Error('DB error')),
    } as unknown as DbSelectResult);

    const result = await toggleAdversaryVote({
      userAdversaryId: ADVERSARY_ID,
      vote: 'up',
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to update vote');
  });
});
