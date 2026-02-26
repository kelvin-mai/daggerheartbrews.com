import * as React from 'react';

import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CollapsibleSectionTrigger } from '../common';

type GameMasterCollapsibleProps = React.ComponentProps<typeof Collapsible> & {
  label: string;
};

export const GameMasterCollapsible: React.FC<GameMasterCollapsibleProps> = ({
  className,
  label,
  children,
  ...props
}) => {
  return (
    <Collapsible
      className={cn('bg-card rounded-sm border', className)}
      {...props}
    >
      <CollapsibleSectionTrigger>
        <Label className='font-eveleth-clean text-sm'>{label}</Label>
      </CollapsibleSectionTrigger>
      <CollapsibleContent className='border-t px-4 py-3'>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};
