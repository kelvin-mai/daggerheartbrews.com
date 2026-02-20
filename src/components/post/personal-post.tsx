'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

import type {
  AdversaryDetails,
  CardDetails,
  UserAdversary,
  UserCard,
} from '@/lib/types';
import { useAdversaryActions, useCardActions } from '@/store';
import { Button } from '../ui/button';
import { ResponsiveDialog } from '../common';
import { CardPreview } from '../card-creation/preview';
import { AdversaryPreviewStatblock } from '../adversary-creation/preview/statblock';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type PersonalCardProps = React.ComponentProps<'div'> & {
  cardPreview: CardDetails;
  userCard: UserCard;
};

export const PersonalCard: React.FC<PersonalCardProps> = ({
  cardPreview,
  userCard,
  ...props
}) => {
  const router = useRouter();
  const [visibility, setVisibility] = React.useState(userCard.public);
  const { setUserCard, setCardDetails } = useCardActions();
  const handleTemplate = () => {
    setUserCard(userCard);
    setCardDetails(cardPreview);
    router.push('/card/create');
  };
  const updateVisibility = async () => {
    const nextVisibility = !visibility;
    try {
      setVisibility(nextVisibility);
      const res = await fetch(`/api/community/cards/${userCard.id}`, {
        method: 'PUT',
        body: JSON.stringify({ public: nextVisibility }),
      });
      const data = await res.json();
      if (!data.success) {
        throw Error('Unable to update visibility');
      }
      toast.success(
        `Card visibility set to ${nextVisibility ? 'public' : 'draft'}.`,
      );
    } catch {
      toast.error('Something went wrong. Card visibility unable to change.');
      setVisibility(!nextVisibility);
    }
  };
  const deleteCard = async () => {
    try {
      const res = await fetch(`/api/community/cards/${userCard.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        throw Error('Something went wrong');
      }
      toast.success('Success');
    } catch {
      toast.error('Something went wrong. Unable to delete card.');
    }
    router.refresh();
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='size-8 p-0'>
              <MoreHorizontal className='size-4' />
              <span className='sr-only'>More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={handleTemplate}>
              <Pencil className='size-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={updateVisibility}>
              {visibility ? (
                <EyeOff className='size-4' />
              ) : (
                <Eye className='size-4' />
              )}
              {visibility ? 'Make Draft' : 'Make Public'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={deleteCard}
              className='text-destructive focus:text-destructive'
            >
              <Trash2 className='size-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

type PersonalAdversaryProps = React.ComponentProps<'div'> & {
  adversaryPreview: AdversaryDetails;
  userAdversary: UserAdversary;
};

export const PersonalAdversary: React.FC<PersonalAdversaryProps> = ({
  adversaryPreview,
  userAdversary,
  ...props
}) => {
  const [visibility, setVisibility] = React.useState(userAdversary.public);
  const { setAdversaryDetails, setUserAdversary } = useAdversaryActions();
  const router = useRouter();
  const handleTemplate = () => {
    setUserAdversary(userAdversary);
    setAdversaryDetails(adversaryPreview);
    router.push('/adversary/create');
  };
  const updateVisibility = async () => {
    const nextVisibility = !visibility;
    try {
      setVisibility(nextVisibility);
      const res = await fetch(`/api/community/adversary/${userAdversary.id}`, {
        method: 'PUT',
        body: JSON.stringify({ public: nextVisibility }),
      });
      const data = await res.json();
      if (!data.success) {
        throw Error('Unable to update visibility');
      }
      toast.success(
        `Adversary visibility set to ${nextVisibility ? 'public' : 'draft'}.`,
      );
    } catch {
      toast.error(
        'Something went wrong. Adversary visibility unable to change.',
      );
      setVisibility(!nextVisibility);
    }
  };
  const deleteAdversary = async () => {
    try {
      const res = await fetch(`/api/community/adversary/${userAdversary.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        throw Error('Something went wrong');
      }
      toast.success('Success');
    } catch {
      toast.error('Something went wrong. Unable to delete adversary.');
    }
    router.refresh();
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
        <ResponsiveDialog label='Preview' variant='ghost' size='sm'>
          <div className='flex items-center justify-center'>
            <AdversaryPreviewStatblock adversary={adversaryPreview} />
          </div>
        </ResponsiveDialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='size-8 p-0'>
              <MoreHorizontal className='size-4' />
              <span className='sr-only'>More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={handleTemplate}>
              <Pencil className='size-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={updateVisibility}>
              {visibility ? (
                <EyeOff className='size-4' />
              ) : (
                <Eye className='size-4' />
              )}
              {visibility ? 'Make Draft' : 'Make Public'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={deleteAdversary}
              className='text-destructive focus:text-destructive'
            >
              <Trash2 className='size-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
