import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAdminSession } from "@/lib/admin/auth";
import AdminShell from "./_components/AdminShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/auth");

  return <AdminShell>{children}</AdminShell>;
}
