'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, LayoutTemplate, Search } from 'lucide-react';

import type { CardDetails } from '@/lib/types';
import type {
  ClassReference,
  SubclassReference,
} from '@/lib/constants/reference';
import { initialSettings } from '@/lib/constants';
import { domainColor } from '@/lib/constants/reference';
import { CardPreview } from '@/components/card-creation/preview';
import {
  DisplayContainer,
  MultipleSelector,
  Option,
} from '@/components/common';
import { Input } from '@/components/ui/input';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useCardActions } from '@/store';

const SOURCE_OPTIONS: Option[] = [
  { value: 'SRD', label: 'SRD' },
  { value: 'The Void', label: 'The Void' },
];

export const CardClassPreview: React.FC<{ card: CardDetails }> = ({ card }) => {
  const { setCardDetails } = useCardActions();
  const router = useRouter();

  const handleUseAsTemplate = () => {
    const { id: _, ...template } = card;
    setCardDetails(template);
    router.push('/card/create?template=true');
  };

  return (
    <DisplayContainer
      blur
      menu={
        <>
          <DropdownMenuItem asChild>
            <Link href={`/reference/classes/${card.name}`}>
              <BookOpen className='size-4' />
              View Class
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleUseAsTemplate}>
            <LayoutTemplate className='size-4' />
            Use as Template
          </DropdownMenuItem>
        </>
      }
    >
      <CardPreview card={card} settings={initialSettings} />
    </DisplayContainer>
  );
};

export const FilteredClasses = ({
  classes,
  subclasses,
}: {
  classes: ClassReference[];
  subclasses: SubclassReference[];
}) => {
  const [search, setSearch] = React.useState('');
  const [selectedSources, setSelectedSources] = React.useState<Option[]>([]);

  const filtered = classes
    .filter((cl) =>
      search ? cl.name.toLowerCase().includes(search.toLowerCase()) : true,
    )
    .filter((cl) =>
      selectedSources.length > 0
        ? selectedSources.map((o) => o.value).includes(cl.source ?? 'SRD')
        : true,
    );

  return (
    <div>
      <div className='mb-6 grid grid-cols-2 gap-2'>
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            className='pl-9'
            placeholder='Search classes…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <MultipleSelector
          commandProps={{ label: 'Select Sources' }}
          defaultOptions={SOURCE_OPTIONS}
          value={selectedSources}
          onChange={setSelectedSources}
          placeholder='Filter by source'
          emptyIndicator={
            <p className='text-muted-foreground text-center text-sm'>
              No results
            </p>
          }
        />
      </div>

      {filtered.length === 0 && (
        <div className='text-muted-foreground py-16 text-center text-sm'>
          No classes match your filters
        </div>
      )}

      <div className='flex flex-wrap justify-center gap-4'>
        {filtered.map((cl) => {
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
                  image: firstSubclass?.image
                    ? `/assets/images/srd/class/${firstSubclass.image}`
                    : undefined,
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
    </div>
  );
};
