'use client';

import * as React from 'react';
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { Trees } from 'lucide-react';

import type {
  AdversaryDetails,
  ApiResponse,
  PaginationMeta,
  User,
  UserAdversary,
} from '@/lib/types';
import {
  MultipleSelector,
  Option,
  Pagination,
  PaginationPageSizeDropdown,
} from '@/components/common';
import { Skeleton } from '@/components/ui/skeleton';
import { CommunityAdversary } from '@/components/post';
import { capitalize } from '@/lib/utils';

type Data = {
  userAdversary: UserAdversary;
  user: User;
  adversaryPreview: AdversaryDetails;
};

const subtypes = ['exploration', 'social', 'traversal', 'event'];

const tierOptions: Option[] = [1, 2, 3, 4].map((n) => ({
  value: String(n),
  label: `Tier ${n}`,
}));

const subtypeOptions: Option[] = subtypes.map((s) => ({
  value: s,
  label: capitalize(s),
}));

const fetchEnvironments = async ({
  page,
  pageSize,
  tiers,
  selectedSubtypes,
}: {
  page: number;
  pageSize: number;
  tiers: number[];
  selectedSubtypes: string[];
}): Promise<ApiResponse<Data[], PaginationMeta>> => {
  const tierQuery = tiers.length > 0 ? `&tier=${tiers.join(',')}` : '';
  const subtypeQuery =
    selectedSubtypes.length > 0 ? `&role=${selectedSubtypes.join(',')}` : '';
  const res = await fetch(
    `/api/community/adversary?page=${page}&page-size=${pageSize}&type=environment${tierQuery}${subtypeQuery}`,
  );
  return res.json();
};

export const CommunityEnvironments = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedTiers, setSelectedTiers] = React.useState<Option[]>([]);
  const [selectedSubtypes, setSelectedSubtypes] = React.useState<Option[]>([]);

  const selectedTierValues = selectedTiers.map((o) => Number(o.value));
  const selectedSubtypeValues = selectedSubtypes.map((o) => o.value);

  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks', 'adversaries'],
    queryFn: () =>
      fetch('/api/bookmarks/adversaries').then((r) => r.json()) as Promise<{
        data: { ids: string[] } | null;
      }>,
    staleTime: 60_000,
  });

  const bookmarkedIds = new Set(bookmarksData?.data?.ids ?? []);

  const { data, isLoading } = useQuery({
    queryKey: [
      'community-environments',
      currentPage,
      pageSize,
      selectedTierValues,
      selectedSubtypeValues,
    ],
    queryFn: () =>
      fetchEnvironments({
        page: currentPage,
        pageSize,
        tiers: selectedTierValues,
        selectedSubtypes: selectedSubtypeValues,
      }),
    placeholderData: keepPreviousData,
  });

  const environments = data?.data ?? [];
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
      <div className='mb-6 grid grid-cols-2 gap-2'>
        <MultipleSelector
          commandProps={{ label: 'Select Tiers' }}
          defaultOptions={tierOptions}
          value={selectedTiers}
          onChange={(opts) => {
            setSelectedTiers(opts);
            setCurrentPage(1);
          }}
          placeholder='Filter by tier'
          emptyIndicator={
            <p className='text-muted-foreground text-center text-sm'>
              No results
            </p>
          }
        />
        <MultipleSelector
          commandProps={{ label: 'Select Subtypes' }}
          defaultOptions={subtypeOptions}
          value={selectedSubtypes}
          onChange={(opts) => {
            setSelectedSubtypes(opts);
            setCurrentPage(1);
          }}
          placeholder='Filter by subtype'
          emptyIndicator={
            <p className='text-muted-foreground text-center text-sm'>
              No results
            </p>
          }
        />
      </div>
      {environments.map((env) => (
        <CommunityAdversary
          key={env.userAdversary.id}
          adversaryPreview={env.adversaryPreview}
          user={env.user}
          userAdversary={env.userAdversary}
          isBookmarked={bookmarkedIds.has(env.userAdversary.id)}
          onBookmarkToggle={() =>
            queryClient.invalidateQueries({
              queryKey: ['bookmarks', 'adversaries'],
            })
          }
        />
      ))}
      {environments.length > 0 ? (
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
            <Trees className='text-muted-foreground size-6' />
          </div>
          <div>
            <p className='font-medium'>No public environments yet</p>
            <p className='text-muted-foreground text-sm'>
              There are currently no public environments. Please check back
              later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
