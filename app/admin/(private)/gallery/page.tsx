"use client";

import { useState } from "react";
import CreateGallery from "./_components/CreateGallery";
import AdminGalleryTable from "./_components/AdminGalleryTable";

export default function GalleryAdminPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery Management</h1>
          <p className="text-muted-foreground">
            Manage the group's photo gallery and memories.
          </p>
        </div>
        <CreateGallery onSuccess={handleSuccess} />
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <AdminGalleryTable
          refreshTrigger={refreshTrigger}
          setRefreshTrigger={setRefreshTrigger}
        />
      </div>
    </div>
  );
}
