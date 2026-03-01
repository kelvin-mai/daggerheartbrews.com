import Link from 'next/link';
import Image from 'next/image';

import { Footer } from '@/components/layout';
import { ThemeToggle } from '@/components/common';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-svh flex-col'>
      <header className='container flex items-center gap-2 py-4'>
        <Link
          href='/'
          className='font-eveleth-clean flex items-center gap-2 text-lg'
        >
          <Image
            className='size-8'
            src='/assets/images/dh-cgl-logo.png'
            alt='Daggerheart CGL Logo'
            height={32}
            width={32}
          />
          Daggerheart Brews
        </Link>
        <div className='ml-auto'>
          <ThemeToggle />
        </div>
      </header>
      <main className='container flex-1 py-8'>{children}</main>
      <Footer />
    </div>
  );
}
