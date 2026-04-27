"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";

export type EquipmentRow = {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  installedOn: string;
  category: string;
};

export type ListEquipmentsResult = {
  data: EquipmentRow[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export async function listEquipments(
  params: { page?: number; limit?: number; category?: string | null } = {}
): Promise<ListEquipmentsResult> {
  await requireAdmin();
  let page = params.page ?? 1;
  let limit = params.limit ?? 10;
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 10;
  const skip = (page - 1) * limit;
  const where = params.category ? { category: params.category } : {};

  const [rows, total] = await Promise.all([
    prisma.equipments.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.equipments.count({ where }),
  ]);

  return {
    data: rows.map((r) => ({
      id: r.id,
      name: r.name,
      manufacturer: r.manufacturer,
      model: r.model,
      serialNumber: r.serialNumber,
      installedOn: r.installedOn.toISOString(),
      category: r.category,
    })),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}
