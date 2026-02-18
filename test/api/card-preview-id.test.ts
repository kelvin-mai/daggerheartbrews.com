import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/actions/user-items', () => ({
  limitCardInserts: vi.fn(),
  insertCard: vi.fn(),
  updateCard: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

import { POST } from '@/app/api/card-preview/[id]/route';
import { auth } from '@/lib/auth';
import { limitCardInserts, insertCard, updateCard } from '@/actions/user-items';

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type InsertCardResult = Awaited<ReturnType<typeof insertCard>>;
type UpdateCardResult = Awaited<ReturnType<typeof updateCard>>;

const mockSession = { user: { id: 'user-1', email: 'user@example.com' } };
const mockCard = { id: 'card-1', name: 'Test Card', type: 'ancestry' };
const mockUserCard = { id: 'uc-1', userId: 'user-1', cardPreviewId: 'card-1' };

const params = Promise.resolve({ id: 'card-1' });

const makeReq = (body: unknown) =>
  new NextRequest('http://localhost/api/card-preview/card-1', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });

describe('POST /api/card-preview/[id]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 500 when there is no session', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const res = await POST(makeReq({ card: mockCard }), { params });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error.message).toBe('Unauthorized');
  });

  it('calls updateCard when userCard belongs to the session user and returns 202', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(updateCard).mockResolvedValueOnce({
      card: mockCard,
      userCard: mockUserCard,
    } as unknown as UpdateCardResult);

    const res = await POST(
      makeReq({ card: mockCard, userCard: mockUserCard }),
      { params },
    );
    const json = await res.json();

    expect(res.status).toBe(202);
    expect(json.success).toBe(true);
    expect(updateCard).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'card-1', session: mockSession }),
    );
    expect(insertCard).not.toHaveBeenCalled();
  });

  it('calls insertCard when userCard belongs to a different user and returns 201', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(limitCardInserts).mockResolvedValueOnce(undefined);
    vi.mocked(insertCard).mockResolvedValueOnce({
      card: mockCard,
      userCard: mockUserCard,
    } as unknown as InsertCardResult);

    const res = await POST(
      makeReq({
        card: mockCard,
        userCard: { ...mockUserCard, userId: 'other-user' },
      }),
      { params },
    );
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(insertCard).toHaveBeenCalled();
    expect(updateCard).not.toHaveBeenCalled();
  });

  it('calls insertCard when body has no userCard and returns 201', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(limitCardInserts).mockResolvedValueOnce(undefined);
    vi.mocked(insertCard).mockResolvedValueOnce({
      card: mockCard,
      userCard: mockUserCard,
    } as unknown as InsertCardResult);

    const res = await POST(makeReq({ card: mockCard }), { params });
    await res.json();

    expect(res.status).toBe(201);
    expect(insertCard).toHaveBeenCalled();
  });
});
