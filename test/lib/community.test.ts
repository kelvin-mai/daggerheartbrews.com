import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('server-only', () => ({}));

vi.mock('@/lib/database', () => ({
  db: { select: vi.fn() },
}));

import { db } from '@/lib/database';
import { getPublicAdversaryType, isPublicCard } from '@/lib/community';

type DbSelectResult = ReturnType<(typeof db)['select']>;

const ID = '00000000-0000-0000-0000-000000000001';

const makeSelectChain = (resolveValue: unknown) =>
  ({
    from: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValueOnce(resolveValue),
  }) as unknown as DbSelectResult;

beforeEach(() => {
  vi.resetAllMocks();
});

describe('community/isPublicCard', () => {
  it('returns true for a public card', async () => {
    vi.mocked(db.select).mockReturnValueOnce(makeSelectChain([{ id: ID }]));

    expect(await isPublicCard(ID)).toBe(true);
  });

  it('returns false for a private or missing card', async () => {
    vi.mocked(db.select).mockReturnValueOnce(makeSelectChain([]));

    expect(await isPublicCard(ID)).toBe(false);
  });
});

describe('community/getPublicAdversaryType', () => {
  it('returns the preview type for a public adversary', async () => {
    vi.mocked(db.select).mockReturnValueOnce(
      makeSelectChain([{ type: 'environment' }]),
    );

    expect(await getPublicAdversaryType(ID)).toBe('environment');
  });

  it('returns an empty string when a public adversary has no preview type', async () => {
    vi.mocked(db.select).mockReturnValueOnce(makeSelectChain([{ type: null }]));

    expect(await getPublicAdversaryType(ID)).toBe('');
  });

  it('returns null for a private or missing adversary', async () => {
    vi.mocked(db.select).mockReturnValueOnce(makeSelectChain([]));

    expect(await getPublicAdversaryType(ID)).toBeNull();
  });
});
