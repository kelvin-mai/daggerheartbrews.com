import { Resend } from 'resend';

import { env } from '../env';
import {
  ChangelogEmail,
  ContactEmail,
  ResetPasswordEmail,
  VerificationEmail,
} from '@/components/email';

export const resend = new Resend(env.RESEND_API_KEY);

type AuthEmailParams = {
  user: { name: string; email: string };
  url: string;
};

export const sendVerificationEmail = async ({ user, url }: AuthEmailParams) => {
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
  const { data } = await resend.contacts.list({
    audienceId: env.RESEND_AUDIENCE_ID,
  });
  const contact = data?.data.find((c) => c.email === email);
  if (!contact) return;
  return await resend.contacts.update({
    audienceId: env.RESEND_AUDIENCE_ID,
    id: contact.id,
    unsubscribed,
  });
};

export const sendChangelogEmail = async ({ version }: { version: string }) => {
  if (!env.RESEND_AUDIENCE_ID) return { data: null, error: null };
  const { data, error } = await resend.broadcasts.create({
    audienceId: env.RESEND_AUDIENCE_ID,
    from: 'updates@daggerheartbrews.com',
    subject: `[dev update] DaggerheartBrews ${version}`,
    name: `changelog-${version}`,
    react: <ChangelogEmail version={version} />,
  });
  if (error || !data) return { data: null, error };
  return await resend.broadcasts.send(data.id);
};

export const sendContactEmail = async (params: ContactEmailParams) => {
  return await resend.emails.send({
    from: 'contact@daggerheartbrews.com',
    to: ['me@kelvinmai.io'],
    replyTo: params.email,
    subject: `[Contact] ${params.subject}`,
    react: <ContactEmail {...params} />,
  });
};
