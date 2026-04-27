"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { NewsAndAnnouncementsType } from "@/lib/generated/prisma/enums";

const NewsInput = z.object({
  title: z.string().min(1, "Title is required"),
  newsBody: z.string().min(1, "Body is required"),
  type: z.enum([
    NewsAndAnnouncementsType.Event,
    NewsAndAnnouncementsType.Vacancy,
  ]),
});

type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidatePublicNews() {
  revalidatePath("/news/events");
  revalidatePath("/news/vaccancy");
}

export async function createNews(
  input: z.infer<typeof NewsInput>
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = NewsInput.parse(input);
    await prisma.newsAndAnnouncements.create({
      data: { title: data.title, body: data.newsBody, type: data.type },
    });
    revalidatePublicNews();
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues[0]?.message ?? "Invalid input" };
    }
    console.error("createNews:", err);
    return { ok: false, error: "Failed to create news item" };
  }
}

export async function updateNews(
  id: string,
  input: z.infer<typeof NewsInput>
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = NewsInput.parse(input);
    await prisma.newsAndAnnouncements.update({
      where: { id },
      data: { title: data.title, body: data.newsBody, type: data.type },
    });
    revalidatePublicNews();
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues[0]?.message ?? "Invalid input" };
    }
    console.error("updateNews:", err);
    return { ok: false, error: "Failed to update news item" };
  }
}

export async function deleteNews(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.newsAndAnnouncements.delete({ where: { id } });
    revalidatePublicNews();
    return { ok: true };
  } catch (err) {
    console.error("deleteNews:", err);
    return { ok: false, error: "Failed to delete news item" };
  }
}
