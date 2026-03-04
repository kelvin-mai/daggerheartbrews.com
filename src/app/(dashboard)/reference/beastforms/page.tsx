import { beastforms } from '@/lib/constants/reference';
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
        subtitle='Browse SRD beastforms across tiers 1–4 for custom card creation'
        className='mb-4'
      >
        <span className='text-muted-foreground text-sm'>
          {beastforms.length} available
        </span>
      </PageHeader>
      <FilteredBeastforms beastforms={beastforms} />
    </>
  );
}
