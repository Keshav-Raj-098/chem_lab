import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const news = await prisma.newsAndAnnouncements.findUnique({
            where: { id },
        });

        if (!news) {
            return NextResponse.json({ error: "News item not found" }, { status: 404 });
        }

        return NextResponse.json(news);
    } catch (error) {
        console.error("Error in news ID route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (!body || !body.title || !body.newsBody || !body.type) {
            return NextResponse.json({ error: "Title, body, and type are required" }, { status: 400 });
        }

        const updatedNews = await prisma.newsAndAnnouncements.update({
            where: { id },
            data: {
                title: body.title,
                body: body.newsBody,
                type: body.type,
            },
        });

        return NextResponse.json({ message: "News updated successfully", news: updatedNews });
    } catch (error) {
        console.error("Error in news ID route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.newsAndAnnouncements.delete({
            where: { id },
        });

        return NextResponse.json({ message: "News deleted successfully" });
    } catch (error) {
        console.error("Error in news ID route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
