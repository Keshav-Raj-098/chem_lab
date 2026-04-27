"use server";
import { redirect } from "next/navigation";
import { TokenPayload, LoginSchema } from "@/types/types";
import { CreateToken } from "@/utils/token.utils";
import { setAdminCookie, clearAdminCookie } from "@/lib/admin/auth";

type LoginInput = {
  username: string;
  password: string;
};

type LoginResult = {
  status: boolean;
  message: string;
};

export async function signin(input: LoginInput): Promise<LoginResult> {
  try {
    const { username, password } = LoginSchema.parse(input);

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return { status: false, message: "Invalid credentials" };
    }

    const token = CreateToken({ username, role: "admin" } as TokenPayload);
    await setAdminCookie(token);
    return { status: true, message: "Login successful" };
  } catch (error) {
    console.error("Login error:", error);
    return { status: false, message: "Login failed" };
  }
}

export async function signout() {
  await clearAdminCookie();
  redirect("/admin/auth");
}
