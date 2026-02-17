import Link from 'next/link';

import Image from 'next/image';
import {
  AdUnit,
  BuyMeCofffeeBanner,
  DCGLCompatibilityBanner,
} from '@/components/common';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout';
import { LogIn } from 'lucide-react';

export default async function Home() {
  return (
    <>
      <main className='relative'>
        <div className='container flex flex-col gap-12 px-4 py-12 md:py-24 lg:gap-24 lg:py-32'>
          <div className='flex items-center justify-center gap-4'>
            <Image
              className='size-8 sm:size-12 md:size-16 lg:size-20 xl:size-24'
              src='/assets/images/dh-cgl-logo.png'
              alt='Daggerheart CGL Logo'
              height={200}
              width={200}
            />
            <h1 className='font-eveleth-clean sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'>
              Daggerheart Brews
            </h1>
          </div>
          <p className='text-muted-foreground text-center text-base font-medium sm:text-lg md:text-xl'>
            This is a fan application created by{' '}
            <a
              href='https://kelvinmai.io'
              target='_blank'
              className='underline underline-offset-4'
            >
              Kelvin Mai
            </a>{' '}
            for generating homebrew Daggerheart content.
          </p>
          <div className='flex justify-center gap-4'>
            <Button size='lg' asChild>
              <Link href='/card/create'>Start Building</Link>
            </Button>
            <Button size='lg' variant='ghost' asChild>
              <Link href='/login'>
                Login
                <LogIn />
              </Link>
            </Button>
          </div>
          <div className='overflow-hidden rounded-lg border'>
            <Image
              src='/assets/images/mockup.png'
              alt='Mockup'
              width={1800}
              height={900}
            />
          </div>

          <DCGLCompatibilityBanner className='text-black' />
          <BuyMeCofffeeBanner />
          <AdUnit slot='HOME_BOTTOM' format='auto' />
        </div>
      </main>

      <Footer />
    </>
  );
}
