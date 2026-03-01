'use server';

import { z } from 'zod';

import type { ActionState } from '@/lib/types';
import { sendContactEmail } from '@/lib/email';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Enter a valid email address.'),
  subject: z.string().min(1, 'Subject is required.'),
  message: z.string().min(1, 'Message is required.'),
});

export const submitContact = async (
  params: z.infer<typeof contactSchema>,
): Promise<ActionState<typeof contactSchema>> => {
  const validation = contactSchema.safeParse(params);
  if (!validation.success) {
    return {
      success: false,
      errors: { validation: validation.error.flatten().fieldErrors },
    };
  }
  try {
    const { error } = await sendContactEmail(validation.data);
    if (error) {
      return { success: false, errors: { action: error.message } };
    }
    return { success: true };
  } catch (e) {
    return { success: false, errors: { action: (e as Error).message } };
  }
};
