import { CardDisplayPreview } from '@/components/card-creation/preview';
import { Prose, getMdxComponents } from '@/components/mdx';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { CollapsibleSectionTrigger, PageHeader } from '@/components/common';
import { Label } from '@/components/ui/label';
import { initialSettings } from '@/lib/constants';
import {
  classes,
  subclasses,
  domainColor,
} from '@/lib/constants/reference/srd';
import { getClassAdditional, getSubclassAdditional } from '@/lib/mdx';
import { capitalize } from '@/lib/utils';

type PageProps = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const name = (await params).name;
  const current = classes.find((c) => c.name === name);
  if (!current) {
    return null;
  }
  return {
    title: capitalize(current.name),
    description: `Reference to ${capitalize(current.name)} and it's assosciated subclasses available in the System Reference Document`,
  };
}

export default async function Page({ params }: PageProps) {
  const name = (await params).name;
  const current = classes.find((c) => c.name === name);
  if (!current) {
    return null;
  }

  const classSubclasses = subclasses.filter(
    (sc) => sc.className === current.name,
  );
  const components = getMdxComponents();
  const classAdditional = await getClassAdditional(current.name, components);
  const subclassAdditionals = await Promise.all(
    classSubclasses.map((sc) =>
      getSubclassAdditional(
        sc.name.toLowerCase().replace(/\s+/g, '-'),
        components,
      ),
    ),
  );

  return (
    <>
      <PageHeader title={name} />
      <div className='my-4 flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-[1fr_2fr]'>
        <CardDisplayPreview
          card={{
            name,
            type: 'class',
            subtitle: 'Class Features',
            image: `/assets/images/srd/class/${classSubclasses[0].image}`,
            artist: classSubclasses[0].artist,
            evasion: current.startEvasion,
            domainPrimary: current.domains[0],
            domainPrimaryColor: domainColor(current.domains[0]),
            domainSecondary: current.domains[1],
            domainSecondaryColor: domainColor(current.domains[1]),
            text: current.features
              .map(
                (feat) => `
              <p><strong><em>${feat.name}: </em></strong>${feat.description}</p>
              ${feat.extra ? feat.extra : ''}
              `,
              )
              .join(''),
            credits: 'Daggerheart © Darrington Press 2025',
          }}
          settings={initialSettings}
        />
        <div className='space-y-2'>
          <p className='text-muted-foreground'>{current.flavor}</p>
          <div className='bg-accent text-foreground border-accent-foreground border-t border-b p-4'>
            <p>
              <strong>Starting Evasion: </strong>
              {current.startEvasion}
            </p>
            <p>
              <strong>Starting Hit Points: </strong>
              {current.startHp}
            </p>
            <p>
              <strong>Class Items: </strong>
              <em>{current.items}</em>
            </p>
          </div>
          <h3 className='font-eveleth-clean'>Background Questions</h3>
          <p className='text-muted-foreground'>
            <em>
              Answer any of the following background questions. You can also
              create your own questions.
            </em>
          </p>
          <ul className='list-outside list-disc pl-4'>
            {current.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
          <h3 className='font-eveleth-clean'>Connections</h3>
          <p className='text-muted-foreground'>
            <em>
              Ask your fellow players one of the following questions for their
              character to answer, or create your own questions.
            </em>
          </p>
          <ul className='list-outside list-disc pl-4'>
            {current.connections.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      </div>
      {classAdditional && (
        <Prose className='mb-4 space-y-4'>{classAdditional}</Prose>
      )}
      <h2 className='font-eveleth-clean text-xl'>Subclasses</h2>
      <div className='my-2 space-y-2'>
        {classSubclasses.map((sc, i) => (
          <Collapsible
            key={sc.name}
            className='bg-card group/collapsible rounded-lg border'
            defaultOpen
          >
            <CollapsibleSectionTrigger>
              <Label className='font-eveleth-clean text-lg'>{sc.name}</Label>
            </CollapsibleSectionTrigger>
            <p className='text-muted-foreground px-4 py-3'>{sc.description}</p>
            <CollapsibleContent>
              <div className='grid grid-cols-1 gap-2 border-t px-4 py-3 lg:grid-cols-3'>
                <CardDisplayPreview
                  card={{
                    name: sc.name,
                    type: 'subclass',
                    subtype: current.name,
                    subtitle: 'Foundation',
                    image: `/assets/images/srd/class/${sc.image}`,
                    artist: sc.artist,
                    domainPrimary: current.domains[0],
                    domainPrimaryColor: domainColor(current.domains[0]),
                    domainSecondary: current.domains[1],
                    domainSecondaryColor: domainColor(current.domains[1]),
                    text: [
                      ...(sc.trait
                        ? [
                            `<p style="text-align: center;"><strong>SPELLCAST: </strong> ${sc.trait.toUpperCase()}</p>`,
                          ]
                        : []),
                      ...sc.foundation.map(
                        (
                          feat,
                        ) => `<p><em><strong>${feat.name}: </strong></em>${feat.description}</p>
                  ${feat.extra ? feat.extra : ''}`,
                      ),
                    ].join(''),
                  }}
                  settings={initialSettings}
                />

                <CardDisplayPreview
                  card={{
                    name: sc.name,
                    type: 'subclass',
                    subtype: current.name,
                    subtitle: 'Specialization',
                    image: `/assets/images/srd/class/${sc.image}`,
                    artist: sc.artist,
                    domainPrimary: current.domains[0],
                    domainPrimaryColor: domainColor(current.domains[0]),
                    domainSecondary: current.domains[1],
                    domainSecondaryColor: domainColor(current.domains[1]),
                    text: sc.specialization
                      .map(
                        (
                          feat,
                        ) => `<p><em><strong>${feat.name}: </strong></em>${feat.description}</p>
                  ${feat.extra ? feat.extra : ''}`,
                      )
                      .join(''),
                  }}
                  settings={initialSettings}
                />

                <CardDisplayPreview
                  card={{
                    name: sc.name,
                    type: 'subclass',
                    subtype: current.name,
                    subtitle: 'Mastery',
                    image: `/assets/images/srd/class/${sc.image}`,
                    artist: sc.artist,
                    domainPrimary: current.domains[0],
                    domainPrimaryColor: domainColor(current.domains[0]),
                    domainSecondary: current.domains[1],
                    domainSecondaryColor: domainColor(current.domains[1]),
                    text: sc.mastery
                      .map(
                        (
                          feat,
                        ) => `<p><em><strong>${feat.name}: </strong></em>${feat.description}</p>
                  ${feat.extra ? feat.extra : ''}`,
                      )
                      .join(''),
                  }}
                  settings={initialSettings}
                />
              </div>
              {subclassAdditionals[i] && (
                <Prose className='space-y-4 px-4 pb-3'>
                  {subclassAdditionals[i]}
                </Prose>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </>
  );
}
