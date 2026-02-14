import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { and, eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import { userAdversaries } from '@/lib/database/schema';
import { formatAPIError } from '@/lib/utils';

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error('Unauthorized');
    const body: { public: boolean; userAdversaryId?: string } = await req.json();
    if (!body.userAdversaryId) throw new Error('userAdversaryId is required');
    await db
      .update(userAdversaries)
      .set({ public: body.public })
      .where(and(eq(userAdversaries.userId, session.user.id), eq(userAdversaries.id, body.userAdversaryId)));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: formatAPIError(e) }, { status: 500 });
  }
}


