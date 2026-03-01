import { ancestries } from '@/lib/constants';
import { PageHeader } from '@/components/common';
import { FilteredAncestries } from './client';

export const metadata = {
  title: 'Ancestries',
  description:
    'Reference to ancestries available in the System Reference Document',
};

export default function Page() {
  return (
    <>
      <PageHeader
        title='Ancestries'
        subtitle='Browse SRD ancestries for use in custom ancestry card creation.'
        className='mb-6'
      >
        <span className='text-muted-foreground text-sm'>
          {ancestries.length} available
        </span>
      </PageHeader>
      <FilteredAncestries ancestries={ancestries} />
    </>
  );
}
