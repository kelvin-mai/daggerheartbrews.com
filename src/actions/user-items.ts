'use server';

import { and, count, eq } from 'drizzle-orm';
import sanitizeHtml from 'sanitize-html';

import { db } from '@/lib/database';
import {
  adversaryPreviews,
  cardPreviews,
  userAdversaries,
  userCards,
} from '@/lib/database/schema';
import type { AdversaryDetails, CardDetails, User } from '@/lib/types';

export const limitCardInserts = async ({
  session,
  limit = 100,
}: {
  session: { user: User };
  limit?: number;
}) => {
  const [result] = await db
    .select({ count: count() })
    .from(userCards)
    .where(eq(userCards.userId, session.user.id));
  if (result.count >= limit) {
    throw new Error('Insert limit met for current user');
  }
};

export const insertCard = async ({
  body,
  session,
}: {
  body: { card: CardDetails };
  session: { user: User };
}) => {
  return await db.transaction(async (tx) => {
    const { id: _id, ...insertCard } = body.card;
    const [card] = await tx
      .insert(cardPreviews)
      .values({ ...insertCard, text: sanitizeHtml(insertCard.text || '') })
      .returning();
    const [userCard] = await tx
      .insert(userCards)
      .values({ userId: session.user.id, cardPreviewId: card.id, public: true })
      .returning();
    return { card, userCard };
  });
};

export const updateCard = async ({
  id,
  body,
  session,
}: {
  id: string;
  body: { card: CardDetails; public?: boolean };
  session: { user: User };
}) => {
  return await db.transaction(async (tx) => {
    const [card] = await tx
      .update(cardPreviews)
      .set({ ...body.card, text: sanitizeHtml(body.card.text || '') })
      .where(eq(cardPreviews.id, id))
      .returning();
    const [userCard] = await tx
      .update(userCards)
      .set({ updatedAt: new Date(), ...(typeof body.public === 'boolean' ? { public: body.public } : {}) })
      .where(
        and(
          eq(userCards.userId, session.user.id),
          eq(userCards.cardPreviewId, id),
        ),
      )
      .returning();
    return { card, userCard };
  });
};

export const limitAdversaryInserts = async ({
  session,
  limit = 100,
}: {
  session: { user: User };
  limit?: number;
}) => {
  const [result] = await db
    .select({ count: count() })
    .from(userAdversaries)
    .where(eq(userAdversaries.userId, session.user.id));
  if (result.count >= limit) {
    throw new Error('Insert limit met for current user');
  }
};

export const insertAdversary = async ({
  body,
  session,
}: {
  body: { adversary: AdversaryDetails };
  session: { user: User };
}) => {
  return await db.transaction(async (tx) => {
    const { id: _id, ...insertAdversary } = body.adversary;
    const [adversary] = await tx
      .insert(adversaryPreviews)
      .values({
        ...insertAdversary,
        text: sanitizeHtml(insertAdversary.text || ''),
      })
      .returning();
    const [userAdversary] = await tx
      .insert(userAdversaries)
      .values({ userId: session.user.id, adversaryPreviewId: adversary.id, public: true })
      .returning();
    return { adversary, userAdversary };
  });
};

export const updateAdversary = async ({
  id,
  body,
  session,
}: {
  id: string;
  body: { adversary: AdversaryDetails; public?: boolean };
  session: { user: User };
}) => {
  return await db.transaction(async (tx) => {
    const [adversary] = await tx
      .update(adversaryPreviews)
      .set({ ...body.adversary, text: sanitizeHtml(body.adversary.text || '') })
      .where(eq(adversaryPreviews.id, id))
      .returning();
    const [userAdversary] = await tx
      .update(userAdversaries)
      .set({ updatedAt: new Date(), ...(typeof body.public === 'boolean' ? { public: body.public } : {}) })
      .where(
        and(
          eq(userAdversaries.userId, session.user.id),
          eq(userAdversaries.adversaryPreviewId, id),
        ),
      )
      .returning();
    return { adversary, userAdversary };
  });
};
