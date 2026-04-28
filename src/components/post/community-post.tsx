'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, ImageIcon, LayoutTemplate } from 'lucide-react';
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
import { toggleAdversaryVote, toggleCardVote } from '@/actions/votes';
import { useAdversaryActions, useCardActions } from '@/store';
import { useSession } from '@/lib/auth/client';
import { ResponsiveDialog } from '@/components/common/responsive-dialog';
import { CardPreview } from '@/components/card-creation/preview';
import { AdversaryPreviewStatblock } from '../adversary-creation/preview/statblock';
import { BookmarkButton } from './bookmark-button';
import { VoteButton } from './vote-button';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type CommunityPostProps = React.ComponentProps<'div'> & {
  name: string | undefined;
  type: string;
  image: string | undefined;
  creator: string;
  preview: React.ReactNode;
  onUseAsTemplate: () => void;
  bookmarkButton?: React.ReactNode;
  voteButton?: React.ReactNode;
};

export const CommunityPost: React.FC<CommunityPostProps> = ({
  name,
  type,
  image,
  creator,
  preview,
  onUseAsTemplate,
  bookmarkButton,
  voteButton,
  ...props
}) => (
  <div
    className='group bg-card hover:bg-accent/30 rounded-lg border transition-colors'
    {...props}
  >
    <div className='flex items-start gap-3 px-3 pt-3'>
      <div className='bg-muted mt-0.5 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md'>
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
      {voteButton}
    </div>
    <div className='flex items-center gap-0.5 px-2 pb-1.5'>
      {bookmarkButton}
      <ResponsiveDialog
        label='Preview'
        icon={<Eye className='size-4' />}
        variant='ghost'
        size='sm'
        className='size-8 p-0'
      >
        <div className='flex items-center justify-center'>{preview}</div>
      </ResponsiveDialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='size-8 p-0'
              onClick={onUseAsTemplate}
              aria-label='Use as Template'
            >
              <LayoutTemplate className='size-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Use as Template</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
);

type CommunityCardProps = React.ComponentProps<'div'> & {
  cardPreview: CardDetails;
  user: User;
  userCard: UserCard;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  userVote?: 'up' | 'down' | null;
  onVoteToggle?: () => void;
};

export const CommunityCard: React.FC<CommunityCardProps> = ({
  cardPreview,
  user,
  userCard,
  isBookmarked = false,
  onBookmarkToggle,
  userVote = null,
  onVoteToggle,
  ...props
}) => {
  const { setCardDetails } = useCardActions();
  const router = useRouter();
  const session = useSession();
  const [bookmarked, setBookmarked] = React.useState(isBookmarked);
  const [isBookmarkPending, startBookmarkTransition] = React.useTransition();
  const [currentVote, setCurrentVote] = React.useState<'up' | 'down' | null>(
    userVote,
  );
  const [upvotes, setUpvotes] = React.useState(userCard.upvotes ?? 0);
  const [downvotes, setDownvotes] = React.useState(userCard.downvotes ?? 0);
  const [isVotePending, startVoteTransition] = React.useTransition();

  React.useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  React.useEffect(() => {
    setCurrentVote(userVote);
  }, [userVote]);

  React.useEffect(() => {
    setUpvotes(userCard.upvotes ?? 0);
    setDownvotes(userCard.downvotes ?? 0);
  }, [userCard.upvotes, userCard.downvotes]);

  const handleTemplate = () => {
    setCardDetails(cardPreview);
    router.push('/card/create?template=true');
  };

  const handleBookmarkToggle = () => {
    const next = !bookmarked;
    setBookmarked(next);
    startBookmarkTransition(async () => {
      const result = await toggleCardBookmark({ userCardId: userCard.id });
      if (result.error) {
        setBookmarked(!next);
        toast.error('Failed to update bookmark');
      } else {
        onBookmarkToggle?.();
      }
    });
  };

  const handleVote = (vote: 'up' | 'down') => {
    const prevVote = currentVote;
    const prevUp = upvotes;
    const prevDown = downvotes;

    if (prevVote === vote) {
      setCurrentVote(null);
      if (vote === 'up') setUpvotes((v) => v - 1);
      else setDownvotes((v) => v - 1);
    } else {
      setCurrentVote(vote);
      if (vote === 'up') {
        setUpvotes((v) => v + 1);
        if (prevVote === 'down') setDownvotes((v) => v - 1);
      } else {
        setDownvotes((v) => v + 1);
        if (prevVote === 'up') setUpvotes((v) => v - 1);
      }
    }

    startVoteTransition(async () => {
      const result = await toggleCardVote({ userCardId: userCard.id, vote });
      if (result.error) {
        setCurrentVote(prevVote);
        setUpvotes(prevUp);
        setDownvotes(prevDown);
        toast.error('Failed to update vote');
      } else if (result.data) {
        setUpvotes(result.data.upvotes);
        setDownvotes(result.data.downvotes);
        setCurrentVote(result.data.userVote);
        onVoteToggle?.();
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
            isPending={isBookmarkPending}
          />
        ) : undefined
      }
      voteButton={
        <VoteButton
          upvotes={upvotes}
          downvotes={downvotes}
          userVote={currentVote}
          onVote={handleVote}
          isPending={isVotePending}
          disabled={!session.data?.user}
        />
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
  userVote?: 'up' | 'down' | null;
  onVoteToggle?: () => void;
};

export const CommunityAdversary: React.FC<CommunityAdversaryProps> = ({
  adversaryPreview,
  user,
  userAdversary,
  isBookmarked = false,
  onBookmarkToggle,
  userVote = null,
  onVoteToggle,
  ...props
}) => {
  const { setAdversaryDetails } = useAdversaryActions();
  const router = useRouter();
  const session = useSession();
  const [bookmarked, setBookmarked] = React.useState(isBookmarked);
  const [isBookmarkPending, startBookmarkTransition] = React.useTransition();
  const [currentVote, setCurrentVote] = React.useState<'up' | 'down' | null>(
    userVote,
  );
  const [upvotes, setUpvotes] = React.useState(userAdversary.upvotes ?? 0);
  const [downvotes, setDownvotes] = React.useState(
    userAdversary.downvotes ?? 0,
  );
  const [isVotePending, startVoteTransition] = React.useTransition();

  React.useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  React.useEffect(() => {
    setCurrentVote(userVote);
  }, [userVote]);

  React.useEffect(() => {
    setUpvotes(userAdversary.upvotes ?? 0);
    setDownvotes(userAdversary.downvotes ?? 0);
  }, [userAdversary.upvotes, userAdversary.downvotes]);

  const handleTemplate = () => {
    setAdversaryDetails(adversaryPreview);
    router.push('/adversary/create?template=true');
  };

  const handleBookmarkToggle = () => {
    const next = !bookmarked;
    setBookmarked(next);
    startBookmarkTransition(async () => {
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

  const handleVote = (vote: 'up' | 'down') => {
    const prevVote = currentVote;
    const prevUp = upvotes;
    const prevDown = downvotes;

    if (prevVote === vote) {
      setCurrentVote(null);
      if (vote === 'up') setUpvotes((v) => v - 1);
      else setDownvotes((v) => v - 1);
    } else {
      setCurrentVote(vote);
      if (vote === 'up') {
        setUpvotes((v) => v + 1);
        if (prevVote === 'down') setDownvotes((v) => v - 1);
      } else {
        setDownvotes((v) => v + 1);
        if (prevVote === 'up') setUpvotes((v) => v - 1);
      }
    }

    startVoteTransition(async () => {
      const result = await toggleAdversaryVote({
        userAdversaryId: userAdversary.id,
        vote,
      });
      if (result.error) {
        setCurrentVote(prevVote);
        setUpvotes(prevUp);
        setDownvotes(prevDown);
        toast.error('Failed to update vote');
      } else if (result.data) {
        setUpvotes(result.data.upvotes);
        setDownvotes(result.data.downvotes);
        setCurrentVote(result.data.userVote);
        onVoteToggle?.();
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
            isPending={isBookmarkPending}
          />
        ) : undefined
      }
      voteButton={
        <VoteButton
          upvotes={upvotes}
          downvotes={downvotes}
          userVote={currentVote}
          onVote={handleVote}
          isPending={isVotePending}
          disabled={!session.data?.user}
        />
      }
      preview={<AdversaryPreviewStatblock adversary={adversaryPreview} />}
      {...props}
    />
  );
};
