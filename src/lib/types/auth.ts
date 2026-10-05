import type { User as BetterAuthUser } from 'better-auth';

export type User = BetterAuthUser;

export type PublicAuthor = Pick<User, 'id' | 'name' | 'image'>;
