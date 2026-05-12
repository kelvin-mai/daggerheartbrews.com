'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Layers, Settings, Skull, Trees } from 'lucide-react';

import type {
  AdversaryDetails,
  CardDetails,
  User,
  UserAdversary,
  UserCard,
} from '@/lib/types';
import { useSession } from '@/lib/auth/client';
import { CommunityAdversary, CommunityCard } from '@/components/post';
import { CollapsibleSectionTrigger } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';

type CardRow = {
  user_cards: UserCard;
  card_previews: CardDetails | null;
  commentCount: number;
};
type AdversaryRow = {
  user_adversaries: UserAdversary;
  adversary_previews: AdversaryDetails | null;
  commentCount: number;
};

type Props = {
  user: User;
  cards: CardRow[];
  adversaries: AdversaryRow[];
};

export const UserProfile: React.FC<Props> = ({ user, cards, adversaries }) => {
  const session = useSession();
  const isOwner = session.data?.user?.id === user.id;

  const validCards = cards.filter((r) => r.card_previews !== null);
  const validAdversaries = adversaries.filter(
    (r) =>
      r.adversary_previews !== null &&
      r.adversary_previews.type !== 'environment',
  );
  const validEnvironments = adversaries.filter(
    (r) =>
      r.adversary_previews !== null &&
      r.adversary_previews.type === 'environment',
  );

  return (
    <div className='mb-4 space-y-4'>
      <div className='flex items-center gap-4'>
        <div className='bg-muted flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full text-xl font-bold'>
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={64}
              height={64}
              className='size-16 object-cover'
            />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className='flex-1'>
          <h1 className='text-2xl font-bold'>{user.name}</h1>
        </div>
        {isOwner && (
          <Button variant='outline' asChild>
            <Link href='/profile'>
              <Settings className='size-4' />
              Settings
            </Link>
          </Button>
        )}
      </div>

      <div className='grid grid-cols-3 gap-3'>
        <div className='bg-card rounded-lg border p-3 text-center'>
          <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
            Cards
          </p>
          <p className='font-eveleth-clean text-2xl'>{validCards.length}</p>
        </div>
        <div className='bg-card rounded-lg border p-3 text-center'>
          <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
            Adversaries
          </p>
          <p className='font-eveleth-clean text-2xl'>
            {validAdversaries.length}
          </p>
        </div>
        <div className='bg-card rounded-lg border p-3 text-center'>
          <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
            Environments
          </p>
          <p className='font-eveleth-clean text-2xl'>
            {validEnvironments.length}
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
            {validCards.length}
          </Badge>
        </CollapsibleSectionTrigger>
        <CollapsibleContent>
          <div className='border-t px-4 py-3'>
            {validCards.length > 0 ? (
              <div className='space-y-3'>
                {validCards.map(
                  ({ user_cards, card_previews, commentCount }) => (
                    <CommunityCard
                      key={user_cards.id}
                      userCard={user_cards}
                      cardPreview={card_previews!}
                      user={user}
                      commentCount={commentCount}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className='flex flex-col items-center gap-3 py-8 text-center'>
                <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
                  <Layers className='text-muted-foreground size-6' />
                </div>
                <div>
                  <p className='font-medium'>No public cards yet</p>
                  <p className='text-muted-foreground text-sm'>
                    This user hasn&apos;t shared any cards.
                  </p>
                </div>
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
            {validAdversaries.length}
          </Badge>
        </CollapsibleSectionTrigger>
        <CollapsibleContent>
          <div className='border-t px-4 py-3'>
            {validAdversaries.length > 0 ? (
              <div className='space-y-3'>
                {validAdversaries.map(
                  ({ user_adversaries, adversary_previews, commentCount }) => (
                    <CommunityAdversary
                      key={user_adversaries.id}
                      userAdversary={user_adversaries}
                      adversaryPreview={adversary_previews!}
                      user={user}
                      commentCount={commentCount}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className='flex flex-col items-center gap-3 py-8 text-center'>
                <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
                  <Skull className='text-muted-foreground size-6' />
                </div>
                <div>
                  <p className='font-medium'>No public adversaries yet</p>
                  <p className='text-muted-foreground text-sm'>
                    This user hasn&apos;t shared any adversaries.
                  </p>
                </div>
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
            {validEnvironments.length}
          </Badge>
        </CollapsibleSectionTrigger>
        <CollapsibleContent>
          <div className='border-t px-4 py-3'>
            {validEnvironments.length > 0 ? (
              <div className='space-y-3'>
                {validEnvironments.map(
                  ({ user_adversaries, adversary_previews, commentCount }) => (
                    <CommunityAdversary
                      key={user_adversaries.id}
                      userAdversary={user_adversaries}
                      adversaryPreview={adversary_previews!}
                      user={user}
                      commentCount={commentCount}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className='flex flex-col items-center gap-3 py-8 text-center'>
                <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
                  <Trees className='text-muted-foreground size-6' />
                </div>
                <div>
                  <p className='font-medium'>No public environments yet</p>
                  <p className='text-muted-foreground text-sm'>
                    This user hasn&apos;t shared any environments.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
