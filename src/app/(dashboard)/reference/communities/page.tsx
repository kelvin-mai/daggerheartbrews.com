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
      <div className='my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {communities.map((community) => (
          <CardDisplayPreview
            key={community.name}
            card={community}
            settings={initialSettings}
          />
        ))}
      </div>
    </>
  );
}
