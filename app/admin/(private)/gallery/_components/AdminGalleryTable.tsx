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
import { X } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imgUrl: string;
  createdAt: string;
}

interface AdminGalleryTableProps {
  refreshTrigger: number;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}

const getImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const publicUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  if (publicUrl) return `${publicUrl}/${url}`;
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${url}`;
};

export default function AdminGalleryTable({ refreshTrigger, setRefreshTrigger }: AdminGalleryTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchGallery = async (page: number, limit: number) => {
    const response = await axios.get(`/admin/gallery?page=${page}&limit=${limit}`);
    return {
      data: response.data.gallery,
      meta: response.data.meta,
    };
  };

  const handleEdit = (item: GalleryItem) => {
    setSelected(item);
    setEditTitle(item.title);
    setEditDescription(item.description || "");
    setEditImage(null);
    setEditPreview(getImageUrl(item.imgUrl));
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (item: GalleryItem) => {
    setSelected(item);
    setDeleteDialogOpen(true);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      e.target.value = "";
      return;
    }
    setEditImage(file);
    setEditPreview(URL.createObjectURL(file));
  };

  const confirmUpdate = async () => {
    if (!selected) return;
    try {
      setIsUpdating(true);
      const data = new FormData();
      data.append("title", editTitle);
      data.append("description", editDescription);
      data.append("imgUrl", selected.imgUrl);
      if (editImage) {
        data.append("image", editImage);
      }

      await axios.put(`/admin/gallery/${selected.id}`, data);
      toast.success("Gallery item updated successfully");
      setEditDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.error || "Failed to update gallery item");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!selected) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/admin/gallery/${selected.id}`);
      toast.success("Gallery item deleted successfully");
      setDeleteDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete gallery item");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<GalleryItem>[] = [
    {
      header: "Image",
      accessorKey: "imgUrl",
      cell: (row: GalleryItem) => (
        <div className="w-16 h-12 rounded overflow-hidden border bg-muted">
          <img src={getImageUrl(row.imgUrl)} alt={row.title} className="w-full h-full object-cover" />
        </div>
      ),
    },
    { header: "Title", accessorKey: "title" },
    {
      header: "Description",
      accessorKey: "description",
      cell: (row: GalleryItem) => (
        <div
          className="max-w-xs truncate text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: row.description || "—" }}
        />
      ),
    },
    {
      header: "Date Added",
      accessorKey: "createdAt",
      cell: (row: GalleryItem) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <>
      <GenericDataTable
        columns={columns}
        fetchData={fetchGallery}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        refreshTrigger={refreshTrigger}
      />

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Image</Label>
              <div className="flex flex-col gap-3 p-4 border rounded-lg bg-gray-50/50">
                {editPreview && (
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-24 border-2 border-white shadow-md rounded-lg overflow-hidden bg-white">
                      <img src={editPreview} alt="Preview" className="w-full h-full object-cover" />
                      {editImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditImage(null);
                            setEditPreview(selected ? getImageUrl(selected.imgUrl) : "");
                          }}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {editImage ? "New image selected" : "Current image (leave empty to keep)"}
                    </p>
                  </div>
                )}
                <Input type="file" accept="image/*" onChange={handleEditFileChange} className="bg-white" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <RichTextEditor value={editDescription} onChange={setEditDescription} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Gallery Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this gallery item?</p>
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
