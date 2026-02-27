'use client';

import { useSession } from '@/lib/auth/client';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';

export const SavePreviewButton: React.FC<
  React.ComponentProps<typeof Button>
> = ({ className, children, disabled, ...props }) => {
  const session = useSession();
  return session.data?.user ? (
    <Button {...props} className={className} disabled={disabled}>
      {children}
    </Button>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...props}
          aria-disabled
          className={cn('w-full cursor-not-allowed opacity-50', className)}
          onClick={(e) => e.preventDefault()}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Save feature is only available if you are logged in.</p>
      </TooltipContent>
    </Tooltip>
  );
};
