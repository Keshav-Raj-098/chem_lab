"use client";

import React, { useState } from "react";
import CreateAlumni from "./_components/CreateAlumni";
import AdminAlumniTable from "./_components/AdminAlumniTable";

export default function AlumniAdminPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alumni Management</h1>
          <p className="text-muted-foreground">
            Manage the group's alumni records and their details.
          </p>
        </div>
        <CreateAlumni onSuccess={handleSuccess} />
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <AdminAlumniTable 
          refreshTrigger={refreshTrigger} 
          setRefreshTrigger={setRefreshTrigger} 
        />
      </div>
    </div>
  );
}
