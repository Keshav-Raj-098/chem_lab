import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body || !body.title || !body.description || !body.body) {
            return NextResponse.json({ error: "Title, description, and body are required" }, { status: 400 });
        }

        const project = await prisma.researchProjects.create({
            data: {
                title: body.title,
                description: body.description,
                body: body.body,
                mainImg: body.mainImg || "",
                imgs: body.imgs || [],
                links: body.links || [],
                fundingAgencies: body.fundingAgencies || [],
                investigators: body.investigators || [],
                contributors: body.contributors || [],
                duration: body.duration,
                status: body.status || "PLANNED",
                amntFunded: body.amntFunded ? parseFloat(body.amntFunded) : null,
                completedOn: body.completedOn ? new Date(body.completedOn) : null,
            }
        });

        return NextResponse.json({ message: "Project created successfully", project }, { status: 201 });
    } catch (error) {
        console.error("Error in research projects POST:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        let page = parseInt(searchParams.get("page") || "1");
        let limit = parseInt(searchParams.get("limit") || "10");
        const status = searchParams.get("status");

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const [projects, total] = await Promise.all([
            prisma.researchProjects.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.researchProjects.count({ where }),
        ]);

        return NextResponse.json({
            projects,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error in research projects GET:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
