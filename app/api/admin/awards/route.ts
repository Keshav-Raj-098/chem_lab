import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ca } from "zod/v4/locales";
import { stat } from "fs";
import DOMPurify from "isomorphic-dompurify";

export async function POST(req: NextRequest) {
    try {
        const req_body = await req.json();

        console.log("Received request body:", req_body);

        if (!req_body || !req_body.awardBody || !req_body.awardType) {
            return NextResponse.json({ error: "Invalid request body: body and type are required" }, { status: 400 });
        }

        const sanitizedBody = DOMPurify.sanitize(req_body.awardBody);

        const createAward = await prisma.awards.create({
            data: {
                body: sanitizedBody,
                type: req_body.awardType,
            }
        });
        return NextResponse.json({ message: "Award created successfully", status: 201 });
    }
    catch (error) {
        console.error("Error in awards route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 },);
    }
}




export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        
        let page = parseInt(searchParams.get("page") || "1");
        let limit = parseInt(searchParams.get("limit") || "10");

        // Handle NaN or invalid numbers
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const skip = (page - 1) * limit;

        const [awards, total] = await Promise.all([
            prisma.awards.findMany({
                skip,
                take: limit,
                orderBy: {
                    updatedAt: "desc",
                },
            }),
            prisma.awards.count(),
        ]);

        return NextResponse.json({
            awards,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error("Error in awards route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}