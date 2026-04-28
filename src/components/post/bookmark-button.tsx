'use client';

import * as React from 'react';
import { Bookmark } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type BookmarkButtonProps = {
  isBookmarked: boolean;
  onToggle: () => void;
  isPending?: boolean;
};

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggle,
  isPending = false,
}) => {
  const label = isBookmarked ? 'Remove bookmark' : 'Add bookmark';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='size-8 p-0'
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            disabled={isPending}
            aria-label={label}
          >
            <Bookmark
              className={cn('size-4', isBookmarked && 'fill-current')}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
