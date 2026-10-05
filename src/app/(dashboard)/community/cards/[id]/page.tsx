import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { db } from '@/lib/database';
import { publicAuthor } from '@/lib/database/selections';
import {
  cardPreviews,
  userCardComments,
  userCards,
  users,
} from '@/lib/database/schema';
import type {
  CardDetails,
  CommentWithUser,
  PublicAuthor,
  UserCard,
  UserCardComment,
} from '@/lib/types';

import { CommunityCardDetail } from './client';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [result] = await db
    .select({ name: cardPreviews.name })
    .from(userCards)
    .leftJoin(cardPreviews, eq(userCards.cardPreviewId, cardPreviews.id))
    .where(and(eq(userCards.id, id), eq(userCards.public, true)));
  const name = result?.name ?? 'Community Card';
  return { title: `${name} — Community Cards` };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const [result] = await db
    .select({
      user_cards: userCards,
      users: publicAuthor,
      card_previews: cardPreviews,
    })
    .from(userCards)
    .leftJoin(users, eq(userCards.userId, users.id))
    .leftJoin(cardPreviews, eq(userCards.cardPreviewId, cardPreviews.id))
    .where(and(eq(userCards.id, id), eq(userCards.public, true)));

  if (!result?.card_previews) notFound();

  const rawComments = await db
    .select({
      user_card_comments: userCardComments,
      users: publicAuthor,
    })
    .from(userCardComments)
    .leftJoin(users, eq(userCardComments.userId, users.id))
    .where(eq(userCardComments.userCardId, id))
    .orderBy(userCardComments.createdAt);

  const postComments: CommentWithUser<UserCardComment>[] = rawComments.map(
    (row) => ({
      comment: row.user_card_comments as UserCardComment,
      user: row.users,
    }),
  );

  return (
    <CommunityCardDetail
      userCard={result.user_cards as UserCard}
      cardPreview={result.card_previews as CardDetails}
      user={result.users as PublicAuthor}
      comments={postComments}
    />
  );
}
