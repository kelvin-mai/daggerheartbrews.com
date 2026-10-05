import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/lib/database', () => ({
  db: {
    update: vi.fn(),
    transaction: vi.fn(),
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

import { PUT, DELETE } from '@/app/api/community/adversary/[id]/route';
import { auth } from '@/lib/auth';
import { db } from '@/lib/database';

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type DbUpdateResult = ReturnType<(typeof db)['update']>;
type TransactionCallback = Parameters<(typeof db)['transaction']>[0];
type TransactionArg = Parameters<TransactionCallback>[0];

const mockSession = { user: { id: 'user-1', email: 'user@example.com' } };
const mockUserAdversary = {
  id: 'ua-1',
  userId: 'user-1',
  adversaryPreviewId: 'adv-1',
};

const params = Promise.resolve({ id: 'ua-1' });

const makeReq = (body: unknown, method = 'PUT') =>
  new NextRequest('http://localhost/api/community/adversary/ua-1', {
    method,
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });

describe('PUT /api/community/adversary/[id]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 500 when there is no session', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const res = await PUT(makeReq({ public: true }), { params });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error.message).toBe('Unauthorized');
  });

  it('returns 404 when the user adversary is not found', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
    } as unknown as DbUpdateResult);

    const res = await PUT(makeReq({ public: true }), { params });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.success).toBe(false);
  });

  it('returns 202 with the updated user adversary', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([mockUserAdversary]),
    } as unknown as DbUpdateResult);

    const res = await PUT(makeReq({ public: true }), { params });
    const json = await res.json();

    expect(res.status).toBe(202);
    expect(json.success).toBe(true);
    expect(json.data.userAdversary).toEqual(mockUserAdversary);
  });

  it('returns 500 on db error', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockRejectedValue(new Error('DB write failed')),
    } as unknown as DbUpdateResult);

    const res = await PUT(makeReq({ public: true }), { params });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
  });
});

describe('PUT /api/community/adversary/[id] validation', () => {
  beforeEach(() => vi.clearAllMocks());

  const mockOwned = () => {
    const set = vi.fn().mockReturnThis();
    vi.mocked(db.update).mockReturnValue({
      set,
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([mockUserAdversary]),
    } as unknown as DbUpdateResult);
    return set;
  };

  it.each([
    ['upvotes', { public: true, upvotes: 999 }],
    ['userId', { public: true, userId: 'other' }],
    ['preview id', { public: true, adversaryPreviewId: 'x' }],
  ])('returns 400 and does not update for extra key (%s)', async (_, body) => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );

    const res = await PUT(makeReq(body), { params });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(db.update).not.toHaveBeenCalled();
  });

  it.each([
    ['non-boolean public', { public: 'yes' }],
    ['empty body', {}],
  ])('returns 400 for %s', async (_, body) => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );

    const res = await PUT(makeReq(body), { params });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(db.update).not.toHaveBeenCalled();
  });

  it('returns 202 and sets only public and updatedAt', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    const set = mockOwned();

    const res = await PUT(makeReq({ public: false }), { params });
    const json = await res.json();

    expect(res.status).toBe(202);
    expect(json.success).toBe(true);
    expect(set).toHaveBeenCalledWith({
      public: false,
      updatedAt: expect.any(Date),
    });
    expect(Object.keys(set.mock.calls[0][0]).sort()).toEqual([
      'public',
      'updatedAt',
    ]);
  });

  it('returns 500 Unauthorized before parsing an invalid body', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const res = await PUT(makeReq({ public: 'yes' }), { params });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error.message).toBe('Unauthorized');
    expect(db.update).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/community/adversary/[id]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 500 when there is no session', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const res = await DELETE(makeReq({}, 'DELETE'), { params });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error.message).toBe('Unauthorized');
  });

  it('deletes the adversary and its preview in a transaction and returns 202', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.transaction).mockImplementation((fn) => {
      const txMock = {
        delete: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnThis(),
          returning: vi.fn().mockResolvedValue([mockUserAdversary]),
        }),
      };
      return fn(txMock as unknown as TransactionArg);
    });

    const res = await DELETE(makeReq({}, 'DELETE'), { params });
    const json = await res.json();

    expect(res.status).toBe(202);
    expect(json.success).toBe(true);
    expect(json.data.userAdversary).toEqual(mockUserAdversary);
  });

  it('returns 500 on db error', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(db.transaction).mockRejectedValueOnce(
      new Error('transaction failed'),
    );

    const res = await DELETE(makeReq({}, 'DELETE'), { params });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
  });
});
