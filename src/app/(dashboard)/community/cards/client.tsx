'use client';

import * as React from 'react';
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { Layers } from 'lucide-react';

import type {
  ApiResponse,
  CardDetails,
  PaginationMeta,
  User,
  UserCard,
} from '@/lib/types';
import {
  MultipleSelector,
  Option,
  Pagination,
  PaginationPageSizeDropdown,
} from '@/components/common';
import { Skeleton } from '@/components/ui/skeleton';
import { CommunityCard, SortTabs, type SortMode } from '@/components/post';
import { cardTypes } from '@/lib/types/card-creation';
import { capitalize } from '@/lib/utils';

type Data = { userCard: UserCard; user: User; cardPreview: CardDetails };

const typeOptions: Option[] = cardTypes.map((t) => ({
  value: t,
  label: capitalize(t),
}));

async function fetchCards({
  page,
  pageSize,
  types,
  sort,
}: {
  page: number;
  pageSize: number;
  types: string[];
  sort: SortMode;
}): Promise<ApiResponse<Data[], PaginationMeta>> {
  const typeQuery = types.length > 0 ? `&type=${types.join(',')}` : '';
  const res = await fetch(
    `/api/community/cards?page=${page}&page-size=${pageSize}&sort=${sort}${typeQuery}`,
  );
  return res.json();
}

export const CommunityCards = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedTypes, setSelectedTypes] = React.useState<Option[]>([]);
  const [sort, setSort] = React.useState<SortMode>('hot');

  const selectedTypeValues = selectedTypes.map((o) => o.value);

  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks', 'cards'],
    queryFn: () =>
      fetch('/api/bookmarks/cards').then((r) => r.json()) as Promise<{
        data: { ids: string[] } | null;
      }>,
    staleTime: 60_000,
  });

  const { data: votesData } = useQuery({
    queryKey: ['votes', 'cards'],
    queryFn: () =>
      fetch('/api/votes/cards').then((r) => r.json()) as Promise<{
        data: { votes: Record<string, 'up' | 'down'> } | null;
      }>,
    staleTime: 60_000,
  });

  const bookmarkedIds = new Set(bookmarksData?.data?.ids ?? []);
  const userVotes = votesData?.data?.votes ?? {};

  const { data, isLoading } = useQuery({
    queryKey: [
      'community-cards',
      currentPage,
      pageSize,
      selectedTypeValues,
      sort,
    ],
    queryFn: () =>
      fetchCards({
        page: currentPage,
        pageSize,
        types: selectedTypeValues,
        sort,
      }),
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
      <div className='mb-6 space-y-3'>
        <SortTabs
          value={sort}
          onChange={(s) => {
            setSort(s);
            setCurrentPage(1);
          }}
        />
        <MultipleSelector
          commandProps={{ label: 'Select Types' }}
          defaultOptions={typeOptions}
          value={selectedTypes}
          onChange={(opts) => {
            setSelectedTypes(opts);
            setCurrentPage(1);
          }}
          placeholder='Filter by type'
          emptyIndicator={
            <p className='text-muted-foreground text-center text-sm'>
              No results
            </p>
          }
        />
      </div>
      {cards.map((card) => (
        <CommunityCard
          key={card.userCard.id}
          cardPreview={card.cardPreview}
          user={card.user}
          userCard={card.userCard}
          isBookmarked={bookmarkedIds.has(card.userCard.id)}
          onBookmarkToggle={() =>
            queryClient.invalidateQueries({ queryKey: ['bookmarks', 'cards'] })
          }
          userVote={userVotes[card.userCard.id] ?? null}
          onVoteToggle={() =>
            queryClient.invalidateQueries({ queryKey: ['votes', 'cards'] })
          }
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
