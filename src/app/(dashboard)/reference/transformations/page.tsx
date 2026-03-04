import { transformations } from '@/lib/constants/reference';
import { PageHeader } from '@/components/common';
import { FilteredTransformations } from './client';

export const metadata = {
  title: 'Transformations',
  description:
    'Reference to transformations available for custom card creation',
};

export default function Page() {
  return (
    <>
      <PageHeader
        title='Transformations'
        subtitle='Browse transformations for custom card creation.'
        className='mb-4'
      >
        <span className='text-muted-foreground text-sm'>
          {transformations.length} available
        </span>
      </PageHeader>
      <FilteredTransformations transformations={transformations} />
    </>
  );
}
