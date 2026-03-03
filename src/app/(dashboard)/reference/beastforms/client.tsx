'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search } from 'lucide-react';

import { MultipleSelector, Option } from '@/components/common';
import { CardDetails } from '@/lib/types';
import { CardDisplayPreview } from '@/components/card-creation/preview';
import { initialSettings } from '@/lib/constants';
import { Input } from '@/components/ui/input';

export const FilteredBeastforms = ({
  beastforms,
}: {
  beastforms: CardDetails[];
}) => {
  const tiers: Option[] = [1, 2, 3, 4].map((n) => ({
    value: String(n),
    label: `Tier ${n}`,
  }));
  const [searchName, setSearchName] = React.useState<string>('');
  const [selectedTiers, setSelectedTiers] = React.useState<Option[]>([]);

  const filtered = beastforms
    .filter((b) =>
      searchName
        ? b.name.toLowerCase().includes(searchName.toLowerCase())
        : true,
    )
    .filter((b) =>
      selectedTiers.length > 0
        ? selectedTiers.map((o) => Number(o.value)).includes(b.tier!)
        : true,
    );

  return (
    <div>
      <div className='mb-6 grid grid-cols-2 gap-2'>
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            className='pl-9'
            placeholder='Search beastforms…'
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
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

      {filtered.length === 0 && (
        <div className='text-muted-foreground py-16 text-center text-sm'>
          No beastforms match your filters
        </div>
      )}

      <div className='flex flex-wrap justify-center gap-4'>
        <AnimatePresence>
          {filtered.map((beastform) => (
            <motion.div
              key={beastform.name}
              className='w-full max-w-[340px]'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              layout
            >
              <CardDisplayPreview card={beastform} settings={initialSettings} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
