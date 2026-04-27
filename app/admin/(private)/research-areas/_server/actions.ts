"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidatePublic() {
  revalidatePath("/research");
  revalidatePath("/research/areas");
}

function readFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  if (value instanceof File && value.size > 0) return value;
  return null;
}

export async function createResearchArea(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const name = (formData.get("name") as string | null)?.trim() ?? "";
    const body = (formData.get("body") as string | null) ?? "";
    const image = readFile(formData, "image");

    if (!name || !body) return { ok: false, error: "Name and body are required" };

    let imgUrl: string | null = null;
    if (image) {
      if (image.size > MAX_IMAGE_BYTES)
        return { ok: false, error: "File size exceeds 5MB limit" };
      imgUrl = await uploadToCloudinary(image, "research-areas");
    }

    await prisma.researchAreas.create({
      data: { name, body, imgUrl },
    });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    console.error("createResearchArea:", err);
    return { ok: false, error: "Failed to create research area" };
  }
}

export async function updateResearchArea(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const name = (formData.get("name") as string | null)?.trim() ?? "";
    const body = (formData.get("body") as string | null) ?? "";
    const existingImgUrl = (formData.get("imgUrl") as string | null) ?? "";
    const image = readFile(formData, "image");

    if (!name || !body) return { ok: false, error: "Name and body are required" };

    let imgUrl: string | null = existingImgUrl || null;
    if (image) {
      if (image.size > MAX_IMAGE_BYTES)
        return { ok: false, error: "File size exceeds 5MB limit" };
      imgUrl = await uploadToCloudinary(image, "research-areas");
    }

    await prisma.researchAreas.update({
      where: { id },
      data: { name, body, imgUrl },
    });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    console.error("updateResearchArea:", err);
    return { ok: false, error: "Failed to update research area" };
  }
}

export async function deleteResearchArea(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.researchAreas.delete({ where: { id } });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    console.error("deleteResearchArea:", err);
    return { ok: false, error: "Failed to delete research area" };
  }
}
