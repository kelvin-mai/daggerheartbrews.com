import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';

import type { AdversaryDetails } from '@/lib/types';
import { auth } from '@/lib/auth';
import { formatAPIError } from '@/lib/utils';
import { insertAdversary, limitAdversaryInserts } from '@/actions/user-items';

export async function POST(req: NextRequest) {
  try {
    const body: { adversary: AdversaryDetails } = await req.json();
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error('Unauthorized');
    }
    await limitAdversaryInserts({ session });
    const data = await insertAdversary({ body, session });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: formatAPIError(e) },
      { status: 500 },
    );
  }
}
