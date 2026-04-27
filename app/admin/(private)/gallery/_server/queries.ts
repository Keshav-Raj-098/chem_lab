"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";

export type GalleryRow = {
  id: string;
  title: string;
  description: string;
  imgUrl: string;
  createdAt: string;
};

export type ListGalleryResult = {
  data: GalleryRow[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export async function listGallery(
  params: { page?: number; limit?: number } = {}
): Promise<ListGalleryResult> {
  await requireAdmin();
  let page = params.page ?? 1;
  let limit = params.limit ?? 10;
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 10;
  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    prisma.gallery.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.gallery.count(),
  ]);

  return {
    data: rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      imgUrl: r.imgUrl,
      createdAt: r.createdAt.toISOString(),
    })),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}
