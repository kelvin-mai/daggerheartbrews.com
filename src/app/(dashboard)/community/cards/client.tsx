'use client';

import * as React from 'react';

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

export const CommunityCards = () => {
  const [loading, setLoading] = React.useState(false);
  const [cards, setCards] = React.useState<Data[]>([]);
  const [pagination, setPagination] = React.useState({
    currentPage: 1,
    pageSize: 10,
    total: 100,
  });
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);

  const loadData = async ({
    page,
    pageSize,
    types,
  }: {
    page: number;
    pageSize: number;
    types?: string[];
  }) => {
    setLoading(true);
    const typeQuery =
      types && types.length > 0 ? `&type=${types.join(',')}` : '';
    const res = await fetch(
      `/api/community/cards?page=${page}&page-size=${pageSize}${typeQuery}`,
    );
    const data: ApiResponse<Data[], PaginationMeta> = await res.json();
    setCards(data.data);
    setPagination({
      currentPage: data.meta.page,
      pageSize: data.meta.pageSize,
      total: data.meta.total,
    });
    setLoading(false);
  };

  React.useEffect(() => {
    loadData({
      page: 1,
      pageSize: pagination.pageSize,
      types: selectedTypes,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTypes]);

  React.useEffect(() => {
    loadData({ page: 1, pageSize: 10, types: [] });
  }, []);

  if (loading) {
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
          currentPage={pagination.currentPage}
          pages={Math.ceil(pagination.total / pagination.pageSize)}
          onPage={(page) =>
            loadData({
              page,
              pageSize: pagination.pageSize,
              types: selectedTypes,
            })
          }
          buttonProps={{ variant: 'ghost' }}
        >
          <PaginationPageSizeDropdown
            pageSize={pagination.pageSize}
            total={pagination.total}
            onPageSize={(pageSize) =>
              loadData({
                page: 1,
                pageSize,
                types: selectedTypes,
              })
            }
            buttonProps={{ variant: 'ghost' }}
          />
        </Pagination>
      ) : (
        <div className='bg-card flex flex-col items-center gap-3 rounded-lg border py-12 text-center'>
          <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
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
