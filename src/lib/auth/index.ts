import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

import { sendResetPasswordEmail, sendVerificationEmail } from '@/lib/email';
import { env } from '@/lib/env';
import { db } from '@/lib/database';
import * as schemas from '@/lib/database/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schemas.users,
      session: schemas.sessions,
      account: schemas.accounts,
      verification: schemas.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({ user, url: url.toString() });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }) => {
      const link = new URL(url);
      link.searchParams.set('callbackURL', '/profile');
      await sendVerificationEmail({ user, url: link.toString() });
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
    reddit: {
      clientId: env.REDDIT_CLIENT_ID,
      clientSecret: env.REDDIT_CLIENT_SECRET,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [nextCookies()],
});
