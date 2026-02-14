import { and, desc, count, eq, inArray, ilike } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';

import { db } from '@/lib/database';
import { cardPreviews, userCards, users } from '@/lib/database/schema';
import { formatAPIError } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page')
      ? Number(searchParams.get('page'))
      : 1;
    const pageSize = searchParams.get('page-size')
      ? Number(searchParams.get('page-size'))
      : 10;
    const typeParam = searchParams.get('type');
    const nameParam = searchParams.get('q');
    const types = typeParam
      ? typeParam
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    // Build filters
    const baseFilter = eq(userCards.public, true);
    const typeFilter = types.length
      ? inArray(cardPreviews.type, types)
      : undefined;
    const nameFilter = nameParam ? ilike(cardPreviews.name, `%${nameParam}%`) : undefined;
    let whereFilter = baseFilter as any;
    if (typeFilter) whereFilter = and(whereFilter, typeFilter);
    if (nameFilter) whereFilter = and(whereFilter, nameFilter);

    // Count with the same filter conditions
    const [result] = await db
      .select({ count: count() })
      .from(userCards)
      .leftJoin(cardPreviews, eq(userCards.cardPreviewId, cardPreviews.id))
      .where(whereFilter);
    const meta = { page, pageSize, total: result.count };

    const data = await db
      .select()
      .from(userCards)
      .leftJoin(users, eq(userCards.userId, users.id))
      .leftJoin(cardPreviews, eq(userCards.cardPreviewId, cardPreviews.id))
      .where(whereFilter)
      .orderBy(desc(userCards.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize);
    return NextResponse.json(
      {
        success: true,
        data: data.map((d) => ({
          userCard: d.user_cards,
          cardPreview: d.card_previews,
          user: d.users,
        })),
        meta,
      },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, error: formatAPIError(e) },
      {
        status: 500,
      },
    );
  }
}
