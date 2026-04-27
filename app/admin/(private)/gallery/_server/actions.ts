"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidatePublic() {
  revalidatePath("/gallery");
}

function readFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  if (value instanceof File && value.size > 0) return value;
  return null;
}

export async function createGallery(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const title = (formData.get("title") as string | null)?.trim() ?? "";
    const description = (formData.get("description") as string | null) ?? "";
    const image = readFile(formData, "image");

    if (!title) return { ok: false, error: "Title is required" };
    if (!image) return { ok: false, error: "Image is required" };
    if (image.size > MAX_IMAGE_BYTES)
      return { ok: false, error: "File size exceeds 5MB limit" };

    const imgUrl = await uploadToCloudinary(image, "gallery");

    await prisma.gallery.create({
      data: { title, description, imgUrl },
    });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    console.error("createGallery:", err);
    return { ok: false, error: "Failed to create gallery item" };
  }
}

export async function updateGallery(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const title = (formData.get("title") as string | null)?.trim() ?? "";
    const description = (formData.get("description") as string | null) ?? "";
    const existingImgUrl = (formData.get("imgUrl") as string | null) ?? "";
    const image = readFile(formData, "image");

    if (!title) return { ok: false, error: "Title is required" };

    let imgUrl = existingImgUrl;
    if (image) {
      if (image.size > MAX_IMAGE_BYTES)
        return { ok: false, error: "File size exceeds 5MB limit" };
      imgUrl = await uploadToCloudinary(image, "gallery");
    }

    await prisma.gallery.update({
      where: { id },
      data: { title, description, imgUrl },
    });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    console.error("updateGallery:", err);
    return { ok: false, error: "Failed to update gallery item" };
  }
}

export async function deleteGallery(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.gallery.delete({ where: { id } });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    console.error("deleteGallery:", err);
    return { ok: false, error: "Failed to delete gallery item" };
  }
}
