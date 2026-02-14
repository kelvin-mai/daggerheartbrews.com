import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/database';
import { auth } from '@/lib/auth';
import { cardPreviews, userCards } from '@/lib/database/schema';
import { formatAPIError } from '@/lib/utils';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    const data = await db
      .select({
        userCard: userCards,
        cardPreview: cardPreviews,
      })
      .from(userCards)
      .leftJoin(cardPreviews, eq(userCards.cardPreviewId, cardPreviews.id))
      .where(eq(userCards.userId, session.user.id));

    return NextResponse.json({
      success: true,
      data: data.map((d) => ({
        userCard: d.userCard,
        cardPreview: d.cardPreview,
      })),
    });
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
