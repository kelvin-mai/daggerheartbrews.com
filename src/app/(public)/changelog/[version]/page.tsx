import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { getChangelogEntry, getChangelogVersions } from '@/lib/mdx';
import { Prose, getMdxComponents } from '@/components/mdx';

type Params = Promise<{ version: string }>;

export const generateStaticParams = () => {
  return getChangelogVersions().map(({ version }) => ({
    version: `v${version}`,
  }));
};

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { version } = await params;
  const entry = await getChangelogEntry(version, {});
  if (!entry) return { title: 'Not Found' };

  return {
    title: `v${entry.frontmatter.version} — ${entry.frontmatter.title}`,
    description: `Changelog for Daggerheart Brews v${entry.frontmatter.version}`,
  };
};

export default async function ChangelogVersionPage({
  params,
}: {
  params: Params;
}) {
  const { version } = await params;
  const entry = await getChangelogEntry(version, getMdxComponents());

  if (!entry) notFound();

  const { frontmatter, content } = entry;

  return (
    <div className='mx-auto max-w-3xl space-y-8'>
      <div className='space-y-3'>
        <div className='flex items-baseline gap-3'>
          <h1 className='font-eveleth-clean text-4xl'>
            v{frontmatter.version}
          </h1>
          <span className='text-muted-foreground text-sm'>
            {frontmatter.date}
          </span>
        </div>
        <p className='text-muted-foreground text-lg'>{frontmatter.title}</p>
      </div>

      <Prose>{content}</Prose>

      <div className='flex gap-4 pt-2'>
        <Link href='/changelog' className='underline underline-offset-4'>
          All versions
        </Link>
      </div>
    </div>
  );
}
