"use client";

import React, { useState } from "react";
import AdminResearchAreasTable from "./_components/AdminResearchAreasTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ResearchAreasPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Areas</h1>
          <p className="text-muted-foreground">
            Manage the primary research areas and specializations of the group.
          </p>
        </div>
        <Link href="/admin/research-areas/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Research Area
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-card">
        <AdminResearchAreasTable 
          refreshTrigger={refreshTrigger} 
          setRefreshTrigger={setRefreshTrigger} 
        />
      </div>
    </div>
  );
}

