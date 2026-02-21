import { CardDisplayPreview } from '@/components/card-creation/preview';
import { ancestries, initialSettings } from '@/lib/constants';

export const metadata = {
  title: 'Ancestries',
  description:
    'Reference to ancestries available in the System Reference Document',
};

export default function Page() {
  return (
    <>
      <h1 className='font-eveleth-clean dark:text-primary-foreground text-2xl font-bold'>
        Ancestries
      </h1>
      <p className='text-muted-foreground'>
        Reference to ancestries available in the System Reference Document
      </p>
      <div className='my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {ancestries.map((ancestry) => (
          <CardDisplayPreview
            key={ancestry.name}
            card={ancestry}
            settings={initialSettings}
          />
        ))}
      </div>
    </>
  );
}
