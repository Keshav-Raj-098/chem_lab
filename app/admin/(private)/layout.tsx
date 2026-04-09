"use client"
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/sideBar";


export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar setPageTitle={setPageTitle} />
      <main className="flex-1 overflow-auto bg-gray-50/50">
        <div >
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}