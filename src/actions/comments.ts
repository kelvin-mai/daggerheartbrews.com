'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import {
  adversaryPreviews,
  userAdversaries,
  userAdversaryComments,
  userCardComments,
} from '@/lib/database/schema';
import type { UserAdversaryComment, UserCardComment } from '@/lib/types';

const cardCommentSchema = z.object({
  userCardId: z.string().uuid(),
  body: z.string().min(1).max(2000),
});

const adversaryCommentSchema = z.object({
  userAdversaryId: z.string().uuid(),
  body: z.string().min(1).max(2000),
});

const deleteCommentSchema = z.object({ commentId: z.string().uuid() });

export const createCardComment = async (input: {
  userCardId: string;
  body: string;
}): Promise<{
  data: { comment: UserCardComment } | null;
  error: string | null;
}> => {
  try {
    const { userCardId, body } = cardCommentSchema.parse(input);
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { data: null, error: 'Unauthorized' };

    const [comment] = await db
      .insert(userCardComments)
      .values({ userId: session.user.id, userCardId, body })
      .returning();

    revalidatePath(`/community/cards/${userCardId}`);
    return { data: { comment: comment as UserCardComment }, error: null };
  } catch {
    return { data: null, error: 'Failed to post comment' };
  }
};

export const deleteCardComment = async (input: {
  commentId: string;
}): Promise<{ data: { commentId: string } | null; error: string | null }> => {
  try {
    const { commentId } = deleteCommentSchema.parse(input);
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { data: null, error: 'Unauthorized' };

    const [comment] = await db
      .select()
      .from(userCardComments)
      .where(eq(userCardComments.id, commentId));

    if (!comment || comment.userId !== session.user.id) {
      return { data: null, error: 'Not found' };
    }

    await db
      .delete(userCardComments)
      .where(
        and(
          eq(userCardComments.id, commentId),
          eq(userCardComments.userId, session.user.id),
        ),
      );

    revalidatePath(`/community/cards/${comment.userCardId}`);
    return { data: { commentId }, error: null };
  } catch {
    return { data: null, error: 'Failed to delete comment' };
  }
};

export const createAdversaryComment = async (input: {
  userAdversaryId: string;
  body: string;
}): Promise<{
  data: { comment: UserAdversaryComment } | null;
  error: string | null;
}> => {
  try {
    const { userAdversaryId, body } = adversaryCommentSchema.parse(input);
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { data: null, error: 'Unauthorized' };

    const [comment] = await db
      .insert(userAdversaryComments)
      .values({ userId: session.user.id, userAdversaryId, body })
      .returning();

    const [adversary] = await db
      .select({ type: adversaryPreviews.type })
      .from(userAdversaries)
      .leftJoin(
        adversaryPreviews,
        eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id),
      )
      .where(eq(userAdversaries.id, userAdversaryId));

    const path =
      adversary?.type === 'environment'
        ? `/community/environments/${userAdversaryId}`
        : `/community/adversaries/${userAdversaryId}`;

    revalidatePath(path);
    return { data: { comment: comment as UserAdversaryComment }, error: null };
  } catch {
    return { data: null, error: 'Failed to post comment' };
  }
};

export const deleteAdversaryComment = async (input: {
  commentId: string;
}): Promise<{ data: { commentId: string } | null; error: string | null }> => {
  try {
    const { commentId } = deleteCommentSchema.parse(input);
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { data: null, error: 'Unauthorized' };

    const [comment] = await db
      .select()
      .from(userAdversaryComments)
      .where(eq(userAdversaryComments.id, commentId));

    if (!comment || comment.userId !== session.user.id) {
      return { data: null, error: 'Not found' };
    }

    await db
      .delete(userAdversaryComments)
      .where(
        and(
          eq(userAdversaryComments.id, commentId),
          eq(userAdversaryComments.userId, session.user.id),
        ),
      );

    const [adversary] = await db
      .select({ type: adversaryPreviews.type })
      .from(userAdversaries)
      .leftJoin(
        adversaryPreviews,
        eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id),
      )
      .where(eq(userAdversaries.id, comment.userAdversaryId));

    const path =
      adversary?.type === 'environment'
        ? `/community/environments/${comment.userAdversaryId}`
        : `/community/adversaries/${comment.userAdversaryId}`;

    revalidatePath(path);
    return { data: { commentId }, error: null };
  } catch {
    return { data: null, error: 'Failed to delete comment' };
  }
};
