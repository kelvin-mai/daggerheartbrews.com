import { classes, domainColor } from '@/lib/constants/srd';
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
      <div className='my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {classes.map((cl) => (
          <CardClassPreview
            key={cl.name}
            card={{
              name: cl.name,
              type: 'class',
              subtitle: 'Flavor',
              evasion: cl.startEvasion,
              image: `/assets/images/srd/class/${cl.subclasses[0].image}`,
              artist: cl.subclasses[0].artist,
              domainPrimary: cl.domains[0],
              domainPrimaryColor: domainColor(cl.domains[0]),
              domainSecondary: cl.domains[1],
              domainSecondaryColor: domainColor(cl.domains[1]),
              text: `<p><em>${cl.flavor}</em></p>`,
              credits: 'Daggerheart © Darrington Press 2025',
            }}
          />
        ))}
      </div>
    </>
  );
}
