"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { NewsAndAnnouncementsType } from "@/lib/generated/prisma/enums";

export type NewsRow = {
  id: string;
  title: string;
  body: string;
  type: NewsAndAnnouncementsType;
  createdAt: string;
};

export type ListNewsParams = {
  page?: number;
  limit?: number;
};

export type ListNewsResult = {
  data: NewsRow[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export async function listNews(
  params: ListNewsParams = {}
): Promise<ListNewsResult> {
  await requireAdmin();

  let page = params.page ?? 1;
  let limit = params.limit ?? 10;
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 10;

  const skip = (page - 1) * limit;

  const [news, total] = await Promise.all([
    prisma.newsAndAnnouncements.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.newsAndAnnouncements.count(),
  ]);

  return {
    data: news.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      type: n.type,
      createdAt: n.createdAt.toISOString(),
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
