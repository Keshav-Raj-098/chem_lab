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
import { Plus, Upload, X } from "lucide-react";

const RichTextEditor = dynamic(() => import("../textEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-40 border rounded-md bg-muted/20 animate-pulse flex items-center justify-center text-muted-foreground text-sm">
      Loading editor...
    </div>
  ),
});

interface CreateGalleryProps {
  onSuccess: () => void;
}

const CreateGallery = ({ onSuccess }: CreateGalleryProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageFile(null);
    setPreviewUrl("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      e.target.value = "";
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl("");
  };

  const handleCreate = async () => {
    if (!title.trim() || !imageFile) {
      toast.error("Please provide a title and an image");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", title);
      data.append("description", description);
      data.append("image", imageFile);

      await axios.post("/admin/gallery", data);
      toast.success("Gallery item created successfully");
      resetForm();
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error creating gallery item:", error);
      toast.error(error.response?.data?.error || "Failed to create gallery item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
        <Plus className="mr-2 h-4 w-4" /> Add Gallery Item
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New Gallery Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Image <span className="text-red-500">*</span></Label>
              <div className="flex flex-col gap-3 p-4 border rounded-lg bg-gray-50/50">
                {previewUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-24 border-2 border-white shadow-md rounded-lg overflow-hidden bg-white">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p className="font-medium text-gray-700">Image Preview</p>
                      <p>Will be uploaded on submit</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Upload className="h-4 w-4" /> JPG, PNG or WEBP. Max 5MB.
                  </div>
                )}
                <Input type="file" accept="image/*" onChange={handleFileChange} className="bg-white" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter gallery title"
              />
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="A brief description of this memory..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Creating..." : "Create Gallery Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateGallery;
