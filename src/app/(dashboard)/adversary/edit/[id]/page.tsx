import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/database';
import { auth } from '@/lib/auth';
import { adversaryPreviews, userAdversaries } from '@/lib/database/schema';
import type { AdversaryDetails, UserAdversary } from '@/lib/types';
import { AdversaryCreationForms } from '@/components/adversary-creation/forms';
import { AdversaryCreationPreview } from '@/components/adversary-creation/preview';
import { AdversaryEditInitializer } from './initializer';

export const metadata = {
  title: 'Edit Adversary',
  description: 'Edit your Daggerheart adversary.',
};

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  const [result] = await db
    .select()
    .from(userAdversaries)
    .leftJoin(
      adversaryPreviews,
      eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id),
    )
    .where(
      and(
        eq(userAdversaries.id, id),
        eq(userAdversaries.userId, session.user.id),
      ),
    );

  if (!result?.adversary_previews) notFound();

  return (
    <>
      <AdversaryEditInitializer
        adversary={result.adversary_previews as AdversaryDetails}
        userAdversary={result.user_adversaries as UserAdversary}
      />
      <h1 className='font-eveleth-clean dark:text-primary-foreground text-2xl font-bold'>
        Edit Adversary
      </h1>
      <p className='text-muted-foreground'>Edit your Daggerheart adversary.</p>
      <div className='flex flex-col-reverse gap-2 py-4 md:flex-row'>
        <AdversaryCreationForms />
        <AdversaryCreationPreview />
      </div>
    </>
  );
}
