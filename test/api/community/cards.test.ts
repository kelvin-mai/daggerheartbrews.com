import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/database', () => ({
  db: { select: vi.fn() },
}));

import { GET } from '@/app/api/community/cards/route';
import { db } from '@/lib/database';

type DbSelectResult = ReturnType<(typeof db)['select']>;

const mockRows = [
  {
    user_cards: {
      id: 'uc-1',
      public: true,
      userId: 'user-1',
      cardPreviewId: 'card-1',
    },
    card_previews: { id: 'card-1', name: 'Test Card', type: 'ancestry' },
    users: { id: 'user-1', name: 'Alice' },
  },
];

const makeReq = (params?: Record<string, string>) => {
  const url = new URL('http://localhost/api/community/cards');
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  return new NextRequest(url);
};

const setupDb = (count: number, data: unknown[]) => {
  vi.mocked(db.select)
    .mockReturnValueOnce({
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([{ count }]),
    } as unknown as DbSelectResult)
    .mockReturnValueOnce({
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      offset: vi.fn().mockResolvedValue(data),
    } as unknown as DbSelectResult);
};

describe('GET /api/community/cards', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns paginated cards with default params', async () => {
    setupDb(1, mockRows);

    const res = await GET(makeReq());
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.meta).toEqual({ page: 1, pageSize: 10, total: 1 });
    expect(json.data).toHaveLength(1);
    expect(json.data[0]).toHaveProperty('userCard');
    expect(json.data[0]).toHaveProperty('cardPreview');
    expect(json.data[0]).toHaveProperty('user');
  });

  it('respects custom page and page-size params', async () => {
    setupDb(0, []);

    const res = await GET(makeReq({ page: '3', 'page-size': '5' }));
    const json = await res.json();

    expect(json.meta).toEqual({ page: 3, pageSize: 5, total: 0 });
  });

  it('applies type filter from comma-separated query param', async () => {
    setupDb(2, mockRows);

    const res = await GET(makeReq({ type: 'ancestry,equipment' }));
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.meta.total).toBe(2);
  });

  it('maps database rows to the expected shape', async () => {
    setupDb(1, mockRows);

    const res = await GET(makeReq());
    const json = await res.json();

    expect(json.data[0].userCard).toEqual(mockRows[0].user_cards);
    expect(json.data[0].cardPreview).toEqual(mockRows[0].card_previews);
    expect(json.data[0].user).toEqual(mockRows[0].users);
  });

  it('returns 500 on db error', async () => {
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockRejectedValue(new Error('DB connection failed')),
    } as unknown as DbSelectResult);

    const res = await GET(makeReq());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error.message).toBe('DB connection failed');
  });
});
