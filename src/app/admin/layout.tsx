import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { AppSidebar } from '@/components/layout';
import { ThemeToggle } from '@/components/common';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (
    process.env.NODE_ENV !== 'development' &&
    (!session || session.user.email !== process.env.ADMIN_USER_EMAIL)
  ) {
    notFound();
  }

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
