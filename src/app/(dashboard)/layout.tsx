import { headers } from 'next/headers';

import {
  AdUnit,
  BuyMeCofffeeBanner,
  DCGLCompatibilityBanner,
  OutdatedVersionBanner,
  ThemeToggle,
  WeMovedBanner,
} from '@/components/common';
import { auth } from '@/lib/auth';
import { AppSidebar, Footer } from '@/components/layout';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <SidebarProvider>
      <AppSidebar user={session?.user ?? null} />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <div className='flex w-full items-center justify-between px-4'>
            <SidebarTrigger />
            <ThemeToggle />
          </div>
        </header>
        <main className='container'>
          <WeMovedBanner />
          <OutdatedVersionBanner />
          {children}
        </main>
        <section className='container my-4 space-y-2'>
          <DCGLCompatibilityBanner className='text-muted-foreground grid-cols-1 text-sm lg:grid-cols-2 dark:text-black' />
          <BuyMeCofffeeBanner />
          <AdUnit slot='DASHBOARD_BOTTOM' format='auto' />
        </section>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
