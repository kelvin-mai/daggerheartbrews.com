import { AdversaryCreationForms } from '@/components/adversary-creation/forms';
import { AdversaryCreationPreview } from '@/components/adversary-creation/preview';
import { AdversaryCreateInitializer } from './initializer';

export const metadata = {
  title: 'Create Adversary',
  description: 'Create your very own Daggerheart Adversary or Environment!',
};

export default function Page() {
  return (
    <>
      <AdversaryCreateInitializer />
      <h1 className='font-eveleth-clean dark:text-primary-foreground text-2xl font-bold'>
        Create an Adversary
      </h1>
      <p className='text-muted-foreground'>
        Create your very own Daggerheart Adversary or Environment!
      </p>
      <div className='flex flex-col-reverse gap-2 py-4 md:flex-row'>
        <AdversaryCreationForms />
        <AdversaryCreationPreview />
      </div>
    </>
  );
}
