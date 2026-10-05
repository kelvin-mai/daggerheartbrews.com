import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/admin', () => ({
  isAdmin: vi.fn(),
  isDevelopment: vi.fn(),
}));

vi.mock('@/lib/email', () => ({
  sendReplyEmail: vi.fn(),
}));

vi.mock('@/lib/env', () => ({
  env: { RESEND_API_KEY: 're_test' },
}));

import {
  getReceivedEmail,
  listReceivedEmails,
  replyToEmail,
} from '@/actions/inbox';
import { isAdmin } from '@/lib/admin';
import { sendReplyEmail } from '@/lib/email';

const fetchMock = vi.fn();

const replyParams = {
  toName: 'Ann',
  toEmail: 'ann@test.com',
  originalSubject: '[Contact] Hi',
  replyMessage: 'Hello',
};

describe('inbox actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('when not admin', () => {
    beforeEach(() => {
      vi.mocked(isAdmin).mockResolvedValue(false);
    });

    it('listReceivedEmails returns Not found', async () => {
      expect(await listReceivedEmails()).toEqual({
        data: null,
        error: 'Not found',
      });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('getReceivedEmail returns Not found', async () => {
      expect(await getReceivedEmail('id')).toEqual({
        data: null,
        error: 'Not found',
      });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('replyToEmail returns Not found', async () => {
      expect(await replyToEmail(replyParams)).toEqual({ error: 'Not found' });
      expect(sendReplyEmail).not.toHaveBeenCalled();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('when admin', () => {
    beforeEach(() => {
      vi.mocked(isAdmin).mockResolvedValue(true);
    });

    it('listReceivedEmails filters to contact emails', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          data: [
            { id: '1', from: 'a', subject: '[Contact] x', created_at: 'd' },
            { id: '2', from: 'b', subject: 'other', created_at: 'd' },
          ],
        }),
      });

      const result = await listReceivedEmails();

      expect(result.error).toBeNull();
      expect(result.data).toEqual([
        { id: '1', from: 'a', subject: '[Contact] x', receivedAt: 'd' },
      ]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('getReceivedEmail returns the email detail', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: '1',
          from: 'a',
          subject: 's',
          created_at: 'd',
          reply_to: ['r@test.com'],
          html: '<p>x</p>',
        }),
      });

      const result = await getReceivedEmail('1');

      expect(result.error).toBeNull();
      expect(result.data).toMatchObject({
        id: '1',
        replyTo: ['r@test.com'],
        text: null,
      });
    });

    it('replyToEmail sends the reply', async () => {
      vi.mocked(sendReplyEmail).mockResolvedValue({ error: null } as never);

      expect(await replyToEmail(replyParams)).toEqual({ error: null });
      expect(sendReplyEmail).toHaveBeenCalledWith(replyParams);
    });

    it('replyToEmail rejects invalid input without sending', async () => {
      const result = await replyToEmail({ ...replyParams, toEmail: 'bad' });

      expect(result.error).toBeTruthy();
      expect(sendReplyEmail).not.toHaveBeenCalled();
    });
  });
});
