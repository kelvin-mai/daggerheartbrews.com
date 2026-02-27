import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { useBoolean } from '@/hooks/use-boolean';
import { Input } from '@/components/ui/input';

export const PasswordInput: React.FC<React.ComponentProps<typeof Input>> = ({
  ...props
}) => {
  const visible = useBoolean();
  return (
    <div className='relative'>
      <Input type={visible.value ? 'text' : 'password'} {...props} />
      <button
        className='text-muted-foreground/80 hover:text-foreground focus-visible:outline-ring/70 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg outline-offset-2 transition-colors focus:z-10 focus-visible:outline focus-visible:outline-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
        type='button'
        onClick={visible.toggle}
        aria-label={visible.value ? 'Hide password' : 'Show password'}
        aria-pressed={visible.value}
      >
        {visible.value ? (
          <EyeOff className='size-4' aria-hidden='true' />
        ) : (
          <Eye className='size-4' aria-hidden='true' />
        )}
      </button>
    </div>
  );
};
