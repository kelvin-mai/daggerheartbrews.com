'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq, inArray, sql } from 'drizzle-orm';

import type { ActionState, ExportResolution } from '@/lib/types';
import { db } from '@/lib/database';
import {
  users,
  userSettings,
  userCards,
  userAdversaries,
  cardPreviews,
  adversaryPreviews,
  verification,
} from '@/lib/database/schema';
import { auth } from '@/lib/auth';
import { syncAudienceContact } from '@/lib/email';

const profileSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

export const updateProfile = async (
  _: ActionState<typeof profileSchema>,
  formData: FormData,
): Promise<ActionState<typeof profileSchema>> => {
  const validation = profileSchema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
  });
  if (!validation.success) {
    return {
      errors: { validation: validation.error.flatten().fieldErrors },
      success: false,
    };
  } else {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (validation.data.email !== session?.user.email) {
        throw new Error('Unauthorized');
      }
      await db
        .update(users)
        .set({ name: validation.data.name, updatedAt: sql`now()` })
        .where(eq(users.email, validation.data.email));
      revalidatePath('/profile');
      return { success: true };
    } catch (e) {
      return {
        errors: { action: (e as Error).message },
        success: false,
      };
    }
  }
};

export const updatePublicByDefault = async (
  defaultVisibility: boolean,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error('Unauthorized');
    await db
      .update(userSettings)
      .set({ defaultVisibility, updatedAt: sql`now()` })
      .where(eq(userSettings.userId, session.user.id));
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const updateExportResolution = async (
  resolution: ExportResolution,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error('Unauthorized');
    await db
      .update(userSettings)
      .set({ defaultExportResolution: resolution, updatedAt: sql`now()` })
      .where(eq(userSettings.userId, session.user.id));
    revalidatePath('/profile');
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const updateEmailPreference = async (
  emailUpdates: boolean,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error('Unauthorized');
    await syncAudienceContact({
      email: session.user.email,
      unsubscribed: !emailUpdates,
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const deleteAccount = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: 'Unauthorized' };

    await db.transaction(async (tx) => {
      const cardPreviewRows = await tx
        .select({ id: userCards.cardPreviewId })
        .from(userCards)
        .where(eq(userCards.userId, session.user.id));

      const adversaryPreviewRows = await tx
        .select({ id: userAdversaries.adversaryPreviewId })
        .from(userAdversaries)
        .where(eq(userAdversaries.userId, session.user.id));

      if (cardPreviewRows.length > 0) {
        await tx.delete(cardPreviews).where(
          inArray(
            cardPreviews.id,
            cardPreviewRows.map((r) => r.id),
          ),
        );
      }

      if (adversaryPreviewRows.length > 0) {
        await tx.delete(adversaryPreviews).where(
          inArray(
            adversaryPreviews.id,
            adversaryPreviewRows.map((r) => r.id),
          ),
        );
      }

      await tx
        .delete(verification)
        .where(eq(verification.identifier, session.user.email));

      await tx.delete(users).where(eq(users.id, session.user.id));
    });

    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};
