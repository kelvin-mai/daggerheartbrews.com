import { beastforms } from '@/lib/constants';
import { PageHeader } from '@/components/common';
import { FilteredBeastforms } from './client';

export const metadata = {
  title: 'Beastforms',
  description:
    'Reference to beastforms available in the System Reference Document',
};

export default function Page() {
  return (
    <>
      <PageHeader
        title='Beastforms'
        subtitle='Browse SRD beastforms available for card creation. Tiers 1–4.'
        className='mb-6'
      >
        <span className='text-muted-foreground text-sm'>
          {beastforms.length} available
        </span>
      </PageHeader>
      <FilteredBeastforms beastforms={beastforms} />
    </>
  );
}
