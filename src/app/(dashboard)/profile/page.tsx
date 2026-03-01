import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { LogoutButton, ProfileSettingsForm } from '@/components/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader } from '@/components/common';
import { ResendVerificationForm } from './client';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div>
      <PageHeader
        title='Account'
        subtitle='Manage your account details and preferences.'
      />
      <div className='my-4 space-y-4'>
        <div className='bg-card space-y-2 rounded-lg border p-4'>
          <div className='flex items-center gap-2'>
            <Avatar className='size-8 rounded-lg'>
              <AvatarImage
                src={session?.user.image ?? undefined}
                alt={session?.user.name}
              />
              <AvatarFallback className='uppercase'>
                {session?.user.name.charAt(0) ?? '?'}
              </AvatarFallback>
            </Avatar>

            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-medium'>{session?.user.name}</span>
              <span className='text-muted-foreground truncate text-xs'>
                {session?.user.email}
              </span>
            </div>

            <LogoutButton className='ml-auto' />
          </div>
          {session?.user && (
            <>
              <h2 className='mb-2 text-lg font-bold'>Basic Settings</h2>
              <ProfileSettingsForm user={session.user} />
            </>
          )}
        </div>
        {session?.user && !session.user.emailVerified && (
          <ResendVerificationForm email={session.user.email} />
        )}
      </div>
    </div>
  );
}
