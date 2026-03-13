'use client';

import * as React from 'react';

import {
  createAudience,
  listAudiences,
  type AudienceItem,
} from '@/actions/broadcast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  configuredAudienceId: string | null;
  initialAudiences: AudienceItem[] | null;
};

export const AudiencesSection = ({
  configuredAudienceId,
  initialAudiences,
}: Props) => {
  const [audiences, setAudiences] = React.useState<AudienceItem[] | null>(
    initialAudiences,
  );
  const [newAudienceName, setNewAudienceName] = React.useState('');
  const [creating, setCreating] = React.useState(false);
  const [createdAudience, setCreatedAudience] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [createError, setCreateError] = React.useState<string | null>(null);

  const handleCreate = async () => {
    if (!newAudienceName.trim()) return;
    setCreating(true);
    setCreatedAudience(null);
    setCreateError(null);
    const result = await createAudience(newAudienceName.trim());
    setCreating(false);
    if (result.error) {
      setCreateError(result.error);
    } else {
      setCreatedAudience(result.data);
      setNewAudienceName('');
      const refreshed = await listAudiences();
      if (refreshed.data) setAudiences(refreshed.data);
    }
  };

  return (
    <section className='bg-card rounded-lg border p-6'>
      <h2 className='mb-1 font-medium'>Audiences</h2>
      <p className='text-muted-foreground mb-4 text-sm'>
        Manage your Resend audiences. Set <code>RESEND_AUDIENCE_ID</code> in
        your environment to use an audience for broadcasts.
      </p>

      <div className='mb-4 flex items-center gap-2 text-sm'>
        <span className='text-muted-foreground'>Configured audience:</span>
        {configuredAudienceId ? (
          <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
            {configuredAudienceId}
          </code>
        ) : (
          <span className='text-amber-600 dark:text-amber-400'>not set</span>
        )}
      </div>

      {audiences && audiences.length > 0 ? (
        <div className='mb-4 overflow-hidden rounded-md border'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-muted/50 border-b'>
                <th className='px-3 py-2 text-left font-medium'>Name</th>
                <th className='px-3 py-2 text-left font-medium'>ID</th>
                <th className='px-3 py-2 text-left font-medium'>Created</th>
              </tr>
            </thead>
            <tbody>
              {audiences.map((a) => (
                <tr key={a.id} className='border-b last:border-0'>
                  <td className='px-3 py-2'>{a.name}</td>
                  <td className='px-3 py-2'>
                    <code className='bg-muted rounded px-1 py-0.5 text-xs'>
                      {a.id}
                    </code>
                  </td>
                  <td className='text-muted-foreground px-3 py-2'>
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : audiences !== null ? (
        <p className='text-muted-foreground mb-4 text-sm'>
          No audiences found.
        </p>
      ) : null}

      <div className='flex max-w-sm items-end gap-2'>
        <div className='flex-1 space-y-1.5'>
          <Label htmlFor='audience-name'>Create audience</Label>
          <Input
            id='audience-name'
            placeholder='e.g. daggerheart-brews'
            value={newAudienceName}
            onChange={(e) => setNewAudienceName(e.target.value)}
          />
        </div>
        <Button
          onClick={handleCreate}
          disabled={creating || !newAudienceName.trim()}
          variant='outline'
        >
          {creating ? 'Creating…' : 'Create'}
        </Button>
      </div>

      {createdAudience && (
        <div className='mt-3 space-y-1 text-sm'>
          <p className='text-green-600 dark:text-green-400'>
            Audience &ldquo;{createdAudience.name}&rdquo; created.
          </p>
          <p className='text-muted-foreground'>
            Set this as your <code>RESEND_AUDIENCE_ID</code>:
          </p>
          <code className='bg-muted block rounded px-2 py-1 text-xs'>
            {createdAudience.id}
          </code>
        </div>
      )}
      {createError && (
        <p className='mt-3 text-sm text-red-600 dark:text-red-400'>
          {createError}
        </p>
      )}
    </section>
  );
};
