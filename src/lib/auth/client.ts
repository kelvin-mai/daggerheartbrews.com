import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

import type { auth } from '@/lib/auth';

const {
  signIn,
  signOut,
  useSession,
  sendVerificationEmail,
  forgetPassword,
  resetPassword,
} = createAuthClient({
  baseURL: 'http://localhost:3000',
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const logout = signOut;

export {
  useSession,
  signIn,
  sendVerificationEmail,
  forgetPassword,
  resetPassword,
};
