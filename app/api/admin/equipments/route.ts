import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body || !body.name || !body.manufacturer || !body.model || !body.serialNumber || !body.installedOn || !body.category) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const equipment = await prisma.equipments.create({
            data: {
                name: body.name,
                manufacturer: body.manufacturer,
                model: body.model,
                serialNumber: body.serialNumber,
                installedOn: new Date(body.installedOn),
                category: body.category,
            }
        });

        return NextResponse.json({ message: "Equipment created successfully", equipment }, { status: 201 });
    } catch (error) {
        console.error("Error in equipments route:", error);
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
        if (category) {
            where.category = category;
        }

        const [equipments, total] = await Promise.all([
            prisma.equipments.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.equipments.count({ where }),
        ]);

        return NextResponse.json({
            equipments,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error in equipments route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
