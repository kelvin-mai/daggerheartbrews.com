'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

import { cn } from '@/lib/utils';

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

type AdUnitProps = {
  slot: string;
  format?: string;
  className?: string;
};

export const AdUnit: React.FC<AdUnitProps> = ({
  slot,
  format = 'auto',
  className,
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className={cn('adsbygoogle block', className)}
      data-ad-client='ca-pub-7510278420022630'
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive='true'
    />
  );
};

export const GoogleAdsense = () => {
  return (
    <Script
      async
      src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7510278420022630'
      crossOrigin='anonymous'
      strategy='afterInteractive'
    />
  );
};
