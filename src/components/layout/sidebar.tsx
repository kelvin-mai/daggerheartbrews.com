'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
  CircleUser,
  LogIn,
  LogOut,
  MoreVertical,
} from 'lucide-react';
import { toast } from 'sonner';

import { useSession, logout } from '@/lib/auth/client';
import { adminNav, nav } from '@/lib/constants';
import type { NavCategory } from '@/lib/types';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from '../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Collapsible } from '@/components/ui/collapsible';
import { CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Badge } from '../ui/badge';

const AppSidebarFooter = () => {
  const { isMobile } = useSidebar();
  const { data } = useSession();

  const handleLogout = async () => {
    await logout({
      fetchOptions: {
        onError: (ctx) => {
          toast(ctx.error.message);
        },
        onSuccess: () => {
          toast('You have been logged out. See you soon!');
        },
      },
    });
  };

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          {data?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size='lg'>
                  <Avatar className='size-8 rounded-lg'>
                    <AvatarImage
                      src={data.user.image ?? undefined}
                      alt={data.user.name}
                    />
                    <AvatarFallback className='uppercase'>
                      {data.user.name.charAt(0) ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>
                      {data.user.name}
                    </span>
                    <span className='text-muted-foreground truncate text-xs'>
                      {data.user.email}
                    </span>
                  </div>
                  <MoreVertical className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                side={isMobile ? 'bottom' : 'right'}
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel>
                  <div className='flex items-center gap-2'>
                    <Avatar className='size-8 rounded-lg'>
                      <AvatarImage
                        src={data.user.image ?? undefined}
                        alt={data.user.name}
                      />
                      <AvatarFallback className='uppercase'>
                        {data.user.name.charAt(0) ?? '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-medium'>
                        {data.user.name}
                      </span>
                      <span className='text-muted-foreground truncate text-xs'>
                        {data.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/profile' className='flex items-center gap-2'>
                    <CircleUser />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SidebarMenuButton asChild>
              <Link href='/login' className='font-semibold'>
                <LogIn />
                Login
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

const NavContent = ({ categories }: { categories: NavCategory[] }) => {
  const pathname = usePathname();
  return (
    <SidebarContent>
      {categories.map((category) => (
        <SidebarGroup key={category.name}>
          <SidebarMenu>
            <Collapsible defaultOpen className='group/collapsible'>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={category.children
                      ?.filter((item) => item.type !== 'divider')
                      .map((item) => item.url)
                      .includes(pathname)}
                  >
                    {category.name}
                    {category.badge && (
                      <Badge className='capitalize'>{category.badge}</Badge>
                    )}
                    <ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {category.children?.map((item, index) =>
                    item.type === 'divider' ? (
                      <SidebarSeparator key={index} className='mx-0 my-1' />
                    ) : (
                      <SidebarMenuSubItem key={item.name}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === item.url}
                        >
                          <Link href={item.url}>
                            {item.name}
                            {item.badge && (
                              <Badge className='capitalize'>{item.badge}</Badge>
                            )}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ),
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
};

const AppSidebarContent = () => {
  const { data } = useSession();
  const filtered = nav.filter(
    (category) => !category.requireAuth || (category.requireAuth && data?.user),
  );
  return <NavContent categories={filtered} />;
};

const AdminSidebarContent = () => <NavContent categories={adminNav} />;

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  admin?: boolean;
};

export const AppSidebar: React.FC<AppSidebarProps> = ({ admin, ...props }) => {
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuButton size='lg' asChild>
            <Link href={admin ? '/admin' : '/'}>
              <Image
                src='/assets/images/dh-cgl-logo.png'
                alt='Brand'
                height={30}
                width={30}
              />
              <div className='flex flex-col gap-1 leading-none'>
                <span className='font-eveleth-clean'>Daggerheart Brews</span>
                {admin && (
                  <span className='text-muted-foreground text-xs'>Admin</span>
                )}
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      {admin ? <AdminSidebarContent /> : <AppSidebarContent />}
      <AppSidebarFooter />
    </Sidebar>
  );
};
