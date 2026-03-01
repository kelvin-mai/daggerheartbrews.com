'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { updatePublicByDefault } from '@/actions/profile';
import { Switch } from '@/components/ui/switch';

type PublicDefaultFormProps = {
  publicByDefault: boolean;
};

export const PublicDefaultForm: React.FC<PublicDefaultFormProps> = ({
  publicByDefault,
}) => {
  const [checked, setChecked] = React.useState(publicByDefault);
  const [pending, startTransition] = React.useTransition();

  const handleChange = (value: boolean) => {
    setChecked(value);
    startTransition(async () => {
      const result = await updatePublicByDefault(value);
      if (result.success) {
        toast.success(
          value
            ? 'New content will be public by default.'
            : 'New content will be saved as draft by default.',
        );
      } else {
        setChecked(!value);
        toast.error(result.error ?? 'Failed to update preference.');
      }
    });
  };

  return (
    <div className='flex items-center justify-between gap-4'>
      <div>
        <p className='text-sm font-medium'>Public by default</p>
        <p className='text-muted-foreground text-sm'>
          Newly created cards and adversaries will be published to the community
          automatically.
        </p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={handleChange}
        disabled={pending}
      />
    </div>
  );
};
