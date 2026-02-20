import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import {
  ChevronDown,
  Layers,
  Skull,
  Plus,
} from 'lucide-react';

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
} from '@/lib/database/schema';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PersonalAdversary, PersonalCard } from '@/components/post';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect('/login');
  }
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
    <div className='mb-4 space-y-6'>
      <div>
        <h1 className='font-eveleth-clean text-2xl font-bold'>
          My Homebrew
        </h1>
        <p className='text-muted-foreground'>
          Manage your custom cards and adversaries
        </p>
      </div>

      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        <div className='bg-card rounded-lg border p-3 text-center'>
          <p className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
            Total
          </p>
          <p className='font-eveleth-clean text-2xl'>{totalItems}</p>
        </div>
        <div className='bg-card rounded-lg border p-3 text-center'>
          <p className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
            Cards
          </p>
          <p className='font-eveleth-clean text-2xl'>{cardData.length}</p>
        </div>
        <div className='bg-card rounded-lg border p-3 text-center'>
          <p className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
            Adversaries
          </p>
          <p className='font-eveleth-clean text-2xl'>
            {adversaryData.length}
          </p>
        </div>
        <div className='bg-card rounded-lg border p-3 text-center'>
          <p className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
            Public
          </p>
          <p className='font-eveleth-clean text-2xl'>
            {publicCards + publicAdversaries}
          </p>
        </div>
      </div>

      <Collapsible
        defaultOpen
        className='bg-card group/collapsible rounded-lg border'
      >
        <CollapsibleTrigger asChild>
          <button
            type='button'
            className='flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50'
          >
            <div className='flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary'>
              <Layers className='size-4' />
            </div>
            <span className='font-eveleth-clean text-sm'>Cards</span>
            <Badge variant='secondary' className='ml-1'>
              {cardData.length}
            </Badge>
            <ChevronDown className='text-muted-foreground ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
            <span className='sr-only'>Toggle cards section</span>
          </button>
        </CollapsibleTrigger>
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
                <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
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
        <CollapsibleTrigger asChild>
          <button
            type='button'
            className='flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50'
          >
            <div className='flex size-8 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive'>
              <Skull className='size-4' />
            </div>
            <span className='font-eveleth-clean text-sm'>Adversaries</span>
            <Badge variant='secondary' className='ml-1'>
              {adversaryData.length}
            </Badge>
            <ChevronDown className='text-muted-foreground ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
            <span className='sr-only'>Toggle adversaries section</span>
          </button>
        </CollapsibleTrigger>
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
                <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
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
