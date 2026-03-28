'use server';

import { adminDb } from '@/lib/database/admin';
import { users } from '@/lib/database/schema';
import { resend } from '@/lib/email';
import { env } from '@/lib/env';

export type SyncableUser = { email: string; name: string };

export const getSyncableUsers = async (): Promise<{
  data: SyncableUser[] | null;
  error: string | null;
}> => {
  if (!env.RESEND_AUDIENCE_ID) {
    return { data: null, error: 'RESEND_AUDIENCE_ID is not configured' };
  }
  const rows = await adminDb
    .select({ email: users.email, name: users.name })
    .from(users);
  return { data: rows, error: null };
};

export type SyncContactResult = { success: boolean; error: string | null };

export const syncContact = async (
  email: string,
  name: string,
): Promise<SyncContactResult> => {
  if (!resend) {
    return { success: false, error: 'Resend not configured' };
  }
  if (!env.RESEND_AUDIENCE_ID) {
    return { success: false, error: 'RESEND_AUDIENCE_ID is not configured' };
  }
  const { error } = await resend.contacts.create({
    audienceId: env.RESEND_AUDIENCE_ID,
    email,
    firstName: name.split(' ')[0],
    unsubscribed: false,
  });
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
};

export type AudienceItem = {
  id: string;
  name: string;
  createdAt: string;
};

export type ListAudiencesResult = {
  data: AudienceItem[] | null;
  error: string | null;
};

export const listAudiences = async (): Promise<ListAudiencesResult> => {
  if (!resend) {
    return { data: null, error: 'Resend not configured' };
  }
  const { data, error } = await resend.audiences.list();
  if (error || !data)
    return { data: null, error: error?.message ?? 'Failed to list audiences' };
  return {
    data: data.data.map((a) => ({
      id: a.id,
      name: a.name,
      createdAt: a.created_at,
    })),
    error: null,
  };
};

export type CreateAudienceResult = {
  data: { id: string; name: string } | null;
  error: string | null;
};

export const createAudience = async (
  name: string,
): Promise<CreateAudienceResult> => {
  if (!resend) {
    return { data: null, error: 'Resend not configured' };
  }
  const { data, error } = await resend.audiences.create({ name });
  if (error || !data)
    return { data: null, error: error?.message ?? 'Failed to create audience' };
  return { data: { id: data.id, name: data.name }, error: null };
};

export type BroadcastTemplate = 'update' | 'changelog';

export type SendBroadcastParams = {
  template: BroadcastTemplate;
  subject: string;
  name: string;
};

export type SendBroadcastResult = {
  data: { id: string } | null;
  error: string | null;
};

export const sendBroadcast = async (
  params: SendBroadcastParams,
): Promise<SendBroadcastResult> => {
  if (!env.RESEND_AUDIENCE_ID) {
    return { data: null, error: 'RESEND_AUDIENCE_ID is not configured' };
  }

  const { sendUpdateBroadcast, sendChangelogBroadcast } =
    await import('@/lib/email');

  if (params.template === 'update') {
    return sendUpdateBroadcast({
      subject: params.subject,
      name: params.name,
    });
  }

  if (params.template === 'changelog') {
    return sendChangelogBroadcast({
      subject: params.subject,
      name: params.name,
    });
  }

  return { data: null, error: 'Unknown template' };
};
