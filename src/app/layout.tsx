import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { Toaster } from '@/components/ui/toast';
import { fontVariables } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { GoogleAdsense } from '@/components/common';

export const metadata: Metadata = {
  title: {
    template: '%s | DaggerheartBrews',
    default: 'DaggerheartBrews',
  },
  description: 'A fan application for generating homebrew Daggerheart content',
  creator: 'kelvin-mai',
  authors: [{ name: 'kelvin-mai', url: 'https://kelvinmai.io' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn(fontVariables, 'antialiased')}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </ThemeProvider>
        <GoogleAdsense />
      </body>
    </html>
  );
}
