'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search } from 'lucide-react';

import type { AdversaryDetails } from '@/lib/types';
import { AdversaryDisplayPreview } from '@/components/adversary-creation/preview';
import { MultipleSelector, Option } from '@/components/common';
import { Input } from '@/components/ui/input';

export const FilteredAdversaries = ({
  adversaries,
}: {
  adversaries: AdversaryDetails[];
}) => {
  const tiers: Option[] = [1, 2, 3, 4].map((n) => ({
    value: String(n),
    label: String(n),
  }));

  const subtypes: Option[] = Array.from(
    new Set(adversaries.map((a) => a.subtype).filter(Boolean)),
  )
    .sort()
    .map((s) => ({ value: s!, label: s! }));

  const [searchName, setSearchName] = React.useState<string>('');
  const [selectedSubtypes, setSelectedSubtypes] = React.useState<Option[]>([]);
  const [selectedTiers, setSelectedTiers] = React.useState<Option[]>([]);

  return (
    <div>
      <div className='mb-4 grid grid-cols-3 gap-2'>
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            className='pl-9'
            placeholder='Search adversaries…'
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <MultipleSelector
          commandProps={{ label: 'Select Subtypes' }}
          defaultOptions={subtypes}
          value={selectedSubtypes}
          onChange={setSelectedSubtypes}
          placeholder='Filter by subtype'
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
          {adversaries
            .filter((adversary) =>
              searchName.length > 0
                ? adversary.name
                    .toLowerCase()
                    .includes(searchName.toLowerCase())
                : true,
            )
            .filter((adversary) =>
              selectedSubtypes.length > 0
                ? selectedSubtypes
                    .map((o) => o.value)
                    .includes(adversary.subtype!)
                : true,
            )
            .filter((adversary) =>
              selectedTiers.length > 0
                ? selectedTiers
                    .map((o) => Number(o.value))
                    .includes(adversary.tier!)
                : true,
            )
            .map((adversary) => (
              <motion.div
                key={adversary.name}
                className='break-inside-avoid'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                layout
              >
                <AdversaryDisplayPreview adversary={adversary} />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
