import * as React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export const FormInput: React.FC<
  React.ComponentProps<'input'> & { id: string; label?: string }
> = ({ id, label, className, value, ...props }) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>
        {label || <span className='capitalize'>{id}</span>}
      </Label>
      <Input id={id} value={value || ''} {...props} />
    </div>
  );
};
