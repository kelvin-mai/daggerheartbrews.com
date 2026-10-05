import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { db } from '@/lib/database';
import { publicAuthor } from '@/lib/database/selections';
import {
  adversaryPreviews,
  userAdversaries,
  userAdversaryComments,
  users,
} from '@/lib/database/schema';
import type {
  AdversaryDetails,
  CommentWithUser,
  PublicAuthor,
  UserAdversary,
  UserAdversaryComment,
} from '@/lib/types';

import { CommunityEnvironmentDetail } from './client';

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
    .where(
      and(
        eq(userAdversaries.id, id),
        eq(userAdversaries.public, true),
        eq(adversaryPreviews.type, 'environment'),
      ),
    );
  const name = result?.name ?? 'Community Environment';
  return { title: `${name} — Community Environments` };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const [result] = await db
    .select({
      user_adversaries: userAdversaries,
      users: publicAuthor,
      adversary_previews: adversaryPreviews,
    })
    .from(userAdversaries)
    .leftJoin(users, eq(userAdversaries.userId, users.id))
    .leftJoin(
      adversaryPreviews,
      eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id),
    )
    .where(
      and(
        eq(userAdversaries.id, id),
        eq(userAdversaries.public, true),
        eq(adversaryPreviews.type, 'environment'),
      ),
    );

  if (!result?.adversary_previews) notFound();

  const rawComments = await db
    .select({
      user_adversary_comments: userAdversaryComments,
      users: publicAuthor,
    })
    .from(userAdversaryComments)
    .leftJoin(users, eq(userAdversaryComments.userId, users.id))
    .where(eq(userAdversaryComments.userAdversaryId, id))
    .orderBy(userAdversaryComments.createdAt);

  const postComments: CommentWithUser<UserAdversaryComment>[] = rawComments.map(
    (row) => ({
      comment: row.user_adversary_comments as UserAdversaryComment,
      user: row.users,
    }),
  );

  return (
    <CommunityEnvironmentDetail
      userAdversary={result.user_adversaries as UserAdversary}
      adversaryPreview={result.adversary_previews as AdversaryDetails}
      user={result.users as PublicAuthor}
      comments={postComments}
    />
  );
}
