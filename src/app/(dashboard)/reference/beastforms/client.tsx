'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { FormInput } from '@/components/common/form';
import { MultipleSelector, Option } from '@/components/common';
import { Label } from '@/components/ui/label';
import { CardDetails } from '@/lib/types';
import { CardDisplayPreview } from '@/components/card-creation/preview';
import { initialSettings } from '@/lib/constants';

export const FilteredBeastforms = ({
  beastforms,
}: {
  beastforms: CardDetails[];
}) => {
  const tiers: Option[] = [1, 2, 3, 4].map((n) => ({
    value: String(n),
    label: String(n),
  }));
  const [searchName, setSearchName] = React.useState<string>('');
  const [selectedTiers, setSelectedTiers] = React.useState<Option[]>([]);
  return (
    <div className='pt-2'>
      <Label className='py-2'>Filter Environments</Label>
      <div className='grid grid-cols-3 items-center gap-2'>
        <FormInput
          id='name'
          placeholder='Environment Name'
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <div className='space-y-2'>
          <Label>Tier</Label>
          <MultipleSelector
            commandProps={{ label: 'Select Tiers' }}
            defaultOptions={tiers}
            value={selectedTiers}
            onChange={setSelectedTiers}
            placeholder='Select Tiers'
            emptyIndicator={
              <p className='text-muted-foreground text-center text-sm'>
                No results
              </p>
            }
          />
        </div>
      </div>
      <div className='my-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'>
        <AnimatePresence>
          {beastforms
            .filter((beastform) =>
              searchName.length > 0
                ? beastform.name
                    .toLowerCase()
                    .includes(searchName.toLowerCase())
                : true,
            )
            .filter((beastform) =>
              selectedTiers.length > 0
                ? selectedTiers
                    .map((option) => Number(option.value))
                    .includes(beastform.tier!)
                : true,
            )
            .map((beastform) => (
              <motion.div
                key={beastform.name}
                className='break-inside-avoid flex justify-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                layout
              >
                <div className='[&>div>div:first-child]:origin-top [&>div>div:first-child]:scale-[0.45] [&>div>div:first-child]:-mb-[578px] [&>div>button]:w-[340px] [&>div>button]:mx-auto [&>div>button]:mt-3'>
                  <CardDisplayPreview
                    card={beastform}
                    settings={initialSettings}
                  />
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
