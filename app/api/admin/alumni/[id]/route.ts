import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const alumni = await prisma.alumni.findUnique({
            where: { id },
        });

        if (!alumni) {
            return NextResponse.json({ error: "Alumni record not found" }, { status: 404 });
        }

        return NextResponse.json(alumni);
    } catch (error) {
        console.error("Error in alumni ID route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (!body || !body.name || !body.body) {
            return NextResponse.json({ error: "Name and body are required" }, { status: 400 });
        }

        const updatedAlumni = await prisma.alumni.update({
            where: { id },
            data: {
                name: body.name,
                body: body.body,
            },
        });

        return NextResponse.json({ message: "Alumni updated successfully", alumni: updatedAlumni });
    } catch (error) {
        console.error("Error in alumni ID PUT route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.alumni.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Alumni deleted successfully" });
    } catch (error) {
        console.error("Error in alumni ID DELETE route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
