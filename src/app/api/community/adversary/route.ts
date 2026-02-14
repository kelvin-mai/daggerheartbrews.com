import {
  and,
  desc,
  count,
  eq,
  inArray,
  notInArray,
  or,
  ne,
  ilike,
  type SQL,
} from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';

import { db } from '@/lib/database';
import {
  adversaryPreviews,
  userAdversaries,
  users,
} from '@/lib/database/schema';
import { formatAPIError } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page')
      ? Number(searchParams.get('page'))
      : 1;
    const pageSize = searchParams.get('page-size')
      ? Number(searchParams.get('page-size'))
      : 10;
    const tierParam = searchParams.get('tier');
    const roleParam = searchParams.get('role');
    const nameParam = searchParams.get('q');
    const tiers = tierParam
      ? tierParam
          .split(',')
          .map((t) => Number(t.trim()))
          .filter((n) => !Number.isNaN(n))
      : [];

    const baseFilter = eq(userAdversaries.public, true);
    const tierFilter = tiers.length
      ? inArray(adversaryPreviews.tier, tiers)
      : undefined;
    const predefinedRoles = [
      'bruiser',
      'horde',
      'leader',
      'minion',
      'ranged',
      'skulk',
      'social',
      'solo',
      'standard',
      'support',
    ];
    const roles = roleParam
      ? roleParam
          .split(',')
          .map((r) => r.trim().toLowerCase())
          .filter(Boolean)
      : [];
    const includeAll = roles.includes('all');
    const includeCustom = roles.includes('custom');
    const explicitRoles = roles.filter((r) => r !== 'all' && r !== 'custom');

    let roleFilter:
      | ReturnType<typeof inArray<typeof adversaryPreviews.subtype>>
      | ReturnType<typeof and>
      | ReturnType<typeof or>
      | undefined;
    if (!includeAll && (explicitRoles.length > 0 || includeCustom)) {
      const roleConditions = [] as Array<
        | ReturnType<typeof inArray<typeof adversaryPreviews.subtype>>
        | ReturnType<typeof and>
      >;
      if (explicitRoles.length > 0) {
        roleConditions.push(inArray(adversaryPreviews.subtype, explicitRoles));
      }
      if (includeCustom) {
        roleConditions.push(
          and(
            notInArray(adversaryPreviews.subtype, predefinedRoles),
            ne(adversaryPreviews.subtype, ''),
          ),
        );
      }
      roleFilter =
        roleConditions.length === 1 ? roleConditions[0] : or(...roleConditions);
    }

    const composedFilters = [baseFilter] as SQL<unknown>[];
    if (tierFilter) composedFilters.push(tierFilter);
    if (roleFilter) composedFilters.push(roleFilter);
    if (nameParam) composedFilters.push(ilike(adversaryPreviews.name, `%${nameParam}%`));
    const whereFilter =
      composedFilters.length === 1 ? baseFilter : and(...composedFilters);

    const [result] = await db
      .select({ count: count() })
      .from(userAdversaries)
      .leftJoin(
        adversaryPreviews,
        eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id),
      )
      .where(whereFilter);
    const meta = { page, pageSize, total: result.count };

    const data = await db
      .select()
      .from(userAdversaries)
      .leftJoin(users, eq(userAdversaries.userId, users.id))
      .leftJoin(
        adversaryPreviews,
        eq(userAdversaries.adversaryPreviewId, adversaryPreviews.id),
      )
      .where(whereFilter)
      .orderBy(desc(userAdversaries.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize);
    return NextResponse.json(
      {
        success: true,
        data: data.map((d) => ({
          userAdversary: d.user_adversaries,
          adversaryPreview: d.adversary_previews,
          user: d.users,
        })),
        meta,
      },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, error: formatAPIError(e) },
      {
        status: 500,
      },
    );
  }
}
