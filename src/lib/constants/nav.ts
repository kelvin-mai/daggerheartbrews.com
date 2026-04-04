import type { NavCategory } from '@/lib/types';

export const adminNav: NavCategory[] = [
  {
    name: 'Overview',
    children: [{ name: 'Dashboard', url: '/admin' }],
  },
  {
    name: 'Data',
    children: [{ name: 'Users', url: '/admin/users' }],
  },
  {
    name: 'Email',
    children: [
      { name: 'Inbox', url: '/admin/inbox' },
      { name: 'Broadcast', url: '/admin/broadcast' },
      { name: 'Previews', url: '/admin/emails' },
    ],
  },
];

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
        name: 'Classes',
        url: '/reference/classes',
      },
      {
        type: 'divider',
      },
      {
        name: 'Ancestries',
        url: '/reference/ancestries',
      },
      {
        name: 'Communities',
        url: '/reference/communities',
      },
      {
        name: 'Equipment',
        url: '/reference/equipment',
      },
      {
        name: 'Beastforms',
        url: '/reference/beastforms',
      },
      {
        name: 'Transformations',
        url: '/reference/transformations',
      },
      { type: 'divider' as const },
      {
        name: 'Adversaries',
        url: '/reference/adversaries',
      },
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
      {
        name: 'Bookmarks',
        url: '/profile/bookmarks',
      },
      {
        name: 'Print',
        url: '/profile/print',
      },
    ],
  },
];
