'use client';

import * as React from 'react';
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { Skull } from 'lucide-react';

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

const predefinedRoles = [
  'bruiser',
  'horde',
  'leader',
  'minion',
  'ranged',
  'skulk',
  'social',
  'solo',
  'standard',
  'support',
  'custom',
];

const tierOptions: Option[] = [1, 2, 3, 4, 5].map((n) => ({
  value: String(n),
  label: `Tier ${n}`,
}));

const roleOptions: Option[] = predefinedRoles.map((r) => ({
  value: r,
  label: capitalize(r),
}));

async function fetchAdversaries({
  page,
  pageSize,
  tiers,
  roles,
}: {
  page: number;
  pageSize: number;
  tiers: number[];
  roles: string[];
}): Promise<ApiResponse<Data[], PaginationMeta>> {
  const tierQuery = tiers.length > 0 ? `&tier=${tiers.join(',')}` : '';
  const rolesQuery = roles.length > 0 ? `&role=${roles.join(',')}` : '';
  const res = await fetch(
    `/api/community/adversary?page=${page}&page-size=${pageSize}${tierQuery}${rolesQuery}`,
  );
  return res.json();
}

export const CommunityAdversaries = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedTiers, setSelectedTiers] = React.useState<Option[]>([]);
  const [selectedRoles, setSelectedRoles] = React.useState<Option[]>([]);

  const selectedTierValues = selectedTiers.map((o) => Number(o.value));
  const selectedRoleValues = selectedRoles.map((o) => o.value);

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
      'community-adversaries',
      currentPage,
      pageSize,
      selectedTierValues,
      selectedRoleValues,
    ],
    queryFn: () =>
      fetchAdversaries({
        page: currentPage,
        pageSize,
        tiers: selectedTierValues,
        roles: selectedRoleValues,
      }),
    placeholderData: keepPreviousData,
  });

  const adversaries = data?.data ?? [];
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
          commandProps={{ label: 'Select Roles' }}
          defaultOptions={roleOptions}
          value={selectedRoles}
          onChange={(opts) => {
            setSelectedRoles(opts);
            setCurrentPage(1);
          }}
          placeholder='Filter by role'
          emptyIndicator={
            <p className='text-muted-foreground text-center text-sm'>
              No results
            </p>
          }
        />
      </div>
      {adversaries.map((adversary) => (
        <CommunityAdversary
          key={adversary.userAdversary.id}
          adversaryPreview={adversary.adversaryPreview}
          user={adversary.user}
          userAdversary={adversary.userAdversary}
          isBookmarked={bookmarkedIds.has(adversary.userAdversary.id)}
          onBookmarkToggle={() =>
            queryClient.invalidateQueries({
              queryKey: ['bookmarks', 'adversaries'],
            })
          }
        />
      ))}
      {adversaries.length > 0 ? (
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
            <Skull className='text-muted-foreground size-6' />
          </div>
          <div>
            <p className='font-medium'>No public adversaries yet</p>
            <p className='text-muted-foreground text-sm'>
              There are currently no public adversaries. Please check back
              later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
