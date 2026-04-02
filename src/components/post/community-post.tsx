'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImageIcon, LayoutTemplate, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import type {
  AdversaryDetails,
  CardDetails,
  User,
  UserAdversary,
  UserCard,
} from '@/lib/types';
import {
  toggleAdversaryBookmark,
  toggleCardBookmark,
} from '@/actions/bookmarks';
import { useAdversaryActions, useCardActions } from '@/store';
import { useSession } from '@/lib/auth/client';
import { ResponsiveDialog } from '@/components/common/responsive-dialog';
import { CardPreview } from '@/components/card-creation/preview';
import { AdversaryPreviewStatblock } from '../adversary-creation/preview/statblock';
import { BookmarkButton } from './bookmark-button';
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
  bookmarkButton?: React.ReactNode;
};

export const CommunityPost: React.FC<CommunityPostProps> = ({
  name,
  type,
  image,
  creator,
  preview,
  onUseAsTemplate,
  bookmarkButton,
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
      {bookmarkButton}
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
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
};

export const CommunityCard: React.FC<CommunityCardProps> = ({
  cardPreview,
  user,
  userCard,
  isBookmarked = false,
  onBookmarkToggle,
  ...props
}) => {
  const { setCardDetails } = useCardActions();
  const router = useRouter();
  const session = useSession();
  const [bookmarked, setBookmarked] = React.useState(isBookmarked);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const handleTemplate = () => {
    setCardDetails(cardPreview);
    router.push('/card/create?template=true');
  };

  const handleBookmarkToggle = () => {
    const next = !bookmarked;
    setBookmarked(next);
    startTransition(async () => {
      const result = await toggleCardBookmark({ userCardId: userCard.id });
      if (result.error) {
        setBookmarked(!next);
        toast.error('Failed to update bookmark');
      } else {
        onBookmarkToggle?.();
      }
    });
  };

  return (
    <CommunityPost
      name={cardPreview.name}
      type={cardPreview.type}
      image={cardPreview.image}
      creator={user.name}
      onUseAsTemplate={handleTemplate}
      bookmarkButton={
        session.data?.user ? (
          <BookmarkButton
            isBookmarked={bookmarked}
            onToggle={handleBookmarkToggle}
            isPending={isPending}
          />
        ) : undefined
      }
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
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
};

export const CommunityAdversary: React.FC<CommunityAdversaryProps> = ({
  adversaryPreview,
  user,
  userAdversary,
  isBookmarked = false,
  onBookmarkToggle,
  ...props
}) => {
  const { setAdversaryDetails } = useAdversaryActions();
  const router = useRouter();
  const session = useSession();
  const [bookmarked, setBookmarked] = React.useState(isBookmarked);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const handleTemplate = () => {
    setAdversaryDetails(adversaryPreview);
    router.push('/adversary/create?template=true');
  };

  const handleBookmarkToggle = () => {
    const next = !bookmarked;
    setBookmarked(next);
    startTransition(async () => {
      const result = await toggleAdversaryBookmark({
        userAdversaryId: userAdversary.id,
      });
      if (result.error) {
        setBookmarked(!next);
        toast.error('Failed to update bookmark');
      } else {
        onBookmarkToggle?.();
      }
    });
  };

  return (
    <CommunityPost
      name={adversaryPreview.name}
      type={adversaryPreview.type}
      image={adversaryPreview.image}
      creator={user.name}
      onUseAsTemplate={handleTemplate}
      bookmarkButton={
        session.data?.user ? (
          <BookmarkButton
            isBookmarked={bookmarked}
            onToggle={handleBookmarkToggle}
            isPending={isPending}
          />
        ) : undefined
      }
      preview={<AdversaryPreviewStatblock adversary={adversaryPreview} />}
      {...props}
    />
  );
};
