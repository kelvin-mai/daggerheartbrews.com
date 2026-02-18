import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/database', () => ({
  db: { select: vi.fn() },
}));

import { GET } from '@/app/api/community/adversary/route';
import { db } from '@/lib/database';

type DbSelectResult = ReturnType<(typeof db)['select']>;

const mockRows = [
  {
    user_adversaries: {
      id: 'ua-1',
      public: true,
      userId: 'user-1',
      adversaryPreviewId: 'adv-1',
    },
    adversary_previews: {
      id: 'adv-1',
      name: 'Goblin',
      type: 'standard',
      subtype: 'bruiser',
      tier: 1,
    },
    users: { id: 'user-1', name: 'Alice' },
  },
];

const makeReq = (params?: Record<string, string>) => {
  const url = new URL('http://localhost/api/community/adversary');
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

describe('GET /api/community/adversary', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns paginated adversaries with default params', async () => {
    setupDb(1, mockRows);

    const res = await GET(makeReq());
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.meta).toEqual({ page: 1, pageSize: 10, total: 1 });
    expect(json.data).toHaveLength(1);
    expect(json.data[0]).toHaveProperty('userAdversary');
    expect(json.data[0]).toHaveProperty('adversaryPreview');
    expect(json.data[0]).toHaveProperty('user');
  });

  it('respects custom pagination params', async () => {
    setupDb(0, []);

    const res = await GET(makeReq({ page: '3', 'page-size': '20' }));
    const json = await res.json();

    expect(json.meta).toEqual({ page: 3, pageSize: 20, total: 0 });
  });

  it('maps database rows to the expected shape', async () => {
    setupDb(1, mockRows);

    const res = await GET(makeReq());
    const json = await res.json();

    expect(json.data[0].userAdversary).toEqual(mockRows[0].user_adversaries);
    expect(json.data[0].adversaryPreview).toEqual(
      mockRows[0].adversary_previews,
    );
    expect(json.data[0].user).toEqual(mockRows[0].users);
  });

  it('handles tier filter with numeric tiers', async () => {
    setupDb(1, mockRows);

    const res = await GET(makeReq({ tier: '1,2' }));
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.meta.total).toBe(1);
  });

  it('ignores non-numeric values in tier filter', async () => {
    setupDb(0, []);

    const res = await GET(makeReq({ tier: 'abc,xyz' }));
    const json = await res.json();

    // NaN values are filtered out, so no tier filter is applied
    expect(json.success).toBe(true);
  });

  it('handles explicit role filter', async () => {
    setupDb(1, mockRows);

    const res = await GET(makeReq({ role: 'bruiser,ranged' }));
    const json = await res.json();

    expect(json.success).toBe(true);
  });

  it('handles custom role filter', async () => {
    setupDb(1, mockRows);

    const res = await GET(makeReq({ role: 'custom' }));
    const json = await res.json();

    expect(json.success).toBe(true);
  });

  it('handles mixed explicit and custom role filter', async () => {
    setupDb(1, mockRows);

    const res = await GET(makeReq({ role: 'bruiser,custom' }));
    const json = await res.json();

    expect(json.success).toBe(true);
  });

  it('skips role filtering when role=all', async () => {
    setupDb(1, mockRows);

    const res = await GET(makeReq({ role: 'all' }));
    const json = await res.json();

    expect(json.success).toBe(true);
  });

  it('handles combined tier and role filters', async () => {
    setupDb(1, mockRows);

    const res = await GET(makeReq({ tier: '1', role: 'bruiser' }));
    const json = await res.json();

    expect(json.success).toBe(true);
  });

  it('returns 500 on db error', async () => {
    vi.mocked(db.select).mockReturnValueOnce({
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockRejectedValue(new Error('connection refused')),
    } as unknown as DbSelectResult);

    const res = await GET(makeReq());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error.message).toBe('connection refused');
  });
});
