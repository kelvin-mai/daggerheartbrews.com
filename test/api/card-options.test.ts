import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/database', () => ({
  db: { select: vi.fn() },
}));

import { GET } from '@/app/api/card-options/route';
import { db } from '@/lib/database';

type DbSelectResult = ReturnType<(typeof db)['select']>;

const mockDomains = [
  { id: 'd1', name: 'blade', color: '#ff0000', source: 'srd' },
];
const mockClasses = [
  {
    id: 'c1',
    name: 'Warrior',
    domainPrimary: 'blade',
    domainSecondary: 'bone',
    source: 'srd',
  },
];

describe('GET /api/card-options', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns domains and classes from the database', async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce({
        from: vi.fn().mockResolvedValue(mockDomains),
      } as unknown as DbSelectResult)
      .mockReturnValueOnce({
        from: vi.fn().mockResolvedValue(mockClasses),
      } as unknown as DbSelectResult);

    const res = await GET();
    const json = await res.json();

    expect(json).toEqual({ domains: mockDomains, classes: mockClasses });
  });

  it('returns empty arrays when database has no records', async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce({
        from: vi.fn().mockResolvedValue([]),
      } as unknown as DbSelectResult)
      .mockReturnValueOnce({
        from: vi.fn().mockResolvedValue([]),
      } as unknown as DbSelectResult);

    const res = await GET();
    const json = await res.json();

    expect(json).toEqual({ domains: [], classes: [] });
  });
});
