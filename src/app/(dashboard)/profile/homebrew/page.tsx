import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { Layers, Skull, Plus } from 'lucide-react';

import type {
  AdversaryDetails,
  CardDetails,
  UserAdversary,
  UserCard,
} from '@/lib/types';
import { db } from '@/lib/database';
import { auth } from '@/lib/auth';
import {
  adversaryPreviews,
  cardPreviews,
  userAdversaries,
  userCards,
  userSettings,
} from '@/lib/database/schema';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PersonalAdversary, PersonalCard } from '@/components/post';
import { CollapsibleSectionTrigger, PageHeader } from '@/components/common';
import { PublicDefaultForm } from '@/components/auth/public-default-form';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect('/login');
  }
  const [prefs] = await db
    .select({ defaultVisibility: userSettings.defaultVisibility })
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id));

  const cardData = await db
    .select()
    .from(userCards)
    .leftJoin(cardPreviews, eq(userCards.cardPreviewId, cardPreviews.id))
    .where(eq(userCards.userId, session.user.id));

  const adversaryData = await db
    .select()
    .from(userAdversaries)
    .leftJoin(
      adversaryPreviews,
      eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id),
    )
    .where(eq(userAdversaries.userId, session.user.id));

  const totalItems = cardData.length + adversaryData.length;
  const publicCards = cardData.filter((d) => d.user_cards.public).length;
  const publicAdversaries = adversaryData.filter(
    (d) => d.user_adversaries.public,
  ).length;

  return (
    <div className='mb-4 space-y-4'>
      <PageHeader
        title='My Homebrew'
        subtitle='All your custom content in one place.'
      />
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        <div className='bg-card rounded-lg border p-3 text-center'>
          <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
            Total
          </p>
          <p className='font-eveleth-clean text-2xl'>{totalItems}</p>
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
            Public
          </p>
          <p className='font-eveleth-clean text-2xl'>
            {publicCards + publicAdversaries}
          </p>
        </div>
      </div>
      <div className='bg-card rounded-lg border p-4'>
        <PublicDefaultForm
          defaultVisibility={prefs?.defaultVisibility ?? false}
        />
      </div>

      <Collapsible
        defaultOpen
        className='bg-card group/collapsible rounded-lg border'
      >
        <CollapsibleSectionTrigger>
          <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md'>
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
                  <PersonalCard
                    key={data.user_cards.id}
                    cardPreview={data.card_previews as CardDetails}
                    userCard={data.user_cards as UserCard}
                  />
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center gap-3 py-8 text-center'>
                <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
                  <Layers className='text-muted-foreground size-6' />
                </div>
                <div>
                  <p className='font-medium'>No cards yet</p>
                  <p className='text-muted-foreground text-sm'>
                    Create your first custom card to get started
                  </p>
                </div>
                <Button asChild size='sm'>
                  <Link href='/card/create'>
                    <Plus className='size-4' />
                    Create Card
                  </Link>
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
          <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md'>
            <Skull className='size-4' />
          </div>
          <Label className='font-eveleth-clean text-sm'>Adversaries</Label>
          <Badge variant='secondary' className='ml-1'>
            {cardData.length}
          </Badge>
        </CollapsibleSectionTrigger>
        <CollapsibleContent>
          <div className='border-t px-4 py-3'>
            {adversaryData.length > 0 ? (
              <div className='space-y-3'>
                {adversaryData.map((data) => (
                  <PersonalAdversary
                    key={data.user_adversaries.id}
                    adversaryPreview={
                      data.adversary_previews as AdversaryDetails
                    }
                    userAdversary={data.user_adversaries as UserAdversary}
                  />
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center gap-3 py-8 text-center'>
                <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
                  <Skull className='text-muted-foreground size-6' />
                </div>
                <div>
                  <p className='font-medium'>No adversaries yet</p>
                  <p className='text-muted-foreground text-sm'>
                    Create your first custom adversary to get started
                  </p>
                </div>
                <Button asChild size='sm'>
                  <Link href='/adversary/create'>
                    <Plus className='size-4' />
                    Create Adversary
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
