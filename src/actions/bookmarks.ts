'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import {
  userAdversaryBookmarks,
  userCardBookmarks,
} from '@/lib/database/schema';

const cardBookmarkSchema = z.object({ userCardId: z.string().uuid() });
const adversaryBookmarkSchema = z.object({
  userAdversaryId: z.string().uuid(),
});

export const toggleCardBookmark = async (input: {
  userCardId: string;
}): Promise<{ data: { bookmarked: boolean } | null; error: string | null }> => {
  try {
    const { userCardId } = cardBookmarkSchema.parse(input);
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { data: null, error: 'Unauthorized' };
    }
    const [existing] = await db
      .select()
      .from(userCardBookmarks)
      .where(
        and(
          eq(userCardBookmarks.userId, session.user.id),
          eq(userCardBookmarks.userCardId, userCardId),
        ),
      );
    if (existing) {
      await db
        .delete(userCardBookmarks)
        .where(eq(userCardBookmarks.id, existing.id));
      revalidatePath('/profile/bookmarks');
      return { data: { bookmarked: false }, error: null };
    }
    await db
      .insert(userCardBookmarks)
      .values({ userId: session.user.id, userCardId });
    revalidatePath('/profile/bookmarks');
    return { data: { bookmarked: true }, error: null };
  } catch {
    return { data: null, error: 'Failed to update bookmark' };
  }
};

export const toggleAdversaryBookmark = async (input: {
  userAdversaryId: string;
}): Promise<{ data: { bookmarked: boolean } | null; error: string | null }> => {
  try {
    const { userAdversaryId } = adversaryBookmarkSchema.parse(input);
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { data: null, error: 'Unauthorized' };
    }
    const [existing] = await db
      .select()
      .from(userAdversaryBookmarks)
      .where(
        and(
          eq(userAdversaryBookmarks.userId, session.user.id),
          eq(userAdversaryBookmarks.userAdversaryId, userAdversaryId),
        ),
      );
    if (existing) {
      await db
        .delete(userAdversaryBookmarks)
        .where(eq(userAdversaryBookmarks.id, existing.id));
      revalidatePath('/profile/bookmarks');
      return { data: { bookmarked: false }, error: null };
    }
    await db
      .insert(userAdversaryBookmarks)
      .values({ userId: session.user.id, userAdversaryId });
    revalidatePath('/profile/bookmarks');
    return { data: { bookmarked: true }, error: null };
  } catch {
    return { data: null, error: 'Failed to update bookmark' };
  }
};
