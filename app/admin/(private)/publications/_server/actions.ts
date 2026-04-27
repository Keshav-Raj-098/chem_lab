"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { PublicationCategory } from "@/lib/generated/prisma/enums";

const PublicationInput = z.object({
  publicationBody: z.string().min(1, "Body is required"),
  publicationCategory: z.enum(
    Object.values(PublicationCategory) as [string, ...string[]]
  ),
  year: z.number().int().nullable().optional(),
});

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidatePublic() {
  revalidatePath("/publications");
}

export async function createPublication(
  input: z.infer<typeof PublicationInput>
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = PublicationInput.parse(input);
    await prisma.publications.create({
      data: {
        body: data.publicationBody,
        category: data.publicationCategory as PublicationCategory,
        year: data.year ?? null,
      },
    });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues[0]?.message ?? "Invalid input" };
    }
    console.error("createPublication:", err);
    return { ok: false, error: "Failed to create publication" };
  }
}

export async function updatePublication(
  id: string,
  input: z.infer<typeof PublicationInput>
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = PublicationInput.parse(input);
    await prisma.publications.update({
      where: { id },
      data: {
        body: data.publicationBody,
        category: data.publicationCategory as PublicationCategory,
        year: data.year ?? null,
      },
    });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues[0]?.message ?? "Invalid input" };
    }
    console.error("updatePublication:", err);
    return { ok: false, error: "Failed to update publication" };
  }
}

export async function deletePublication(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.publications.delete({ where: { id } });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    console.error("deletePublication:", err);
    return { ok: false, error: "Failed to delete publication" };
  }
}
