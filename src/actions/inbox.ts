'use server';

import { z } from 'zod';

import { env } from '@/lib/env';
import { sendReplyEmail } from '@/lib/email';

export type ReceivedEmail = {
  id: string;
  from: string;
  subject: string;
  receivedAt: string;
};

export type ReceivedEmailDetail = ReceivedEmail & {
  replyTo: string[];
  html: string | null;
  text: string | null;
};

const RESEND_BASE = 'https://api.resend.com';

const resendFetch = (path: string) =>
  fetch(`${RESEND_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

type ListParams = {
  limit?: number;
  after?: string;
  before?: string;
};

export const listReceivedEmails = async ({
  limit = 20,
  after,
  before,
}: ListParams = {}): Promise<{
  data: ReceivedEmail[] | null;
  error: string | null;
}> => {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    if (after) params.set('after', after);
    if (before) params.set('before', before);
    const res = await resendFetch(`/emails/receiving?${params}`);
    const json = await res.json();
    if (!res.ok)
      return { data: null, error: json.message ?? 'Failed to fetch emails' };
    const emails: ReceivedEmail[] = (json.data ?? [])
      .filter((e: { subject?: string }) => e.subject?.startsWith('[Contact]'))
      .map(
        (e: {
          id: string;
          from?: string;
          subject?: string;
          created_at?: string;
        }) => ({
          id: e.id,
          from: e.from ?? '',
          subject: e.subject ?? '',
          receivedAt: e.created_at ?? '',
        }),
      );
    return { data: emails, error: null };
  } catch (e) {
    return { data: null, error: (e as Error).message };
  }
};

export const getReceivedEmail = async (
  id: string,
): Promise<{ data: ReceivedEmailDetail | null; error: string | null }> => {
  try {
    const res = await resendFetch(`/emails/receiving/${id}`);
    const json = await res.json();
    if (!res.ok)
      return { data: null, error: json.message ?? 'Failed to fetch email' };
    return {
      data: {
        id: json.id,
        from: json.from ?? '',
        subject: json.subject ?? '',
        receivedAt: json.created_at ?? '',
        replyTo: Array.isArray(json.reply_to) ? json.reply_to : [],
        html: json.html ?? null,
        text: json.text ?? null,
      },
      error: null,
    };
  } catch (e) {
    return { data: null, error: (e as Error).message };
  }
};

const replySchema = z.object({
  toName: z.string().min(1),
  toEmail: z.string().email(),
  originalSubject: z.string().min(1),
  replyMessage: z.string().min(1, 'Reply message is required.'),
});

export const replyToEmail = async (
  params: z.infer<typeof replySchema>,
): Promise<{ error: string | null }> => {
  const validation = replySchema.safeParse(params);
  if (!validation.success) {
    const firstError = Object.values(
      validation.error.flatten().fieldErrors,
    ).flat()[0];
    return { error: firstError ?? 'Invalid input.' };
  }
  try {
    const { error } = await sendReplyEmail(validation.data);
    return { error: error ? error.message : null };
  } catch (e) {
    return { error: (e as Error).message };
  }
};
