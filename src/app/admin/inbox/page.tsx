import { listReceivedEmails } from '@/actions/inbox';
import { InboxSection } from '@/components/admin';

export default async function InboxPage() {
  const { data: initialEmails } = await listReceivedEmails();

  return (
    <div className='py-6'>
      <h1 className='mb-6 text-xl font-semibold'>Inbox</h1>
      <InboxSection initialEmails={initialEmails ?? []} />
    </div>
  );
}
