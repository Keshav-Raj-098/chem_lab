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

interface NewsItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

interface AdminNewsTableProps {
  refreshTrigger: number;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}

export default function AdminNewsTable({ refreshTrigger, setRefreshTrigger }: AdminNewsTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Form state for editing
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchNews = async (page: number, limit: number) => {
    const response = await axios.get(`/admin/news&announcements?page=${page}&limit=${limit}`);
    return {
      data: response.data.news,
      meta: response.data.meta,
    };
  };

  const handleEdit = (news: NewsItem) => {
    setSelectedNews(news);
    setEditTitle(news.title);
    setEditBody(news.body);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (news: NewsItem) => {
    setSelectedNews(news);
    setDeleteDialogOpen(true);
  };

  const confirmUpdate = async () => {
    if (!selectedNews) return;
    try {
      setIsUpdating(true);
      await axios.put(`/admin/news&announcements/${selectedNews.id}`, {
        title: editTitle,
        newsBody: editBody,
      });
      toast.success("News updated successfully");
      setEditDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update news");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedNews) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/admin/news&announcements/${selectedNews.id}`);
      toast.success("News deleted successfully");
      setDeleteDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete news");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<NewsItem>[] = [
    { header: "Title", accessorKey: "title" },
    { 
      header: "Content", 
      accessorKey: "body",
      cell: (row: NewsItem) => (
        <div className="max-w-xs truncate" dangerouslySetInnerHTML={{ __html: row.body }} />
      )
    },
    { 
      header: "Date", 
      accessorKey: "createdAt",
      cell: (row: NewsItem) => new Date(row.createdAt).toLocaleDateString()
    },
  ];

  return (
    <>
      <GenericDataTable
        columns={columns}
        fetchData={fetchNews}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        refreshTrigger={refreshTrigger}
      />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit News & Announcement</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <RichTextEditor value={editBody} onChange={setEditBody} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update News"}
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
          <p>Are you sure you want to delete this news item?</p>
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
