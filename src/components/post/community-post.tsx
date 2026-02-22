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
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const { setCardDetails } = useCardActions();
  const router = useRouter();
  const handleTemplate = () => {
    setCardDetails(cardPreview);
    router.push('/card/create?template=true');
  };
  return (
    <div className='bg-card flex items-start rounded-lg border p-4' {...props}>
      <div className='flex items-center gap-4'>
        {cardPreview.image ? (
          <Image
            src={cardPreview.image}
            alt={`Preview image ${userCard.id}`}
            className='overflow-hidden rounded'
            width={32}
            height={32}
          />
        ) : (
          <ImageIcon className='text-muted-foreground size-8' />
        )}
        <div>
          <p className='font-bold'>{cardPreview.name || 'Untitled'}</p>
          <p className='text-muted-foreground text-sm'>
            <span className='capitalize'>{cardPreview.type}</span> created by{' '}
            {user.name}
          </p>
        </div>
      </div>
      <div className='ml-auto flex flex-col gap-2'>
        <ResponsiveDialog label='Preview'>
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
        <Button variant='secondary' onClick={handleTemplate}>
          Use as template
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
  const { setAdversaryDetails } = useAdversaryActions();
  const router = useRouter();
  const handleTemplate = () => {
    setAdversaryDetails(adversaryPreview);
    router.push('/adversary/create?template=true');
  };
  return (
    <div className='bg-card flex items-start rounded-lg border p-4' {...props}>
      <div className='flex items-center gap-4'>
        {adversaryPreview.image ? (
          <Image
            src={adversaryPreview.image}
            alt={`Preview image ${userAdversary.id}`}
            className='overflow-hidden rounded'
            width={32}
            height={32}
          />
        ) : (
          <ImageIcon className='text-muted-foreground size-8' />
        )}
        <div>
          <p className='font-bold'>{adversaryPreview.name || 'Untitled'}</p>
          <p className='text-muted-foreground text-sm'>
            <span className='capitalize'>{adversaryPreview.type}</span> created
            by {user.name}
          </p>
        </div>
      </div>
      <div className='ml-auto flex flex-col gap-2'>
        <ResponsiveDialog label='Preview'>
          <div className='flex items-center justify-center'>
            <AdversaryPreviewStatblock adversary={adversaryPreview} />
          </div>
        </ResponsiveDialog>
        <Button variant='secondary' onClick={handleTemplate}>
          Use as template
        </Button>
      </div>
    </div>
  );
};
