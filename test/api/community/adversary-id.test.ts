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

    const res = await PUT(makeReq({ card: { tier: 2 } }), { params });
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

    const res = await PUT(makeReq({ card: { tier: 2 } }), { params });
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

    const res = await PUT(makeReq({ card: { tier: 2 } }), { params });
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

    const res = await PUT(makeReq({ card: { tier: 2 } }), { params });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
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
