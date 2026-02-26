'use client';

import { ChevronDown } from 'lucide-react';

import { CollapsibleTrigger } from '@/components/ui/collapsible';

type CollapsibleSectionTriggerProps = React.ComponentProps<
  typeof CollapsibleTrigger
> & {};

export function CollapsibleSectionTrigger({
  children,
  ...props
}: CollapsibleSectionTriggerProps) {
  return (
    <CollapsibleTrigger asChild {...props}>
      <button
        type='button'
        className='hover:bg-accent/50 flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors'
      >
        {children}
        <ChevronDown className='text-muted-foreground ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
        <span className='sr-only'>Toggle section</span>
      </button>
    </CollapsibleTrigger>
  );
}
