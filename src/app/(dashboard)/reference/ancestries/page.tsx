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
      <div className='my-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'>
        {ancestries.map((ancestry) => (
          <div key={ancestry.name} className='flex justify-center'>
            <div className='[&>div>div:first-child]:origin-top [&>div>div:first-child]:scale-[0.45] [&>div>div:first-child]:-mb-[578px] [&>div>button]:w-[340px] [&>div>button]:mx-auto [&>div>button]:mt-3'>
              <CardDisplayPreview
                card={ancestry}
                settings={initialSettings}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
