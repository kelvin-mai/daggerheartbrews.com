'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search } from 'lucide-react';

import { MultipleSelector, Option } from '@/components/common';
import { CardDetails } from '@/lib/types';
import { CardDisplayPreview } from '@/components/card-creation/preview';
import { initialSettings } from '@/lib/constants';
import { Input } from '@/components/ui/input';

const SOURCE_OPTIONS: Option[] = [
  { value: 'SRD', label: 'SRD' },
  { value: 'The Void', label: 'The Void' },
];

export const FilteredTransformations = ({
  transformations,
}: {
  transformations: CardDetails[];
}) => {
  const [searchName, setSearchName] = React.useState<string>('');
  const [selectedSources, setSelectedSources] = React.useState<Option[]>([]);

  const filtered = transformations
    .filter((t) =>
      searchName
        ? t.name.toLowerCase().includes(searchName.toLowerCase())
        : true,
    )
    .filter((t) =>
      selectedSources.length > 0
        ? selectedSources.map((o) => o.value).includes(t.source ?? 'SRD')
        : true,
    );

  return (
    <div>
      <div className='mb-6 grid grid-cols-2 gap-2'>
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            className='pl-9'
            placeholder='Search transformations…'
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
      </div>

      {filtered.length === 0 && (
        <div className='text-muted-foreground py-16 text-center text-sm'>
          No transformations match your filters
        </div>
      )}

      <div className='flex flex-wrap justify-center gap-4'>
        <AnimatePresence>
          {filtered.map((transformation) => (
            <motion.div
              key={transformation.name}
              className='w-full max-w-[340px]'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              layout
            >
              <CardDisplayPreview
                card={transformation}
                settings={initialSettings}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
