import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body || !body.title || !body.newsBody || !body.type) {
            return NextResponse.json({ error: "Title, body, and type are required" }, { status: 400 });
        }

        const news = await prisma.newsAndAnnouncements.create({
            data: {
                title: body.title,
                body: body.newsBody,
                type: body.type,
            }
        });

        return NextResponse.json({ message: "News created successfully", news }, { status: 201 });
    } catch (error) {
        console.error("Error in news route:", error);
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

        const [news, total] = await Promise.all([
            prisma.newsAndAnnouncements.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.newsAndAnnouncements.count(),
        ]);

        return NextResponse.json({
            news,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error in news route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
