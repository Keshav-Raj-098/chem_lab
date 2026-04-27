"use client";
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/sideBar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [, setPageTitle] = useState("Dashboard");

  return (
    <SidebarProvider>
      <AppSidebar setPageTitle={setPageTitle} />
      <main className="flex-1 overflow-auto bg-gray-50/50">
        <div>{children}</div>
      </main>
    </SidebarProvider>
  );
}
