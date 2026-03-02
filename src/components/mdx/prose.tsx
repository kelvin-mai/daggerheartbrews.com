import type { MDXComponents } from 'mdx/types';

import { cn } from '@/lib/utils';

type ProseProps = {
  children: React.ReactNode;
  className?: string;
};

export const Prose = ({ children, className }: ProseProps) => (
  <div className={cn('space-y-6', className)}>{children}</div>
);

export const defaultComponents: MDXComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className='font-eveleth-clean text-4xl'>{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className='text-2xl font-bold'>{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className='text-lg font-semibold'>{children}</h3>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    const isExternal = href?.startsWith('http');
    return (
      <a
        href={href}
        className='underline underline-offset-4'
        {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </a>
    );
  },
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className='list-disc space-y-2 pl-6'>{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className='list-decimal space-y-2 pl-6'>{children}</ol>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className='bg-muted rounded px-1 py-0.5 text-sm'>{children}</code>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className='bg-muted overflow-x-auto rounded-lg p-4 text-sm'>
      {children}
    </pre>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className='text-muted-foreground border-l-4 pl-4 italic'>
      {children}
    </blockquote>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <table className='border-border w-full border-collapse border'>
      {children}
    </table>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className='border-border border px-4 py-2 text-left font-semibold'>
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className='border-border border px-4 py-2'>{children}</td>
  ),
};

export const getMdxComponents = (overrides?: MDXComponents): MDXComponents => ({
  ...defaultComponents,
  ...overrides,
});
