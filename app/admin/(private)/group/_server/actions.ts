"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { GroupCategory } from "@/lib/generated/prisma/enums";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidatePublic() {
  revalidatePath("/people/team");
  revalidatePath("/people/alumni");
}

function readFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  if (value instanceof File && value.size > 0) return value;
  return null;
}

function getString(formData: FormData, key: string): string {
  return ((formData.get(key) as string | null) ?? "").trim();
}

export async function createGroupMember(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const name = getString(formData, "name");
    const email = getString(formData, "email");
    const category = getString(formData, "category") as GroupCategory;
    const designation = getString(formData, "designation");
    const phoneNumber = getString(formData, "phoneNumber");
    const profileLink = getString(formData, "profileLink");
    const researchAreas = (formData.get("researchAreas") as string | null) ?? "";
    let profileImgUrl = getString(formData, "profileImgUrl");
    const image = readFile(formData, "image");

    if (!name || !email || !category) {
      return { ok: false, error: "Name, Email, and Category are required" };
    }

    if (image) {
      if (image.size > MAX_IMAGE_BYTES)
        return { ok: false, error: "File size exceeds 5MB limit" };
      profileImgUrl = await uploadToCloudinary(image, "members");
    }

    await prisma.groupMembers.create({
      data: {
        name,
        email,
        researchAreas,
        designation,
        category,
        profileImgUrl,
        profileLink,
        phoneNumber,
      },
    });
    revalidatePublic();
    return { ok: true };
  } catch (err: any) {
    if (err?.code === "P2002") {
      return { ok: false, error: "Email already exists" };
    }
    console.error("createGroupMember:", err);
    return { ok: false, error: "Failed to add group member" };
  }
}

export async function updateGroupMember(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const name = getString(formData, "name");
    const email = getString(formData, "email");
    const category = getString(formData, "category") as GroupCategory;
    const designation = getString(formData, "designation");
    const phoneNumber = getString(formData, "phoneNumber");
    const profileLink = getString(formData, "profileLink");
    const researchAreas = (formData.get("researchAreas") as string | null) ?? "";
    let profileImgUrl = getString(formData, "profileImgUrl");
    const image = readFile(formData, "image");

    if (!name || !email || !category) {
      return {
        ok: false,
        error: `Required fields missing: ${!name ? "Name " : ""}${
          !email ? "Email " : ""
        }${!category ? "Category" : ""}`.trim(),
      };
    }

    if (image) {
      if (image.size > MAX_IMAGE_BYTES)
        return { ok: false, error: "File size exceeds 5MB limit" };
      profileImgUrl = await uploadToCloudinary(image, "group-members");
    }

    await prisma.groupMembers.update({
      where: { id },
      data: {
        name,
        email,
        researchAreas,
        designation,
        category,
        profileImgUrl,
        profileLink,
        phoneNumber,
      },
    });
    revalidatePublic();
    return { ok: true };
  } catch (err: any) {
    if (err?.code === "P2002") {
      return { ok: false, error: "Email already exists" };
    }
    console.error("updateGroupMember:", err);
    return { ok: false, error: "Failed to update group member" };
  }
}

export async function deleteGroupMember(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.groupMembers.delete({ where: { id } });
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    console.error("deleteGroupMember:", err);
    return { ok: false, error: "Failed to delete group member" };
  }
}

export async function moveMemberToAlumni(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    const member = await prisma.groupMembers.findUnique({ where: { id } });
    if (!member) return { ok: false, error: "Member not found" };

    const researchText = member.researchAreas
      ? member.researchAreas.replace(/<[^>]*>?/gm, "").trim()
      : "";

    const templates = [
      `Served as ${member.designation || "a group member"}${
        researchText ? ` specializing in ${researchText}` : ""
      }.`,
      `Designated as ${member.designation || "a group member"}${
        researchText
          ? `, focused on exploration in the field of ${researchText}`
          : ""
      }.`,
      `Contributed as ${member.designation || "a group member"}${
        researchText ? ` to the group's efforts in ${researchText}` : ""
      }.`,
      `Worked as ${member.designation || "a member"} of the research group${
        researchText ? `, primarily investigating ${researchText}` : ""
      }.`,
      `${member.name} was ${
        member.designation ? `a ${member.designation}` : "a member"
      }${
        researchText
          ? ` and focused their research on ${researchText}`
          : " of the group"
      }.`,
      `During their tenure as ${member.designation || "a researcher"}${
        researchText ? `, they explored various aspects of ${researchText}` : ""
      }.`,
      `${member.name} played a key role as ${
        member.designation || "a group member"
      }${researchText ? `, particularly in ${researchText}` : ""}.`,
    ];

    const description = templates[Math.floor(Math.random() * templates.length)];

    await prisma.$transaction(async (tx) => {
      await tx.alumni.create({ data: { name: member.name, body: description } });
      await tx.groupMembers.delete({ where: { id } });
    });

    if (member.profileImgUrl && !member.profileImgUrl.startsWith("http")) {
      await deleteFromCloudinary(member.profileImgUrl);
    }

    revalidatePublic();
    return { ok: true };
  } catch (err) {
    console.error("moveMemberToAlumni:", err);
    return { ok: false, error: "Failed to move member to alumni" };
  }
}
