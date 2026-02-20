'use client';

import Link from 'next/link';
import {
  ChevronDown,
  Layers,
  Skull,
  Plus,
  Eye,
  EyeOff,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import React from 'react';

import type { CardDetails, AdversaryDetails, UserCard, UserAdversary } from '@/lib/types';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// --- Mock data ---

const mockCards: { cardPreview: CardDetails; userCard: UserCard }[] = [
  {
    cardPreview: {
      name: 'Shadow Dancer',
      type: 'class',
      image: '',
      text: 'A nimble warrior who strikes from the shadows.',
      domainPrimary: 'Midnight',
      domainPrimaryColor: '#4a2d7a',
    },
    userCard: {
      id: 'card-1',
      userId: 'dev-user',
      public: true,
      upvotes: 12,
      downvotes: 1,
      cardPreviewId: 'cp-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    cardPreview: {
      name: 'Ironbark Shield',
      type: 'equipment',
      text: 'A sturdy shield crafted from enchanted wood.',
    },
    userCard: {
      id: 'card-2',
      userId: 'dev-user',
      public: false,
      upvotes: 3,
      downvotes: 0,
      cardPreviewId: 'cp-2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    cardPreview: {
      name: 'Verdant Ancestry',
      type: 'ancestry',
      text: 'Descendants of the ancient forest guardians.',
      image: '',
    },
    userCard: {
      id: 'card-3',
      userId: 'dev-user',
      public: true,
      upvotes: 8,
      downvotes: 2,
      cardPreviewId: 'cp-3',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

const mockAdversaries: {
  adversaryPreview: AdversaryDetails;
  userAdversary: UserAdversary;
}[] = [
  {
    adversaryPreview: {
      name: 'Blight Crawler',
      type: 'solo',
      tier: 3,
      hp: 45,
      stress: 8,
      difficulty: 'severe',
      description: 'A twisted creature born of corrupted magic.',
    },
    userAdversary: {
      id: 'adv-1',
      userId: 'dev-user',
      public: true,
      upvotes: 7,
      downvotes: 0,
      cardPreviewId: 'ap-1',
      adversaryPreviewId: 'ap-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    adversaryPreview: {
      name: 'Hollow Knight',
      type: 'bruiser',
      tier: 2,
      hp: 30,
      stress: 5,
      difficulty: 'standard',
      description: 'An empty suit of armor animated by fell energy.',
    },
    userAdversary: {
      id: 'adv-2',
      userId: 'dev-user',
      public: false,
      upvotes: 2,
      downvotes: 1,
      cardPreviewId: 'ap-2',
      adversaryPreviewId: 'ap-2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

// --- Mock Item Components (no store/router dependency) ---

function MockCardItem({
  cardPreview,
  userCard,
}: {
  cardPreview: CardDetails;
  userCard: UserCard;
}) {
  const [visibility, setVisibility] = React.useState(userCard.public);

  return (
    <div className='group flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent/30'>
      <div className='flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted'>
        {cardPreview.image ? (
          <ImageIcon className='text-muted-foreground size-5' />
        ) : (
          <ImageIcon className='text-muted-foreground size-5' />
        )}
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <p className='truncate font-medium'>
            {cardPreview.name || 'Untitled'}
          </p>
          <Badge
            variant={visibility ? 'default' : 'outline'}
            className='shrink-0 text-[10px]'
          >
            {visibility ? 'Public' : 'Draft'}
          </Badge>
        </div>
        <p className='text-muted-foreground text-sm capitalize'>
          {cardPreview.type}
        </p>
      </div>

      <div className='flex shrink-0 items-center gap-1'>
        <Button variant='ghost' size='sm'>
          Preview
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='size-8 p-0'>
              <MoreHorizontal className='size-4' />
              <span className='sr-only'>More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={() => toast.info('Edit clicked (dev mode)')}
            >
              <Pencil className='size-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setVisibility(!visibility)}>
              {visibility ? (
                <EyeOff className='size-4' />
              ) : (
                <Eye className='size-4' />
              )}
              {visibility ? 'Make Draft' : 'Make Public'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-destructive focus:text-destructive'>
              <Trash2 className='size-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function MockAdversaryItem({
  adversaryPreview,
  userAdversary,
}: {
  adversaryPreview: AdversaryDetails;
  userAdversary: UserAdversary;
}) {
  const [visibility, setVisibility] = React.useState(userAdversary.public);

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
          <Badge
            variant={visibility ? 'default' : 'outline'}
            className='shrink-0 text-[10px]'
          >
            {visibility ? 'Public' : 'Draft'}
          </Badge>
        </div>
        <p className='text-muted-foreground text-sm capitalize'>
          {adversaryPreview.type}
        </p>
      </div>

      <div className='flex shrink-0 items-center gap-1'>
        <Button variant='ghost' size='sm'>
          Preview
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='size-8 p-0'>
              <MoreHorizontal className='size-4' />
              <span className='sr-only'>More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={() => toast.info('Edit clicked (dev mode)')}
            >
              <Pencil className='size-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setVisibility(!visibility)}>
              {visibility ? (
                <EyeOff className='size-4' />
              ) : (
                <Eye className='size-4' />
              )}
              {visibility ? 'Make Draft' : 'Make Public'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-destructive focus:text-destructive'>
              <Trash2 className='size-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// --- Page ---

export default function DevHomebrewPage() {
  const totalItems = mockCards.length + mockAdversaries.length;
  const publicCards = mockCards.filter((d) => d.userCard.public).length;
  const publicAdversaries = mockAdversaries.filter(
    (d) => d.userAdversary.public,
  ).length;

  return (
    <div className='container mx-auto max-w-3xl py-8'>
      <div className='bg-destructive/10 text-destructive mb-6 rounded-lg border border-destructive/20 px-4 py-2 text-center text-sm font-medium'>
        DEV PREVIEW -- This page uses mock data and is for design review only
      </div>

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
            <p className='font-eveleth-clean text-2xl'>{mockCards.length}</p>
          </div>
          <div className='bg-card rounded-lg border p-3 text-center'>
            <p className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
              Adversaries
            </p>
            <p className='font-eveleth-clean text-2xl'>
              {mockAdversaries.length}
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
                {mockCards.length}
              </Badge>
              <ChevronDown className='text-muted-foreground ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
              <span className='sr-only'>Toggle cards section</span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='border-t px-4 py-3'>
              <div className='space-y-3'>
                {mockCards.map((data) => (
                  <MockCardItem
                    key={data.userCard.id}
                    cardPreview={data.cardPreview}
                    userCard={data.userCard}
                  />
                ))}
              </div>
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
                {mockAdversaries.length}
              </Badge>
              <ChevronDown className='text-muted-foreground ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
              <span className='sr-only'>Toggle adversaries section</span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='border-t px-4 py-3'>
              <div className='space-y-3'>
                {mockAdversaries.map((data) => (
                  <MockAdversaryItem
                    key={data.userAdversary.id}
                    adversaryPreview={data.adversaryPreview}
                    userAdversary={data.userAdversary}
                  />
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Empty state preview */}
        <h2 className='font-eveleth-clean text-lg'>Empty State Preview</h2>
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
                0
              </Badge>
              <ChevronDown className='text-muted-foreground ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='border-t px-4 py-3'>
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
                  <Link href='#'>
                    <Plus className='size-4' />
                    Create Card
                  </Link>
                </Button>
              </div>
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
                0
              </Badge>
              <ChevronDown className='text-muted-foreground ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='border-t px-4 py-3'>
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
                  <Link href='#'>
                    <Plus className='size-4' />
                    Create Adversary
                  </Link>
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
