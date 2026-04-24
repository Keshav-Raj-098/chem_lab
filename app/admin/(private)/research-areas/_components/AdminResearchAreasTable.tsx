"use client";

import React, { useState } from "react";
import { GenericDataTable, Column } from "@/components/admin/GenericDataTable";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResearchArea {
  id: string;
  name: string;
  body: string;
  imgUrl: string | null;
  createdAt: string;
}

interface AdminResearchAreasTableProps {
  refreshTrigger: number;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}

export default function AdminResearchAreasTable({ refreshTrigger, setRefreshTrigger }: AdminResearchAreasTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<ResearchArea | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResearchAreas = async (page: number, limit: number) => {
    const response = await axios.get(`/admin/research-areas?page=${page}&limit=${limit}`);
    return {
      data: response.data.researchAreas,
      meta: response.data.meta,
    };
  };

  const handleEdit = (area: ResearchArea) => {
    router.push(`/admin/research-areas/edit/${area.id}`);
  };

  const handleDeleteClick = (area: ResearchArea) => {
    setSelectedArea(area);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedArea) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/admin/research-areas/${selectedArea.id}`);
      toast.success("Research area deleted successfully");
      setDeleteDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete research area");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<ResearchArea>[] = [
    { 
      header: "Image", 
      accessorKey: "imgUrl",
      cell: (row: ResearchArea) => (
        <div className="h-10 w-16 relative rounded overflow-hidden border">
          {row.imgUrl ? (
            <img 
              src={row.imgUrl.startsWith('http') ? row.imgUrl : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${row.imgUrl}`} 
              alt={row.name} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="bg-muted w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
          )}
        </div>
      )
    },
    { header: "Name", accessorKey: "name" },
    { 
      header: "Description", 
      accessorKey: "body",
      cell: (row: ResearchArea) => (
        <div className="max-w-xs truncate text-xs" dangerouslySetInnerHTML={{ __html: row.body }} />
      )
    },
    { 
      header: "Created At", 
      accessorKey: "createdAt",
      cell: (row: ResearchArea) => new Date(row.createdAt).toLocaleDateString()
    },
  ];

  return (
    <>
      <GenericDataTable
        columns={columns}
        fetchData={fetchResearchAreas}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        refreshTrigger={refreshTrigger}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this research area? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
