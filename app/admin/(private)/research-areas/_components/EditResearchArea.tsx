"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "@/lib/axiosConfig";
import dynamic from "next/dynamic";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";

const RichTextEditor = dynamic(() => import("@/components/admin/textEditor"), {
  ssr: false,
});

export default function EditResearchArea() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImgUrl, setExistingImgUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchArea = async () => {
      try {
        const response = await axios.get(`/admin/research-areas/${id}`);
        const area = response.data;
        setName(area.name);
        setBody(area.body);
        if (area.imgUrl) {
          setExistingImgUrl(area.imgUrl);
          const fullUrl = area.imgUrl.startsWith('http') 
            ? area.imgUrl 
            : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${area.imgUrl}`;
          setPreview(fullUrl);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
        toast.error("Failed to load research area data");
        router.push("/admin/research-areas");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchArea();
  }, [id, router]);

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
    setExistingImgUrl("");
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
      formData.append("imgUrl", existingImgUrl);
      if (image) {
        formData.append("image", image);
      }

      await axios.put(`/admin/research-areas/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Research area updated successfully");
      router.push("/admin/research-areas");
      router.refresh();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update research area");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Research Area</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Research Area Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Area Name</Label>
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
                {loading ? "Updating..." : "Update Research Area"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
