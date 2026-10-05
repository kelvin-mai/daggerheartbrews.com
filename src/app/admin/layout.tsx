import { notFound } from 'next/navigation';

import { AppSidebar } from '@/components/layout';
import { ThemeToggle } from '@/components/common';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { isAdmin } from '@/lib/admin';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) notFound();

  return (
    <SidebarProvider>
      <AppSidebar admin />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <div className='flex w-full items-center justify-between px-4'>
            <SidebarTrigger />
            <ThemeToggle />
          </div>
        </header>
        <main className='container'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
