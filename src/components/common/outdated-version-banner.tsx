'use client';

import * as React from 'react';

export const OutdatedVersionBanner = () => {
  const [outdated, setOutdated] = React.useState(false);

  React.useEffect(() => {
    const clientVersion = process.env.NEXT_PUBLIC_APP_VERSION;
    if (!clientVersion) return;

    fetch('/api/version')
      .then((res) => res.json())
      .then((data: { version: string | null }) => {
        if (data.version && data.version !== clientVersion) {
          setOutdated(true);
        }
      })
      .catch(() => {
        // silently ignore network errors
      });
  }, []);

  if (!outdated) return null;

  return (
    <div className='border-destructive bg-destructive/20 my-4 rounded-lg border p-4'>
      <p className='text-destructive'>
        A new version is available. Please{' '}
        <button
          className='underline underline-offset-4'
          onClick={() => window.location.reload()}
        >
          refresh the page
        </button>{' '}
        to get the latest updates.
      </p>
    </div>
  );
};
