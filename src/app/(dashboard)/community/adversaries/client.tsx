'use client';

import * as React from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import type {
  AdversaryDetails,
  ApiResponse,
  PaginationMeta,
  User,
  UserAdversary,
} from '@/lib/types';
import { Pagination, PaginationPageSizeDropdown } from '@/components/common';
import { Skeleton } from '@/components/ui/skeleton';
import { CommunityAdversary } from '@/components/post';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Skull } from 'lucide-react';

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
];

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
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedTiers, setSelectedTiers] = React.useState<number[]>([]);
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: [
      'community-adversaries',
      currentPage,
      pageSize,
      selectedTiers,
      selectedRoles,
    ],
    queryFn: () =>
      fetchAdversaries({
        page: currentPage,
        pageSize,
        tiers: selectedTiers,
        roles: selectedRoles,
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
      <div className='flex flex-row items-start gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='capitalize'>
              {selectedTiers.length > 0 && selectedTiers.length < 5
                ? `Tier: ${selectedTiers.join(', ')}`
                : 'Tier: All'}
              <ChevronDown className='text-muted-foreground ml-2 size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='min-w-64'>
            <DropdownMenuLabel>Filter by tier</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={selectedTiers.length === 5}
              onCheckedChange={(c) => {
                setSelectedTiers(c ? [1, 2, 3, 4, 5] : []);
                setCurrentPage(1);
              }}
            >
              All
            </DropdownMenuCheckboxItem>
            {[1, 2, 3, 4, 5].map((tier) => {
              const checked = selectedTiers.includes(tier);
              return (
                <DropdownMenuCheckboxItem
                  key={tier}
                  checked={checked}
                  onCheckedChange={(c) => {
                    setSelectedTiers((prev) => {
                      if (c) return Array.from(new Set([...prev, tier]));
                      return prev.filter((x) => x !== tier);
                    });
                    setCurrentPage(1);
                  }}
                >
                  {tier}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='capitalize'>
              {selectedRoles.length > 0 &&
              selectedRoles.length < predefinedRoles.length
                ? `Role: ${selectedRoles.join(', ')}`
                : 'Role: All'}
              <ChevronDown className='text-muted-foreground ml-2 size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='min-w-64'>
            <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={selectedRoles.length === predefinedRoles.length}
              onCheckedChange={(c) => {
                setSelectedRoles(c ? [...predefinedRoles] : []);
                setCurrentPage(1);
              }}
              className='capitalize'
            >
              All
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedRoles.includes('custom')}
              onCheckedChange={(c) => {
                setSelectedRoles((prev) => {
                  if (c) return Array.from(new Set([...prev, 'custom']));
                  return prev.filter((x) => x !== 'custom');
                });
                setCurrentPage(1);
              }}
              className='capitalize'
            >
              custom
            </DropdownMenuCheckboxItem>
            {predefinedRoles.map((r) => {
              const checked = selectedRoles.includes(r);
              return (
                <DropdownMenuCheckboxItem
                  key={r}
                  checked={checked}
                  onCheckedChange={(c) => {
                    setSelectedRoles((prev) => {
                      if (c) return Array.from(new Set([...prev, r]));
                      return prev.filter((x) => x !== r);
                    });
                    setCurrentPage(1);
                  }}
                  className='capitalize'
                >
                  {r}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {adversaries.map((adversary) => (
        <CommunityAdversary
          key={adversary.userAdversary.id}
          adversaryPreview={adversary.adversaryPreview}
          user={adversary.user}
          userAdversary={adversary.userAdversary}
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
