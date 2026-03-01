import { AdversaryCreationForms } from '@/components/adversary-creation/forms';
import { AdversaryCreationPreview } from '@/components/adversary-creation/preview';
import { PageHeader } from '@/components/common';
import { AdversaryCreateInitializer } from './initializer';

export const metadata = {
  title: 'Create Adversary',
  description: 'Create your very own Daggerheart Adversary or Environment!',
};

type Props = { searchParams: Promise<{ template?: string }> };

export default async function Page({ searchParams }: Props) {
  const { template } = await searchParams;
  return (
    <>
      <AdversaryCreateInitializer isTemplate={template === 'true'} />
      <PageHeader
        title='Create an Adversary'
        subtitle='Build custom adversaries and environments for your campaign.'
      />
      <div className='grid grid-cols-1 gap-2 py-4 md:grid-cols-2'>
        <AdversaryCreationForms />
        <AdversaryCreationPreview />
      </div>
    </>
  );
}
