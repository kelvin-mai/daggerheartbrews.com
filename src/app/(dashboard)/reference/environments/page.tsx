import { environments } from '@/lib/constants/srd';
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
        subtitle='Browse SRD environments to inspire your next session.'
        className='mb-4'
      />
      <FilteredEnvironments environments={environments} />
    </>
  );
}
