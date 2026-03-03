import {
  classes,
  subclasses,
  domainColor,
} from '@/lib/constants/reference/srd';
import { PageHeader } from '@/components/common';
import { CardClassPreview } from './client';

export const metadata = {
  title: 'Classes',
  description:
    'Reference to classes available in the System Reference Document',
};

export default function Page() {
  return (
    <>
      <PageHeader
        title='Classes'
        subtitle='Browse SRD classes and their subclasses from the System Reference Document.'
      >
        <span className='text-muted-foreground text-sm'>
          {classes.length} available
        </span>
      </PageHeader>
      <div className='my-4 flex flex-wrap justify-center gap-4'>
        {classes.map((cl) => {
          const firstSubclass = subclasses.find(
            (sc) => sc.className === cl.name,
          );
          return (
            <div key={cl.name} className='w-full max-w-[340px]'>
              <CardClassPreview
                card={{
                  name: cl.name,
                  type: 'class',
                  subtitle: 'Flavor',
                  evasion: cl.startEvasion,
                  image: `/assets/images/srd/class/${firstSubclass?.image ?? ''}`,
                  artist: firstSubclass?.artist ?? '',
                  domainPrimary: cl.domains[0],
                  domainPrimaryColor: domainColor(cl.domains[0]),
                  domainSecondary: cl.domains[1],
                  domainSecondaryColor: domainColor(cl.domains[1]),
                  text: `<p><em>${cl.flavor}</em></p>`,
                  credits: 'Daggerheart © Darrington Press 2025',
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
