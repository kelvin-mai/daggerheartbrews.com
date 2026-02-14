import { headers } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

import type { CardDetails, UserCard } from '@/lib/types';
import { auth } from '@/lib/auth';
import { formatAPIError } from '@/lib/utils';
import { insertCard, limitCardInserts, updateCard } from '@/actions/user-items';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const body: { card: CardDetails; userCard?: UserCard; public?: boolean } = await req.json();
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error('Unauthorized');
    }
    if (body.userCard?.userId === session.user.id) {
      const data = await updateCard({ id, body, session });
      return NextResponse.json({ success: true, data }, { status: 202 });
    } else {
      await limitCardInserts({ session });
      const data = await insertCard({ body, session });
      return NextResponse.json({ success: true, data }, { status: 201 });
    }
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: formatAPIError(e),
      },
      { status: 500 },
    );
  }
}
