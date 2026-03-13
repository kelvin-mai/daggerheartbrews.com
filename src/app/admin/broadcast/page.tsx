import { listAudiences } from '@/actions/broadcast';
import { env } from '@/lib/env';
import { BroadcastPageClient } from './client';

export default async function BroadcastPage() {
  const { data: audiences } = await listAudiences();

  return (
    <BroadcastPageClient
      configuredAudienceId={env.RESEND_AUDIENCE_ID ?? null}
      initialAudiences={audiences}
    />
  );
}
