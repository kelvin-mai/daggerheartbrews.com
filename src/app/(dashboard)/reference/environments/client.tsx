'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search } from 'lucide-react';

import type { AdversaryDetails } from '@/lib/types';
import { AdversaryDisplayPreview } from '@/components/adversary-creation/preview';
import { MultipleSelector, Option } from '@/components/common';
import { Input } from '@/components/ui/input';
import { capitalize } from '@/lib/utils';

const SOURCE_OPTIONS: Option[] = [
  { value: 'SRD', label: 'SRD' },
  { value: 'The Void', label: 'The Void' },
];

export const FilteredEnvironments = ({
  environments,
}: {
  environments: AdversaryDetails[];
}) => {
  const tiers: Option[] = [1, 2, 3, 4].map((n) => ({
    value: String(n),
    label: String(n),
  }));
  const types: Option[] = ['exploration', 'social', 'traversal', 'event'].map(
    (s) => ({
      value: s,
      label: capitalize(s),
    }),
  );
  const [searchName, setSearchName] = React.useState<string>('');
  const [selectedTypes, setSelectedTypes] = React.useState<Option[]>([]);
  const [selectedTiers, setSelectedTiers] = React.useState<Option[]>([]);
  const [selectedSources, setSelectedSources] = React.useState<Option[]>([]);

  return (
    <div>
      <div className='mb-4 grid grid-cols-2 gap-2'>
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            className='pl-9'
            placeholder='Search environments…'
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
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
        <MultipleSelector
          commandProps={{ label: 'Select Types' }}
          defaultOptions={types}
          value={selectedTypes}
          onChange={setSelectedTypes}
          placeholder='Filter by type'
          emptyIndicator={
            <p className='text-muted-foreground text-center text-sm'>
              No results
            </p>
          }
        />
        <MultipleSelector
          commandProps={{ label: 'Select Tiers' }}
          defaultOptions={tiers}
          value={selectedTiers}
          onChange={setSelectedTiers}
          placeholder='Filter by tier'
          emptyIndicator={
            <p className='text-muted-foreground text-center text-sm'>
              No results
            </p>
          }
        />
      </div>
      <div className='my-4 columns-1 gap-4 space-y-4 lg:columns-2 xl:columns-3'>
        <AnimatePresence>
          {environments
            .filter((environment) =>
              searchName.length > 0
                ? environment.name
                    .toLowerCase()
                    .includes(searchName.toLowerCase())
                : true,
            )
            .filter((environment) =>
              selectedSources.length > 0
                ? selectedSources
                    .map((o) => o.value)
                    .includes(environment.source ?? 'SRD')
                : true,
            )
            .filter((environment) =>
              selectedTypes.length > 0
                ? selectedTypes
                    .map((option) => option.value.toLowerCase())
                    .includes(environment.subtype!.toLowerCase())
                : true,
            )
            .filter((environment) =>
              selectedTiers.length > 0
                ? selectedTiers
                    .map((option) => Number(option.value))
                    .includes(environment.tier!)
                : true,
            )
            .map((environment) => (
              <motion.div
                key={environment.name}
                className='break-inside-avoid'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                layout
              >
                <AdversaryDisplayPreview adversary={environment} />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
