import type { Metadata } from 'next';
import Link from 'next/link';
import { Github, Mail } from 'lucide-react';

import { ContactForm } from './client';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Daggerheart Brews team.',
};

export default function ContactPage() {
  return (
    <div className='mx-auto max-w-3xl space-y-10'>
      <div className='space-y-3'>
        <h1 className='font-eveleth-clean text-4xl'>Get in Touch</h1>
        <p className='text-muted-foreground text-lg'>
          Found a bug, have a feature idea, or just want to say hi? Send a
          message below or reach out directly.
        </p>
      </div>

      <div className='grid gap-10 md:grid-cols-[1fr_auto]'>
        <ContactForm />

        <div className='flex flex-col gap-4 md:w-48'>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>Or reach out directly</p>
            <p className='text-muted-foreground text-sm'>
              Prefer to skip the form? Both options go straight to me.
            </p>
          </div>

          <div className='divide-y overflow-hidden rounded-lg border'>
            <a
              href='mailto:me@kelvinmai.io'
              className='hover:bg-accent flex items-center gap-3 p-4 transition-colors'
            >
              <Mail className='text-muted-foreground size-4 shrink-0' />
              <div>
                <p className='text-sm font-medium'>Email</p>
                <p className='text-muted-foreground text-xs'>me@kelvinmai.io</p>
              </div>
            </a>
            <a
              href='https://github.com/kelvin-mai/daggerheartbrews.com/issues'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:bg-accent flex items-center gap-3 p-4 transition-colors'
            >
              <Github className='text-muted-foreground size-4 shrink-0' />
              <div>
                <p className='text-sm font-medium'>GitHub Issues</p>
                <p className='text-muted-foreground text-xs'>
                  Bug reports &amp; features
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className='flex gap-4 pt-2'>
        <Link href='/about' className='underline underline-offset-4'>
          About
        </Link>
        <Link href='/privacy-policy' className='underline underline-offset-4'>
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
