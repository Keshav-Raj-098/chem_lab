import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PublicationCategory } from "@/lib/generated/prisma/enums";

export async function POST(req: NextRequest) {
    try {
        const req_body = await req.json();

        if (!req_body || !req_body.publicationBody || !req_body.publicationCategory) {
            return NextResponse.json({ error: "Invalid request body: body and category are required" }, { status: 400 });
        }

        console.log(req_body);
        

        const createPublication = await prisma.publications.create({
            data: {
                body: req_body.publicationBody,
                category: req_body.publicationCategory as PublicationCategory,
                year: req_body.year || null,
            }
        });
        return NextResponse.json({ message: "Publication created successfully", status: 201 });
    }
    catch (error) {
        console.error("Error in publications route:", error);
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

        const [publications, total] = await Promise.all([
            prisma.publications.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    updatedAt: "desc",
                },
            }),
            prisma.publications.count({ where }),
        ]);

        return NextResponse.json({
            publications,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error("Error in publications route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}