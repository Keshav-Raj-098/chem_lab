import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function getAlumniById(id:string) {
    try {
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

export async function updateAlumniById(id:string,name:string,body:string) {
    try {
        

        const updatedAlumni = await prisma.alumni.update({
            where: { id },
            data: {
                name: name,
                body: body,
            },
        });

        return NextResponse.json({ message: "Alumni updated successfully", alumni: updatedAlumni });
    } catch (error) {
        console.error("Error in alumni ID PUT route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function delteAlumnibyId(id:string) {
    try {
        await prisma.alumni.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Alumni deleted successfully" });
    } catch (error) {
        console.error("Error in alumni ID DELETE route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
