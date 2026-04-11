import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const member = await prisma.groupMembers.findUnique({
            where: { id },
        });

        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }

        return NextResponse.json(member);
    } catch (error) {
        console.error("Error in group member ID route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const contentType = req.headers.get("content-type") || "";
        
        let name, email, category, designation, profileLink, researchAreas, image, profileImgUrl;

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            name = formData.get("name") as string;
            email = formData.get("email") as string;
            category = formData.get("category") as string;
            designation = formData.get("designation") as string;
            profileLink = formData.get("profileLink") as string;
            const researchAreasStr = formData.get("researchAreas") as string;
            researchAreas = researchAreasStr ? JSON.parse(researchAreasStr) : [];
            image = formData.get("image") as File | null;
            profileImgUrl = formData.get("profileImgUrl") as string || "";

            // Only upload to Cloudinary if a file was provided and has size.
            if (image && typeof image !== "string" && image.size > 0) {
                profileImgUrl = await uploadToCloudinary(image, "group-members");
            }
        } else {
            // Fallback for JSON requests if any
            const body = await req.json();
            name = body.name;
            email = body.email;
            category = body.category;
            designation = body.designation;
            profileLink = body.profileLink;
            researchAreas = body.researchAreas || [];
            profileImgUrl = body.profileImgUrl;
        }

        if (!name || !email || !category) {
            return NextResponse.json({ 
                error: `Required fields missing: ${!name ? 'Name ' : ''}${!email ? 'Email ' : ''}${!category ? 'Category' : ''}` 
            }, { status: 400 });
        }

        const updatedMember = await prisma.groupMembers.update({
            where: { id },
            data: {
                name,
                email,
                researchAreas,
                designation,
                category,
                profileImgUrl,
                profileLink,
            },
        });

        return NextResponse.json({ message: "Group member updated successfully", member: updatedMember });
    } catch (error: any) {
        console.error("Error in group member ID route:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.groupMembers.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Group member deleted successfully" });
    } catch (error) {
        console.error("Error in group member ID route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
