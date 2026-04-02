import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/lib/database', () => ({
  db: { select: vi.fn() },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

import { GET } from '@/app/api/bookmarks/cards/route';
import { auth } from '@/lib/auth';
import { db } from '@/lib/database';

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type DbSelectResult = ReturnType<(typeof db)['select']>;

const mockSession = { user: { id: 'user-1', email: 'user@example.com' } };

const CARD_ID_1 = '00000000-0000-0000-0000-000000000001';
const CARD_ID_2 = '00000000-0000-0000-0000-000000000002';

const makeSelectChain = (resolveValue: unknown) =>
  ({
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValueOnce(resolveValue),
  }) as unknown as DbSelectResult;

describe('GET /api/bookmarks/cards', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns empty ids when no session', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.ids).toEqual([]);
    expect(json.error).toBeNull();
  });

  it('returns bookmarked card ids for authenticated user', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([{ userCardId: CARD_ID_1 }, { userCardId: CARD_ID_2 }]),
    );

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.ids).toEqual([CARD_ID_1, CARD_ID_2]);
    expect(json.error).toBeNull();
  });

  it('returns empty ids when user has no bookmarks', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce(makeSelectChain([]));

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.ids).toEqual([]);
  });

  it('returns 500 on db error', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockRejectedValueOnce(new Error('DB connection failed')),
    } as unknown as DbSelectResult);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.data).toBeNull();
    expect(json.error).toBeDefined();
  });
});
