import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { z } from 'zod';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/actions/user-items', () => ({
  limitAdversaryInserts: vi.fn(),
  insertAdversary: vi.fn(),
  updateAdversary: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

import { POST } from '@/app/api/adversary-preview/[id]/route';
import { auth } from '@/lib/auth';
import { MAX_REQUEST_BODY_SIZE } from '@/lib/utils';
import {
  limitAdversaryInserts,
  insertAdversary,
  updateAdversary,
} from '@/actions/user-items';

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type UpdateAdversaryResult = Awaited<ReturnType<typeof updateAdversary>>;

const mockSession = { user: { id: 'user-1', email: 'user@example.com' } };
const mockAdversary = { id: 'adv-1', name: 'Test', type: 'standard' };
const mockUserAdversary = {
  id: 'u-1',
  userId: 'user-1',
  adversaryPreviewId: 'adv-1',
};

const params = Promise.resolve({ id: 'adv-1' });

const makeReq = (body: unknown, headers: Record<string, string> = {}) =>
  new NextRequest('http://localhost/api/adversary-preview/adv-1', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
    headers: { 'content-type': 'application/json', ...headers },
  });

const oversized = () =>
  JSON.stringify({ adversary: { image: 'a'.repeat(MAX_REQUEST_BODY_SIZE) } });

describe('POST /api/adversary-preview/[id]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 500 when there is no session', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const res = await POST(makeReq({ adversary: mockAdversary }), { params });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error.message).toBe('Unauthorized');
    expect(updateAdversary).not.toHaveBeenCalled();
  });

  it('updates and returns 202 when no userAdversary is sent', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(updateAdversary).mockResolvedValueOnce({
      adversary: mockAdversary,
      userAdversary: mockUserAdversary,
    } as unknown as UpdateAdversaryResult);

    const res = await POST(makeReq({ adversary: mockAdversary }), { params });
    const json = await res.json();

    expect(res.status).toBe(202);
    expect(json.success).toBe(true);
    expect(json.data.adversary).toEqual(mockAdversary);
    expect(updateAdversary).toHaveBeenCalledWith({
      id: 'adv-1',
      body: { adversary: mockAdversary },
      session: mockSession,
    });
    expect(insertAdversary).not.toHaveBeenCalled();
  });

  it.each(['user-1', 'other-user'])(
    'ignores a spoofed userAdversary.userId (%s) and always calls updateAdversary',
    async (userId) => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(
        mockSession as unknown as GetSessionResult,
      );
      vi.mocked(updateAdversary).mockResolvedValueOnce(null);

      const res = await POST(
        makeReq({
          adversary: mockAdversary,
          userAdversary: { ...mockUserAdversary, userId },
        }),
        { params },
      );

      expect(res.status).toBe(404);
      expect(updateAdversary).toHaveBeenCalledWith({
        id: 'adv-1',
        body: expect.objectContaining({ adversary: mockAdversary }),
        session: mockSession,
      });
      expect(insertAdversary).not.toHaveBeenCalled();
      expect(limitAdversaryInserts).not.toHaveBeenCalled();
    },
  );

  it('returns 404 with no insert when updateAdversary resolves null', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    vi.mocked(updateAdversary).mockResolvedValueOnce(null);

    const res = await POST(makeReq({ adversary: mockAdversary }), { params });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({
      success: false,
      error: { name: 'NotFound', message: 'Not found' },
    });
    expect(insertAdversary).not.toHaveBeenCalled();
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
    expect(updateAdversary).not.toHaveBeenCalled();
  });

  it('returns 413 when content-length is over the limit', async () => {
    const res = await POST(
      makeReq(
        { adversary: mockAdversary },
        { 'content-length': String(MAX_REQUEST_BODY_SIZE + 1) },
      ),
      { params },
    );

    expect(res.status).toBe(413);
    expect(updateAdversary).not.toHaveBeenCalled();
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
    expect(updateAdversary).not.toHaveBeenCalled();
  });

  it('returns 400 ValidationError when updateAdversary rejects with a ZodError', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(
      mockSession as unknown as GetSessionResult,
    );
    const result = z
      .object({ level: z.number().int() })
      .safeParse({ level: 1.5 });
    const zodError = result.success ? new Error('unreachable') : result.error;
    vi.mocked(updateAdversary).mockRejectedValueOnce(zodError);

    const res = await POST(makeReq({ adversary: { type: 1 } }), { params });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toEqual({
      name: 'ValidationError',
      message: 'Invalid request body',
    });
  });
});
