'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LayoutGrid, LayoutList, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { CardDetails } from '@/lib/types';
import {
  CardDisplayPreview,
  CardPreview,
} from '@/components/card-creation/preview';
import { initialSettings } from '@/lib/constants';
import {
  MultipleSelector,
  Option,
  Pagination,
  PaginationPageSizeDropdown,
} from '@/components/common';
import { CommunityPost } from '@/components/post';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCardActions } from '@/store';

const CATEGORIES: Option[] = [
  { value: 'Armor', label: 'Armor' },
  { value: 'Weapon', label: 'Weapon' },
  { value: 'Consumable', label: 'Consumable' },
  { value: 'Item', label: 'Item' },
];

const TIERS: Option[] = [1, 2, 3, 4].map((n) => ({
  value: String(n),
  label: String(n),
}));

const HANDS: Option[] = [
  { value: '1', label: 'One-Handed' },
  { value: '2', label: 'Two-Handed' },
];

const DAMAGE_TYPES: Option[] = [
  { value: 'Physical', label: 'Physical' },
  { value: 'Magical', label: 'Magical' },
];

const PAGE_SIZES = [12, 24, 48];

const emptyIndicator = (
  <p className='text-muted-foreground text-center text-sm'>No results</p>
);

type View = 'posts' | 'cards';

export const FilteredEquipment = ({
  equipment,
}: {
  equipment: CardDetails[];
}) => {
  const router = useRouter();
  const { setCardDetails } = useCardActions();

  const [view, setView] = React.useState<View>('posts');
  const [search, setSearch] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<Option[]>(
    [],
  );
  const [selectedTiers, setSelectedTiers] = React.useState<Option[]>([]);
  const [selectedHands, setSelectedHands] = React.useState<Option[]>([]);
  const [selectedDamageTypes, setSelectedDamageTypes] = React.useState<
    Option[]
  >([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(24);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    selectedCategories,
    selectedTiers,
    selectedHands,
    selectedDamageTypes,
  ]);

  const filtered = equipment
    .filter((item) =>
      search ? item.name.toLowerCase().includes(search.toLowerCase()) : true,
    )
    .filter((item) =>
      selectedCategories.length > 0
        ? selectedCategories.some((cat) =>
            cat.value === 'Weapon'
              ? item.subtype?.endsWith('Weapon')
              : item.subtype === cat.value,
          )
        : true,
    )
    .filter((item) =>
      selectedTiers.length > 0
        ? item.tier !== undefined &&
          selectedTiers.map((t) => Number(t.value)).includes(item.tier)
        : true,
    )
    .filter((item) =>
      selectedHands.length > 0
        ? item.hands !== undefined &&
          selectedHands.map((h) => Number(h.value)).includes(item.hands)
        : true,
    )
    .filter((item) =>
      selectedDamageTypes.length > 0
        ? selectedDamageTypes.some((dt) => item.subtype?.includes(dt.value))
        : true,
    );

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleTemplate = (item: CardDetails) => {
    const { id: _, ...template } = item;
    setCardDetails(template);
    router.push('/card/create?template=true');
  };

  return (
    <div>
      <div className='mb-4 flex flex-col gap-2'>
        <div className='flex gap-2'>
          <div className='relative flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
            <Input
              className='pl-9'
              placeholder='Search equipment…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='flex shrink-0 gap-1'>
            <Button
              size='icon'
              variant={view === 'posts' ? 'secondary' : 'ghost'}
              onClick={() => setView('posts')}
              aria-label='Posts view'
            >
              <LayoutList />
            </Button>
            <Button
              size='icon'
              variant={view === 'cards' ? 'secondary' : 'ghost'}
              onClick={() => setView('cards')}
              aria-label='Cards view'
            >
              <LayoutGrid />
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
          <MultipleSelector
            commandProps={{ label: 'Select Categories' }}
            defaultOptions={CATEGORIES}
            value={selectedCategories}
            onChange={setSelectedCategories}
            placeholder='Filter by category'
            emptyIndicator={emptyIndicator}
          />
          <MultipleSelector
            commandProps={{ label: 'Select Tiers' }}
            defaultOptions={TIERS}
            value={selectedTiers}
            onChange={setSelectedTiers}
            placeholder='Filter by tier'
            emptyIndicator={emptyIndicator}
          />
          <MultipleSelector
            commandProps={{ label: 'Select Hands' }}
            defaultOptions={HANDS}
            value={selectedHands}
            onChange={setSelectedHands}
            placeholder='Filter by hands'
            emptyIndicator={emptyIndicator}
          />
          <MultipleSelector
            commandProps={{ label: 'Select Damage Type' }}
            defaultOptions={DAMAGE_TYPES}
            value={selectedDamageTypes}
            onChange={setSelectedDamageTypes}
            placeholder='Filter by damage type'
            emptyIndicator={emptyIndicator}
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className='text-muted-foreground py-16 text-center text-sm'>
          No equipment matches your filters
        </div>
      )}

      {view === 'posts' ? (
        <div className='space-y-2'>
          {paginated.map((item) => (
            <CommunityPost
              key={item.name}
              name={item.name}
              type={item.subtype ?? item.type}
              image={item.image}
              creator={item.source ?? 'SRD'}
              onUseAsTemplate={() => handleTemplate(item)}
              preview={<CardPreview card={item} settings={initialSettings} />}
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-wrap justify-center gap-4'>
          <AnimatePresence>
            {paginated.map((item) => (
              <motion.div
                key={item.name}
                className='w-full max-w-[340px]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                layout
              >
                <CardDisplayPreview card={item} settings={initialSettings} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filtered.length > 0 && (
        <Pagination
          className='justify-end'
          currentPage={currentPage}
          pages={pages}
          onPage={setCurrentPage}
          buttonProps={{ variant: 'ghost' }}
        >
          <PaginationPageSizeDropdown
            pageSize={pageSize}
            total={filtered.length}
            pageSizes={PAGE_SIZES}
            onPageSize={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            buttonProps={{ variant: 'ghost' }}
          />
        </Pagination>
      )}
    </div>
  );
};
