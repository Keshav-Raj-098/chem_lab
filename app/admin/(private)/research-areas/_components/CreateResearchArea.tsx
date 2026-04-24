"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "@/lib/axiosConfig";
import dynamic from "next/dynamic";
import { ArrowLeft, Upload, X } from "lucide-react";

const RichTextEditor = dynamic(() => import("@/components/admin/textEditor"), {
  ssr: false,
});

export default function CreateResearchArea() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !body) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("body", body);
      if (image) {
        formData.append("image", image);
      }

      await axios.post("/admin/research-areas", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Research area created successfully");
      router.push("/admin/research-areas");
      router.refresh();
    } catch (error) {
      console.error("Creation failed:", error);
      toast.error("Failed to create research area");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container w-full mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Add Research Area</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Research Area Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter research area name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditor value={body} onChange={setBody} />
            </div>

            <div className="space-y-2">
              <Label>Image (Optional, max 5MB)</Label>
              <div className="flex flex-col gap-4">
                {!preview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="w-10 h-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  </div>
                ) : (
                  <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full hover:shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Research Area"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
