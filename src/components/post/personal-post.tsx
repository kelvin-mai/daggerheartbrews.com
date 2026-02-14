'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImageIcon } from 'lucide-react';

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
import { Switch } from '../ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type VisibilityToggleProps = React.ComponentProps<'div'> & {
  visiblility: boolean;
  onVisibilityChange: (checked: boolean) => void;
};

const VisibilityToggle: React.FC<VisibilityToggleProps> = ({
  className,
  visiblility,
  onVisibilityChange,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-card flex items-center justify-between rounded-md border p-4',
        className,
      )}
      {...props}
    >
      <div>
        <p>Public Visibility</p>
        <p className='text-muted-foreground'>
          Mark this item as public to showcase to the community.
        </p>
      </div>
      <Switch checked={visiblility} onCheckedChange={onVisibilityChange} />
    </div>
  );
};

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
  const [visiblility, setVisibility] = React.useState(userCard.public);
  const { setUserCard, setCardDetails } = useCardActions();
  const handleTemplate = () => {
    setUserCard(userCard);
    setCardDetails(cardPreview);
    router.push('/card/create');
  };
  const updateVisibility = async () => {
    const nextVisibility = !visiblility;
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
    const confirmed = window.confirm(
      `Are you sure you want to delete "${cardPreview.name || 'Untitled'}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    
    try {
      const res = await fetch(`/api/community/cards/${userCard.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        throw Error('Something went wrong');
      }
      toast.success('Card deleted successfully');
    } catch (e) {
      toast.error('Something went wrong. Unable to delete card.');
    }
    router.refresh();
  };
  const cloneCard = async () => {
    try {
      const res = await fetch('/api/card-preview', {
        method: 'POST',
        body: JSON.stringify({
          card: {
            ...cardPreview,
            id: undefined as unknown as string, // ensure new id server-side
            name: `Clone of ${cardPreview.name || 'Untitled'}`,
          },
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw Error('Unable to clone card');
      }
      toast.success('Card cloned successfully');
      router.refresh();
    } catch (e) {
      toast.error('Something went wrong. Unable to clone card.');
    }
  };
  return (
    <div className='bg-card rounded-lg border p-4' {...props}>
      <div className='flex items-start'>
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
              <span className='capitalize'>{cardPreview.type}</span>
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
                  cardBack: 'default',
                  customCardBackLogo: undefined,
                }}
              />
            </div>
          </ResponsiveDialog>
          <Button variant='secondary' onClick={handleTemplate}>
            Edit
          </Button>
          <Button variant='outline' onClick={cloneCard}>
            Clone
          </Button>
          <Button variant='destructive' onClick={deleteCard}>
            Delete
          </Button>
        </div>
      </div>
      <VisibilityToggle
        className='mt-2'
        visiblility={visiblility}
        onVisibilityChange={updateVisibility}
      />
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
  const [visiblility, setVisibility] = React.useState(userAdversary.public);
  const { setAdversaryDetails, setUserAdversary } = useAdversaryActions();
  const router = useRouter();
  const handleTemplate = () => {
    setUserAdversary(userAdversary);
    setAdversaryDetails(adversaryPreview);
    router.push('/adversary/create');
  };
  const updateVisibility = async () => {
    const nextVisibility = !visiblility;
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
  const cloneAdversary = async () => {
    try {
      const res = await fetch('/api/adversary-preview', {
        method: 'POST',
        body: JSON.stringify({
          adversary: {
            ...adversaryPreview,
            id: undefined as unknown as string,
            name: `Clone of ${adversaryPreview.name || 'Untitled'}`,
          },
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw Error('Unable to clone adversary');
      }
      toast.success('Adversary cloned successfully');
      router.refresh();
    } catch (e) {
      toast.error('Something went wrong. Unable to clone adversary.');
    }
  };
  const deleteAdversary = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${adversaryPreview.name || 'Untitled'}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    
    try {
      const res = await fetch(`/api/community/adversary/${userAdversary.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        throw Error('Something went wrong');
      }
      toast.success('Adversary deleted successfully');
    } catch (e) {
      toast.error('Something went wrong. Unable to delete adversary.');
    }
    router.refresh();
  };
  return (
    <div className='bg-card rounded-lg border p-4' {...props}>
      <div className='flex items-start'>
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
              <span className='capitalize'>{adversaryPreview.type}</span>
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
            Edit
          </Button>
          <Button variant='outline' onClick={cloneAdversary}>
            Clone
          </Button>
          <Button variant='destructive' onClick={deleteAdversary}>
            Delete
          </Button>
        </div>
      </div>
      <VisibilityToggle
        className='mt-2'
        visiblility={visiblility}
        onVisibilityChange={updateVisibility}
      />
    </div>
  );
};
