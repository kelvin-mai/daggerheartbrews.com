import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

import type { CardDetails, UserCard } from '@/lib/types';
import { db } from '@/lib/database';
import { auth } from '@/lib/auth';
import {
  cardPreviews,
  userCardBookmarks,
  userCards,
} from '@/lib/database/schema';
import { PageHeader } from '@/components/common';

import { PrintSheetClient } from './client';

export type PrintableCard = {
  cardPreview: CardDetails;
  userCard: UserCard;
  source: 'own' | 'bookmarked';
};

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect('/login');
  }

  const [ownData, bookmarkData] = await Promise.all([
    db
      .select()
      .from(userCards)
      .leftJoin(cardPreviews, eq(userCards.cardPreviewId, cardPreviews.id))
      .where(eq(userCards.userId, session.user.id)),
    db
      .select()
      .from(userCardBookmarks)
      .innerJoin(userCards, eq(userCardBookmarks.userCardId, userCards.id))
      .innerJoin(cardPreviews, eq(userCards.cardPreviewId, cardPreviews.id))
      .where(eq(userCardBookmarks.userId, session.user.id)),
  ]);

  const ownCards: PrintableCard[] = ownData
    .filter((row) => row.card_previews !== null)
    .map((row) => ({
      cardPreview: row.card_previews as CardDetails,
      userCard: row.user_cards as UserCard,
      source: 'own' as const,
    }));

  const ownIds = new Set(ownCards.map((c) => c.userCard.id));

  const bookmarkedCards: PrintableCard[] = bookmarkData
    .filter((row) => !ownIds.has(row.user_cards.id))
    .map((row) => ({
      cardPreview: row.card_previews as CardDetails,
      userCard: row.user_cards as UserCard,
      source: 'bookmarked' as const,
    }));

  const cards = [...ownCards, ...bookmarkedCards];

  return (
    <div className='mb-4 space-y-4'>
      <PageHeader
        title='Print Sheet'
        subtitle='Download your cards as a print-ready PDF.'
      />
      <PrintSheetClient cards={cards} />
    </div>
  );
}
