import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  EllipsisVertical,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils/index';
import { DropdownMenuRadioGroup } from '@/components/ui/dropdown-menu';

type PaginationProps = React.ComponentProps<'nav'> & {
  currentPage: number;
  pages: number;
  onPage: (page: number) => void;
  buttonProps?: Omit<
    React.ComponentProps<typeof Button>,
    'disabled' | 'onClick'
  >;
};

export const Pagination: React.FC<PaginationProps> = ({
  className,
  currentPage,
  pages,
  onPage,
  buttonProps,
  children,
  ...props
}) => {
  return (
    <nav
      role='navigation'
      aria-label='pagination'
      className={cn('mx-auto my-4 flex w-full justify-center gap-1', className)}
      {...props}
    >
      <Button
        onClick={() => onPage(currentPage - 1)}
        disabled={currentPage <= 1}
        {...buttonProps}
      >
        <ChevronLeft />
        <span>Previous</span>
      </Button>
      {currentPage >= 3 && (
        <Button disabled {...buttonProps}>
          <Ellipsis />
        </Button>
      )}
      {currentPage >= 2 && (
        <Button onClick={() => onPage(currentPage - 1)} {...buttonProps}>
          {currentPage - 1}
        </Button>
      )}
      <Button disabled {...buttonProps}>
        {currentPage}
      </Button>
      {currentPage < pages - 1 && (
        <Button onClick={() => onPage(currentPage + 1)} {...buttonProps}>
          {currentPage + 1}
        </Button>
      )}
      {pages - currentPage >= 2 && (
        <Button disabled {...buttonProps}>
          <Ellipsis />
        </Button>
      )}
      {currentPage !== pages && (
        <Button onClick={() => onPage(pages)} {...buttonProps}>
          {pages}
        </Button>
      )}
      <Button
        onClick={() => onPage(currentPage + 1)}
        disabled={currentPage >= pages}
        {...buttonProps}
      >
        <span>Next</span>
        <ChevronRight />
      </Button>
      {children}
    </nav>
  );
};

type PaginationPageSizeDropdownProps = React.ComponentProps<
  typeof DropdownMenu
> & {
  buttonProps?: React.ComponentProps<typeof Button>;
  pageSizes?: number[];
  total: number;
  pageSize: number;
  onPageSize: (pageSize: number) => void;
};

export const PaginationPageSizeDropdown: React.FC<
  PaginationPageSizeDropdownProps
> = ({
  buttonProps,
  pageSizes = [5, 10, 25],
  total,
  pageSize,
  onPageSize,
  ...props
}) => {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button {...buttonProps}>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Total: {total}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Select Page Size</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={String(pageSize)}
          onValueChange={(v) => onPageSize(Number(v))}
        >
          {pageSizes.map((n) => (
            <DropdownMenuRadioItem key={n} value={String(n)}>
              {n}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
