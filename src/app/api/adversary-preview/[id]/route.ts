import { headers } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

import type { AdversaryDetails } from '@/lib/types';
import { auth } from '@/lib/auth';
import {
  formatAPIError,
  PayloadTooLargeError,
  readJSONBody,
} from '@/lib/utils';
import { updateAdversary } from '@/actions/user-items';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const body = await readJSONBody<{ adversary: AdversaryDetails }>(req);
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error('Unauthorized');
    }
    const data = await updateAdversary({ id, body, session });
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: { name: 'NotFound', message: 'Not found' },
        },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data }, { status: 202 });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: formatAPIError(e),
      },
      { status: e instanceof PayloadTooLargeError ? 413 : 500 },
    );
  }
}
