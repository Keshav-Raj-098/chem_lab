import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const area = await prisma.researchAreas.findUnique({
            where: { id },
        });

        if (!area) {
            return NextResponse.json({ error: "Research area not found" }, { status: 404 });
        }

        return NextResponse.json(area);
    } catch (error) {
        console.error("Error in research area ID route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const body = formData.get("body") as string;
        const image = formData.get("image") as File | null;
        let existingImgUrl = formData.get("imgUrl") as string || "";

        if (!name || !body) {
            return NextResponse.json({ error: "Name and body are required" }, { status: 400 });
        }

        let imgUrl = existingImgUrl;
        if (image && image.size > 0 && typeof image !== 'string') {
            imgUrl = await uploadToCloudinary(image, "research-areas");
        }

        const updatedAt = new Date();

        const updatedArea = await prisma.researchAreas.update({
            where: { id },
            data: {
                name,
                body,
                imgUrl,
                updatedAt,
            },
        });

        return NextResponse.json({ message: "Research area updated successfully", area: updatedArea });
    } catch (error) {
        console.error("Error in research area ID PUT route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.researchAreas.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Research area deleted successfully" });
    } catch (error) {
        console.error("Error in research area ID DELETE route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
