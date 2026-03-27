import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/lib/database';
import { userSettings } from '@/lib/database/schema';
import type { ExportResolution } from '@/lib/types';
import { CardCreationForms } from '@/components/card-creation/forms';
import { CardCreationPreview } from '@/components/card-creation/preview';
import { PageHeader } from '@/components/common';
import { CardCreateInitializer } from './initializer';

export const metadata = {
  title: 'Create Card',
  description: 'Create your very own Daggerheart Card!',
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
      <CardCreateInitializer
        isTemplate={template === 'true'}
        defaultResolution={defaultResolution}
      />
      <PageHeader
        title='Create a card'
        subtitle='Design custom cards to expand your Daggerheart experience.'
      />
      <div className='flex flex-col-reverse gap-2 py-4 md:flex-row'>
        <CardCreationForms />
        <CardCreationPreview />
      </div>
    </>
  );
}
