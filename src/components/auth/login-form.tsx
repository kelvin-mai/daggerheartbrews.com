'use client';

import * as React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { login } from '@/actions/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormField, PasswordInput } from '../common';
import { cn } from '@/lib/utils';

export const LoginForm = () => {
  const [state, action, pending] = React.useActionState(login, {
    success: false,
  });
  if (state.success) {
    redirect('/profile/homebrew');
  }

  return (
    <form action={action} className='flex flex-col space-y-4'>
      {state.errors?.action ? (
        <div className='border-destructive text-destructive bg-destructive/10 rounded-lg border px-4 py-2'>
          <p>{state.errors.action}</p>
        </div>
      ) : null}
      <FormField id='email' errors={state.errors?.validation?.email}>
        <Input
          id='email'
          type='email'
          name='email'
          className={cn(
            state.errors?.validation?.email && 'border-destructive',
          )}
        />
      </FormField>
      <div className='space-y-2'>
        <div className='flex justify-between'>
          <Label htmlFor='password'>Password</Label>
          <Link
            href='/forgot-password'
            className='text-sm underline-offset-4 hover:underline'
          >
            Forgot your password?
          </Link>
        </div>
        <PasswordInput
          id='password'
          type='password'
          name='password'
          className={cn(
            state.errors?.validation?.password && 'border-destructive',
          )}
        />
        {state.errors?.validation?.password ? (
          <div className='text-destructive text-sm'>
            {state.errors.validation.password[0]}
          </div>
        ) : null}
      </div>
      <Button type='submit' disabled={pending}>
        {pending ? <Loader2 className='animate-spin' /> : null}
        Login
      </Button>
    </form>
  );
};
