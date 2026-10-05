import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { ZodError } from 'zod';

import { auth } from '@/lib/auth';
import {
  formatAPIError,
  PayloadTooLargeError,
  readJSONBody,
} from '@/lib/utils';
import { insertAdversary, limitAdversaryInserts } from '@/actions/user-items';

export async function POST(req: NextRequest) {
  try {
    const body = await readJSONBody<{ adversary: unknown }>(req);
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
