import { ChevronDown } from 'lucide-react';

import { CardDisplayPreview } from '@/components/card-creation/preview';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { initialSettings } from '@/lib/constants';
import { classes, domainColor } from '@/lib/constants/srd';
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
  return (
    <>
      <h1 className='font-eveleth-clean dark:text-primary-foreground text-2xl font-bold'>
        {name}
      </h1>
      <div className='my-4 flex flex-col gap-4 lg:flex-row'>
        <div className='flex justify-center overflow-hidden h-[472px]'>
          <div className='scale-[0.45] origin-top'>
            <CardDisplayPreview
              card={{
                name,
                type: 'class',
                subtitle: 'Class Features',
                image: `/assets/images/srd/class/${current.subclasses[0].image}`,
                artist: current.subclasses[0].artist,
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
          </div>
        </div>
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
      {current.AdditionalSection ? <current.AdditionalSection /> : null}
      <h2 className='font-eveleth-clean text-xl'>Subclasses</h2>
      <div className='my-2 space-y-2'>
        {current.subclasses.map((sc) => (
          <Collapsible
            key={sc.name}
            className='bg-card group/collapsible rounded-lg border px-4 py-2'
            defaultOpen
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='font-eveleth-clean w-full items-center justify-between text-lg hover:cursor-pointer'
              >
                <Label>{sc.name}</Label>
                <ChevronDown className='size-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
                <span className='sr-only'>Toggle</span>
              </Button>
            </CollapsibleTrigger>
            <p className='text-muted-foreground pl-2'>{sc.description}</p>
            <CollapsibleContent className='mt-2 space-y-2'>
              <div className='grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3'>
                <div className='flex justify-center overflow-hidden h-[472px]'>
                  <div className='scale-[0.45] origin-top'>
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
                  </div>
                </div>

                <div className='flex justify-center overflow-hidden h-[472px]'>
                  <div className='scale-[0.45] origin-top'>
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
                  </div>
                </div>

                <div className='flex justify-center overflow-hidden h-[472px]'>
                  <div className='scale-[0.45] origin-top'>
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
                </div>
              </div>
              {sc.AdditoanlSection ? <sc.AdditoanlSection /> : null}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </>
  );
}
