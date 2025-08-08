// API route for importing cards via CSV files
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Papa from 'papaparse';

import { auth } from '@/lib/auth';
import { formatAPIError } from '@/lib/utils';
import type { CardDetails, CardType } from '@/lib/types';
import { insertCard } from '@/actions/user-items';

// Fields that need to be converted to numbers
const numericFields = [
  'level',
  'stress',
  'evasion',
  'tier',
  'hands',
  'armor',
] as const satisfies (keyof CardDetails)[];

// Boolean toggles
const booleanFields = [
  'thresholdsEnabled',
  'tierEnabled',
  'handsEnabled',
  'armorEnabled',
] as const satisfies (keyof CardDetails)[];

// Simple string fields
const stringFields = [
  'image',
  'text',
  'artist',
  'credits',
  'subtype',
  'subtitle',
  'domainPrimary',
  'domainPrimaryColor',
  'domainPrimaryIcon',
  'domainSecondary',
  'domainSecondaryColor',
  'domainSecondaryIcon',
] as const satisfies (keyof CardDetails)[];

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    const inserted: unknown[] = [];
    const errors: { file: string; row: number; error: string }[] = [];

    for (const value of form.values()) {
      if (!(value instanceof File)) continue;
      const file = value as File;
      const type = file.name.replace(/\.csv$/i, '').toLowerCase();
      const text = await file.text();
      const parsed = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsed.errors.length) {
        errors.push({
          file: file.name,
          row: 0,
          error: parsed.errors.map((e) => e.message).join('; '),
        });
        continue;
      }

      for (let i = 0; i < parsed.data.length; i++) {
        const row = parsed.data[i];
        const name = row.name?.trim();
        if (!name) {
          errors.push({ file: file.name, row: i + 1, error: 'Missing required field "name"' });
          continue;
        }

        const card: CardDetails = {
          name,
          type: type as CardType,
        };

        const cardRecord = card as Record<string, unknown>;

        for (const key of stringFields) {
          const val = row[key];
          if (val) {
            cardRecord[key] = val;
          }
        }

        for (const key of numericFields) {
          const val = row[key];
          if (val !== undefined && val !== '') {
            const num = Number(val);
            if (!Number.isNaN(num)) {
              cardRecord[key] = num;
            }
          }
        }

        for (const key of booleanFields) {
          const val = row[key];
          if (val !== undefined && val !== '') {
            cardRecord[key] = val === 'true' || val === '1';
          }
        }

        if (row.thresholds) {
          const parts = String(row.thresholds)
            .split(/[;,]/)
            .map((n) => Number(n.trim()))
            .filter((n) => !Number.isNaN(n));
          if (parts.length === 2) {
            card.thresholds = [parts[0], parts[1]];
          } else {
            errors.push({ file: file.name, row: i + 1, error: 'Invalid thresholds' });
            continue;
          }
        }

        try {
          const result = await insertCard({ body: { card }, session });
          inserted.push(result);
        } catch (e) {
          errors.push({
            file: file.name,
            row: i + 1,
            error: e instanceof Error ? e.message : 'Unknown error',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: { inserted, errors },
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: formatAPIError(e) },
      {
        status: 500,
      },
    );
  }
}

