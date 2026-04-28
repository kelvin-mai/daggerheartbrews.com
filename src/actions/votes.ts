'use server';

import { headers } from 'next/headers';
import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import {
  userAdversaries,
  userAdversaryVotes,
  userCardVotes,
  userCards,
} from '@/lib/database/schema';

type VoteResult = {
  data: {
    upvotes: number;
    downvotes: number;
    userVote: 'up' | 'down' | null;
  } | null;
  error: string | null;
};

const cardVoteSchema = z.object({
  userCardId: z.string().uuid(),
  vote: z.enum(['up', 'down']),
});

const adversaryVoteSchema = z.object({
  userAdversaryId: z.string().uuid(),
  vote: z.enum(['up', 'down']),
});

export const toggleCardVote = async (input: {
  userCardId: string;
  vote: 'up' | 'down';
}): Promise<VoteResult> => {
  try {
    const { userCardId, vote } = cardVoteSchema.parse(input);
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { data: null, error: 'Unauthorized' };
    }

    const [existing] = await db
      .select()
      .from(userCardVotes)
      .where(
        and(
          eq(userCardVotes.userId, session.user.id),
          eq(userCardVotes.userCardId, userCardId),
        ),
      );

    if (existing) {
      if (existing.vote === vote) {
        await db.delete(userCardVotes).where(eq(userCardVotes.id, existing.id));
        const delta =
          vote === 'up'
            ? { upvotes: sql`upvotes - 1` }
            : { downvotes: sql`downvotes - 1` };
        const [updated] = await db
          .update(userCards)
          .set(delta)
          .where(eq(userCards.id, userCardId))
          .returning({
            upvotes: userCards.upvotes,
            downvotes: userCards.downvotes,
          });
        return { data: { ...updated, userVote: null }, error: null };
      } else {
        await db
          .update(userCardVotes)
          .set({ vote })
          .where(eq(userCardVotes.id, existing.id));
        const delta =
          vote === 'up'
            ? { upvotes: sql`upvotes + 1`, downvotes: sql`downvotes - 1` }
            : { upvotes: sql`upvotes - 1`, downvotes: sql`downvotes + 1` };
        const [updated] = await db
          .update(userCards)
          .set(delta)
          .where(eq(userCards.id, userCardId))
          .returning({
            upvotes: userCards.upvotes,
            downvotes: userCards.downvotes,
          });
        return { data: { ...updated, userVote: vote }, error: null };
      }
    }

    await db
      .insert(userCardVotes)
      .values({ userId: session.user.id, userCardId, vote });
    const delta =
      vote === 'up'
        ? { upvotes: sql`upvotes + 1` }
        : { downvotes: sql`downvotes + 1` };
    const [updated] = await db
      .update(userCards)
      .set(delta)
      .where(eq(userCards.id, userCardId))
      .returning({
        upvotes: userCards.upvotes,
        downvotes: userCards.downvotes,
      });
    return { data: { ...updated, userVote: vote }, error: null };
  } catch {
    return { data: null, error: 'Failed to update vote' };
  }
};

export const toggleAdversaryVote = async (input: {
  userAdversaryId: string;
  vote: 'up' | 'down';
}): Promise<VoteResult> => {
  try {
    const { userAdversaryId, vote } = adversaryVoteSchema.parse(input);
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { data: null, error: 'Unauthorized' };
    }

    const [existing] = await db
      .select()
      .from(userAdversaryVotes)
      .where(
        and(
          eq(userAdversaryVotes.userId, session.user.id),
          eq(userAdversaryVotes.userAdversaryId, userAdversaryId),
        ),
      );

    if (existing) {
      if (existing.vote === vote) {
        await db
          .delete(userAdversaryVotes)
          .where(eq(userAdversaryVotes.id, existing.id));
        const delta =
          vote === 'up'
            ? { upvotes: sql`upvotes - 1` }
            : { downvotes: sql`downvotes - 1` };
        const [updated] = await db
          .update(userAdversaries)
          .set(delta)
          .where(eq(userAdversaries.id, userAdversaryId))
          .returning({
            upvotes: userAdversaries.upvotes,
            downvotes: userAdversaries.downvotes,
          });
        return { data: { ...updated, userVote: null }, error: null };
      } else {
        await db
          .update(userAdversaryVotes)
          .set({ vote })
          .where(eq(userAdversaryVotes.id, existing.id));
        const delta =
          vote === 'up'
            ? { upvotes: sql`upvotes + 1`, downvotes: sql`downvotes - 1` }
            : { upvotes: sql`upvotes - 1`, downvotes: sql`downvotes + 1` };
        const [updated] = await db
          .update(userAdversaries)
          .set(delta)
          .where(eq(userAdversaries.id, userAdversaryId))
          .returning({
            upvotes: userAdversaries.upvotes,
            downvotes: userAdversaries.downvotes,
          });
        return { data: { ...updated, userVote: vote }, error: null };
      }
    }

    await db
      .insert(userAdversaryVotes)
      .values({ userId: session.user.id, userAdversaryId, vote });
    const delta =
      vote === 'up'
        ? { upvotes: sql`upvotes + 1` }
        : { downvotes: sql`downvotes + 1` };
    const [updated] = await db
      .update(userAdversaries)
      .set(delta)
      .where(eq(userAdversaries.id, userAdversaryId))
      .returning({
        upvotes: userAdversaries.upvotes,
        downvotes: userAdversaries.downvotes,
      });
    return { data: { ...updated, userVote: vote }, error: null };
  } catch {
    return { data: null, error: 'Failed to update vote' };
  }
};
