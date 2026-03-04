import { armor, weapons, consumables, items } from '@/lib/constants/reference';
import { PageHeader } from '@/components/common';
import { FilteredEquipment } from './client';

export const metadata = {
  title: 'Equipment',
  description:
    'Reference to equipment available in the System Reference Document',
};

const equipment = [...armor, ...weapons, ...consumables, ...items];

export default function Page() {
  return (
    <>
      <PageHeader
        title='Equipment'
        subtitle='Browse SRD equipment for use in custom card creation.'
        className='mb-4'
      >
        <span className='text-muted-foreground text-sm'>
          {equipment.length} available
        </span>
      </PageHeader>
      <FilteredEquipment equipment={equipment} />
    </>
  );
}
