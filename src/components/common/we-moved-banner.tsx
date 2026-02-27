'use client';

import * as React from 'react';

export const WeMovedBanner = () => {
  const [show, setShow] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (!window.location.hostname.includes('daggerheartbrews')) {
      setShow(true);
    }
  }, []);
  if (!show) return null;

  return (
    <div className='border-destructive bg-destructive/20 my-4 rounded-lg border p-4'>
      <p className='text-destructive'>
        We have moved to a new domain! Please visit{' '}
        <a
          className='underline underline-offset-4'
          href='https://daggerheartbrews.com'
          rel='noopener noreferrer'
          target='_blank'
        >
          daggerheartbrews.com
        </a>
      </p>
    </div>
  );
};
