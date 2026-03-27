import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import { userSettings } from '@/lib/database/schema';
import type { ExportResolution } from '@/lib/types';
import { AdversaryCreationForms } from '@/components/adversary-creation/forms';
import { AdversaryCreationPreview } from '@/components/adversary-creation/preview';
import { PageHeader } from '@/components/common';
import { AdversaryCreateInitializer } from './initializer';

export const metadata = {
  title: 'Create Adversary',
  description: 'Create your very own Daggerheart Adversary or Environment!',
};

type Props = { searchParams: Promise<{ template?: string }> };

export default async function Page({ searchParams }: Props) {
  const { template } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  const defaultResolution: ExportResolution = session
    ? await db
        .select({
          defaultExportResolution: userSettings.defaultExportResolution,
        })
        .from(userSettings)
        .where(eq(userSettings.userId, session.user.id))
        .then(
          (rows) => (rows[0]?.defaultExportResolution as ExportResolution) ?? 1,
        )
    : 1;
  return (
    <>
      <AdversaryCreateInitializer
        isTemplate={template === 'true'}
        defaultResolution={defaultResolution}
      />
      <PageHeader
        title='Create an Adversary'
        subtitle='Build custom adversaries and environments for your campaign.'
      />
      <div className='grid grid-cols-1 gap-2 py-4 md:grid-cols-2'>
        <AdversaryCreationForms />
        <AdversaryCreationPreview />
      </div>
    </>
  );
}
