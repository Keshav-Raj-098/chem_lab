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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/admin/textEditor";
import DOMPurify from "isomorphic-dompurify";

interface Award {
  id: string;
  body: string;
  type: string;
  updatedAt: string;
}

interface AdminAwardsTableProps {
  refreshTrigger: number;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}

export default function AdminAwardsTable({ refreshTrigger, setRefreshTrigger }: AdminAwardsTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);

  // Form state for editing
  const [editBody, setEditBody] = useState("");
  const [editType, setEditType] = useState("GROUP_MEMBER");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAwards = async (page: number, limit: number) => {
    const response = await axios.get(`/admin/awards?page=${page}&limit=${limit}`);
    return {
      data: response.data.awards,
      meta: response.data.meta,
    };
  };

  const handleEdit = (award: Award) => {
    setSelectedAward(award);
    setEditBody(award.body);
    setEditType(award.type);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (award: Award) => {
    setSelectedAward(award);
    setDeleteDialogOpen(true);
  };

  const confirmUpdate = async () => {
    if (!selectedAward) return;
    try {
      setIsUpdating(true);
      await axios.put(`/admin/awards/${selectedAward.id}`, {
        awardBody: editBody,
        awardType: editType,
      });
      toast.success("Award updated successfully");
      setEditDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update award");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedAward) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/admin/awards/${selectedAward.id}`);
      toast.success("Award deleted successfully");
      setDeleteDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete award");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Award>[] = [
    {
      header: "Award Description",
      accessorKey: "body",
      cell: (award) => (
        <div 
          className="max-w-150 line-clamp-2 text-sm text-gray-600 prose prose-sm prose-slate"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(award.body) }} 
        />
      ),
    },
    {
      header: "Category",
      accessorKey: "type",
      cell: (award) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          award.type === "GROUP_LEADER" 
            ? "bg-blue-100 text-blue-800" 
            : "bg-green-100 text-green-800"
        }`}>
          {award.type.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Updated",
      accessorKey: "updatedAt",
      cell: (award) => (
        <span className="text-gray-500 text-sm">
          {new Date(award.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <GenericDataTable
        title=""
        columns={columns}
        fetchData={fetchAwards}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        refreshTrigger={refreshTrigger}
      />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-175">
          <DialogHeader>
            <DialogTitle>Edit Award</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={editType} onValueChange={(val) => setEditType(val as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GROUP_LEADER">Group Leader</SelectItem>
                  <SelectItem value="GROUP_MEMBER">Group Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Award Description</Label>
              <RichTextEditor value={editBody} onChange={setEditBody} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpdate} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete the award from our servers.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Award"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
