export type NavItem = {
  type?: never;
  name: string;
  badge?: string;
  url: string;
};

export type NavDivider = {
  type: 'divider';
};

export type NavChild = NavItem | NavDivider;

export type NavCategory = {
  name: string;
  badge?: string;
  requireAuth?: boolean;
  children?: NavChild[];
};
