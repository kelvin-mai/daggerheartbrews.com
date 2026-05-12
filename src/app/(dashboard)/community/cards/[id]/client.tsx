'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bookmark, ChevronLeft, LayoutTemplate } from 'lucide-react';
import { toast } from 'sonner';

import type {
  CardDetails,
  CommentWithUser,
  User,
  UserCard,
  UserCardComment,
} from '@/lib/types';
import { toggleCardBookmark } from '@/actions/bookmarks';
import { toggleCardVote } from '@/actions/votes';
import { useCardActions } from '@/store';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/auth/client';
import { CardPreview } from '@/components/card-creation/preview';
import { CommentSection } from '@/components/post/comment-section';
import { VoteButton } from '@/components/post/vote-button';
import { Button } from '@/components/ui/button';

type Props = {
  userCard: UserCard;
  cardPreview: CardDetails;
  user: User;
  comments: CommentWithUser<UserCardComment>[];
};

export const CommunityCardDetail: React.FC<Props> = ({
  userCard,
  cardPreview,
  user,
  comments,
}) => {
  const { setCardDetails } = useCardActions();
  const router = useRouter();
  const session = useSession();
  const [bookmarked, setBookmarked] = React.useState(false);
  const [isBookmarkPending, startBookmarkTransition] = React.useTransition();
  const [currentVote, setCurrentVote] = React.useState<'up' | 'down' | null>(
    null,
  );
  const [upvotes, setUpvotes] = React.useState(userCard.upvotes ?? 0);
  const [downvotes, setDownvotes] = React.useState(userCard.downvotes ?? 0);
  const [isVotePending, startVoteTransition] = React.useTransition();

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
      }
    });
  };

  return (
    <>
      <Link
        href='/community/cards'
        className='text-muted-foreground mb-6 flex items-center gap-1 text-sm'
      >
        <ChevronLeft className='size-4' />
        Back to Community Cards
      </Link>

      <div className='mb-6 flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>
            {cardPreview.name || 'Untitled'}
          </h1>
          <p className='text-muted-foreground text-sm'>
            <span className='capitalize'>{cardPreview.type}</span>
            {' · by '}
            <Link href={`/profile/${user.id}`} className='hover:underline'>
              {user.name}
            </Link>
          </p>
        </div>
        <VoteButton
          upvotes={upvotes}
          downvotes={downvotes}
          userVote={currentVote}
          onVote={handleVote}
          isPending={isVotePending}
          disabled={!session.data?.user}
        />
      </div>

      <div className='flex justify-center'>
        <div className='w-[340px] shrink-0'>
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
        </div>
      </div>

      <div className='mt-4 flex items-center gap-2'>
        {session.data?.user && (
          <Button
            variant='outline'
            onClick={handleBookmarkToggle}
            disabled={isBookmarkPending}
          >
            <Bookmark className={cn('size-4', bookmarked && 'fill-current')} />
            Bookmark
          </Button>
        )}
        <Button variant='outline' onClick={handleTemplate}>
          <LayoutTemplate className='size-4' />
          Use as Template
        </Button>
      </div>

      <div className='mt-8'>
        <CommentSection
          comments={comments}
          postType='card'
          postId={userCard.id}
          currentUserId={session.data?.user?.id}
        />
      </div>
    </>
  );
};
