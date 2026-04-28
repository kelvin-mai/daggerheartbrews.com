import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import { userAdversaryVotes } from '@/lib/database/schema';

export const GET = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ data: { votes: {} }, error: null });
  }
  try {
    const rows = await db
      .select({
        userAdversaryId: userAdversaryVotes.userAdversaryId,
        vote: userAdversaryVotes.vote,
      })
      .from(userAdversaryVotes)
      .where(eq(userAdversaryVotes.userId, session.user.id));
    const votes = Object.fromEntries(
      rows.map((r) => [r.userAdversaryId, r.vote]),
    );
    return Response.json({ data: { votes }, error: null });
  } catch {
    return Response.json(
      { data: null, error: 'Failed to fetch votes' },
      { status: 500 },
    );
  }
};
