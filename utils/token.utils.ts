import jwt from "jsonwebtoken";
import { TokenPayload } from "@/types/types";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "default_secret_key";


export function CreateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as TokenPayload;
        return decoded;
    } catch (error) {
        return null; 
    }
}