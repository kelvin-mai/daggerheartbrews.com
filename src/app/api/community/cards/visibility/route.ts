import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { and, eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import { userCards } from '@/lib/database/schema';
import { formatAPIError } from '@/lib/utils';

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error('Unauthorized');
    const body: { public: boolean; userCardId?: string } = await req.json();
    // If a specific userCardId is provided, update that row; otherwise update last edited one is out-of-scope; require id.
    if (!body.userCardId) throw new Error('userCardId is required');
    await db
      .update(userCards)
      .set({ public: body.public })
      .where(and(eq(userCards.userId, session.user.id), eq(userCards.id, body.userCardId)));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: formatAPIError(e) }, { status: 500 });
  }
}


