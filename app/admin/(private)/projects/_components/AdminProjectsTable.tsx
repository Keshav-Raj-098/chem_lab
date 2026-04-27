"use client";

import React, { useState } from "react";
import { GenericDataTable, Column } from "@/components/admin/GenericDataTable";
import { toast } from "sonner";
import { listProjects } from "../_server/queries";
import { deleteProject } from "../_server/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  type: string;
  amntFunded: string | null;
  duration: string | null;
  fundingAgencies: string | null;
  investigators: string | null;
  contributors: string | null;
  completedOn: string | null;
}

interface AdminProjectsTableProps {
  refreshTrigger: number;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}

export default function AdminProjectsTable({ refreshTrigger, setRefreshTrigger }: AdminProjectsTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async (page: number, limit: number) => {
    const result = await listProjects({ page, limit });
    return { data: result.data, meta: result.meta };
  };

  const handleEdit = (project: Project) => {
    router.push(`/admin/projects/edit/${project.id}`);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;
    try {
      setIsDeleting(true);
      const res = await deleteProject(selectedProject.id);
      if (!res.ok) { toast.error(res.error); return; }
      toast.success("Project deleted successfully");
      setDeleteDialogOpen(false);
      setRefreshTrigger(p => p + 1);
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Project>[] = [
    { header: "Title", accessorKey: "title" },
    { header: "Type", accessorKey: "type" },
    { header: "Status", accessorKey: "status" },
    { header: "Duration", accessorKey: "duration" },
    { 
        header: "Amount", 
        accessorKey: "amntFunded",
        cell: (row: Project) => row.amntFunded ? `₹${row.amntFunded}` : "-" 
    },
  ];

  return (
    <>
      <GenericDataTable
        columns={columns}
        fetchData={fetchProjects}
        onEdit={handleEdit}
        onDelete={(p) => { setSelectedProject(p); setDeleteDialogOpen(true); }}
        refreshTrigger={refreshTrigger}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete this project? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
