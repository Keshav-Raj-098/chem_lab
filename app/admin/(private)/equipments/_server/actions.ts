"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";

const EquipmentInput = z.object({
  name: z.string().min(1, "Name is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  installedOn: z.string().min(1, "Installed date is required"),
  category: z.string().min(1, "Category is required"),
});

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidatePublic() {
  revalidatePath("/research/facilities");
}

export async function createEquipment(
  input: z.infer<typeof EquipmentInput>
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = EquipmentInput.parse(input);
    await prisma.equipments.create({
      data: { ...data, installedOn: new Date(data.installedOn) },
    });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues[0]?.message ?? "Invalid input" };
    }
    console.error("createEquipment:", err);
    return { ok: false, error: "Failed to create equipment" };
  }
}

export async function updateEquipment(
  id: string,
  input: z.infer<typeof EquipmentInput>
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = EquipmentInput.parse(input);
    await prisma.equipments.update({
      where: { id },
      data: { ...data, installedOn: new Date(data.installedOn) },
    });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues[0]?.message ?? "Invalid input" };
    }
    console.error("updateEquipment:", err);
    return { ok: false, error: "Failed to update equipment" };
  }
}

export async function deleteEquipment(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.equipments.delete({ where: { id } });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    console.error("deleteEquipment:", err);
    return { ok: false, error: "Failed to delete equipment" };
  }
}
