"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";

export type ResearchAreaRow = {
  id: string;
  name: string;
  body: string;
  imgUrl: string | null;
  createdAt: string;
};

export type ListResearchAreasResult = {
  data: ResearchAreaRow[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

function serialize(r: {
  id: string;
  name: string;
  body: string;
  imgUrl: string | null;
  createdAt: Date;
}): ResearchAreaRow {
  return {
    id: r.id,
    name: r.name,
    body: r.body,
    imgUrl: r.imgUrl,
    createdAt: r.createdAt.toISOString(),
  };
}

export async function listResearchAreas(
  params: { page?: number; limit?: number } = {}
): Promise<ListResearchAreasResult> {
  await requireAdmin();
  let page = params.page ?? 1;
  let limit = params.limit ?? 10;
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 10;
  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    prisma.researchAreas.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.researchAreas.count(),
  ]);

  return {
    data: rows.map(serialize),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getResearchArea(
  id: string
): Promise<ResearchAreaRow | null> {
  await requireAdmin();
  const r = await prisma.researchAreas.findUnique({ where: { id } });
  return r ? serialize(r) : null;
}
