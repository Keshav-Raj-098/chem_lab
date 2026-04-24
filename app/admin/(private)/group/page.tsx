"use client";

import React, { useState } from "react";
import AdminGroupTable from "./_components/AdminGroupTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const GroupAdminPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between sticky top-0 bg-white z-10 px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Group Members Management</h1>
          <p className="text-sm text-muted-foreground">Manage your research group members, their roles and research areas.</p>
        </div>
        <Link href="/admin/group/createMember">
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm gap-2">
            <Plus className="h-4 w-4" /> Add Group Member
          </Button>
        </Link>
      </header>
      <div className="p-6 bg-gray-50 flex-1 overflow-auto min-h-[calc(100vh-89px)]">
        <AdminGroupTable refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />
      </div>
    </div>
  );
};

export default GroupAdminPage;
