'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { updateEmailPreference } from '@/actions/profile';
import { Switch } from '@/components/ui/switch';

type EmailPreferenceFormProps = {
  emailUpdates: boolean;
};

export const EmailPreferenceForm: React.FC<EmailPreferenceFormProps> = ({
  emailUpdates,
}) => {
  const [checked, setChecked] = React.useState(emailUpdates);
  const [pending, startTransition] = React.useTransition();

  const handleChange = (value: boolean) => {
    setChecked(value);
    startTransition(async () => {
      const result = await updateEmailPreference(value);
      if (result.success) {
        toast.success(
          value
            ? 'Subscribed to version updates.'
            : 'Unsubscribed from version updates.',
        );
      } else {
        setChecked(!value);
        toast.error(result.error ?? 'Failed to update email preferences.');
      }
    });
  };

  return (
    <div className='flex items-center justify-between gap-4'>
      <div>
        <p className='text-sm font-medium'>Version update emails</p>
        <p className='text-muted-foreground text-sm'>
          Receive an email when a new major or minor version ships.
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
