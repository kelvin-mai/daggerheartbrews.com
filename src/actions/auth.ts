'use server';

import { z } from 'zod';

import type { ActionState } from '@/lib/types';
import { auth } from '@/lib/auth';

const authSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters'),
});

const loginSchema = authSchema;

const registerSchema = authSchema
  .extend({
    name: z.string().min(1),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export const login = async (
  _: ActionState<typeof loginSchema>,
  formData: FormData,
): Promise<ActionState<typeof loginSchema>> => {
  const validation = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!validation.success) {
    return {
      errors: { validation: validation.error.flatten().fieldErrors },
      success: false,
    };
  } else {
    try {
      await auth.api.signInEmail({
        body: {
          email: validation.data.email,
          password: validation.data.password,
        },
      });

      return {
        success: true,
      };
    } catch (e) {
      return {
        errors: { action: (e as Error).message },
        success: false,
      };
    }
  }
};

export const register = async (
  _: ActionState<typeof registerSchema>,
  formData: FormData,
): Promise<ActionState<typeof registerSchema>> => {
  const validation = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
  });
  if (!validation.success) {
    return {
      errors: { validation: validation.error.flatten().fieldErrors },
      success: false,
    };
  } else {
    try {
      await auth.api.signUpEmail({
        body: {
          name: validation.data.name,
          email: validation.data.email,
          password: validation.data.password,
        },
      });
      return {
        success: true,
      };
    } catch (e) {
      return {
        errors: { action: (e as Error).message },
        success: false,
      };
    }
  }
};
