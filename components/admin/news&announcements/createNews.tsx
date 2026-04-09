"use client";

import React, { useState } from "react";
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
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

const RichTextEditor = dynamic(() => import("../textEditor"), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-md bg-muted/20 animate-pulse flex items-center justify-center text-muted-foreground text-sm">Loading editor...</div>
});

interface CreateNewsProps {
  onSuccess: () => void;
}

const CreateNews = ({ onSuccess }: CreateNewsProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateNews = async () => {
    if (!title.trim() || !newsBody.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/admin/news&announcements", {
        title,
        newsBody,
      });

      toast.success("News item created successfully");
      setTitle("");
      setNewsBody("");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error creating news:", error);
      toast.error(error.response?.data?.error || "Failed to create news item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
        <Plus className="mr-2 h-4 w-4" /> Create New News Item
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New News & Announcement</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter news title"
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <RichTextEditor 
                value={newsBody} 
                onChange={setNewsBody} 
                placeholder="Enter news details..." 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
                onClick={handleCreateNews} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create News"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateNews;
