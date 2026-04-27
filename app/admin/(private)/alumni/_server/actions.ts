"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";

const AlumniInput = z.object({
  name: z.string().min(1, "Name is required"),
  body: z.string().min(1, "Body is required"),
});

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidatePublic() {
  revalidatePath("/people/alumni");
}

/**
  * Server actions for managing alumni entries in the admin interface.
  * Includes create, update, and delete operations with input validation and error handling.
  * All actions require admin authentication and will trigger revalidation of the public alumni page upon success.
 */
export async function createAlumni(
  input: z.infer<typeof AlumniInput>
): Promise<ActionResult> {
  
  try {
    await requireAdmin();
    const data = AlumniInput.parse(input);
    await prisma.alumni.create({ data });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues[0]?.message ?? "Invalid input" };
    }
    console.error("createAlumni:", err);
    return { ok: false, error: "Failed to create alumni" };
  }
}

export async function updateAlumni(
  id: string,
  input: z.infer<typeof AlumniInput>
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = AlumniInput.parse(input);
    await prisma.alumni.update({ where: { id }, data });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues[0]?.message ?? "Invalid input" };
    }
    console.error("updateAlumni:", err);
    return { ok: false, error: "Failed to update alumni" };
  }
}

export async function deleteAlumni(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.alumni.delete({ where: { id } });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    console.error("deleteAlumni:", err);
    return { ok: false, error: "Failed to delete alumni" };
  }
}
