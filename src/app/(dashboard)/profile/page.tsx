import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import { userSettings } from '@/lib/database/schema';
import {
  EmailPreferenceForm,
  ExportResolutionForm,
  LogoutButton,
  ProfileSettingsForm,
  PublicDefaultForm,
} from '@/components/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader } from '@/components/common';
import { ResendVerificationForm } from './client';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  const prefs = session
    ? await Promise.all([
        db
          .select({
            defaultVisibility: userSettings.defaultVisibility,
            defaultExportResolution: userSettings.defaultExportResolution,
          })
          .from(userSettings)
          .where(eq(userSettings.userId, session.user.id))
          .then(
            (rows) =>
              rows[0] ?? {
                defaultVisibility: false,
                defaultExportResolution: 1,
              },
          ),
        getContactSubscriptionStatus(session.user.email),
      ]).then(([settings, emailUpdates]) => ({ ...settings, emailUpdates }))
    : null;
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
        {session?.user && prefs && (
          <div className='bg-card space-y-2 rounded-lg border p-4'>
            <h2 className='text-lg font-bold'>Preferences</h2>
            <EmailPreferenceForm emailUpdates={prefs.emailUpdates} />
            <PublicDefaultForm defaultVisibility={prefs.defaultVisibility} />
            <ExportResolutionForm
              defaultExportResolution={
                (prefs.defaultExportResolution as 1 | 2 | 3) ?? 1
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
