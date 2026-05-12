import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { db } from '@/lib/database';
import {
  adversaryPreviews,
  userAdversaries,
  users,
} from '@/lib/database/schema';
import type { AdversaryDetails, User, UserAdversary } from '@/lib/types';

import { CommunityAdversaryDetail } from './client';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [result] = await db
    .select({ name: adversaryPreviews.name })
    .from(userAdversaries)
    .leftJoin(
      adversaryPreviews,
      eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id),
    )
    .where(and(eq(userAdversaries.id, id), eq(userAdversaries.public, true)));
  const name = result?.name ?? 'Community Adversary';
  return { title: `${name} — Community Adversaries` };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const [result] = await db
    .select()
    .from(userAdversaries)
    .leftJoin(users, eq(userAdversaries.userId, users.id))
    .leftJoin(
      adversaryPreviews,
      eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id),
    )
    .where(and(eq(userAdversaries.id, id), eq(userAdversaries.public, true)));

  if (!result?.adversary_previews) notFound();

  return (
    <CommunityAdversaryDetail
      userAdversary={result.user_adversaries as UserAdversary}
      adversaryPreview={result.adversary_previews as AdversaryDetails}
      user={result.users as User}
    />
  );
}
