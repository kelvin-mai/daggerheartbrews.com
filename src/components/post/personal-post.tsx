'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import type {
  AdversaryDetails,
  CardDetails,
  UserAdversary,
  UserCard,
} from '@/lib/types';
import { Button } from '../ui/button';
import { ResponsiveDialog } from '../common';
import { CardPreview } from '../card-creation/preview';
import { AdversaryPreviewStatblock } from '../adversary-creation/preview/statblock';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type PersonalPostProps = React.ComponentProps<'div'> & {
  name: string | undefined;
  type: string;
  image: string | undefined;
  isPublic: boolean;
  editHref: string;
  endpoint: string;
  label: string;
  preview: React.ReactNode;
};

export const PersonalPost: React.FC<PersonalPostProps> = ({
  name,
  type,
  image,
  isPublic,
  editHref,
  endpoint,
  label,
  preview,
  ...props
}) => {
  const router = useRouter();
  const [visibility, setVisibility] = React.useState(isPublic);

  const updateVisibility = async () => {
    const nextVisibility = !visibility;
    try {
      setVisibility(nextVisibility);
      const res = await fetch(endpoint, {
        method: 'PUT',
        body: JSON.stringify({ public: nextVisibility }),
      });
      const data = await res.json();
      if (!data.success) throw Error('Unable to update visibility');
      toast.success(
        `${label} visibility set to ${nextVisibility ? 'public' : 'draft'}.`,
      );
    } catch {
      toast.error(
        `Something went wrong. ${label} visibility unable to change.`,
      );
      setVisibility(!nextVisibility);
    }
  };

  const deleteItem = async () => {
    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw Error('Something went wrong');
      toast.success('Success');
    } catch {
      toast.error(
        `Something went wrong. Unable to delete ${label.toLowerCase()}.`,
      );
    }
    router.refresh();
  };

  return (
    <div
      className='group bg-background hover:bg-accent/30 flex items-center gap-3 rounded-lg border p-3 transition-colors'
      {...props}
    >
      <div className='bg-muted flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md'>
        {image ? (
          <Image
            src={image}
            alt={`Preview image for ${name || label.toLowerCase()}`}
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
          <p className='truncate font-medium'>{name || 'Untitled'}</p>
          <Badge
            variant={visibility ? 'default' : 'outline'}
            className='shrink-0 text-[10px]'
          >
            {visibility ? 'Public' : 'Draft'}
          </Badge>
        </div>
        <p className='text-muted-foreground text-sm capitalize'>{type}</p>
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
          <DropdownMenuContent align='end'>
            <DropdownMenuItem asChild>
              <Link href={editHref}>
                <Pencil className='size-4' />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={updateVisibility}>
              {visibility ? (
                <EyeOff className='size-4' />
              ) : (
                <Eye className='size-4' />
              )}
              Toggle Visibility
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={deleteItem}
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

type PersonalCardProps = React.ComponentProps<'div'> & {
  cardPreview: CardDetails;
  userCard: UserCard;
};

export const PersonalCard: React.FC<PersonalCardProps> = ({
  cardPreview,
  userCard,
  ...props
}) => (
  <PersonalPost
    name={cardPreview.name}
    type={cardPreview.type}
    image={cardPreview.image}
    isPublic={userCard.public}
    editHref={`/card/edit/${userCard.id}`}
    endpoint={`/api/community/cards/${userCard.id}`}
    label='Card'
    preview={
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
    }
    {...props}
  />
);

type PersonalAdversaryProps = React.ComponentProps<'div'> & {
  adversaryPreview: AdversaryDetails;
  userAdversary: UserAdversary;
};

export const PersonalAdversary: React.FC<PersonalAdversaryProps> = ({
  adversaryPreview,
  userAdversary,
  ...props
}) => (
  <PersonalPost
    name={adversaryPreview.name}
    type={adversaryPreview.type}
    image={adversaryPreview.image}
    isPublic={userAdversary.public}
    editHref={`/adversary/edit/${userAdversary.id}`}
    endpoint={`/api/community/adversary/${userAdversary.id}`}
    label='Adversary'
    preview={<AdversaryPreviewStatblock adversary={adversaryPreview} />}
    {...props}
  />
);
