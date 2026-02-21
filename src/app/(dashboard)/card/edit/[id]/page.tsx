import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/database';
import { auth } from '@/lib/auth';
import { cardPreviews, userCards } from '@/lib/database/schema';
import type { CardDetails, UserCard } from '@/lib/types';
import { CardCreationForms } from '@/components/card-creation/forms';
import { CardCreationPreview } from '@/components/card-creation/preview';
import { CardEditInitializer } from './initializer';

export const metadata = {
  title: 'Edit Card',
  description: 'Edit your Daggerheart card.',
};

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  const [result] = await db
    .select()
    .from(userCards)
    .leftJoin(cardPreviews, eq(userCards.cardPreviewId, cardPreviews.id))
    .where(and(eq(userCards.id, id), eq(userCards.userId, session.user.id)));

  if (!result?.card_previews) notFound();

  return (
    <>
      <CardEditInitializer
        card={result.card_previews as CardDetails}
        userCard={result.user_cards as UserCard}
      />
      <h1 className='font-eveleth-clean dark:text-primary-foreground text-2xl font-bold'>
        Edit Card
      </h1>
      <p className='text-muted-foreground'>Edit your Daggerheart card.</p>
      <div className='flex flex-col-reverse gap-2 py-4 md:flex-row'>
        <CardCreationForms />
        <CardCreationPreview />
      </div>
    </>
  );
}
