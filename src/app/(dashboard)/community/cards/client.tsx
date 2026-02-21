'use client';

import * as React from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import type {
  ApiResponse,
  CardDetails,
  PaginationMeta,
  User,
  UserCard,
} from '@/lib/types';
import { Pagination, PaginationPageSizeDropdown } from '@/components/common';
import { Skeleton } from '@/components/ui/skeleton';
import { CommunityCard } from '@/components/post';
import { cardTypes } from '@/lib/types/card-creation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Layers } from 'lucide-react';

type Data = { userCard: UserCard; user: User; cardPreview: CardDetails };

async function fetchCards({
  page,
  pageSize,
  types,
}: {
  page: number;
  pageSize: number;
  types: string[];
}): Promise<ApiResponse<Data[], PaginationMeta>> {
  const typeQuery = types.length > 0 ? `&type=${types.join(',')}` : '';
  const res = await fetch(
    `/api/community/cards?page=${page}&page-size=${pageSize}${typeQuery}`,
  );
  return res.json();
}

export const CommunityCards = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['community-cards', currentPage, pageSize, selectedTypes],
    queryFn: () =>
      fetchCards({ page: currentPage, pageSize, types: selectedTypes }),
    placeholderData: keepPreviousData,
  });

  const cards = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  if (isLoading) {
    return (
      <div className='mb-4 space-y-2'>
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className='h-20' />
          ))}
      </div>
    );
  }

  return (
    <div className='mb-2 space-y-2'>
      <div className='flex items-center justify-between gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='capitalize'>
              {selectedTypes.length > 0 &&
              selectedTypes.length < cardTypes.length
                ? `Type: ${selectedTypes.join(', ')}`
                : 'Type: All'}
              <ChevronDown className='text-muted-foreground ml-2 size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='min-w-64'>
            <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={selectedTypes.length === cardTypes.length}
              onCheckedChange={(c) => {
                setSelectedTypes(c ? [...cardTypes] : []);
                setCurrentPage(1);
              }}
              className='capitalize'
            >
              All
            </DropdownMenuCheckboxItem>
            {cardTypes.map((t) => {
              const checked = selectedTypes.includes(t);
              return (
                <DropdownMenuCheckboxItem
                  key={t}
                  checked={checked}
                  onCheckedChange={(c) => {
                    setSelectedTypes((prev) => {
                      if (c) return Array.from(new Set([...prev, t]));
                      return prev.filter((x) => x !== t);
                    });
                    setCurrentPage(1);
                  }}
                  className='capitalize'
                >
                  {t}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {cards.map((card) => (
        <CommunityCard
          key={card.userCard.id}
          cardPreview={card.cardPreview}
          user={card.user}
          userCard={card.userCard}
        />
      ))}
      {cards.length > 0 ? (
        <Pagination
          className='justify-end'
          currentPage={currentPage}
          pages={Math.ceil(total / pageSize)}
          onPage={setCurrentPage}
          buttonProps={{ variant: 'ghost' }}
        >
          <PaginationPageSizeDropdown
            pageSize={pageSize}
            total={total}
            onPageSize={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            buttonProps={{ variant: 'ghost' }}
          />
        </Pagination>
      ) : (
        <div className='bg-card flex flex-col items-center gap-3 rounded-lg border py-12 text-center'>
          <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
            <Layers className='text-muted-foreground size-6' />
          </div>
          <div>
            <p className='font-medium'>No public cards yet</p>
            <p className='text-muted-foreground text-sm'>
              There are currently no public cards. Please check back later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
