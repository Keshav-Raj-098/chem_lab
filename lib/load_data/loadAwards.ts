import { prisma } from "@/lib/prisma";
import { AwardType } from "@/lib/generated/prisma/enums";

export async function fetchAwardsAction({
  type,
  page = 1,
  pageSize = 10,
}: {
  type?: AwardType;
  page?: number;
  pageSize?: number;
}) {
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
}
