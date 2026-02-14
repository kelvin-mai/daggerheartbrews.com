"use client";
import {
  BuyMeCofffeeBanner,
  DCGLCompatibilityBanner,
  ThemeToggle,
  WeMovedBanner,
} from '@/components/common';
import { AppSidebar, Footer } from '@/components/layout';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <div className='flex w-full items-center justify-between px-4'>
            <SidebarTrigger />
            <ThemeToggle />
          </div>
        </header>
        <main className='container'>
          <WeMovedBanner />
          {children}
        </main>
        <section className='container mt-6 mb-4 space-y-2'>
          <DCGLCompatibilityBanner className='text-muted-foreground grid-cols-1 text-sm lg:grid-cols-2 dark:text-black' />
          <BuyMeCofffeeBanner />
        </section>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
