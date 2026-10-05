import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/admin', () => ({
  isAdmin: vi.fn(),
  isDevelopment: vi.fn(),
}));

vi.mock('@/lib/database/admin', () => ({
  adminDb: { select: vi.fn() },
}));

import { getUsers } from '@/actions/admin';
import { isAdmin } from '@/lib/admin';
import { adminDb } from '@/lib/database/admin';

type DbSelectResult = ReturnType<(typeof adminDb)['select']>;

const makeChains = (rows: unknown[], total: number) => {
  const rowsChain = {
    from: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockResolvedValue(rows),
  };
  const countChain = {
    from: vi.fn().mockResolvedValue([{ value: total }]),
  };
  vi.mocked(adminDb.select)
    .mockReturnValueOnce(rowsChain as unknown as DbSelectResult)
    .mockReturnValueOnce(countChain as unknown as DbSelectResult);
  return { rowsChain, countChain };
};

describe('getUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns Not found and does not query when not admin', async () => {
    vi.mocked(isAdmin).mockResolvedValue(false);

    const result = await getUsers();

    expect(result).toEqual({ data: null, error: 'Not found' });
    expect(adminDb.select).not.toHaveBeenCalled();
  });

  it('returns paginated users in { data, error } shape when admin', async () => {
    vi.mocked(isAdmin).mockResolvedValue(true);
    const rows = [{ id: 'u1', email: 'a@b.c' }];
    makeChains(rows, 41);

    const result = await getUsers(2);

    expect(result.error).toBeNull();
    expect(result.data).toEqual({
      data: rows,
      total: 41,
      page: 2,
      pageSize: 20,
      pageCount: 3,
    });
  });
});
