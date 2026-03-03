import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import type { MDXComponents } from 'mdx/types';

const contentDir = path.join(process.cwd(), 'content');

export type ChangelogFrontmatter = {
  version: string;
  date: string;
  title: string;
};

export type PageFrontmatter = {
  title: string;
  description?: string;
};

export type SrdFrontmatter = {
  slug: string;
  title: string;
  description?: string;
  order?: number;
};

const readMdxFile = (filePath: string): string => {
  return fs.readFileSync(filePath, 'utf-8');
};

export const getChangelogVersions = (): ChangelogFrontmatter[] => {
  const dir = path.join(contentDir, 'changelog');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));

  return files
    .map((file) => {
      const source = readMdxFile(path.join(dir, file));
      const { data } = matter(source);
      return data as ChangelogFrontmatter;
    })
    .sort((a, b) => {
      const [aMaj, aMin, aPatch] = a.version.split('.').map(Number);
      const [bMaj, bMin, bPatch] = b.version.split('.').map(Number);
      if (bMaj !== aMaj) return bMaj - aMaj;
      if (bMin !== aMin) return bMin - aMin;
      return bPatch - aPatch;
    });
};

export const getChangelogEntry = async (
  version: string,
  components: MDXComponents,
): Promise<{
  frontmatter: ChangelogFrontmatter;
  content: React.ReactElement;
} | null> => {
  const filePath = path.join(contentDir, 'changelog', `${version}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const source = readMdxFile(filePath);
  const { content, frontmatter } = await compileMDX<ChangelogFrontmatter>({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });

  return { frontmatter, content };
};

export const getPageContent = async (
  slug: string,
  components: MDXComponents,
): Promise<{
  frontmatter: PageFrontmatter;
  content: React.ReactElement;
} | null> => {
  const filePath = path.join(contentDir, 'pages', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const source = readMdxFile(filePath);
  const { content, frontmatter } = await compileMDX<PageFrontmatter>({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });

  return { frontmatter, content };
};

export const getSrdSlugs = (): string[] => {
  const dir = path.join(contentDir, 'srd');
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
};

export const getClassAdditional = async (
  name: string,
  components: MDXComponents,
): Promise<React.ReactElement | null> => {
  const filePath = path.join(contentDir, 'srd', 'classes', `${name}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const { content } = await compileMDX({
    source: readMdxFile(filePath),
    components,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });
  return content;
};

export const getSubclassAdditional = async (
  slug: string,
  components: MDXComponents,
): Promise<React.ReactElement | null> => {
  const filePath = path.join(contentDir, 'srd', 'subclasses', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const { content } = await compileMDX({
    source: readMdxFile(filePath),
    components,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });
  return content;
};

export const getSrdPage = async (
  slug: string,
  components: MDXComponents,
): Promise<{
  frontmatter: SrdFrontmatter;
  content: React.ReactElement;
} | null> => {
  const filePath = path.join(contentDir, 'srd', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const source = readMdxFile(filePath);
  const { content, frontmatter } = await compileMDX<SrdFrontmatter>({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });

  return { frontmatter, content };
};
