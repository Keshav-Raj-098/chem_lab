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
import dynamic from "next/dynamic";
import { PublicationCategory } from "@/lib/generated/prisma/enums";
import { ShowToast } from "@/components/showToast";

const RichTextEditor = dynamic(() => import("@/components/admin/textEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8 border border-dashed rounded-md bg-muted/50">
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs text-muted-foreground">Loading editor...</p>
      </div>
    </div>
  ),
});

interface Publication {
  id: string;
  body: string;
  category: PublicationCategory;
  year: number | null;
  updatedAt: string;
}

interface AdminPublicationTableProps {
  refreshTrigger: number;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}

const yearOptions = [
  "None",
  "<2000",
  ...Array.from({ length: 27 }, (_, i) => (new Date().getFullYear() - i).toString()),
];

export default function AdminPublicationTable({
  refreshTrigger,
  setRefreshTrigger,
}: AdminPublicationTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);

  // Form state for editing
  const [editBody, setEditBody] = useState("");
  const [editCategory, setEditCategory] = useState<PublicationCategory>(PublicationCategory.JOURNAL);
  const [editYear, setEditYear] = useState<string>("None");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPublications = async (page: number, limit: number, filters?: Record<string, any>) => {
    let url = `/admin/publication?page=${page}&limit=${limit}`;
    
    if (filters?.category) {
      url += `&category=${filters.category}`;
    }
    
    const response = await axios.get(url);
    console.log("Fetched publications:", response.data);
    return {
      data: response.data.publications,
      meta: response.data.meta,
    };
  };

  const handleEdit = (pub: Publication) => {
    setSelectedPublication(pub);
    setEditBody(pub.body);
    setEditCategory(pub.category);
    
    if (pub.year === null) {
      setEditYear("None");
    } else if (pub.year === 1999) {
      setEditYear("<2000");
    } else {
      setEditYear(pub.year.toString());
    }
    
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (pub: Publication) => {
    setSelectedPublication(pub);
    setDeleteDialogOpen(true);
  };

  const isYearRequired =
    editCategory === PublicationCategory.PATENTS ||
    editCategory === PublicationCategory.PUBLICATION;

  const confirmUpdate = async () => {
    if (!selectedPublication) return;
    
    if (!editBody.trim()) {
      ShowToast("Please provide publication details", "error");
      return;
    }

    if (isYearRequired && (editYear === "None" || !editYear)) {
      ShowToast(`Please specify the year for ${editCategory.toLowerCase()}`, "error");
      return;
    }

    try {
      setIsUpdating(true);
      await axios.put(`/admin/publication/${selectedPublication.id}`, {
        publicationBody: editBody,
        publicationCategory: editCategory,
        year: editYear === "None" ? null : editYear === "<2000" ? 1999 : parseInt(editYear),
      });
      ShowToast("Publication updated successfully", "success");
      setEditDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      console.error("Update failed:", error);
      ShowToast(error.response?.data?.error || "Failed to update publication", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedPublication) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/admin/publication/${selectedPublication.id}`);
      ShowToast("Publication deleted successfully", "success");
      setDeleteDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Delete failed:", error);
      ShowToast("Failed to delete publication", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Publication>[] = [
    {
      header: "Publication Details",
      accessorKey: "body",
      cell: (item) => (
        <div 
          className="max-w-xl prose prose-sm line-clamp-2" 
          dangerouslySetInnerHTML={{ __html: item.body }} 
        />
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (item) => String(item.category).replace(/_/g, " "),
    },
    {
      header: "Year",
      accessorKey: "year",
      cell: (item) => {
        if (item.year === null) return "None";
        if (item.year === 1999) return "< 2000";
        return item.year;
      },
    },
    {
      header: "Last Updated",
      accessorKey: "updatedAt",
      cell: (item) => new Date(item.updatedAt).toLocaleDateString(),
    },
  ];

  const categories = Object.values(PublicationCategory).map(cat => ({
    label: cat.replace(/_/g, " "),
    value: cat
  }));

  return (
    <>
      <GenericDataTable
        columns={columns}
        fetchData={fetchPublications}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        refreshTrigger={refreshTrigger}
        filtersConfig={[
          {
            key: "category",
            label: "Category",
            options: categories
          }
        ]}
      />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-175 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Publication</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category" className="font-semibold">Category</Label>
                <Select
                  value={editCategory}
                  onValueChange={(val) => setEditCategory(val as PublicationCategory)}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PublicationCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-year" className="font-semibold">
                  Year {isYearRequired && <span className="text-red-500">*</span>}
                </Label>
                <Select
                  value={editYear}
                  onValueChange={(val) => setEditYear(val || "None")}
                  disabled={!isYearRequired && editCategory !== PublicationCategory.JOURNAL}
                >
                  <SelectTrigger id="edit-year">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((yr) => (
                      <SelectItem key={yr} value={yr}>
                        {yr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Publication Details</Label>
              <div className="min-h-62.5 border rounded-md">
                <RichTextEditor
                  value={editBody}
                  onChange={setEditBody}
                  placeholder="Enter publication details..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Publication"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground p-4">
            Are you sure you want to delete this publication? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Publication"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}