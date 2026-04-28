'use client';

import * as React from 'react';
import { Flame, TrendingUp, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type SortMode = 'hot' | 'new' | 'top';

type SortTabsProps = {
  value: SortMode;
  onChange: (value: SortMode) => void;
};

const tabs: { value: SortMode; label: string; icon: React.ElementType }[] = [
  { value: 'hot', label: 'Hot', icon: Flame },
  { value: 'new', label: 'New', icon: Clock },
  { value: 'top', label: 'Top', icon: TrendingUp },
];

export const SortTabs: React.FC<SortTabsProps> = ({ value, onChange }) => (
  <div className='flex gap-1'>
    {tabs.map((tab) => {
      const Icon = tab.icon;
      return (
        <Button
          key={tab.value}
          variant={value === tab.value ? 'secondary' : 'ghost'}
          size='sm'
          className={cn('gap-1.5', value === tab.value && 'font-medium')}
          onClick={() => onChange(tab.value)}
        >
          <Icon className='size-3.5' />
          {tab.label}
        </Button>
      );
    })}
  </div>
);
