"use client";

import React, { useState } from "react";
import { GenericDataTable, Column } from "@/components/admin/GenericDataTable";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/admin/textEditor";

interface AlumniItem {
  id: string;
  name: string;
  body: string;
  createdAt: string;
}

interface AdminAlumniTableProps {
  refreshTrigger: number;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}

export default function AdminAlumniTable({ refreshTrigger, setRefreshTrigger }: AdminAlumniTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniItem | null>(null);

  // Form state for editing
  const [editName, setEditName] = useState("");
  const [editBody, setEditBody] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAlumni = async (page: number, limit: number) => {
    const response = await axios.get(`/admin/alumni?page=${page}&limit=${limit}`);
    return {
      data: response.data.alumni,
      meta: response.data.meta,
    };
  };

  const handleEdit = (alumni: AlumniItem) => {
    setSelectedAlumni(alumni);
    setEditName(alumni.name);
    setEditBody(alumni.body);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (alumni: AlumniItem) => {
    setSelectedAlumni(alumni);
    setDeleteDialogOpen(true);
  };

  const confirmUpdate = async () => {
    if (!selectedAlumni) return;
    try {
      setIsUpdating(true);
      await axios.put(`/admin/alumni/${selectedAlumni.id}`, {
        name: editName,
        body: editBody,
      });
      toast.success("Alumni updated successfully");
      setEditDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update alumni");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedAlumni) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/admin/alumni/${selectedAlumni.id}`);
      toast.success("Alumni deleted successfully");
      setDeleteDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete alumni");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<AlumniItem>[] = [
    { header: "Name", accessorKey: "name" },
    { 
      header: "Details", 
      accessorKey: "body",
      cell: (row: AlumniItem) => (
        <div className="max-w-xs truncate" dangerouslySetInnerHTML={{ __html: row.body }} />
      )
    },
    { 
      header: "Date Added", 
      accessorKey: "createdAt",
      cell: (row: AlumniItem) => new Date(row.createdAt).toLocaleDateString()
    },
  ];

  return (
    <>
      <GenericDataTable
        columns={columns}
        fetchData={fetchAlumni}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        refreshTrigger={refreshTrigger}
      />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Alumni Record</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Details (Rich Text)</Label>
              <RichTextEditor value={editBody} onChange={setEditBody} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Alumni"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this alumni record?</p>
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
