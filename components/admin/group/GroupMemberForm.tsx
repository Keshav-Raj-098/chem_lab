"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X, Upload, Link } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/admin/textEditor"), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-md bg-muted/20 animate-pulse flex items-center justify-center text-muted-foreground text-sm">Loading editor...</div>
});

export interface GroupMemberFormData {
  name: string;
  email: string;
  researchAreas: string;
  designation: string;
  category: string;
  profileImgUrl: string;
  profileLink: string;
  imageFile?: File;
}

interface GroupMemberFormProps {
  initialData?: GroupMemberFormData;
  onSubmit: (data: GroupMemberFormData) => Promise<void>;
  loading: boolean;
  onCancel: () => void;
  submitLabel: string;
}

const CATEGORIES = [
  "POSTDOC",
  "PHD",
  "MASTERS",
  "UNDERGRADUATE",
  "FACULTY",
  "ALUMNI",
  "STAFF",
  "RESEARCH_SCHOLAR",
  "COLLABORATOR",
  "OTHER",
];

const GroupMemberForm = ({
  initialData,
  onSubmit,
  loading,
  onCancel,
  submitLabel,
}: GroupMemberFormProps) => {
  const [formData, setFormData] = useState<GroupMemberFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    researchAreas: initialData?.researchAreas || "",
    designation: initialData?.designation || "",
    category: initialData?.category || "",
    profileImgUrl: initialData?.profileImgUrl || "",
    profileLink: initialData?.profileLink || "",
  });

  const [researchAreaInput, setResearchAreaInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.profileImgUrl || "");
  const [imageOption, setImageOption] = useState<"upload" | "url">(
    initialData?.profileImgUrl && !initialData.profileImgUrl.includes("blob:") ? "url" : "upload"
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file, profileImgUrl: "" }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, profileImgUrl: url, imageFile: undefined }));
    setPreviewUrl(url);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageFile: undefined, profileImgUrl: "" }));
    setPreviewUrl("");
  };

  const handleCategoryChange = (value: string | null) => {
    if (value) {
      setFormData((prev) => ({ ...prev, category: value }));
    }
  };



  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.category) {
      toast.error("Please fill in all required fields (Name, Email, Category)");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Profile Image</Label>
          <div className="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50/50">
            {previewUrl && (
              <div className="flex items-center gap-4 mb-2">
                <div className="relative w-24 h-24 border-2 border-white shadow-md rounded-lg overflow-hidden bg-white">
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
                  <p>Changes will be saved on submit</p>
                </div>
              </div>
            )}
            
            <Tabs value={imageOption} onValueChange={(v) => setImageOption(v as "upload" | "url")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Upload
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link className="h-4 w-4" /> External URL
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-0">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-white"
                />
                <p className="text-[10px] text-gray-400 mt-1.5 ml-1">JPG, PNG or WEBP. Max 5MB recommended.</p>
              </TabsContent>
              
              <TabsContent value="url" className="mt-0">
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.profileImgUrl}
                  onChange={handleUrlChange}
                  className="bg-white"
                />
                <p className="text-[10px] text-gray-400 mt-1.5 ml-1">Paste a direct link to an image file.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              placeholder="e.g. Research Assistant"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="researchAreas">Research Areas</Label>
          <div className="flex gap-2">
            <RichTextEditor
              placeholder="A brief description of the research areas"
              value={formData.researchAreas}
              onChange={value => setFormData({...formData, researchAreas: value})}
            />
          </div>

        </div>

        <div className="grid gap-2">
          <Label htmlFor="profileLink">Profile Link</Label>
          <Input
            id="profileLink"
            name="profileLink"
            value={formData.profileLink}
            onChange={handleInputChange}
            placeholder="https://example.com/profile"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default GroupMemberForm;
