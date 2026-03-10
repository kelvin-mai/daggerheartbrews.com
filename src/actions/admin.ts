'use server';

import { count } from 'drizzle-orm';

import { adminDb as db } from '@/lib/database/admin';
import { users } from '@/lib/database/schema';

const PAGE_SIZE = 20;

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
};

export type GetUsersResult = {
  data: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export const getUsers = async (page: number = 1): Promise<GetUsersResult> => {
  const offset = (page - 1) * PAGE_SIZE;

  const [rows, [{ value: total }]] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        image: users.image,
        createdAt: users.createdAt,
      })
      .from(users)
      .limit(PAGE_SIZE)
      .offset(offset),
    db.select({ value: count() }).from(users),
  ]);

  return {
    data: rows,
    total,
    page,
    pageSize: PAGE_SIZE,
    pageCount: Math.ceil(total / PAGE_SIZE),
  };
};
