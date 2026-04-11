import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { Bookmark, Layers, Printer, Skull, Trees } from 'lucide-react';

import type {
  AdversaryDetails,
  CardDetails,
  User,
  UserAdversary,
  UserCard,
} from '@/lib/types';
import { db } from '@/lib/database';
import { auth } from '@/lib/auth';
import {
  adversaryPreviews,
  cardPreviews,
  userAdversaries,
  userAdversaryBookmarks,
  userCardBookmarks,
  userCards,
} from '@/lib/database/schema';
import { users } from '@/lib/database/schema/auth.sql';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CommunityAdversary, CommunityCard } from '@/components/post';
import { CollapsibleSectionTrigger, PageHeader } from '@/components/common';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect('/login');
  }

  const cardData = await db
    .select()
    .from(userCardBookmarks)
    .innerJoin(userCards, eq(userCardBookmarks.userCardId, userCards.id))
    .innerJoin(cardPreviews, eq(userCards.cardPreviewId, cardPreviews.id))
    .innerJoin(users, eq(userCards.userId, users.id))
    .where(eq(userCardBookmarks.userId, session.user.id));

  const allAdversaryData = await db
    .select()
    .from(userAdversaryBookmarks)
    .innerJoin(
      userAdversaries,
      eq(userAdversaryBookmarks.userAdversaryId, userAdversaries.id),
    )
    .innerJoin(
      adversaryPreviews,
      eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id),
    )
    .innerJoin(users, eq(userAdversaries.userId, users.id))
    .where(eq(userAdversaryBookmarks.userId, session.user.id));

  const adversaryData = allAdversaryData.filter(
    (d) => d.adversary_previews.type === 'adversary',
  );
  const environmentData = allAdversaryData.filter(
    (d) => d.adversary_previews.type === 'environment',
  );

  const totalBookmarks = cardData.length + allAdversaryData.length;

  return (
    <div className='mb-4 space-y-4'>
      <div className='flex items-start justify-between gap-4'>
        <PageHeader
          title='Bookmarks'
          subtitle='Community content you have saved.'
        />
        <Button asChild size='sm' variant='outline' className='shrink-0'>
          <Link href='/profile/print'>
            <Printer className='size-4' />
            Print Sheet
          </Link>
        </Button>
      </div>
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        <div className='bg-card rounded-lg border p-3 text-center'>
          <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
            Total
          </p>
          <p className='font-eveleth-clean text-2xl'>{totalBookmarks}</p>
        </div>
        <div className='bg-card rounded-lg border p-3 text-center'>
          <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
            Cards
          </p>
          <p className='font-eveleth-clean text-2xl'>{cardData.length}</p>
        </div>
        <div className='bg-card rounded-lg border p-3 text-center'>
          <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
            Adversaries
          </p>
          <p className='font-eveleth-clean text-2xl'>{adversaryData.length}</p>
        </div>
        <div className='bg-card rounded-lg border p-3 text-center'>
          <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
            Environments
          </p>
          <p className='font-eveleth-clean text-2xl'>
            {environmentData.length}
          </p>
        </div>
      </div>

      <Collapsible
        defaultOpen
        className='bg-card group/collapsible rounded-lg border'
      >
        <CollapsibleSectionTrigger>
          <div className='bg-primary/10 text-primary dark:bg-sidebar dark:text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md'>
            <Layers className='size-4' />
          </div>
          <Label className='font-eveleth-clean text-sm'>Cards</Label>
          <Badge variant='secondary' className='ml-1'>
            {cardData.length}
          </Badge>
        </CollapsibleSectionTrigger>
        <CollapsibleContent>
          <div className='border-t px-4 py-3'>
            {cardData.length > 0 ? (
              <div className='space-y-3'>
                {cardData.map((data) => (
                  <CommunityCard
                    key={data.user_card_bookmarks.id}
                    cardPreview={data.card_previews as CardDetails}
                    userCard={data.user_cards as UserCard}
                    user={data.users as User}
                    isBookmarked
                  />
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center gap-3 py-8 text-center'>
                <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
                  <Bookmark className='text-muted-foreground size-6' />
                </div>
                <div>
                  <p className='font-medium'>No bookmarked cards</p>
                  <p className='text-muted-foreground text-sm'>
                    Browse community cards and save ones you like
                  </p>
                </div>
                <Button asChild size='sm'>
                  <Link href='/community/cards'>Browse Cards</Link>
                </Button>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        defaultOpen
        className='bg-card group/collapsible rounded-lg border'
      >
        <CollapsibleSectionTrigger>
          <div className='bg-primary/10 text-primary dark:bg-sidebar dark:text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md'>
            <Skull className='size-4' />
          </div>
          <Label className='font-eveleth-clean text-sm'>Adversaries</Label>
          <Badge variant='secondary' className='ml-1'>
            {adversaryData.length}
          </Badge>
        </CollapsibleSectionTrigger>
        <CollapsibleContent>
          <div className='border-t px-4 py-3'>
            {adversaryData.length > 0 ? (
              <div className='space-y-3'>
                {adversaryData.map((data) => (
                  <CommunityAdversary
                    key={data.user_adversary_bookmarks.id}
                    adversaryPreview={
                      data.adversary_previews as AdversaryDetails
                    }
                    userAdversary={data.user_adversaries as UserAdversary}
                    user={data.users as User}
                    isBookmarked
                  />
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center gap-3 py-8 text-center'>
                <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
                  <Bookmark className='text-muted-foreground size-6' />
                </div>
                <div>
                  <p className='font-medium'>No bookmarked adversaries</p>
                  <p className='text-muted-foreground text-sm'>
                    Browse community adversaries and save ones you like
                  </p>
                </div>
                <Button asChild size='sm'>
                  <Link href='/community/adversaries'>Browse Adversaries</Link>
                </Button>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        defaultOpen
        className='bg-card group/collapsible rounded-lg border'
      >
        <CollapsibleSectionTrigger>
          <div className='bg-primary/10 text-primary dark:bg-sidebar dark:text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md'>
            <Trees className='size-4' />
          </div>
          <Label className='font-eveleth-clean text-sm'>Environments</Label>
          <Badge variant='secondary' className='ml-1'>
            {environmentData.length}
          </Badge>
        </CollapsibleSectionTrigger>
        <CollapsibleContent>
          <div className='border-t px-4 py-3'>
            {environmentData.length > 0 ? (
              <div className='space-y-3'>
                {environmentData.map((data) => (
                  <CommunityAdversary
                    key={data.user_adversary_bookmarks.id}
                    adversaryPreview={
                      data.adversary_previews as AdversaryDetails
                    }
                    userAdversary={data.user_adversaries as UserAdversary}
                    user={data.users as User}
                    isBookmarked
                  />
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center gap-3 py-8 text-center'>
                <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
                  <Bookmark className='text-muted-foreground size-6' />
                </div>
                <div>
                  <p className='font-medium'>No bookmarked environments</p>
                  <p className='text-muted-foreground text-sm'>
                    Browse community environments and save ones you like
                  </p>
                </div>
                <Button asChild size='sm'>
                  <Link href='/community/environments'>
                    Browse Environments
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
