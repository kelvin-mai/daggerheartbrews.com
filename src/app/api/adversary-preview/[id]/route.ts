import { headers } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

import type { AdversaryDetails, UserAdversary } from '@/lib/types';
import { auth } from '@/lib/auth';
import {
  insertAdversary,
  limitAdversaryInserts,
  updateAdversary,
} from '@/actions/user-items';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const body: { adversary: AdversaryDetails; userAdversary?: UserAdversary; public?: boolean } =
      await req.json();
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error('Unauthorized');
    }
    if (body.userAdversary?.userId === session.user.id) {
      const data = await updateAdversary({ id, body, session });
      return NextResponse.json({ success: true, data }, { status: 202 });
    } else {
      await limitAdversaryInserts({ session });
      const data = await insertAdversary({ body, session });
      return NextResponse.json({ success: true, data }, { status: 201 });
    }
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: e,
      },
      {
        status: 500,
      },
    );
  }
}
