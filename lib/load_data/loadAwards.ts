import { prisma } from "@/lib/prisma";
import { AwardType } from "@/lib/generated/prisma/enums";
import { unstable_cache } from 'next/cache';

export const fetchAwardsAction = unstable_cache(
  async ({
    type,
    page = 1,
    pageSize = 10,
  }: {
    type?: AwardType;
    page?: number;
    pageSize?: number;
  }) => {
    try {
      const skip = (page - 1) * pageSize;
      
      const where = type ? { type } : {};

      const [awards, total] = await Promise.all([
        prisma.awards.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: pageSize,
        }),
        prisma.awards.count({ where }),
      ]);

      return {
        success: true,
        data: awards,
        total,
        hasMore: total > skip + awards.length,
      };
    } catch (error) {
      console.error("Error fetching awards:", error);
      return { success: false, error: "Failed to fetch awards" };
    }
  },
  ['public-awards'],
  { revalidate: 3600, tags: ['awards'] }
);
