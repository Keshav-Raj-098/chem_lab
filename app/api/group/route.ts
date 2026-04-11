import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        let page = parseInt(searchParams.get("page") || "1");
        let limit = parseInt(searchParams.get("limit") || "12"); // Default 12 for grid layout
        const category = searchParams.get("category");

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 12;

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
                    name: "asc", // Public view usually sorted by name
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
        console.error("Error in public group members route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
