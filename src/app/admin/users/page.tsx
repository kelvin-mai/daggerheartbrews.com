'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';

import { getUsers } from '@/actions/admin';
import { Pagination } from '@/components/common';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function UsersPage() {
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page],
    queryFn: () => getUsers(page),
    placeholderData: (prev) => prev,
  });

  return (
    <div className='py-6'>
      <h1 className='mb-4 text-xl font-semibold'>Users</h1>
      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && !data ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-muted-foreground py-8 text-center'
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar className='size-7 rounded-md'>
                        <AvatarImage
                          src={user.image ?? undefined}
                          alt={user.name}
                        />
                        <AvatarFallback className='rounded-md uppercase'>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className='font-medium'>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.emailVerified ? 'default' : 'secondary'}
                    >
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        className='justify-end'
        currentPage={page}
        pages={data?.pageCount ?? 1}
        onPage={setPage}
        buttonProps={{ variant: 'ghost' }}
      />
    </div>
  );
}
