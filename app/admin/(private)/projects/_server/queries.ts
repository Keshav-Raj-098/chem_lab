"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import {
  ResearchStatus,
  ResearchProjectType,
} from "@/lib/generated/prisma/enums";

export type ProjectRow = {
  id: string;
  title: string;
  description: string | null;
  fundingAgencies: string | null;
  investigators: string | null;
  contributors: string | null;
  duration: string | null;
  status: ResearchStatus;
  type: ResearchProjectType;
  amntFunded: string | null;
  completedOn: string | null;
};

export type ListProjectsResult = {
  data: ProjectRow[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

function serialize(p: {
  id: string;
  title: string;
  description: string | null;
  fundingAgencies: string | null;
  investigators: string | null;
  contributors: string | null;
  duration: string | null;
  status: ResearchStatus;
  type: ResearchProjectType;
  amntFunded: string | null;
  completedOn: Date | null;
}): ProjectRow {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    fundingAgencies: p.fundingAgencies,
    investigators: p.investigators,
    contributors: p.contributors,
    duration: p.duration,
    status: p.status,
    type: p.type,
    amntFunded: p.amntFunded,
    completedOn: p.completedOn ? p.completedOn.toISOString() : null,
  };
}

export async function listProjects(
  params: { page?: number; limit?: number; status?: ResearchStatus | null } = {}
): Promise<ListProjectsResult> {
  await requireAdmin();
  let page = params.page ?? 1;
  let limit = params.limit ?? 10;
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 10;
  const skip = (page - 1) * limit;
  const where = params.status ? { status: params.status } : {};

  const [rows, total] = await Promise.all([
    prisma.researchProjects.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.researchProjects.count({ where }),
  ]);

  return {
    data: rows.map(serialize),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  await requireAdmin();
  const p = await prisma.researchProjects.findUnique({ where: { id } });
  return p ? serialize(p) : null;
}
