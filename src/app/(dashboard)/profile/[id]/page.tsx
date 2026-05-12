import { and, eq, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { db } from '@/lib/database';
import {
  adversaryPreviews,
  cardPreviews,
  userAdversaries,
  userAdversaryComments,
  userCardComments,
  userCards,
  users,
} from '@/lib/database/schema';
import type {
  AdversaryDetails,
  CardDetails,
  User,
  UserAdversary,
  UserCard,
} from '@/lib/types';

import { UserProfile } from './client';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [user] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, id));
  return { title: user ? `${user.name}'s Profile` : 'Profile' };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) notFound();

  const cards = await db
    .select({
      user_cards: userCards,
      card_previews: cardPreviews,
      commentCount: sql<number>`(SELECT COUNT(*) FROM ${userCardComments} WHERE ${userCardComments.userCardId} = ${userCards.id})::int`,
    })
    .from(userCards)
    .leftJoin(cardPreviews, eq(userCards.cardPreviewId, cardPreviews.id))
    .where(and(eq(userCards.userId, id), eq(userCards.public, true)));

  const adversaries = await db
    .select({
      user_adversaries: userAdversaries,
      adversary_previews: adversaryPreviews,
      commentCount: sql<number>`(SELECT COUNT(*) FROM ${userAdversaryComments} WHERE ${userAdversaryComments.userAdversaryId} = ${userAdversaries.id})::int`,
    })
    .from(userAdversaries)
    .leftJoin(
      adversaryPreviews,
      eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id),
    )
    .where(
      and(eq(userAdversaries.userId, id), eq(userAdversaries.public, true)),
    );

  return (
    <UserProfile
      user={user as User}
      cards={
        cards as {
          user_cards: UserCard;
          card_previews: CardDetails | null;
          commentCount: number;
        }[]
      }
      adversaries={
        adversaries as {
          user_adversaries: UserAdversary;
          adversary_previews: AdversaryDetails | null;
          commentCount: number;
        }[]
      }
    />
  );
}
