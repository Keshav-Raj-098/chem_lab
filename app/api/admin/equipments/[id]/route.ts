import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const equipment = await prisma.equipments.findUnique({
            where: { id },
        });

        if (!equipment) {
            return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
        }

        return NextResponse.json(equipment);
    } catch (error) {
        console.error("Error in equipment ID route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (!body || !body.name || !body.manufacturer || !body.model || !body.serialNumber || !body.installedOn || !body.category) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const updatedEquipment = await prisma.equipments.update({
            where: { id },
            data: {
                name: body.name,
                manufacturer: body.manufacturer,
                model: body.model,
                serialNumber: body.serialNumber,
                installedOn: new Date(body.installedOn),
                category: body.category,
            },
        });

        return NextResponse.json({ message: "Equipment updated successfully", equipment: updatedEquipment });
    } catch (error) {
        console.error("Error in equipment ID route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.equipments.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Equipment deleted successfully" });
    } catch (error) {
        console.error("Error in equipment ID route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
