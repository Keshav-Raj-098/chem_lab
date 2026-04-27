"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { AwardType } from "@/lib/generated/prisma/enums";

export type AwardRow = {
  id: string;
  body: string;
  type: AwardType;
  updatedAt: string;
};

export type ListAwardsParams = {
  page?: number;
  limit?: number;
  type?: AwardType | null;
};

export type ListAwardsResult = {
  data: AwardRow[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export async function listAwards(
  params: ListAwardsParams = {}
): Promise<ListAwardsResult> {
  await requireAdmin();

  let page = params.page ?? 1;
  let limit = params.limit ?? 10;
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 10;

  const where = params.type ? { type: params.type } : {};
  const skip = (page - 1) * limit;

  const [awards, total] = await Promise.all([
    prisma.awards.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.awards.count({ where }),
  ]);

  return {
    data: awards.map((a) => ({
      id: a.id,
      body: a.body,
      type: a.type,
      updatedAt: a.updatedAt.toISOString(),
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
