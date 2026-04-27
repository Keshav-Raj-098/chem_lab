"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { GroupCategory } from "@/lib/generated/prisma/enums";

export type GroupMemberRow = {
  id: string;
  name: string;
  email: string;
  researchAreas: string;
  designation: string | null;
  category: GroupCategory;
  profileImgUrl: string | null;
  profileLink: string | null;
  phoneNumber: string | null;
  createdAt: string;
};

export type ListGroupResult = {
  data: GroupMemberRow[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

function serialize(m: {
  id: string;
  name: string;
  email: string;
  researchAreas: string | null;
  designation: string | null;
  category: GroupCategory;
  profileImgUrl: string | null;
  profileLink: string | null;
  phoneNumber: string | null;
  createdAt: Date;
}): GroupMemberRow {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    researchAreas: m.researchAreas ?? "",
    designation: m.designation,
    category: m.category,
    profileImgUrl: m.profileImgUrl,
    profileLink: m.profileLink,
    phoneNumber: m.phoneNumber,
    createdAt: m.createdAt.toISOString(),
  };
}

export async function listGroupMembers(
  params: { page?: number; limit?: number; category?: string | null } = {}
): Promise<ListGroupResult> {
  await requireAdmin();
  let page = params.page ?? 1;
  let limit = params.limit ?? 10;
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 10;
  const skip = (page - 1) * limit;

  const where =
    params.category && params.category !== "all"
      ? { category: params.category as GroupCategory }
      : {};

  const [rows, total] = await Promise.all([
    prisma.groupMembers.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.groupMembers.count({ where }),
  ]);

  return {
    data: rows.map(serialize),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getGroupMember(
  id: string
): Promise<GroupMemberRow | null> {
  await requireAdmin();
  const m = await prisma.groupMembers.findUnique({ where: { id } });
  return m ? serialize(m) : null;
}
