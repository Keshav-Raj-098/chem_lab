import "server-only";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/token.utils";
import { TokenPayload } from "@/types/types";

export const ADMIN_COOKIE = "admin_token";
const ONE_HOUR_SECONDS = 60 * 60;

export async function setAdminCookie(token: string) {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_HOUR_SECONDS,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function getAdminSession(): Promise<TokenPayload | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function requireAdmin(): Promise<TokenPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
