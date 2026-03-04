import { adversaries } from '@/lib/constants/reference';
import { PageHeader } from '@/components/common';
import { FilteredAdversaries } from './client';

export const metadata = {
  title: 'Adversaries',
  description:
    'Reference to adversaries available in the System Reference Document',
};

export default function Page() {
  return (
    <>
      <PageHeader
        title='Adversaries'
        subtitle='Browse SRD adversaries to populate your next encounter.'
        className='mb-4'
      >
        <span className='text-muted-foreground text-sm'>
          {adversaries.length} available
        </span>
      </PageHeader>
      <FilteredAdversaries adversaries={adversaries} />
    </>
  );
}
