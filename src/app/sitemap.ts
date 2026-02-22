import { MetadataRoute } from 'next';

import { nav } from '@/lib/constants';
import { getBaseUrl } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, getBaseUrl()).toString();
  return [
    {
      url: url('/'),
      lastModified: new Date(),
    },
    ...nav
      .flatMap((category) => category.children)
      .filter((i) => i !== undefined && i.type !== 'divider')
      .map((item) => ({
        url: url(item.url),
        lastModified: new Date(),
      })),
  ];
}
