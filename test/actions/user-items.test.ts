import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZodError } from 'zod';

vi.mock('sanitize-html', () => ({
  default: vi.fn((html: string) => `clean:${html}`),
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

type UpdateSession = Parameters<typeof updateCard>[0]['session'];

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

    it('uses default limit of 50', async () => {
      vi.mocked(db.select).mockReturnValue(makeSelectChain([{ count: 50 }]));
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
    const makeTx = (owned: unknown[]) => {
      const set = vi.fn().mockReturnThis();
      const where = vi.fn().mockReturnThis();
      const returning = vi
        .fn()
        .mockResolvedValueOnce(owned)
        .mockResolvedValueOnce([mockCardPreview]);
      const tx = {
        update: vi.fn().mockReturnValue({ set, where, returning }),
      };
      vi.mocked(db.transaction).mockImplementation((fn) =>
        fn(tx as unknown as TransactionArg),
      );
      return { tx, set, where };
    };

    it('updates the owned user row first, then the preview', async () => {
      const { tx } = makeTx([mockUserCard]);

      const result = await updateCard({
        id: 'card-1',
        body: { card: mockCard },
        session: mockSession as unknown as UpdateSession,
      });
      expect(result).toEqual({
        card: mockCardPreview,
        userCard: mockUserCard,
      });
      expect(tx.update).toHaveBeenCalledTimes(2);
    });

    it('returns null without touching the preview when not owned', async () => {
      const { tx } = makeTx([]);

      const result = await updateCard({
        id: 'card-1',
        body: { card: mockCard },
        session: mockSession as unknown as UpdateSession,
      });
      expect(result).toBeNull();
      expect(tx.update).toHaveBeenCalledTimes(1);
    });

    it('does not pass id to the preview set', async () => {
      const { set } = makeTx([mockUserCard]);

      await updateCard({
        id: 'card-1',
        body: { card: { ...mockCard, id: 'other-id' } },
        session: mockSession as unknown as UpdateSession,
      });
      expect(set).toHaveBeenCalledTimes(2);
      const previewSet = set.mock.calls[1][0];
      expect(previewSet).not.toHaveProperty('id');
      expect(previewSet).toMatchObject({
        name: 'mockCard'.length ? mockCard.name : '',
      });
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
    const makeTx = (owned: unknown[]) => {
      const set = vi.fn().mockReturnThis();
      const where = vi.fn().mockReturnThis();
      const returning = vi
        .fn()
        .mockResolvedValueOnce(owned)
        .mockResolvedValueOnce([mockAdversaryPreview]);
      const tx = {
        update: vi.fn().mockReturnValue({ set, where, returning }),
      };
      vi.mocked(db.transaction).mockImplementation((fn) =>
        fn(tx as unknown as TransactionArg),
      );
      return { tx, set, where };
    };

    it('updates the owned user row first, then the preview', async () => {
      const { tx } = makeTx([mockUserAdversary]);

      const result = await updateAdversary({
        id: 'adv-1',
        body: { adversary: mockAdversary },
        session: mockSession as unknown as UpdateSession,
      });
      expect(result).toEqual({
        adversary: mockAdversaryPreview,
        userAdversary: mockUserAdversary,
      });
      expect(tx.update).toHaveBeenCalledTimes(2);
    });

    it('returns null without touching the preview when not owned', async () => {
      const { tx } = makeTx([]);

      const result = await updateAdversary({
        id: 'adv-1',
        body: { adversary: mockAdversary },
        session: mockSession as unknown as UpdateSession,
      });
      expect(result).toBeNull();
      expect(tx.update).toHaveBeenCalledTimes(1);
    });

    it('does not pass id to the preview set', async () => {
      const { set } = makeTx([mockUserAdversary]);

      await updateAdversary({
        id: 'adv-1',
        body: { adversary: { ...mockAdversary, id: 'other-id' } },
        session: mockSession as unknown as UpdateSession,
      });
      expect(set).toHaveBeenCalledTimes(2);
      const previewSet = set.mock.calls[1][0];
      expect(previewSet).not.toHaveProperty('id');
      expect(previewSet).toMatchObject({
        name: 'mockAdversary'.length ? mockAdversary.name : '',
      });
    });
  });
});

describe('user-items preview validation', () => {
  beforeEach(() => vi.clearAllMocks());

  const extras = {
    id: 'evil-id',
    createdAt: 'x',
    userId: 'other',
    source: 'srd',
    features: [],
  };
  const cardInput = { name: 'Card', type: 'domain', text: '<b>hi</b>' };
  const advInput = { name: 'Adv', type: 'standard', text: '<b>hi</b>' };
  const forbidden = ['id', 'createdAt', 'userId', 'source', 'features'];

  const makeInsertTx = (rows: unknown[]) => {
    const values = vi.fn().mockReturnThis();
    const returning = vi
      .fn()
      .mockResolvedValueOnce([{ id: 'p-1' }])
      .mockResolvedValueOnce(rows);
    const tx = { insert: vi.fn().mockReturnValue({ values, returning }) };
    vi.mocked(db.transaction).mockImplementation((fn) =>
      fn(tx as unknown as TransactionArg),
    );
    vi.mocked(db.select).mockReturnValue(makeSelectChain([]));
    return { tx, values };
  };

  const makeUpdateTx = (owned: unknown[]) => {
    const set = vi.fn().mockReturnThis();
    const returning = vi
      .fn()
      .mockResolvedValueOnce(owned)
      .mockResolvedValueOnce([{ id: 'p-1' }]);
    const tx = {
      update: vi.fn().mockReturnValue({
        set,
        where: vi.fn().mockReturnThis(),
        returning,
      }),
    };
    vi.mocked(db.transaction).mockImplementation((fn) =>
      fn(tx as unknown as TransactionArg),
    );
    return { tx, set };
  };

  const session = mockSession as unknown as UpdateSession;

  it('strips extra keys from updateCard set', async () => {
    const { set } = makeUpdateTx([mockUserCard]);
    await updateCard({
      id: 'card-1',
      body: { card: { ...cardInput, ...extras } },
      session,
    });
    const arg = set.mock.calls[1][0];
    for (const key of forbidden) expect(arg).not.toHaveProperty(key);
    expect(arg).toMatchObject({ name: 'Card', type: 'domain' });
  });

  it('strips extra keys from insertCard values', async () => {
    const { values } = makeInsertTx([mockUserCard]);
    await insertCard({
      body: { card: { ...cardInput, ...extras } },
      session,
    });
    const arg = values.mock.calls[0][0];
    for (const key of forbidden) expect(arg).not.toHaveProperty(key);
  });

  it('strips extra keys from updateAdversary set', async () => {
    const { set } = makeUpdateTx([mockUserAdversary]);
    await updateAdversary({
      id: 'adv-1',
      body: { adversary: { ...advInput, ...extras } },
      session,
    });
    const arg = set.mock.calls[1][0];
    for (const key of forbidden) expect(arg).not.toHaveProperty(key);
  });

  it('strips extra keys from insertAdversary values', async () => {
    const { values } = makeInsertTx([mockUserAdversary]);
    await insertAdversary({
      body: { adversary: { ...advInput, ...extras } },
      session,
    });
    const arg = values.mock.calls[0][0];
    for (const key of forbidden) expect(arg).not.toHaveProperty(key);
  });

  it('accepts null optional fields from a database row', async () => {
    const { set } = makeUpdateTx([mockUserCard]);
    await expect(
      updateCard({
        id: 'card-1',
        body: {
          card: {
            ...cardInput,
            image: null,
            artist: null,
            level: null,
            thresholds: null,
            domainSecondary: null,
            handsEnabled: null,
          },
        },
        session,
      }),
    ).resolves.not.toBeNull();
    expect(set).toHaveBeenCalledTimes(2);

    makeUpdateTx([mockUserAdversary]);
    await expect(
      updateAdversary({
        id: 'adv-1',
        body: {
          adversary: {
            ...advInput,
            subtype: null,
            hp: null,
            thresholds: null,
            potential: null,
          },
        },
        session,
      }),
    ).resolves.not.toBeNull();
  });

  it('produces the same card column set on insert and update', async () => {
    const input = {
      ...cardInput,
      level: 2,
      thresholds: [1, 2],
      ...extras,
    };
    const { values } = makeInsertTx([mockUserCard]);
    await insertCard({ body: { card: input }, session });
    const { set } = makeUpdateTx([mockUserCard]);
    await updateCard({ id: 'card-1', body: { card: input }, session });
    expect(Object.keys(set.mock.calls[1][0]).sort()).toEqual(
      Object.keys(values.mock.calls[0][0]).sort(),
    );
  });

  it('produces the same adversary column set on insert and update', async () => {
    const input = { ...advInput, hp: 5, thresholds: [1, 2], ...extras };
    const { values } = makeInsertTx([mockUserAdversary]);
    await insertAdversary({
      body: { adversary: input },
      session,
    });
    const { set } = makeUpdateTx([mockUserAdversary]);
    await updateAdversary({
      id: 'adv-1',
      body: { adversary: input },
      session,
    });
    expect(Object.keys(set.mock.calls[1][0]).sort()).toEqual(
      Object.keys(values.mock.calls[0][0]).sort(),
    );
  });

  it('sanitizes text on insert and update', async () => {
    const { values } = makeInsertTx([mockUserCard]);
    await insertCard({ body: { card: cardInput }, session });
    expect(values.mock.calls[0][0].text).toBe('clean:<b>hi</b>');

    const { set } = makeUpdateTx([mockUserCard]);
    await updateCard({ id: 'card-1', body: { card: cardInput }, session });
    expect(set.mock.calls[1][0].text).toBe('clean:<b>hi</b>');
  });

  it('turns missing or null text into a sanitized empty string', async () => {
    const { values } = makeInsertTx([mockUserAdversary]);
    await insertAdversary({
      body: { adversary: { name: 'Adv', type: 'standard' } },
      session,
    });
    expect(values.mock.calls[0][0].text).toBe('clean:');

    const { set } = makeUpdateTx([mockUserCard]);
    await updateCard({
      id: 'card-1',
      body: { card: { name: 'Card', type: 'domain', text: null } },
      session,
    });
    expect(set.mock.calls[1][0].text).toBe('clean:');
  });

  describe('invalid input rejects with ZodError before any db call', () => {
    it.each([
      ['card type outside cardTypes', { name: 'C', type: 'bogus' }],
      ['non-integer level', { ...cardInput, level: 1.5 }],
      ['missing name', { type: 'domain' }],
      ['malformed thresholds', { ...cardInput, thresholds: [1] }],
    ])('insertCard and updateCard: %s', async (_, card) => {
      await expect(
        insertCard({ body: { card }, session }),
      ).rejects.toBeInstanceOf(ZodError);
      await expect(
        updateCard({ id: 'card-1', body: { card }, session }),
      ).rejects.toBeInstanceOf(ZodError);
      expect(db.select).not.toHaveBeenCalled();
      expect(db.transaction).not.toHaveBeenCalled();
    });

    it.each([
      ['non-string type', { name: 'A', type: 1 }],
      ['non-integer hp', { ...advInput, hp: 2.5 }],
      ['non-object body', 'nope'],
    ])('insertAdversary and updateAdversary: %s', async (_, adversary) => {
      await expect(
        insertAdversary({ body: { adversary }, session }),
      ).rejects.toBeInstanceOf(ZodError);
      await expect(
        updateAdversary({ id: 'adv-1', body: { adversary }, session }),
      ).rejects.toBeInstanceOf(ZodError);
      expect(db.select).not.toHaveBeenCalled();
      expect(db.transaction).not.toHaveBeenCalled();
    });
  });
});
