import type { NavCategory } from '@/lib/types';

export const nav: NavCategory[] = [
  {
    name: 'Community',
    children: [
      {
        name: 'Cards',
        url: '/community/cards',
      },
      {
        name: 'Adversaries',
        url: '/community/adversaries',
      },
    ],
  },
  {
    name: 'Create',
    children: [
      {
        name: 'Card',
        url: '/card/create',
      },
      {
        name: 'Adversary',
        url: '/adversary/create',
      },
    ],
  },
  {
    name: 'Game Tools',
    children: [
      {
        name: 'GM Screen',
        url: '/game-master/screen',
      },
    ],
  },
  {
    name: 'Reference',
    children: [
      {
        name: 'Ancestries',
        url: '/reference/ancestries',
      },
      {
        name: 'Communities',
        url: '/reference/communities',
      },
      {
        name: 'Classes',
        url: '/reference/classes',
      },
      {
        name: 'Beastforms',
        url: '/reference/beastforms',
      },
      { type: 'divider' as const },
      {
        name: 'Environments',
        url: '/reference/environments',
      },
    ],
  },
  {
    name: 'Profile',
    requireAuth: true,
    children: [
      {
        name: 'Settings',
        url: '/profile',
      },
      {
        name: 'Homebrew',
        url: '/profile/homebrew',
      },
    ],
  },
];
