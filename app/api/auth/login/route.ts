import { NextResponse, NextRequest } from "next/server";
import { LoginData, LoginSchema } from "@/types/types";
import { TokenPayload } from "@/types/types";
import { CreateToken } from "@/utils/token.utils";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, password }: LoginData = LoginSchema.parse(body);

        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = CreateToken({ username, role: "admin" } as TokenPayload);
            return NextResponse.json({ message: "Login successful", token });
        }

        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}