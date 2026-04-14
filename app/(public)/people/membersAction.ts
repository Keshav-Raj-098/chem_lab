'use server';

import { prisma } from '@/lib/prisma';
import { GroupCategory } from '@/lib/generated/prisma/enums';
import { unstable_cache } from 'next/cache';

const MEMBERS_PER_SECTION = 15;

export const fetchMembersByCategory = unstable_cache(
  async (category: GroupCategory, page: number = 1) => {
    try {
      const skip = (page - 1) * MEMBERS_PER_SECTION;

      const [members, total] = await Promise.all([
        prisma.groupMembers.findMany({
          where: { category },
          skip,
          take: MEMBERS_PER_SECTION,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.groupMembers.count({ where: { category } }),
      ]);

      return {
        success: true,
        data: members.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          researchAreas: m.researchAreas || '',
          designation: m.designation,
          category: m.category,
          profileImgUrl: m.profileImgUrl,
          profileLink: m.profileLink,
          phoneNumber: m.phoneNumber,
        })),
        meta: {
          total,
          page,
          limit: MEMBERS_PER_SECTION,
          totalPages: Math.ceil(total / MEMBERS_PER_SECTION),
        },
      };
    } catch (error) {
      console.error('Error fetching members:', error);
      return {
        success: false,
        data: [],
        meta: { total: 0, page: 1, limit: MEMBERS_PER_SECTION, totalPages: 0 },
        error: 'Failed to fetch members',
      };
    }
  },
  ['members-by-category'],
  { revalidate: 3600, tags: ['members'] }
);
