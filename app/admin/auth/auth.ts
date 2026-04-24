"use server"
import { TokenPayload } from "@/types/types";
import { CreateToken } from "@/utils/token.utils";

type LoginData = {
    username: string;
    password: string;
}

type OutPut = {
    status : boolean
    message:string
    token?:string
}

export async function signin({ username, password }: LoginData): Promise<OutPut> {
    try {
        console.log(username,password)
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = CreateToken({ username, role: "admin" } as TokenPayload);
            return {status:true, message: "Login successful", token };
        }

        return {status:false, message: "Invalid credentials" };
    } catch (error) {
        console.error("Login error:", error);
        return {status:false, message: "Internal Server Error" };
    }

}