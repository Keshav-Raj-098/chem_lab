import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const body = formData.get("body") as string;
        const image = formData.get("image") as File | null;

        if (!name || !body) {
            return NextResponse.json({ error: "Name and body are required" }, { status: 400 });
        }

        let imgUrl = "";
        if (image && image.size > 0) {
            imgUrl = await uploadToCloudinary(image, "research-areas");
        }

        const area = await prisma.researchAreas.create({
            data: {
                name,
                body,
                imgUrl: imgUrl || null,
            }
        });

        return NextResponse.json({ message: "Research area created successfully", area }, { status: 201 });
    } catch (error) {
        console.error("Error in research areas route:", error);
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

        const [researchAreas, total] = await Promise.all([
            prisma.researchAreas.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.researchAreas.count(),
        ]);

        return NextResponse.json({
            researchAreas,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error in research areas GET route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
