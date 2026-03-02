'use client';

import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type DisplayContainerProps = React.ComponentProps<'div'> & {
  menu: React.ReactNode;
  blur?: boolean;
};

export const DisplayContainer: React.FC<DisplayContainerProps> = ({
  children,
  menu,
  blur = false,
  className,
  ...props
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className={cn('group relative w-full', className)} {...props}>
      <div
        className={cn(
          blur && 'transition-[filter] duration-200 md:group-hover:blur-[2px]',
          blur && menuOpen && 'md:blur-[2px]',
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          'absolute top-2 right-2 z-50 transition-opacity duration-200',
          'opacity-100 md:opacity-0 md:group-hover:opacity-100',
          menuOpen && 'md:opacity-100',
        )}
      >
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon-sm'>
              <MoreHorizontal className='size-4' />
              <span className='sr-only'>Options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='border'>
            {menu}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
