import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body || !body.name || !body.body) {
            return NextResponse.json({ error: "Name and body are required" }, { status: 400 });
        }

        const alumni = await prisma.alumni.create({
            data: {
                name: body.name,
                body: body.body,
            }
        });

        return NextResponse.json({ message: "Alumni created successfully", alumni }, { status: 201 });
    } catch (error) {
        console.error("Error in alumni route:", error);
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

        const [alumni, total] = await Promise.all([
            prisma.alumni.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.alumni.count(),
        ]);

        return NextResponse.json({
            alumni,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error in alumni GET route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
