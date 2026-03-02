import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getSrdPage, getSrdSlugs } from '@/lib/mdx';
import { PageHeader } from '@/components/common';
import { Prose, getMdxComponents } from '@/components/mdx';

type Params = Promise<{ slug: string }>;

export const generateStaticParams = () => {
  return getSrdSlugs().map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { slug } = await params;
  const page = await getSrdPage(slug, {});
  if (!page) return { title: 'Not Found' };

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
  };
};

export default async function SrdPage({ params }: { params: Params }) {
  const { slug } = await params;
  const page = await getSrdPage(slug, getMdxComponents());

  if (!page) notFound();

  const { frontmatter, content } = page;

  return (
    <>
      <PageHeader
        title={frontmatter.title}
        subtitle={frontmatter.description}
        className='mb-6'
      />
      <Prose>{content}</Prose>
    </>
  );
}
