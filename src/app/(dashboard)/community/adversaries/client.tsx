'use client';

import * as React from 'react';

import type {
  AdversaryDetails,
  ApiResponse,
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
import { ChevronDown } from 'lucide-react';

type Data = {
  userAdversary: UserAdversary;
  user: User;
  adversaryPreview: AdversaryDetails;
};
type Meta = { page: number; pageSize: number; total: number };

export const CommunityAdversaries = () => {
  const [loading, setLoading] = React.useState(false);
  const [adversaries, setAdversaries] = React.useState<Data[]>([]);
  const [pagination, setPagination] = React.useState({
    currentPage: 1,
    pageSize: 10,
    total: 100,
  });
  const [selectedTiers, setSelectedTiers] = React.useState<number[]>([]);
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState('');
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

  const loadData = async ({
    page,
    pageSize,
    tiers,
    roles,
    q = '',
  }: {
    page: number;
    pageSize: number;
    tiers?: number[];
    roles?: string[];
    q?: string;
  }) => {
    setLoading(true);
    const tierQuery = tiers && tiers.length > 0 ? `&tier=${tiers.join(',')}` : '';
    const rolesQuery = roles && roles.length > 0 ? `&role=${roles.join(',')}` : '';
    const qQuery = q && q.length > 0 ? `&q=${encodeURIComponent(q)}` : '';
    const res = await fetch(
      `/api/community/adversary?page=${page}&page-size=${pageSize}${tierQuery}${rolesQuery}${qQuery}`,
    );
    const data: ApiResponse<Data[], Meta> = await res.json();
    setAdversaries(data.data);
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
      tiers: selectedTiers,
      roles: selectedRoles,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTiers, selectedRoles]);

  React.useEffect(() => {
    loadData({ page: 1, pageSize: 10, tiers: [], roles: [], q: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className='flex flex-col gap-2 items-start'>
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
              {selectedRoles.length > 0 && selectedRoles.length < predefinedRoles.length
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
                  }}
                  className='capitalize'
                >
                  {r}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              loadData({ page: 1, pageSize: pagination.pageSize, tiers: selectedTiers, roles: selectedRoles, q: query });
            }
          }}
          placeholder='Search by name'
          className='h-9 w-64 rounded-md border px-3 text-sm'
        />
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
          currentPage={pagination.currentPage}
          pages={Math.ceil(pagination.total / pagination.pageSize)}
          onPage={(page) =>
            loadData({
              page,
              pageSize: pagination.pageSize,
              tiers: selectedTiers,
              roles: selectedRoles,
              q: query,
            })
          }
          buttonProps={{ variant: 'ghost' }}
        >
          <PaginationPageSizeDropdown
            pageSize={pagination.pageSize}
            total={pagination.total}
            onPageSize={(pageSize) =>
              loadData({ page: 1, pageSize, tiers: selectedTiers, roles: selectedRoles, q: query })
            }
            buttonProps={{ variant: 'ghost' }}
          />
        </Pagination>
      ) : (
        <div className='bg-card text-muted-foreground rounded-lg border p-4'>
          <p>There are currently no public cards. Please check back later.</p>
        </div>
      )}
    </div>
  );
};
