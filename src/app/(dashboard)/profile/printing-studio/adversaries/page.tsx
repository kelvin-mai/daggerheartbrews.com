// server component (default in app router)

import Link from 'next/link';
import { headers } from 'next/headers';

import { db } from '@/lib/database';
import { adversaryPreviews, userAdversaries } from '@/lib/database/schema';
import { auth } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';
import { AdversaryList } from './client';

export const metadata = {
  title: 'Select Adversaries to Print',
};

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return (
      <div>
        <h1 className='font-eveleth-clean text-2xl font-bold'>Print Your Adversaries</h1>
        <p className='text-muted-foreground'>You must be signed in to view your adversaries.</p>
        <Link href='/login' className='underline'>Sign in</Link>
      </div>
    );
  }

  const data = await db
    .select()
    .from(userAdversaries)
    .leftJoin(adversaryPreviews, eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id))
    .where(eq(userAdversaries.userId, session.user.id))
    .orderBy(desc(userAdversaries.updatedAt), desc(userAdversaries.createdAt));

  return (
    <div>
      <h1 className='font-eveleth-clean text-2xl font-bold'>Select Adversaries</h1>
      <p className='text-muted-foreground'>Choose which of your adversaries you want to print.</p>
      <div className='mt-4'>
        <AdversaryList items={data.map((row) => ({
          userAdversaries: row.user_adversaries,
          adversaryPreviews: row.adversary_previews,
        }))} />
      </div>
    </div>
  );
}


