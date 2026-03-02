'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import type { User } from '@/lib/types';
import { useSession } from '@/lib/auth/client';
import { updateProfile } from '@/actions/profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField } from '../common';

type ProfileSettingsFormProps = {
  user: User;
};

export const ProfileSettingsForm: React.FC<ProfileSettingsFormProps> = ({
  user,
}) => {
  const { refetch } = useSession();
  const [state, action, pending] = React.useActionState(updateProfile, {
    success: false,
  });

  React.useEffect(() => {
    if (state.success) {
      refetch();
      toast.success('Profile settings updated.');
    } else if (state.errors?.action) {
      toast.error(state.errors.action);
    }
  }, [state]);

  return (
    <form action={action} className='flex flex-col space-y-4'>
      <FormField id='email'>
        <Input
          id='email'
          type='email'
          defaultValue={user.email}
          name='email'
          disabled
        />
        <input className='hidden' defaultValue={user.email} name='email' />
      </FormField>
      <FormField
        id='name'
        label='Username'
        errors={state.errors?.validation?.name}
      >
        <Input id='name' name='name' defaultValue={user.name} />
      </FormField>
      <Button type='submit' disabled={pending}>
        {pending ? <Loader2 className='animate-spin' /> : null}
        Edit Settings
      </Button>
    </form>
  );
};
