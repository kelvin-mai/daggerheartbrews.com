import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('sanitize-html', () => ({
  default: vi.fn((html: string) => html),
}));

vi.mock('@/lib/database', () => ({
  db: {
    select: vi.fn(),
    transaction: vi.fn(),
  },
}));

import {
  limitCardInserts,
  insertCard,
  updateCard,
  limitAdversaryInserts,
  insertAdversary,
  updateAdversary,
} from '@/actions/user-items';
import { db } from '@/lib/database';

type DbSelectResult = ReturnType<(typeof db)['select']>;
type TransactionCallback = Parameters<(typeof db)['transaction']>[0];
type TransactionArg = Parameters<TransactionCallback>[0];

const mockSession = { user: { id: 'user-1', email: 'user@example.com' } };

const mockCard = { id: 'card-1', name: 'Test Card', type: 'ancestry' as const };
const mockCardPreview = { id: 'card-1', name: 'Test Card', type: 'ancestry' };
const mockUserCard = { id: 'uc-1', userId: 'user-1', cardPreviewId: 'card-1' };

const mockAdversary = { id: 'adv-1', name: 'Test Adversary', type: 'standard' };
const mockAdversaryPreview = {
  id: 'adv-1',
  name: 'Test Adversary',
  type: 'standard',
};
const mockUserAdversary = {
  id: 'ua-1',
  userId: 'user-1',
  adversaryPreviewId: 'adv-1',
};

const makeSelectChain = (resolveValue: unknown) =>
  ({
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(resolveValue),
  }) as unknown as DbSelectResult;

describe('user-items', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('limitCardInserts', () => {
    it('resolves when count is below the limit', async () => {
      vi.mocked(db.select).mockReturnValue(makeSelectChain([{ count: 5 }]));
      await expect(
        limitCardInserts({ session: mockSession, limit: 10 }),
      ).resolves.toBeUndefined();
    });

    it('throws when count meets the limit', async () => {
      vi.mocked(db.select).mockReturnValue(makeSelectChain([{ count: 10 }]));
      await expect(
        limitCardInserts({ session: mockSession, limit: 10 }),
      ).rejects.toThrow('Insert limit met for current user');
    });

    it('uses default limit of 10', async () => {
      vi.mocked(db.select).mockReturnValue(makeSelectChain([{ count: 10 }]));
      await expect(limitCardInserts({ session: mockSession })).rejects.toThrow(
        'Insert limit met for current user',
      );
    });
  });

  describe('insertCard', () => {
    it('inserts card preview and user card in a transaction', async () => {
      const txMock = {
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockReturnThis(),
          returning: vi
            .fn()
            .mockResolvedValueOnce([mockCardPreview])
            .mockResolvedValueOnce([mockUserCard]),
        }),
      };
      vi.mocked(db.transaction).mockImplementation((fn) =>
        fn(txMock as unknown as TransactionArg),
      );

      const result = await insertCard({
        body: { card: mockCard },
        session: mockSession,
      });
      expect(result).toEqual({ card: mockCardPreview, userCard: mockUserCard });
      expect(txMock.insert).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateCard', () => {
    it('updates card preview and user card in a transaction', async () => {
      const txMock = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnThis(),
          where: vi.fn().mockReturnThis(),
          returning: vi
            .fn()
            .mockResolvedValueOnce([mockCardPreview])
            .mockResolvedValueOnce([mockUserCard]),
        }),
      };
      vi.mocked(db.transaction).mockImplementation((fn) =>
        fn(txMock as unknown as TransactionArg),
      );

      const result = await updateCard({
        id: 'card-1',
        body: { card: mockCard },
        session: mockSession,
      });
      expect(result).toEqual({ card: mockCardPreview, userCard: mockUserCard });
      expect(txMock.update).toHaveBeenCalledTimes(2);
    });
  });

  describe('limitAdversaryInserts', () => {
    it('resolves when count is below the limit', async () => {
      vi.mocked(db.select).mockReturnValue(makeSelectChain([{ count: 3 }]));
      await expect(
        limitAdversaryInserts({ session: mockSession, limit: 10 }),
      ).resolves.toBeUndefined();
    });

    it('throws when count meets the limit', async () => {
      vi.mocked(db.select).mockReturnValue(makeSelectChain([{ count: 10 }]));
      await expect(
        limitAdversaryInserts({ session: mockSession, limit: 10 }),
      ).rejects.toThrow('Insert limit met for current user');
    });
  });

  describe('insertAdversary', () => {
    it('inserts adversary preview and user adversary in a transaction', async () => {
      const txMock = {
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockReturnThis(),
          returning: vi
            .fn()
            .mockResolvedValueOnce([mockAdversaryPreview])
            .mockResolvedValueOnce([mockUserAdversary]),
        }),
      };
      vi.mocked(db.transaction).mockImplementation((fn) =>
        fn(txMock as unknown as TransactionArg),
      );

      const result = await insertAdversary({
        body: { adversary: mockAdversary },
        session: mockSession,
      });
      expect(result).toEqual({
        adversary: mockAdversaryPreview,
        userAdversary: mockUserAdversary,
      });
      expect(txMock.insert).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateAdversary', () => {
    it('updates adversary preview and user adversary in a transaction', async () => {
      const txMock = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnThis(),
          where: vi.fn().mockReturnThis(),
          returning: vi
            .fn()
            .mockResolvedValueOnce([mockAdversaryPreview])
            .mockResolvedValueOnce([mockUserAdversary]),
        }),
      };
      vi.mocked(db.transaction).mockImplementation((fn) =>
        fn(txMock as unknown as TransactionArg),
      );

      const result = await updateAdversary({
        id: 'adv-1',
        body: { adversary: mockAdversary },
        session: mockSession,
      });
      expect(result).toEqual({
        adversary: mockAdversaryPreview,
        userAdversary: mockUserAdversary,
      });
      expect(txMock.update).toHaveBeenCalledTimes(2);
    });
  });
});
