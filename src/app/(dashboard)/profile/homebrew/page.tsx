import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';
import { ChevronDown } from 'lucide-react';

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
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
    .where(eq(userCards.userId, session.user.id))
    .orderBy(desc(userCards.updatedAt), desc(userCards.createdAt));

  const adversaryData = await db
    .select()
    .from(userAdversaries)
    .leftJoin(
      adversaryPreviews,
      eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id),
    )
    .where(eq(userAdversaries.userId, session.user.id))
    .orderBy(desc(userAdversaries.updatedAt), desc(userAdversaries.createdAt));
  return (
    <div className='mb-4 space-y-4'>
      <Collapsible className='bg-card group/collapsible rounded-lg border px-4 py-2'>
        <CollapsibleTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='flex h-8 w-full items-center justify-between px-2 hover:cursor-pointer'
          >
            <Label>Cards</Label>
            <ChevronDown className='size-4 group-data-[state=open]/collapsible:rotate-180' />
            <span className='sr-only'>Toggle</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className='space-y-2 pt-2'>
          {cardData.map((data) => (
            <PersonalCard
              key={data.user_cards.id}
              cardPreview={data.card_previews as CardDetails}
              userCard={data.user_cards as UserCard}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className='bg-card group/collapsible rounded-lg border px-4 py-2'>
        <CollapsibleTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='flex h-8 w-full items-center justify-between px-2 hover:cursor-pointer'
          >
            <Label>Adversaries</Label>
            <ChevronDown className='size-4 group-data-[state=open]/collapsible:rotate-180' />
            <span className='sr-only'>Toggle</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className='space-y-2 pt-2'>
          {adversaryData.map((data) => (
            <PersonalAdversary
              key={data.user_adversaries.id}
              adversaryPreview={data.adversary_previews as AdversaryDetails}
              userAdversary={data.user_adversaries as UserAdversary}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
