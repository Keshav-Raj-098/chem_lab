import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const award = await prisma.awards.findUnique({
      where: { id },
    });

    if (!award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }

    return NextResponse.json(award);
  } catch (error) {
    console.error("Error in awards ID route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body || !body.awardBody || !body.awardType) {
      return NextResponse.json({ error: "Award body and type are required" }, { status: 400 });
    }


    const updatedAward = await prisma.awards.update({
      where: { id },
      data: {
        body: body.awardBody,
        type: body.awardType,
      },
    });

    return NextResponse.json({ message: "Award updated successfully", award: updatedAward });
  } catch (error) {
    console.error("Error in awards ID route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.awards.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Award deleted successfully" });
  } catch (error) {
    console.error("Error in awards ID route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
