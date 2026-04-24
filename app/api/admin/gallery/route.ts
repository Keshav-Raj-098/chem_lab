import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = (formData.get("description") as string) || "";
        const image = formData.get("image") as File | null;

        if (!title || !image || typeof image === "string" || image.size === 0) {
            return NextResponse.json({ error: "Title and image are required" }, { status: 400 });
        }

        if (image.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
        }

        const imgUrl = await uploadToCloudinary(image, "gallery");

        const item = await prisma.gallery.create({
            data: {
                title,
                description,
                imgUrl,
            },
        });

        return NextResponse.json({ message: "Gallery item created successfully", item }, { status: 201 });
    } catch (error) {
        console.error("Error in gallery POST route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        let page = parseInt(searchParams.get("page") || "1");
        let limit = parseInt(searchParams.get("limit") || "10");

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const skip = (page - 1) * limit;

        const [gallery, total] = await Promise.all([
            prisma.gallery.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.gallery.count(),
        ]);

        return NextResponse.json({
            gallery,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error in gallery GET route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
