import 'server-only';

import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/database';
import {
  adversaryPreviews,
  userAdversaries,
  userCards,
} from '@/lib/database/schema';

export const isPublicCard = async (id: string): Promise<boolean> => {
  const [card] = await db
    .select({ id: userCards.id })
    .from(userCards)
    .where(and(eq(userCards.id, id), eq(userCards.public, true)));
  return Boolean(card);
};

export const getPublicAdversaryType = async (
  id: string,
): Promise<string | null> => {
  const [adversary] = await db
    .select({ type: adversaryPreviews.type })
    .from(userAdversaries)
    .leftJoin(
      adversaryPreviews,
      eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id),
    )
    .where(and(eq(userAdversaries.id, id), eq(userAdversaries.public, true)));
  return adversary ? (adversary.type ?? '') : null;
};
