import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // 1. Fetch group member details
        const member = await prisma.groupMembers.findUnique({
            where: { id },
        });

        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }

        // 2. Generate varied description templates
        const researchText = member.researchAreas ? member.researchAreas.replace(/<[^>]*>?/gm, '').trim() : "";
        
        const templates = [
            `Served as ${member.designation || 'a group member'}${researchText ? ` specializing in ${researchText}` : ''}.`,
            `Designated as ${member.designation || 'a group member'}${researchText ? `, focused on exploration in the field of ${researchText}` : ''}.`,
            `Contributed as ${member.designation || 'a group member'}${researchText ? ` to the group's efforts in ${researchText}` : ''}.`,
            `Worked as ${member.designation || 'a member'} of the research group${researchText ? `, primarily investigating ${researchText}` : ''}.`,
            `${member.name} was ${member.designation ? `a ${member.designation}` : 'a member'}${researchText ? ` and focused their research on ${researchText}` : ' of the group'}.`,
            `During their tenure as ${member.designation || 'a researcher'}${researchText ? `, they explored various aspects of ${researchText}` : ''}.`,
            `${member.name} played a key role as ${member.designation || 'a group member'}${researchText ? `, particularly in ${researchText}` : ''}.`
        ];

        const description = templates[Math.floor(Math.random() * templates.length)];

        // 3. Start Transaction
        await prisma.$transaction(async (tx) => {
            // Create Alumni entry
            await tx.alumni.create({
                data: {
                    name: member.name,
                    body: description,
                },
            });

            // Delete Group Member
            await tx.groupMembers.delete({
                where: { id },
            });
        });

        // 4. Delete image from Cloudinary if exists (outside transaction as it's external service)
        if (member.profileImgUrl && !member.profileImgUrl.startsWith("http")) {
            await deleteFromCloudinary(member.profileImgUrl);
        }

        return NextResponse.json({ message: "Member moved to alumni successfully" });
    } catch (error) {
        console.error("Error moving member to alumni:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
