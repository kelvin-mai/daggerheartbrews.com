import 'server-only';

import { and, count, eq } from 'drizzle-orm';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';

import { db } from '@/lib/database';
import {
  adversaryPreviews,
  cardPreviews,
  userAdversaries,
  userCards,
  userSettings,
} from '@/lib/database/schema';
import type { User } from '@/lib/types';
import { cardTypes } from '@/lib/types/card-creation';

const thresholds = z.tuple([z.number(), z.number()]).nullish();
const int = z.number().int().nullish();
const str = z.string().nullish();
const flag = z.boolean().nullish();

const cardPreviewSchema = z.object({
  name: z.string(),
  type: z.enum(cardTypes),
  image: str,
  text: str,
  artist: str,
  credits: str,
  subtype: str,
  subtitle: str,
  level: int,
  stress: int,
  evasion: int,
  thresholds,
  thresholdsEnabled: flag,
  tier: int,
  tierEnabled: flag,
  hands: int,
  handsEnabled: flag,
  armor: int,
  armorEnabled: flag,
  domainPrimary: str,
  domainPrimaryColor: str,
  domainPrimaryIcon: str,
  domainSecondary: str,
  domainSecondaryColor: str,
  domainSecondaryIcon: str,
});

const adversaryPreviewSchema = z.object({
  name: z.string(),
  type: z.string(),
  subtype: str,
  image: str,
  artist: str,
  credits: str,
  tier: int,
  description: str,
  subDescription: str,
  experience: str,
  text: str,
  difficulty: str,
  hp: int,
  stress: int,
  thresholds,
  attack: str,
  weapon: str,
  distance: str,
  damageType: str,
  damageAmount: str,
  potential: str,
});

export const limitCardInserts = async ({
  session,
  limit = 50,
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
  body: { card: unknown };
  session: { user: User };
}) => {
  const parsed = cardPreviewSchema.parse(body.card);
  const [prefs] = await db
    .select({ defaultVisibility: userSettings.defaultVisibility })
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id));
  return await db.transaction(async (tx) => {
    const [card] = await tx
      .insert(cardPreviews)
      .values({ ...parsed, text: sanitizeHtml(parsed.text ?? '') })
      .returning();
    const [userCard] = await tx
      .insert(userCards)
      .values({
        userId: session.user.id,
        cardPreviewId: card.id,
        public: prefs?.defaultVisibility ?? false,
      })
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
  body: { card: unknown };
  session: { user: User };
}) => {
  const parsed = cardPreviewSchema.parse(body.card);
  return await db.transaction(async (tx) => {
    const [userCard] = await tx
      .update(userCards)
      .set({ updatedAt: new Date() })
      .where(
        and(
          eq(userCards.userId, session.user.id),
          eq(userCards.cardPreviewId, id),
        ),
      )
      .returning();
    if (!userCard) {
      return null;
    }
    const [card] = await tx
      .update(cardPreviews)
      .set({ ...parsed, text: sanitizeHtml(parsed.text ?? '') })
      .where(eq(cardPreviews.id, userCard.cardPreviewId))
      .returning();
    return { card, userCard };
  });
};

export const limitAdversaryInserts = async ({
  session,
  limit = 25,
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
  body: { adversary: unknown };
  session: { user: User };
}) => {
  const parsed = adversaryPreviewSchema.parse(body.adversary);
  const [prefs] = await db
    .select({ defaultVisibility: userSettings.defaultVisibility })
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id));
  return await db.transaction(async (tx) => {
    const [adversary] = await tx
      .insert(adversaryPreviews)
      .values({ ...parsed, text: sanitizeHtml(parsed.text ?? '') })
      .returning();
    const [userAdversary] = await tx
      .insert(userAdversaries)
      .values({
        userId: session.user.id,
        adversaryPreviewId: adversary.id,
        public: prefs?.defaultVisibility ?? false,
      })
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
  body: { adversary: unknown };
  session: { user: User };
}) => {
  const parsed = adversaryPreviewSchema.parse(body.adversary);
  return await db.transaction(async (tx) => {
    const [userAdversary] = await tx
      .update(userAdversaries)
      .set({ updatedAt: new Date() })
      .where(
        and(
          eq(userAdversaries.userId, session.user.id),
          eq(userAdversaries.adversaryPreviewId, id),
        ),
      )
      .returning();
    if (!userAdversary) {
      return null;
    }
    const [adversary] = await tx
      .update(adversaryPreviews)
      .set({ ...parsed, text: sanitizeHtml(parsed.text ?? '') })
      .where(eq(adversaryPreviews.id, userAdversary.adversaryPreviewId))
      .returning();
    return { adversary, userAdversary };
  });
};
