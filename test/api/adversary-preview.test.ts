import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/actions/user-items', () => ({
  limitAdversaryInserts: vi.fn(),
  insertAdversary: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

import { POST } from '@/app/api/adversary-preview/route';
import { auth } from '@/lib/auth';
import { limitAdversaryInserts, insertAdversary } from '@/actions/user-items';

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type InsertAdversaryResult = Awaited<ReturnType<typeof insertAdversary>>;

const mockSession = { user: { id: 'user-1', email: 'user@example.com' } };
const mockAdversary = { id: 'adv-1', name: 'Test Adversary', type: 'standard' };
const mockUserAdversary = {
  id: 'ua-1',
  userId: 'user-1',
  adversaryPreviewId: 'adv-1',
};

const makeReq = (body: unknown) =>
  new NextRequest('http://localhost/api/adversary-preview', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });

describe('POST /api/adversary-preview', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 500 when there is no session', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const res = await POST(makeReq({ adversary: mockAdversary }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error.message).toBe('Unauthorized');
  });

  it('creates an adversary and returns 201', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(limitAdversaryInserts).mockResolvedValueOnce(undefined);
    vi.mocked(insertAdversary).mockResolvedValueOnce({
      adversary: mockAdversary,
      userAdversary: mockUserAdversary,
    } as unknown as InsertAdversaryResult);

    const res = await POST(makeReq({ adversary: mockAdversary }));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.adversary).toEqual(mockAdversary);
    expect(json.data.userAdversary).toEqual(mockUserAdversary);
  });

  it('returns 500 when the insert limit is reached', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(limitAdversaryInserts).mockRejectedValueOnce(
      new Error('Insert limit met for current user'),
    );

    const res = await POST(makeReq({ adversary: mockAdversary }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error.message).toBe('Insert limit met for current user');
  });
});
