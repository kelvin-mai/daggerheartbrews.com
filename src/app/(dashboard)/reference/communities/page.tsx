import { communities } from '@/lib/constants/srd/communities';
import { PageHeader } from '@/components/common';
import { FilteredCommunities } from './client';

export const metadata = {
  title: 'Communities',
  description:
    'Reference to communities available in the System Reference Document',
};

export default function Page() {
  return (
    <>
      <PageHeader
        title='Communities'
        subtitle='Browse SRD communities for use in custom community card creation.'
        className='mb-4'
      >
        <span className='text-muted-foreground text-sm'>
          {communities.length} available
        </span>
      </PageHeader>
      <FilteredCommunities communities={communities} />
    </>
  );
}
