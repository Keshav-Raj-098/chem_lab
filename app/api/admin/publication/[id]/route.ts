import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PublicationCategory } from "@/lib/generated/prisma/enums";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const publication = await prisma.publications.findUnique({
      where: { id },
    });

    if (!publication) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 });
    }

    return NextResponse.json(publication);
  } catch (error) {
    console.error("Error in publications ID route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body || !body.publicationBody || !body.publicationCategory) {
      return NextResponse.json({ error: "Publication body and category are required" }, { status: 400 });
    }

    const updatedPublication = await prisma.publications.update({
      where: { id },
      data: {
        body: body.publicationBody,
        category: body.publicationCategory as PublicationCategory,
        year: body.year || null,
      },
    });

    return NextResponse.json({ message: "Publication updated successfully", publication: updatedPublication });
  } catch (error) {
    console.error("Error in publications ID route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.publications.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Publication deleted successfully" });
  } catch (error) {
    console.error("Error in publications ID route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}