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
import { nav } from '@/lib/constants';
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
import { Collapsible } from '@radix-ui/react-collapsible';
import { CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Badge } from '../ui/badge';

const AppSidebarFooter = () => {
  const { isMobile } = useSidebar();
  const { data } = useSession();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isAuthed = mounted && !!data?.user;

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
          {isAuthed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size='lg'>
                  <Avatar className='size-8 rounded-lg'>
                    <AvatarImage src={data.user?.image ?? undefined} alt={data.user?.name || 'User'} />
                    <AvatarFallback className='uppercase'>
                      {data.user?.name?.charAt(0) ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>
                      {data.user?.name || ''}
                    </span>
                    <span className='text-muted-foreground truncate text-xs'>
                      {data.user?.email || ''}
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
                    <AvatarImage src={data.user?.image ?? undefined} alt={data.user?.name || 'User'} />
                      <AvatarFallback className='uppercase'>
                        {data.user?.name?.charAt(0) ?? '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-medium'>
                      {data.user?.name || ''}
                      </span>
                      <span className='text-muted-foreground truncate text-xs'>
                      {data.user?.email || ''}
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

const AppSidebarContent = () => {
  const pathname = usePathname();
  const { data } = useSession();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isAuthed = mounted && !!data?.user;
  return (
    <SidebarContent>
      {nav
        .filter(
          (category) =>
            !category.requireAuth || (category.requireAuth && isAuthed),
        )
        .map((category) => (
          <SidebarGroup key={category.name}>
            <SidebarMenu>
              <Collapsible defaultOpen className='group/collapsible'>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={category.children
                        ?.map((item) => item.url)
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
                    {category.children?.map((item) => (
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
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        ))}
    </SidebarContent>
  );
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {};

export const AppSidebar: React.FC<AppSidebarProps> = ({ ...props }) => {
  return (
    <Sidebar variant='inset' collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuButton size='lg' asChild>
            <Link href='/'>
              <Image
                src='/assets/images/dh-cgl-logo.png'
                alt='Brand'
                height={30}
                width={30}
              />
              <div className='flex flex-col gap-1 leading-none'>
                <span className='font-eveleth-clean'>Daggerheart Brews</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      <AppSidebarContent />
      <AppSidebarFooter />
    </Sidebar>
  );
};
