"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from 'next/cache';

export const fetchAlumniAction = unstable_cache(
  async ({
    page = 1,
    pageSize = 10,
  }: {
    page?: number;
    pageSize?: number;
  }) => {
    try {
      const skip = (page - 1) * pageSize;
      
      const [alumni, total] = await Promise.all([
        prisma.alumni.findMany({
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: pageSize,
        }),
        prisma.alumni.count(),
      ]);

      return {
        success: true,
        data: alumni,
        total,
        hasMore: total > skip + alumni.length,
      };
    } catch (error) {
      console.error("Error fetching alumni:", error);
      return { success: false, error: "Failed to fetch alumni" };
    }
  },
  ['public-alumni'],
  { revalidate: 3600, tags: ['alumni'] }
);
