import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import { userCardVotes } from '@/lib/database/schema';

export const GET = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ data: { votes: {} }, error: null });
  }
  try {
    const rows = await db
      .select({
        userCardId: userCardVotes.userCardId,
        vote: userCardVotes.vote,
      })
      .from(userCardVotes)
      .where(eq(userCardVotes.userId, session.user.id));
    const votes = Object.fromEntries(rows.map((r) => [r.userCardId, r.vote]));
    return Response.json({ data: { votes }, error: null });
  } catch {
    return Response.json(
      { data: null, error: 'Failed to fetch votes' },
      { status: 500 },
    );
  }
};
