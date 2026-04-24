import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const item = await prisma.gallery.findUnique({
            where: { id },
        });

        if (!item) {
            return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
        }
        return NextResponse.json(item);
    } catch (error) {
        console.error("Error in gallery ID route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const contentType = req.headers.get("content-type") || "";

        let title: string, description: string, imgUrl: string;
        let image: File | null = null;

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            title = formData.get("title") as string;
            description = (formData.get("description") as string) || "";
            image = formData.get("image") as File | null;
            imgUrl = (formData.get("imgUrl") as string) || "";

            if (image && typeof image !== "string" && image.size > 0) {
                if (image.size > 5 * 1024 * 1024) {
                    return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
                }
                imgUrl = await uploadToCloudinary(image, "gallery");
            }
        } else {
            const body = await req.json();
            title = body.title;
            description = body.description || "";
            imgUrl = body.imgUrl || "";
        }

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const updatedItem = await prisma.gallery.update({
            where: { id },
            data: {
                title,
                description,
                imgUrl,
            },
        });

        return NextResponse.json({ message: "Gallery item updated successfully", item: updatedItem });
    } catch (error) {
        console.error("Error in gallery ID PUT route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.gallery.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Gallery item deleted successfully" });
    } catch (error) {
        console.error("Error in gallery ID DELETE route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
