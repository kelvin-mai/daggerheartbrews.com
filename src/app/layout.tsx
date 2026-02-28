import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { fontVariables } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { QueryProvider } from '@/lib/context';
import { Toaster } from '@/components/ui/sonner';
import { GoogleAdsense, VersionLogger } from '@/components/common';
import '@/styles/globals.css';

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
        <QueryProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            {children}
            <Analytics />
            <SpeedInsights />
            <Toaster />
            <VersionLogger />
          </ThemeProvider>
        </QueryProvider>
        <GoogleAdsense />
      </body>
    </html>
  );
}
