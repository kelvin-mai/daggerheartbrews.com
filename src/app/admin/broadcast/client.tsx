'use client';

import {
  AudiencesSection,
  AudienceSyncSection,
  SendBroadcastSection,
} from '@/components/admin';
import type { AudienceItem } from '@/actions/broadcast';

type Props = {
  configuredAudienceId: string | null;
  initialAudiences: AudienceItem[] | null;
};

export const BroadcastPageClient = ({
  configuredAudienceId,
  initialAudiences,
}: Props) => (
  <div className='space-y-8 py-6'>
    <h1 className='text-xl font-semibold'>Broadcast</h1>
    <AudiencesSection
      configuredAudienceId={configuredAudienceId}
      initialAudiences={initialAudiences}
    />
    <AudienceSyncSection />
    <SendBroadcastSection />
  </div>
);
