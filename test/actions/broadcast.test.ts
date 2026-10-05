import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/admin', () => ({
  isAdmin: vi.fn(),
  isDevelopment: vi.fn(),
}));

vi.mock('@/lib/database/admin', () => ({
  adminDb: { select: vi.fn() },
}));

vi.mock('@/lib/email', () => ({
  resend: {
    contacts: { create: vi.fn() },
    audiences: { list: vi.fn(), create: vi.fn() },
  },
  sendUpdateBroadcast: vi.fn(),
  sendChangelogBroadcast: vi.fn(),
}));

vi.mock('@/lib/env', () => ({
  env: { RESEND_AUDIENCE_ID: 'aud-1' },
}));

import {
  createAudience,
  getSyncableUsers,
  listAudiences,
  sendBroadcast,
  syncContact,
} from '@/actions/broadcast';
import { isAdmin } from '@/lib/admin';
import { adminDb } from '@/lib/database/admin';
import {
  resend,
  sendChangelogBroadcast,
  sendUpdateBroadcast,
} from '@/lib/email';

type DbSelectResult = ReturnType<(typeof adminDb)['select']>;

const expectNoSideEffects = () => {
  expect(adminDb.select).not.toHaveBeenCalled();
  expect(resend!.contacts.create).not.toHaveBeenCalled();
  expect(resend!.audiences.list).not.toHaveBeenCalled();
  expect(resend!.audiences.create).not.toHaveBeenCalled();
  expect(sendUpdateBroadcast).not.toHaveBeenCalled();
  expect(sendChangelogBroadcast).not.toHaveBeenCalled();
};

describe('broadcast actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when not admin', () => {
    beforeEach(() => {
      vi.mocked(isAdmin).mockResolvedValue(false);
    });

    it('getSyncableUsers returns Not found', async () => {
      expect(await getSyncableUsers()).toEqual({
        data: null,
        error: 'Not found',
      });
      expectNoSideEffects();
    });

    it('syncContact returns Not found', async () => {
      expect(await syncContact('a@b.c', 'A B')).toEqual({
        success: false,
        error: 'Not found',
      });
      expectNoSideEffects();
    });

    it('listAudiences returns Not found', async () => {
      expect(await listAudiences()).toEqual({ data: null, error: 'Not found' });
      expectNoSideEffects();
    });

    it('createAudience returns Not found', async () => {
      expect(await createAudience('x')).toEqual({
        data: null,
        error: 'Not found',
      });
      expectNoSideEffects();
    });

    it.each(['update', 'changelog'] as const)(
      'sendBroadcast (%s) returns Not found',
      async (template) => {
        expect(
          await sendBroadcast({ template, subject: 's', name: 'n' }),
        ).toEqual({ data: null, error: 'Not found' });
        expectNoSideEffects();
      },
    );
  });

  describe('when admin', () => {
    beforeEach(() => {
      vi.mocked(isAdmin).mockResolvedValue(true);
    });

    it('getSyncableUsers returns users', async () => {
      const rows = [{ email: 'a@b.c', name: 'A' }];
      vi.mocked(adminDb.select).mockReturnValue({
        from: vi.fn().mockResolvedValue(rows),
      } as unknown as DbSelectResult);

      expect(await getSyncableUsers()).toEqual({ data: rows, error: null });
    });

    it('syncContact creates a contact', async () => {
      vi.mocked(resend!.contacts.create).mockResolvedValue({
        data: {},
        error: null,
      } as never);

      expect(await syncContact('a@b.c', 'Ann Lee')).toEqual({
        success: true,
        error: null,
      });
      expect(resend!.contacts.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'a@b.c', firstName: 'Ann' }),
      );
    });

    it('listAudiences maps audiences', async () => {
      vi.mocked(resend!.audiences.list).mockResolvedValue({
        data: { data: [{ id: '1', name: 'n', created_at: 'd' }] },
        error: null,
      } as never);

      expect(await listAudiences()).toEqual({
        data: [{ id: '1', name: 'n', createdAt: 'd' }],
        error: null,
      });
    });

    it('createAudience creates an audience', async () => {
      vi.mocked(resend!.audiences.create).mockResolvedValue({
        data: { id: '1', name: 'n' },
        error: null,
      } as never);

      expect(await createAudience('n')).toEqual({
        data: { id: '1', name: 'n' },
        error: null,
      });
    });

    it('sendBroadcast dispatches to the update sender', async () => {
      vi.mocked(sendUpdateBroadcast).mockResolvedValue({
        data: { id: 'b1' },
        error: null,
      } as never);

      const result = await sendBroadcast({
        template: 'update',
        subject: 's',
        name: 'n',
      });

      expect(result).toEqual({ data: { id: 'b1' }, error: null });
      expect(sendUpdateBroadcast).toHaveBeenCalledWith({
        subject: 's',
        name: 'n',
      });
    });

    it('sendBroadcast dispatches to the changelog sender', async () => {
      vi.mocked(sendChangelogBroadcast).mockResolvedValue({
        data: { id: 'b2' },
        error: null,
      } as never);

      const result = await sendBroadcast({
        template: 'changelog',
        subject: 's',
        name: 'n',
      });

      expect(result).toEqual({ data: { id: 'b2' }, error: null });
    });
  });
});
