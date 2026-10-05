import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { and, eq } from 'drizzle-orm';
import { z, ZodError } from 'zod';

import { db } from '@/lib/database';
import { formatAPIError } from '@/lib/utils';
import { cardPreviews, userCards } from '@/lib/database/schema';
import { auth } from '@/lib/auth';

const visibilitySchema = z.object({ public: z.boolean() }).strict();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const body: unknown = await req.json();
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error('Unauthorized');
    }
    const { public: isPublic } = visibilitySchema.parse(body);
    const [userCard] = await db
      .update(userCards)
      .set({ public: isPublic, updatedAt: new Date() })
      .where(and(eq(userCards.id, id), eq(userCards.userId, session.user.id)))
      .returning();
    if (!userCard) {
      return NextResponse.json(
        {
          success: false,
          error: formatAPIError(Error('Not found')),
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: { userCard },
      },
      { status: 202 },
    );
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: formatAPIError(e) },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: formatAPIError(e),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error('Unauthorized');
    }
    const userCard = await db.transaction(async (tx) => {
      const [userCard] = await tx
        .delete(userCards)
        .where(and(eq(userCards.id, id), eq(userCards.userId, session.user.id)))
        .returning();
      await tx
        .delete(cardPreviews)
        .where(eq(cardPreviews.id, userCard.cardPreviewId));
      return userCard;
    });
    if (!userCard) {
      return NextResponse.json(
        {
          success: false,
          error: formatAPIError(Error('Not found')),
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: { userCard },
      },
      { status: 202 },
    );
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
