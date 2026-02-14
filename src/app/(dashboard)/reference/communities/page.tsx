import { CardDisplayPreview } from '@/components/card-creation/preview';
import { initialSettings } from '@/lib/constants';
import { communities } from '@/lib/constants/srd/communities';

export const metadata = {
  title: 'Communities',
  description:
    'Reference to communities available in the System Reference Document',
};

export default function Page() {
  return (
    <>
      <h1 className='font-eveleth-clean dark:text-primary-foreground text-2xl font-bold'>
        Communities
      </h1>
      <p className='text-muted-foreground'>
        Reference to communities available in the System Reference Document
      </p>
      <div className='my-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'>
        {communities.map((community) => (
          <div key={community.name} className='flex justify-center'>
            <div className='[&>div>div:first-child]:origin-top [&>div>div:first-child]:scale-[0.45] [&>div>div:first-child]:-mb-[578px] [&>div>button]:w-[340px] [&>div>button]:mx-auto [&>div>button]:mt-3'>
              <CardDisplayPreview
                card={community}
                settings={initialSettings}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
