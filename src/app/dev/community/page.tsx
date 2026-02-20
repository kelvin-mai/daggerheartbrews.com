'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Copy,
  ImageIcon,
  Layers,
  Skull,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';

import type { CardDetails } from '@/lib/types/card-creation';
import type { AdversaryDetails } from '@/lib/types/adversary-creation';

// ─── Mock data ────────────────────────────────────────────────

const mockUsers = [
  { id: 'u1', name: 'Rook Ashwood', image: null },
  { id: 'u2', name: 'Lyra Thornfield', image: null },
  { id: 'u3', name: 'Grimm Stoneheart', image: null },
  { id: 'u4', name: 'Seraphina Dawn', image: null },
];

const mockCards: { cardPreview: CardDetails; userName: string }[] = [
  {
    cardPreview: {
      name: 'Blade of the Eclipse',
      type: 'equipment',
      tier: 2,
      text: 'A darkened blade that glows faintly under moonlight.',
    },
    userName: 'Rook Ashwood',
  },
  {
    cardPreview: {
      name: 'Thornwood Heritage',
      type: 'ancestry',
      text: 'Born of the ancient Thornwood forests, your kind has deep roots.',
    },
    userName: 'Lyra Thornfield',
  },
  {
    cardPreview: {
      name: 'Order of the Crimson Flame',
      type: 'community',
      text: 'A brotherhood of fire-sworn protectors.',
    },
    userName: 'Grimm Stoneheart',
  },
  {
    cardPreview: {
      name: 'Dawnbringer',
      type: 'subclass',
      domainPrimary: 'Grace',
      domainSecondary: 'Valor',
      text: 'Channels radiant energy through acts of courage.',
    },
    userName: 'Seraphina Dawn',
  },
  {
    cardPreview: {
      name: 'Shadowstep Mantle',
      type: 'equipment',
      tier: 3,
      hands: 0,
      text: 'A cloak that bends light around the wearer.',
    },
    userName: 'Rook Ashwood',
  },
];

const mockAdversaries: { adversaryPreview: AdversaryDetails; userName: string }[] = [
  {
    adversaryPreview: {
      name: 'Hollow Knight',
      type: 'solo',
      tier: 3,
      difficulty: 'severe',
      hp: 45,
      stress: 6,
      thresholds: [12, 24],
      attack: 'Spectral Blade',
      weapon: 'Greatsword',
      description: 'An empty suit of armor animated by pure malice.',
    },
    userName: 'Grimm Stoneheart',
  },
  {
    adversaryPreview: {
      name: 'Thornvine Crawler',
      type: 'horde',
      tier: 1,
      difficulty: 'standard',
      hp: 8,
      stress: 2,
      thresholds: [3, 6],
      attack: 'Lashing Thorns',
      description: 'Tangled masses of animated bramble that roam forest floors.',
    },
    userName: 'Lyra Thornfield',
  },
  {
    adversaryPreview: {
      name: 'The Ashen Warden',
      type: 'leader',
      tier: 4,
      difficulty: 'extreme',
      hp: 60,
      stress: 8,
      thresholds: [18, 36],
      attack: 'Cinder Breath',
      description: 'An ancient elemental bound to protect a forgotten shrine.',
    },
    userName: 'Seraphina Dawn',
  },
  {
    adversaryPreview: {
      name: 'Spore Goblin',
      type: 'minion',
      tier: 1,
      difficulty: 'standard',
      hp: 4,
      stress: 1,
      thresholds: [2, 3],
      attack: 'Toxic Spores',
      description: 'Small, erratic creatures covered in luminescent fungus.',
    },
    userName: 'Rook Ashwood',
  },
];

// ─── Mock components (no real store/router dependencies) ──────

function MockCommunityCard({
  cardPreview,
  userName,
}: {
  cardPreview: CardDetails;
  userName: string;
}) {
  return (
    <div className='group flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent/30'>
      <div className='flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted'>
        <ImageIcon className='text-muted-foreground size-5' />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <p className='truncate font-medium'>
            {cardPreview.name || 'Untitled'}
          </p>
          <Badge variant='secondary' className='shrink-0 text-[10px] capitalize'>
            {cardPreview.type}
          </Badge>
        </div>
        <div className='text-muted-foreground flex items-center gap-1.5 text-sm'>
          <Avatar className='size-4'>
            <AvatarFallback className='text-[8px]'>
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className='truncate'>{userName}</span>
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-1'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => toast.info('[Dev] Preview dialog would open')}
        >
          Preview
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => toast.info('[Dev] Would use as template')}
        >
          <Copy className='size-4' />
          <span className='sr-only sm:not-sr-only'>Use as template</span>
        </Button>
      </div>
    </div>
  );
}

function MockCommunityAdversary({
  adversaryPreview,
  userName,
}: {
  adversaryPreview: AdversaryDetails;
  userName: string;
}) {
  return (
    <div className='group flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent/30'>
      <div className='flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted'>
        <ImageIcon className='text-muted-foreground size-5' />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <p className='truncate font-medium'>
            {adversaryPreview.name || 'Untitled'}
          </p>
          {adversaryPreview.tier && (
            <Badge variant='secondary' className='shrink-0 text-[10px]'>
              Tier {adversaryPreview.tier}
            </Badge>
          )}
          {adversaryPreview.difficulty && (
            <Badge
              variant='outline'
              className='shrink-0 text-[10px] capitalize'
            >
              {adversaryPreview.difficulty}
            </Badge>
          )}
        </div>
        <div className='text-muted-foreground flex items-center gap-1.5 text-sm'>
          <Avatar className='size-4'>
            <AvatarFallback className='text-[8px]'>
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className='truncate'>{userName}</span>
          {adversaryPreview.type && (
            <>
              <span aria-hidden='true'>{'|'}</span>
              <span className='capitalize'>{adversaryPreview.type}</span>
            </>
          )}
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-1'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => toast.info('[Dev] Preview dialog would open')}
        >
          Preview
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => toast.info('[Dev] Would use as template')}
        >
          <Copy className='size-4' />
          <span className='sr-only sm:not-sr-only'>Use as template</span>
        </Button>
      </div>
    </div>
  );
}

// ─── Dev page ─────────────────────────────────────────────────

export default function DevCommunityPage() {
  return (
    <div className='bg-background text-foreground min-h-screen'>
      <div className='bg-destructive/10 border-b border-destructive/30 px-4 py-2 text-center text-sm font-medium text-destructive'>
        Dev Preview - Community Posts UI
      </div>

      <div className='mx-auto max-w-3xl px-4 py-8'>
        {/* Community Cards Section */}
        <section className='mb-10'>
          <div className='mb-4'>
            <h1 className='font-eveleth-clean text-2xl font-bold'>
              Community Cards
            </h1>
            <p className='text-muted-foreground'>
              Check out homebrew cards created by the community
            </p>
          </div>

          <div className='space-y-2'>
            {mockCards.map((card, i) => (
              <MockCommunityCard
                key={i}
                cardPreview={card.cardPreview}
                userName={card.userName}
              />
            ))}
          </div>
        </section>

        <hr className='border-border mb-10' />

        {/* Community Adversaries Section */}
        <section className='mb-10'>
          <div className='mb-4'>
            <h1 className='font-eveleth-clean text-2xl font-bold'>
              Community Adversaries
            </h1>
            <p className='text-muted-foreground'>
              Check out homebrew adversaries created by the community
            </p>
          </div>

          <div className='space-y-2'>
            {mockAdversaries.map((adv, i) => (
              <MockCommunityAdversary
                key={i}
                adversaryPreview={adv.adversaryPreview}
                userName={adv.userName}
              />
            ))}
          </div>
        </section>

        <hr className='border-border mb-10' />

        {/* Empty State */}
        <section>
          <h2 className='font-eveleth-clean mb-4 text-xl font-bold'>
            Empty State
          </h2>
          <div className='bg-card flex flex-col items-center gap-3 rounded-lg border py-12 text-center'>
            <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
              <Layers className='text-muted-foreground size-6' />
            </div>
            <div>
              <p className='font-medium'>No public cards yet</p>
              <p className='text-muted-foreground text-sm'>
                There are currently no public cards. Please check back later.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
