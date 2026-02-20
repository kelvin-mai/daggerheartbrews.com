'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import type {
  AdversaryDetails,
  CardDetails,
  User,
  UserAdversary,
  UserCard,
} from '@/lib/types';
import { Copy, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { useAdversaryActions, useCardActions } from '@/store';
import { ResponsiveDialog } from '@/components/common/responsive-dialog';
import { CardPreview } from '@/components/card-creation/preview';
import { AdversaryPreviewStatblock } from '../adversary-creation/preview/statblock';

type CommunityCardProps = React.ComponentProps<'div'> & {
  cardPreview: CardDetails;
  user: User;
  userCard: UserCard;
};

export const CommunityCard: React.FC<CommunityCardProps> = ({
  cardPreview,
  user,
  userCard,
  ...props
}) => {
  const { setCardDetails, setUserCard } = useCardActions();
  const router = useRouter();
  const handleTemplate = () => {
    setUserCard(userCard);
    setCardDetails(cardPreview);
    router.push('/card/create');
  };
  return (
    <div
      className='group flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent/30'
      {...props}
    >
      <div className='flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted'>
        {cardPreview.image ? (
          <Image
            src={cardPreview.image}
            alt={`Preview image for ${cardPreview.name || 'card'}`}
            className='size-10 object-cover'
            width={40}
            height={40}
          />
        ) : (
          <ImageIcon className='text-muted-foreground size-5' />
        )}
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
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className='text-[8px]'>
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className='truncate'>{user.name}</span>
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-1'>
        <ResponsiveDialog label='Preview' variant='ghost' size='sm'>
          <div className='flex items-center justify-center'>
            <CardPreview
              card={cardPreview}
              settings={{
                border: true,
                boldRulesText: true,
                artist: true,
                credits: true,
                placeholderImage: true,
              }}
            />
          </div>
        </ResponsiveDialog>
        <Button variant='ghost' size='sm' onClick={handleTemplate}>
          <Copy className='size-4' />
          <span className='sr-only sm:not-sr-only'>Use as template</span>
        </Button>
      </div>
    </div>
  );
};

type CommunityAdversaryProps = React.ComponentProps<'div'> & {
  adversaryPreview: AdversaryDetails;
  user: User;
  userAdversary: UserAdversary;
};

export const CommunityAdversary: React.FC<CommunityAdversaryProps> = ({
  adversaryPreview,
  user,
  userAdversary,
  ...props
}) => {
  const { setAdversaryDetails, setUserAdversary } = useAdversaryActions();
  const router = useRouter();
  const handleTemplate = () => {
    setUserAdversary(userAdversary);
    setAdversaryDetails(adversaryPreview);
    router.push('/adversary/create');
  };
  return (
    <div
      className='group flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent/30'
      {...props}
    >
      <div className='flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted'>
        {adversaryPreview.image ? (
          <Image
            src={adversaryPreview.image}
            alt={`Preview image for ${adversaryPreview.name || 'adversary'}`}
            className='size-10 object-cover'
            width={40}
            height={40}
          />
        ) : (
          <ImageIcon className='text-muted-foreground size-5' />
        )}
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
            <Badge variant='outline' className='shrink-0 text-[10px] capitalize'>
              {adversaryPreview.difficulty}
            </Badge>
          )}
        </div>
        <div className='text-muted-foreground flex items-center gap-1.5 text-sm'>
          <Avatar className='size-4'>
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className='text-[8px]'>
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className='truncate'>{user.name}</span>
          {adversaryPreview.type && (
            <>
              <span aria-hidden='true'>{'|'}</span>
              <span className='capitalize'>{adversaryPreview.type}</span>
            </>
          )}
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-1'>
        <ResponsiveDialog label='Preview' variant='ghost' size='sm'>
          <div className='flex items-center justify-center'>
            <AdversaryPreviewStatblock adversary={adversaryPreview} />
          </div>
        </ResponsiveDialog>
        <Button variant='ghost' size='sm' onClick={handleTemplate}>
          <Copy className='size-4' />
          <span className='sr-only sm:not-sr-only'>Use as template</span>
        </Button>
      </div>
    </div>
  );
};
