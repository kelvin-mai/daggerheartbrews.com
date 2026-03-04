'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search } from 'lucide-react';

import { CardDetails } from '@/lib/types';
import { CardDisplayPreview } from '@/components/card-creation/preview';
import { initialSettings } from '@/lib/constants';
import { Input } from '@/components/ui/input';

export const FilteredTransformations = ({
  transformations,
}: {
  transformations: CardDetails[];
}) => {
  const [searchName, setSearchName] = React.useState<string>('');

  const filtered = transformations.filter((t) =>
    searchName ? t.name.toLowerCase().includes(searchName.toLowerCase()) : true,
  );

  return (
    <div>
      <div className='mb-6'>
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            className='pl-9'
            placeholder='Search transformations…'
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
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
