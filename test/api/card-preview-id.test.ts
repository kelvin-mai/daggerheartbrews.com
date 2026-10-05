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
import { MAX_REQUEST_BODY_SIZE } from '@/lib/utils';
import { limitCardInserts, insertCard, updateCard } from '@/actions/user-items';

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type UpdateCardResult = Awaited<ReturnType<typeof updateCard>>;

const mockSession = { user: { id: 'user-1', email: 'user@example.com' } };
const mockCard = { id: 'card-1', name: 'Test', type: 'standard' };
const mockUserCard = {
  id: 'u-1',
  userId: 'user-1',
  cardPreviewId: 'card-1',
};

const params = Promise.resolve({ id: 'card-1' });

const makeReq = (body: unknown, headers: Record<string, string> = {}) =>
  new NextRequest('http://localhost/api/card-preview/card-1', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
    headers: { 'content-type': 'application/json', ...headers },
  });

const oversized = () =>
  JSON.stringify({ card: { image: 'a'.repeat(MAX_REQUEST_BODY_SIZE) } });

describe('POST /api/card-preview/[id]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 500 when there is no session', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const res = await POST(makeReq({ card: mockCard }), { params });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error.message).toBe('Unauthorized');
    expect(updateCard).not.toHaveBeenCalled();
  });

  it('updates and returns 202 when no userCard is sent', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(updateCard).mockResolvedValueOnce({
      card: mockCard,
      userCard: mockUserCard,
    } as unknown as UpdateCardResult);

    const res = await POST(makeReq({ card: mockCard }), { params });
    const json = await res.json();

    expect(res.status).toBe(202);
    expect(json.success).toBe(true);
    expect(json.data.card).toEqual(mockCard);
    expect(updateCard).toHaveBeenCalledWith({
      id: 'card-1',
      body: { card: mockCard },
      session: mockSession,
    });
    expect(insertCard).not.toHaveBeenCalled();
  });

  it.each(['user-1', 'other-user'])(
    'ignores a spoofed userCard.userId (%s) and always calls updateCard',
    async (userId) => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(
        mockSession as unknown as GetSessionResult,
      );
      vi.mocked(updateCard).mockResolvedValueOnce(null);

      const res = await POST(
        makeReq({
          card: mockCard,
          userCard: { ...mockUserCard, userId },
        }),
        { params },
      );

      expect(res.status).toBe(404);
      expect(updateCard).toHaveBeenCalledWith({
        id: 'card-1',
        body: expect.objectContaining({ card: mockCard }),
        session: mockSession,
      });
      expect(insertCard).not.toHaveBeenCalled();
      expect(limitCardInserts).not.toHaveBeenCalled();
    },
  );

  it('returns 404 with no insert when updateCard resolves null', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(updateCard).mockResolvedValueOnce(null);

    const res = await POST(makeReq({ card: mockCard }), { params });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({
      success: false,
      error: { name: 'NotFound', message: 'Not found' },
    });
    expect(insertCard).not.toHaveBeenCalled();
  });

  it('returns 413 and does not update when the body is over the limit', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(
      mockSession as unknown as GetSessionResult,
    );

    const res = await POST(makeReq(oversized()), { params });
    const json = await res.json();

    expect(res.status).toBe(413);
    expect(json).toEqual({
      success: false,
      error: {
        name: 'PayloadTooLargeError',
        message: 'This is too large to save. Try uploading a smaller image.',
      },
    });
    expect(updateCard).not.toHaveBeenCalled();
  });

  it('returns 413 when content-length is over the limit', async () => {
    const res = await POST(
      makeReq(
        { card: mockCard },
        { 'content-length': String(MAX_REQUEST_BODY_SIZE + 1) },
      ),
      { params },
    );

    expect(res.status).toBe(413);
    expect(updateCard).not.toHaveBeenCalled();
  });

  it('returns 413 for an oversized body with no session', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const res = await POST(makeReq(oversized()), { params });

    expect(res.status).toBe(413);
  });

  it('returns 500 for malformed JSON under the limit', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(
      mockSession as unknown as GetSessionResult,
    );

    const res = await POST(makeReq('{nope'), { params });

    expect(res.status).toBe(500);
    expect(updateCard).not.toHaveBeenCalled();
  });
});
