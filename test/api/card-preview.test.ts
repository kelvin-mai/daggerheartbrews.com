import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/actions/user-items', () => ({
  limitCardInserts: vi.fn(),
  insertCard: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

import { POST } from '@/app/api/card-preview/route';
import { auth } from '@/lib/auth';
import { limitCardInserts, insertCard } from '@/actions/user-items';

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type InsertCardResult = Awaited<ReturnType<typeof insertCard>>;

const mockSession = { user: { id: 'user-1', email: 'user@example.com' } };
const mockCard = { id: 'card-1', name: 'Test Card', type: 'ancestry' };
const mockUserCard = { id: 'uc-1', userId: 'user-1', cardPreviewId: 'card-1' };

const makeReq = (body: unknown) =>
  new NextRequest('http://localhost/api/card-preview', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });

describe('POST /api/card-preview', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 500 when there is no session', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const res = await POST(makeReq({ card: mockCard }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error.message).toBe('Unauthorized');
  });

  it('creates a card and returns 201', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(limitCardInserts).mockResolvedValueOnce(undefined);
    vi.mocked(insertCard).mockResolvedValueOnce({
      card: mockCard,
      userCard: mockUserCard,
    } as unknown as InsertCardResult);

    const res = await POST(makeReq({ card: mockCard }));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.card).toEqual(mockCard);
    expect(json.data.userCard).toEqual(mockUserCard);
  });

  it('returns 500 when the insert limit is reached', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(limitCardInserts).mockRejectedValueOnce(
      new Error('Insert limit met for current user'),
    );

    const res = await POST(makeReq({ card: mockCard }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error.message).toBe('Insert limit met for current user');
  });

  it('returns 500 when insertCard throws', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(limitCardInserts).mockResolvedValueOnce(undefined);
    vi.mocked(insertCard).mockRejectedValueOnce(new Error('DB write failed'));

    const res = await POST(makeReq({ card: mockCard }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
  });
});
