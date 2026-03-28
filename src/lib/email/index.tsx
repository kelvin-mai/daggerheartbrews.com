import { Resend } from 'resend';

import { env } from '../env';
import {
  ChangelogEmail,
  ContactEmail,
  ReplyEmail,
  ResetPasswordEmail,
  UpdateEmail,
  VerificationEmail,
} from '@/components/email';

export const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

const devLogEmail = ({
  to,
  subject,
  url,
}: {
  to: string;
  subject: string;
  url?: string;
}) => {
  console.log(`\n[DEV EMAIL] To: ${to}`);
  console.log(`Subject: ${subject}`);
  if (url) console.log(`URL: ${url}`);
  console.log('');
};

type AuthEmailParams = {
  user: { name: string; email: string };
  url: string;
};

export const sendVerificationEmail = async ({ user, url }: AuthEmailParams) => {
  if (!resend) {
    devLogEmail({
      to: user.email,
      subject: '[Action Required] Verify your email',
      url,
    });
    return { data: null, error: null };
  }
  return await resend.emails.send({
    from: 'no-reply@daggerheartbrews.com',
    to: [user.email],
    subject: '[Action Required] Verify your email',
    react: <VerificationEmail user={user} url={url} />,
  });
};

export const sendResetPasswordEmail = async ({
  user,
  url,
}: AuthEmailParams) => {
  if (!resend) {
    devLogEmail({
      to: user.email,
      subject: '[Action Required] Reset your password',
      url,
    });
    return { data: null, error: null };
  }
  return await resend.emails.send({
    from: 'no-reply@daggerheartbrews.com',
    to: [user.email],
    subject: '[Action Required] Reset your password',
    react: <ResetPasswordEmail user={user} url={url} />,
  });
};

type ContactEmailParams = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const addAudienceContact = async ({
  email,
  firstName,
  unsubscribed = false,
}: {
  email: string;
  firstName: string;
  unsubscribed?: boolean;
}) => {
  if (!env.RESEND_AUDIENCE_ID) return;
  if (!resend) return;
  return await resend.contacts.create({
    audienceId: env.RESEND_AUDIENCE_ID,
    email,
    firstName,
    unsubscribed,
  });
};

export const syncAudienceContact = async ({
  email,
  unsubscribed,
}: {
  email: string;
  unsubscribed: boolean;
}) => {
  if (!env.RESEND_AUDIENCE_ID) return;
  if (!resend) return;
  return await resend.contacts.create({
    audienceId: env.RESEND_AUDIENCE_ID,
    email,
    unsubscribed,
  });
};

export const getContactSubscriptionStatus = async (
  email: string,
): Promise<boolean> => {
  if (!env.RESEND_AUDIENCE_ID) return true;
  if (!resend) return true;
  const { data } = await resend.contacts.list({
    audienceId: env.RESEND_AUDIENCE_ID,
  });
  const contact = data?.data.find((c) => c.email === email);
  return contact ? !contact.unsubscribed : true;
};

type BroadcastParams = {
  subject: string;
  name: string;
};

export const sendChangelogBroadcast = async ({
  subject,
  name,
}: BroadcastParams & { version?: string }) => {
  if (!env.RESEND_AUDIENCE_ID)
    return { data: null, error: 'RESEND_AUDIENCE_ID is not configured' };
  if (!resend) return { data: null, error: 'Resend not configured' };
  const version = name;
  const { data, error } = await resend.broadcasts.create({
    audienceId: env.RESEND_AUDIENCE_ID,
    from: 'updates@daggerheartbrews.com',
    subject,
    name,
    react: <ChangelogEmail version={version} />,
  });
  if (error || !data)
    return {
      data: null,
      error: error?.message ?? 'Failed to create broadcast',
    };
  const result = await resend.broadcasts.send(data.id);
  return { data: result.data, error: result.error?.message ?? null };
};

export const sendUpdateBroadcast = async ({
  subject,
  name,
}: BroadcastParams) => {
  if (!env.RESEND_AUDIENCE_ID)
    return { data: null, error: 'RESEND_AUDIENCE_ID is not configured' };
  if (!resend) return { data: null, error: 'Resend not configured' };
  const { data, error } = await resend.broadcasts.create({
    audienceId: env.RESEND_AUDIENCE_ID,
    from: 'updates@daggerheartbrews.com',
    subject,
    name,
    react: <UpdateEmail />,
  });
  if (error || !data)
    return {
      data: null,
      error: error?.message ?? 'Failed to create broadcast',
    };
  const result = await resend.broadcasts.send(data.id);
  return { data: result.data, error: result.error?.message ?? null };
};

export const sendContactEmail = async (params: ContactEmailParams) => {
  if (!resend) {
    devLogEmail({
      to: 'contact@daggerheartbrews.com',
      subject: `[Contact] ${params.subject}`,
    });
    return { data: null, error: null };
  }
  return await resend.emails.send({
    from: 'contact@daggerheartbrews.com',
    to: ['me@kelvinmai.io', 'contact@daggerheartbrews.com'],
    replyTo: params.email,
    subject: `[Contact] ${params.subject}`,
    react: <ContactEmail {...params} />,
  });
};

type ReplyEmailParams = {
  toName: string;
  toEmail: string;
  originalSubject: string;
  replyMessage: string;
};

export const sendReplyEmail = async (params: ReplyEmailParams) => {
  if (!resend) {
    devLogEmail({
      to: params.toEmail,
      subject: `Re: ${params.originalSubject}`,
    });
    return { data: null, error: null };
  }
  return await resend.emails.send({
    from: 'contact@daggerheartbrews.com',
    to: [params.toEmail],
    replyTo: 'contact@daggerheartbrews.com',
    subject: `Re: ${params.originalSubject}`,
    react: <ReplyEmail {...params} />,
  });
};
