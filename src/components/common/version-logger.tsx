'use client';

import { useEffect } from 'react';

export const VersionLogger = () => {
  useEffect(() => {
    console.log(
      `[daggerheart-brews] version: ${process.env.NEXT_PUBLIC_APP_VERSION}`,
    );
  }, []);

  return null;
};
