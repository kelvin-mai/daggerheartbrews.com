'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search } from 'lucide-react';

import type { CardDetails } from '@/lib/types';
import { CardDisplayPreview } from '@/components/card-creation/preview';
import { initialSettings } from '@/lib/constants';
import { Input } from '@/components/ui/input';

export const FilteredCommunities = ({
  communities,
}: {
  communities: CardDetails[];
}) => {
  const [search, setSearch] = React.useState('');

  const filtered = communities.filter((c) =>
    search ? c.name.toLowerCase().includes(search.toLowerCase()) : true,
  );

  return (
    <div>
      <div className='relative mb-6'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
        <Input
          className='pl-9'
          placeholder='Search communities…'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 && (
        <div className='text-muted-foreground py-16 text-center text-sm'>
          No communities match &ldquo;{search}&rdquo;
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
