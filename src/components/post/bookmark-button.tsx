'use client';

import * as React from 'react';
import { Bookmark } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type BookmarkButtonProps = {
  isBookmarked: boolean;
  onToggle: () => void;
  isPending?: boolean;
};

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggle,
  isPending = false,
}) => (
  <Button
    variant='ghost'
    size='sm'
    className='size-8 p-0'
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
    disabled={isPending}
    aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
  >
    <Bookmark className={cn('size-4', isBookmarked && 'fill-current')} />
  </Button>
);
