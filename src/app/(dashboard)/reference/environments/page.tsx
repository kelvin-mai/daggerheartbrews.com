import { environments } from '@/lib/constants/reference';
import { PageHeader } from '@/components/common';
import { FilteredEnvironments } from './client';

export const metadata = {
  title: 'Environments',
  description:
    'Reference to environments available in the System Reference Document',
};

export default function Page() {
  return (
    <>
      <PageHeader
        title='Environments'
        subtitle='Browse SRD environments to inspire your next session'
        className='mb-4'
      >
        <span className='text-muted-foreground text-sm'>
          {environments.length} available
        </span>
      </PageHeader>
      <FilteredEnvironments environments={environments} />
    </>
  );
}
