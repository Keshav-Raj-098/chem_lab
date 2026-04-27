"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";

export type AlumniRow = {
  id: string;
  name: string;
  body: string;
  createdAt: string;
};

export type ListAlumniResult = {
  data: AlumniRow[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export async function listAlumni(
  params: { page?: number; limit?: number } = {}
): Promise<ListAlumniResult> {
  await requireAdmin();
  let page = params.page ?? 1;
  let limit = params.limit ?? 10;
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 10;
  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    prisma.alumni.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.alumni.count(),
  ]);

  return {
    data: rows.map((r) => ({
      id: r.id,
      name: r.name,
      body: r.body,
      createdAt: r.createdAt.toISOString(),
    })),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}
