import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const project = await prisma.researchProjects.findUnique({
            where: { id },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error("Error in project ID GET:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (!body || !body.title || !body.description || !body.body) {
            return NextResponse.json({ error: "Title, description, and body are required" }, { status: 400 });
        }

        const updatedProject = await prisma.researchProjects.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                body: body.body,
                mainImg: body.mainImg,
                imgs: body.imgs,
                links: body.links,
                fundingAgencies: body.fundingAgencies,
                investigators: body.investigators,
                contributors: body.contributors,
                duration: body.duration,
                status: body.status,
                amntFunded: body.amntFunded ? parseFloat(body.amntFunded) : null,
                completedOn: body.completedOn ? new Date(body.completedOn) : null,
            },
        });

        return NextResponse.json({ message: "Project updated successfully", project: updatedProject });
    } catch (error) {
        console.error("Error in project ID PUT:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.researchProjects.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error in project ID DELETE:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
