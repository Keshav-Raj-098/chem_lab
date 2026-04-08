import { NextRequest, NextResponse, } from "next/server";
import { verifyToken } from "@/utils/token.utils";


export function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization");

        if (!authHeader) {
            return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return NextResponse.json({ error: "Missing token" }, { status: 401 });
        }

        const payload = verifyToken(token);


        if (!payload || payload.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ message: "Welcome to the admin dashboard!", user: payload });

    } catch (error) {
        console.error("Error in admin route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}