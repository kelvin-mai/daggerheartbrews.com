import { beastforms } from '@/lib/constants';
import { FilteredBeastforms } from './client';

export const metadata = {
  title: 'Beastforms',
  description:
    'Reference to beastforms available in the System Reference Document',
};

export default function Page() {
  return (
    <>
      <div className='mb-6'>
        <div className='flex items-baseline gap-2'>
          <h1 className='font-eveleth-clean dark:text-primary-foreground text-2xl font-bold'>
            Beastforms
          </h1>
          <span className='text-muted-foreground text-sm'>
            {beastforms.length} available
          </span>
        </div>
        <p className='text-muted-foreground mt-0.5 text-sm'>
          Browse SRD beastforms available for card creation. Tiers 1–4.
        </p>
      </div>
      <FilteredBeastforms beastforms={beastforms} />
    </>
  );
}
