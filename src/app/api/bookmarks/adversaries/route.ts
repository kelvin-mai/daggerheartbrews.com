import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import { userAdversaryBookmarks } from '@/lib/database/schema';

export const GET = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ data: { ids: [] }, error: null });
  }
  try {
    const rows = await db
      .select({ userAdversaryId: userAdversaryBookmarks.userAdversaryId })
      .from(userAdversaryBookmarks)
      .where(eq(userAdversaryBookmarks.userId, session.user.id));
    return Response.json({
      data: { ids: rows.map((r) => r.userAdversaryId) },
      error: null,
    });
  } catch {
    return Response.json(
      { data: null, error: 'Failed to fetch bookmarks' },
      { status: 500 },
    );
  }
};
