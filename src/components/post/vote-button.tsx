'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type VoteButtonProps = {
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  onVote: (vote: 'up' | 'down') => void;
  isPending: boolean;
  disabled?: boolean;
};

export const VoteButton: React.FC<VoteButtonProps> = ({
  upvotes,
  downvotes,
  userVote,
  onVote,
  isPending,
  disabled = false,
}) => {
  const score = upvotes - downvotes;
  const isDisabled = isPending || disabled;

  return (
    <div className='flex shrink-0 flex-col items-center'>
      <Button
        variant='ghost'
        size='sm'
        className={cn(
          'size-7 p-0',
          userVote === 'up' && 'dark:text-primary-foreground text-amber-600',
        )}
        onClick={(e) => {
          e.stopPropagation();
          onVote('up');
        }}
        disabled={isDisabled}
        aria-label='Upvote'
      >
        <ChevronUp className='size-4' />
      </Button>
      <span
        className={cn(
          'min-w-5 text-center text-xs leading-none tabular-nums',
          userVote === 'up' &&
            'dark:text-primary-foreground font-medium text-amber-600',
          userVote === 'down' && 'text-destructive font-medium',
          !userVote && 'text-muted-foreground',
        )}
      >
        {score}
      </span>
      <Button
        variant='ghost'
        size='sm'
        className={cn('size-7 p-0', userVote === 'down' && 'text-destructive')}
        onClick={(e) => {
          e.stopPropagation();
          onVote('down');
        }}
        disabled={isDisabled}
        aria-label='Downvote'
      >
        <ChevronDown className='size-4' />
      </Button>
    </div>
  );
};
