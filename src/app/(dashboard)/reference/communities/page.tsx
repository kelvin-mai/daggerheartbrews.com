import { communities } from '@/lib/constants/srd/communities';
import { FilteredCommunities } from './client';

export const metadata = {
  title: 'Communities',
  description:
    'Reference to communities available in the System Reference Document',
};

export default function Page() {
  return (
    <>
      <div className='mb-6'>
        <div className='flex items-baseline gap-2'>
          <h1 className='font-eveleth-clean dark:text-primary-foreground text-2xl font-bold'>
            Communities
          </h1>
          <span className='text-muted-foreground text-sm'>
            {communities.length} available
          </span>
        </div>
        <p className='text-muted-foreground mt-0.5 text-sm'>
          Browse SRD communities available for community card creation.
        </p>
      </div>
      <FilteredCommunities communities={communities} />
    </>
  );
}
