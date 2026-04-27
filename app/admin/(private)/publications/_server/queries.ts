"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { PublicationCategory } from "@/lib/generated/prisma/enums";

export type PublicationRow = {
  id: string;
  body: string;
  category: PublicationCategory;
  year: number | null;
  updatedAt: string;
};

export type ListPublicationsResult = {
  data: PublicationRow[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export async function listPublications(
  params: { page?: number; limit?: number; category?: PublicationCategory | null } = {}
): Promise<ListPublicationsResult> {
  await requireAdmin();
  let page = params.page ?? 1;
  let limit = params.limit ?? 10;
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 10;
  const skip = (page - 1) * limit;
  const where = params.category ? { category: params.category } : {};

  const [rows, total] = await Promise.all([
    prisma.publications.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.publications.count({ where }),
  ]);

  return {
    data: rows.map((r) => ({
      id: r.id,
      body: r.body,
      category: r.category,
      year: r.year,
      updatedAt: r.updatedAt.toISOString(),
    })),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}
