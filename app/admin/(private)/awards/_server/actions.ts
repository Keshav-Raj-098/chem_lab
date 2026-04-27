"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { AwardType } from "@/lib/generated/prisma/enums";

const AwardInput = z.object({
  awardBody: z.string().min(1, "Body is required"),
  awardType: z.enum([AwardType.GROUP_LEADER, AwardType.GROUP_MEMBER]),
});

type ActionResult<T = void> =
  | ({ ok: true } & (T extends void ? {} : { data: T }))
  | { ok: false; error: string };

function revalidatePublicAwards() {
  revalidatePath("/awards/group-leader");
  revalidatePath("/awards/group-members");
}

export async function createAward(
  input: z.infer<typeof AwardInput>
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = AwardInput.parse(input);
    await prisma.awards.create({
      data: { body: data.awardBody, type: data.awardType },
    });
    revalidatePublicAwards();
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues[0]?.message ?? "Invalid input" };
    }
    console.error("createAward:", err);
    return { ok: false, error: "Failed to create award" };
  }
}

export async function updateAward(
  id: string,
  input: z.infer<typeof AwardInput>
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = AwardInput.parse(input);
    await prisma.awards.update({
      where: { id },
      data: { body: data.awardBody, type: data.awardType },
    });
    revalidatePublicAwards();
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues[0]?.message ?? "Invalid input" };
    }
    console.error("updateAward:", err);
    return { ok: false, error: "Failed to update award" };
  }
}

export async function deleteAward(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.awards.delete({ where: { id } });
    revalidatePublicAwards();
    return { ok: true };
  } catch (err) {
    console.error("deleteAward:", err);
    return { ok: false, error: "Failed to delete award" };
  }
}
