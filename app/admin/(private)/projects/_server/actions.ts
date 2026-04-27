"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import {
  ResearchStatus,
  ResearchProjectType,
} from "@/lib/generated/prisma/enums";

const ProjectInput = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  fundingAgencies: z.string().optional().nullable(),
  investigators: z.string().optional().nullable(),
  contributors: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  status: z.enum([
    ResearchStatus.PLANNED,
    ResearchStatus.ONGOING,
    ResearchStatus.COMPLETED,
  ]),
  type: z.enum([
    ResearchProjectType.FUNDED,
    ResearchProjectType.NON_FUNDED,
  ]),
  amntFunded: z.string().optional().nullable(),
  completedOn: z.string().optional().nullable(),
});

export type ProjectInputType = z.infer<typeof ProjectInput>;

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidatePublic() {
  revalidatePath("/research");
  revalidatePath("/research/projects");
}

function toData(input: ProjectInputType) {
  return {
    title: input.title,
    description: input.description,
    fundingAgencies: input.fundingAgencies || null,
    investigators: input.investigators || null,
    contributors: input.contributors || null,
    duration: input.duration || null,
    status: input.status,
    type: input.type,
    amntFunded: input.amntFunded || null,
    completedOn: input.completedOn ? new Date(input.completedOn) : null,
  };
}

export async function createProject(
  input: ProjectInputType
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = ProjectInput.parse(input);
    await prisma.researchProjects.create({ data: toData(data) });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues[0]?.message ?? "Invalid input" };
    }
    console.error("createProject:", err);
    return { ok: false, error: "Failed to create project" };
  }
}

export async function updateProject(
  id: string,
  input: ProjectInputType
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = ProjectInput.parse(input);
    await prisma.researchProjects.update({
      where: { id },
      data: toData(data),
    });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues[0]?.message ?? "Invalid input" };
    }
    console.error("updateProject:", err);
    return { ok: false, error: "Failed to update project" };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.researchProjects.delete({ where: { id } });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    console.error("deleteProject:", err);
    return { ok: false, error: "Failed to delete project" };
  }
}
