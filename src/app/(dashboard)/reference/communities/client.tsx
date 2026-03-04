'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search } from 'lucide-react';

import type { CardDetails } from '@/lib/types';
import { CardDisplayPreview } from '@/components/card-creation/preview';
import { initialSettings } from '@/lib/constants';
import { MultipleSelector, Option } from '@/components/common';
import { Input } from '@/components/ui/input';

const SOURCE_OPTIONS: Option[] = [
  { value: 'SRD', label: 'SRD' },
  { value: 'The Void', label: 'The Void' },
];

export const FilteredCommunities = ({
  communities,
}: {
  communities: CardDetails[];
}) => {
  const [search, setSearch] = React.useState('');
  const [selectedSources, setSelectedSources] = React.useState<Option[]>([]);

  const filtered = communities
    .filter((c) =>
      search ? c.name.toLowerCase().includes(search.toLowerCase()) : true,
    )
    .filter((c) =>
      selectedSources.length > 0
        ? selectedSources.map((o) => o.value).includes(c.source ?? 'SRD')
        : true,
    );

  return (
    <div>
      <div className='mb-6 flex flex-col gap-2'>
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            className='pl-9'
            placeholder='Search communities…'
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
          No communities match your filters
        </div>
      )}

      <div className='flex flex-wrap justify-center gap-4'>
        <AnimatePresence>
          {filtered.map((community) => (
            <motion.div
              key={community.name}
              className='w-full max-w-[340px]'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              layout
            >
              <CardDisplayPreview card={community} settings={initialSettings} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
