'use client';

import { InboxSection } from '@/components/admin';
import { EmailPreviewClient } from '@/components/email';
import type { ReceivedEmail } from '@/actions/inbox';

type Template = {
  name: string;
  html: string;
};

type Props = {
  templates: Template[];
  initialEmails: ReceivedEmail[];
};

export const EmailsPageClient = ({ templates, initialEmails }: Props) => (
  <div className='py-6'>
    <h1 className='mb-6 text-xl font-semibold'>Emails</h1>
    <div className='mb-8'>
      <h2 className='mb-3 font-medium'>Inbox</h2>
      <InboxSection initialEmails={initialEmails} />
    </div>
    <div>
      <h2 className='mb-3 font-medium'>Template previews</h2>
      <EmailPreviewClient templates={templates} />
    </div>
  </div>
);
