import { ancestries } from '@/lib/constants';
import { FilteredAncestries } from './client';

export const metadata = {
  title: 'Ancestries',
  description:
    'Reference to ancestries available in the System Reference Document',
};

export default function Page() {
  return (
    <>
      <div className='mb-6'>
        <div className='flex items-baseline gap-2'>
          <h1 className='font-eveleth-clean dark:text-primary-foreground text-2xl font-bold'>
            Ancestries
          </h1>
          <span className='text-muted-foreground text-sm'>
            {ancestries.length} available
          </span>
        </div>
        <p className='text-muted-foreground mt-0.5 text-sm'>
          Browse SRD ancestries available for ancestry card creation.
        </p>
      </div>
      <FilteredAncestries ancestries={ancestries} />
    </>
  );
}
