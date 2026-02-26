import * as React from 'react';

import { Collapsible } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CollapsibleSectionTrigger } from '../collapsible-section';

type FormContainerProps = React.ComponentProps<typeof Collapsible> & {
  className?: string;
  title: string;
  children?: React.ReactNode;
  collapsible?: boolean;
};

export const FormContainer: React.FC<FormContainerProps> = ({
  className,
  title,
  collapsible,
  children,
  ...props
}) => {
  const Component = collapsible ? Collapsible : 'div';
  return (
    <Component
      className={cn(
        'bg-card rounded-lg border',
        collapsible && 'group/collapsible',
        className,
      )}
      {...props}
    >
      {collapsible ? (
        <CollapsibleSectionTrigger>
          <Label className='font-eveleth-clean text-xs'>{title}</Label>
        </CollapsibleSectionTrigger>
      ) : (
        <div className='hover:bg-accent/50 flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors'>
          <Label className='font-eveleth-clean text-sm'>{title}</Label>
        </div>
      )}
      {children}
    </Component>
  );
};
