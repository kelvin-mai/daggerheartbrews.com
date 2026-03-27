'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImageIcon, LayoutTemplate, MoreHorizontal } from 'lucide-react';

import type {
  AdversaryDetails,
  CardDetails,
  User,
  UserAdversary,
  UserCard,
} from '@/lib/types';
import { useAdversaryActions, useCardActions } from '@/store';
import { ResponsiveDialog } from '@/components/common/responsive-dialog';
import { CardPreview } from '@/components/card-creation/preview';
import { AdversaryPreviewStatblock } from '../adversary-creation/preview/statblock';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type CommunityPostProps = React.ComponentProps<'div'> & {
  name: string | undefined;
  type: string;
  image: string | undefined;
  creator: string;
  preview: React.ReactNode;
  onUseAsTemplate: () => void;
};

export const CommunityPost: React.FC<CommunityPostProps> = ({
  name,
  type,
  image,
  creator,
  preview,
  onUseAsTemplate,
  ...props
}) => (
  <div
    className='group bg-card hover:bg-accent/30 flex items-center gap-3 rounded-lg border p-3 transition-colors'
    {...props}
  >
    <div className='bg-muted flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md'>
      {image ? (
        <Image
          src={image}
          alt={`Preview image for ${name || type}`}
          className='size-10 object-cover'
          width={40}
          height={40}
        />
      ) : (
        <ImageIcon className='text-muted-foreground size-5' />
      )}
    </div>
    <div className='min-w-0 flex-1'>
      <p className='truncate font-medium'>{name || 'Untitled'}</p>
      <p className='text-muted-foreground text-sm'>
        <span className='capitalize'>{type}</span> · {creator}
      </p>
    </div>
    <div className='flex shrink-0 items-center gap-1'>
      <ResponsiveDialog label='Preview' variant='ghost' size='sm'>
        <div className='flex items-center justify-center'>{preview}</div>
      </ResponsiveDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm' className='size-8 p-0'>
            <MoreHorizontal className='size-4' />
            <span className='sr-only'>More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='border'>
          <DropdownMenuItem onClick={onUseAsTemplate}>
            <LayoutTemplate className='size-4' />
            Use as Template
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);

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
    <CommunityPost
      name={cardPreview.name}
      type={cardPreview.type}
      image={cardPreview.image}
      creator={user.name}
      onUseAsTemplate={handleTemplate}
      preview={
        <CardPreview
          card={cardPreview}
          settings={{
            border: true,
            boldRulesText: true,
            artist: true,
            credits: true,
            placeholderImage: true,
            resolution: 2,
          }}
        />
      }
      {...props}
    />
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
    <CommunityPost
      name={adversaryPreview.name}
      type={adversaryPreview.type}
      image={adversaryPreview.image}
      creator={user.name}
      onUseAsTemplate={handleTemplate}
      preview={<AdversaryPreviewStatblock adversary={adversaryPreview} />}
      {...props}
    />
  );
};
