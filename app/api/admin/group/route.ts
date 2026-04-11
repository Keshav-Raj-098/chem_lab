import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import  {GroupCategory} from "@/lib/generated/prisma/enums"
import { uploadToCloudinary } from "@/lib/cloudinary";
import { log } from "console";


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        console.log("Received form data:", formData);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const category = formData.get("category") as GroupCategory;
        const designation = formData.get("designation") as string;
        const profileLink = formData.get("profileLink") as string;
        const researchAreasStr = formData.get("researchAreas") as string;
        const researchAreas = researchAreasStr ? JSON.parse(researchAreasStr) : [];
        const image = formData.get("image") as File | null;
        let profileImgUrl = formData.get("profileImgUrl") as string || "";

        if (!name || !email || !category) {
            return NextResponse.json({ error: "Name, Email, and Category are required" }, { status: 400 });
        }

        // Only upload to Cloudinary if a file was provided.
        // If image is null, it will use the profileImgUrl string from the URL input.
        if (image && typeof image !== "string" && image.size > 0) {
            profileImgUrl = await uploadToCloudinary(image,"group-members");
        }

        const member = await prisma.groupMembers.create({
            data: {
                name,
                email,
                researchAreas,
                designation,
                category,
                profileImgUrl,
                profileLink,
            }
        });

        return NextResponse.json({ message: "Group member added successfully", member }, { status: 201 });
    } catch (error: any) {
        console.error("Error in group member route:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        let page = parseInt(searchParams.get("page") || "1");
        let limit = parseInt(searchParams.get("limit") || "10");
        const category = searchParams.get("category");

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const skip = (page - 1) * limit;

        const where: any = {};
        if (category && category !== "all") {
            where.category = category;
        }

        const [members, total] = await Promise.all([
            prisma.groupMembers.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.groupMembers.count({ where }),
        ]);

        return NextResponse.json({
            members,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error in group member route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
