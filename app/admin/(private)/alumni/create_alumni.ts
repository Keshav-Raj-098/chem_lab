"use server"
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function CreateNewAlumni(name:string,body:string) {
    try {
        
        const alumni = await prisma.alumni.create({
            data: {name,body}
        });

        return NextResponse.json({ message: "Alumni created successfully", alumni }, { status: 201 });
    } catch (error) {
        console.error("Error in alumni route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
