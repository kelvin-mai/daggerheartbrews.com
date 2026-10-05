import 'server-only';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { env } from '@/lib/env';

export const isDevelopment = (): boolean =>
  process.env.NODE_ENV === 'development';

export const isAdmin = async (): Promise<boolean> => {
  if (!isDevelopment()) return false;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !env.ADMIN_USER_EMAIL) return false;
  return session.user.email === env.ADMIN_USER_EMAIL;
};
