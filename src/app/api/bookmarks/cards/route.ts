import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import { userCardBookmarks } from '@/lib/database/schema';

export const GET = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ data: { ids: [] }, error: null });
  }
  try {
    const rows = await db
      .select({ userCardId: userCardBookmarks.userCardId })
      .from(userCardBookmarks)
      .where(eq(userCardBookmarks.userId, session.user.id));
    return Response.json({
      data: { ids: rows.map((r) => r.userCardId) },
      error: null,
    });
  } catch {
    return Response.json(
      { data: null, error: 'Failed to fetch bookmarks' },
      { status: 500 },
    );
  }
};
