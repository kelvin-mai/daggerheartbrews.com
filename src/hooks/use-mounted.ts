'use client';

import * as React from 'react';

export const useMounted = () => {
  const [mounted, setMounted] = React.useState<boolean>(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
};
