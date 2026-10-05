import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { ZodError } from 'zod';

import { auth } from '@/lib/auth';
import {
  formatAPIError,
  PayloadTooLargeError,
  readJSONBody,
} from '@/lib/utils';
import { insertCard, limitCardInserts } from '@/actions/user-items';

export async function POST(req: NextRequest) {
  try {
    const body = await readJSONBody<{ card: unknown }>(req);
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error('Unauthorized');
    }
    await limitCardInserts({ session });
    const data = await insertCard({ body, session });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: { name: 'ValidationError', message: 'Invalid request body' },
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: formatAPIError(e) },
      { status: e instanceof PayloadTooLargeError ? 413 : 500 },
    );
  }
}
