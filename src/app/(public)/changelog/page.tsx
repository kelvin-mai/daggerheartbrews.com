import type { Metadata } from 'next';
import Link from 'next/link';

import { getChangelogVersions } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Release notes and changes for Daggerheart Brews.',
};

export default function ChangelogPage() {
  const versions = getChangelogVersions();

  return (
    <div className='mx-auto max-w-3xl space-y-12'>
      <div className='space-y-3'>
        <h1 className='font-eveleth-clean text-4xl'>Changelog</h1>
        <p className='text-muted-foreground text-lg'>
          A record of updates, improvements, and fixes to Daggerheart Brews.
        </p>
      </div>

      <ul className='space-y-4'>
        {versions.map(({ version, date, title }) => (
          <li key={version}>
            <Link
              href={`/changelog/v${version}`}
              className='group flex items-baseline gap-3'
            >
              <span className='text-2xl font-bold group-hover:underline group-hover:underline-offset-4'>
                v{version}
              </span>
              <span className='text-muted-foreground text-sm'>{date}</span>
              <span className='text-muted-foreground text-sm'>— {title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className='flex gap-4 pt-2'>
        <Link href='/about' className='underline underline-offset-4'>
          About
        </Link>
        <Link href='/contact' className='underline underline-offset-4'>
          Contact
        </Link>
      </div>
    </div>
  );
}
