'use client';

import {
  useAudienceSyncActions,
  useAudienceSyncEffects,
  useAudienceSyncStore,
} from '@/store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const PAGE_SIZE = 20;

export const AudienceSyncSection = () => {
  const { syncing, cancelled, rows, progress, total, error, retrying, page } =
    useAudienceSyncStore();
  const { setPage, cancel } = useAudienceSyncActions();
  const { startSync, retryContact, exportCsv } = useAudienceSyncEffects();

  const pageCount = rows ? Math.ceil(rows.length / PAGE_SIZE) : 0;
  const visibleRows = rows
    ? rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    : [];
  const errorCount = rows ? rows.filter((r) => r.status === 'error').length : 0;
  const successCount = rows
    ? rows.filter((r) => r.status === 'success').length
    : 0;

  return (
    <section className='bg-card rounded-lg border p-6'>
      <h2 className='mb-1 font-medium'>Audience sync</h2>
      <p className='text-muted-foreground mb-4 text-sm'>
        Backfill your Resend audience with all users from the database. Each
        contact is synced individually with a 500ms delay to avoid rate limits.
      </p>

      <div className='mb-4 flex items-center gap-4'>
        <Button onClick={startSync} disabled={syncing} variant='outline'>
          {syncing ? 'Syncing…' : 'Sync audience'}
        </Button>
        {syncing && (
          <Button variant='ghost' size='sm' onClick={cancel}>
            Cancel
          </Button>
        )}
        {rows && !syncing && (
          <>
            <p className='text-sm'>
              {cancelled && (
                <span className='text-muted-foreground'>Cancelled — </span>
              )}
              <span className='text-green-600 dark:text-green-400'>
                {successCount} synced
              </span>
              {errorCount > 0 && (
                <span className='text-red-600 dark:text-red-400'>
                  {', '}
                  {errorCount} failed
                </span>
              )}
            </p>
            <Button variant='outline' size='sm' onClick={exportCsv}>
              Export CSV
            </Button>
          </>
        )}
        {error && (
          <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
        )}
      </div>

      {(syncing || rows) && total > 0 && (
        <div className='mb-4 space-y-1'>
          <Progress value={(progress / total) * 100} className='h-2' />
          <p className='text-muted-foreground text-xs'>
            {progress} / {total}
          </p>
        </div>
      )}

      {rows && rows.length > 0 && (
        <>
          <div className='overflow-hidden rounded-md border'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-muted/50 border-b'>
                  <th className='px-3 py-2 text-left font-medium'>Email</th>
                  <th className='px-3 py-2 text-left font-medium'>Name</th>
                  <th className='px-3 py-2 text-left font-medium'>Status</th>
                  <th className='px-3 py-2 text-left font-medium'>Error</th>
                  <th className='px-3 py-2' />
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.email} className='border-b last:border-0'>
                    <td className='px-3 py-2 font-mono text-xs'>{row.email}</td>
                    <td className='text-muted-foreground px-3 py-2'>
                      {row.name}
                    </td>
                    <td className='px-3 py-2'>
                      {row.status === 'pending' && (
                        <span className='text-muted-foreground'>pending</span>
                      )}
                      {row.status === 'success' && (
                        <span className='text-green-600 dark:text-green-400'>
                          synced
                        </span>
                      )}
                      {row.status === 'error' && (
                        <span className='text-red-600 dark:text-red-400'>
                          failed
                        </span>
                      )}
                    </td>
                    <td className='text-muted-foreground px-3 py-2 text-xs'>
                      {row.error ?? '—'}
                    </td>
                    <td className='px-3 py-2 text-right'>
                      {row.status === 'error' && (
                        <Button
                          size='sm'
                          variant='ghost'
                          disabled={retrying.has(row.email)}
                          onClick={() => retryContact(row.email, row.name)}
                        >
                          {retrying.has(row.email) ? 'Retrying…' : 'Retry'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <div className='mt-3 flex items-center justify-between text-sm'>
              <Button
                variant='ghost'
                size='sm'
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className='text-muted-foreground'>
                Page {page + 1} of {pageCount}
              </span>
              <Button
                variant='ghost'
                size='sm'
                disabled={page >= pageCount - 1}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
