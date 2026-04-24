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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";
import { PublicationCategory } from "@/lib/generated/prisma/enums";
import { ShowToast } from "@/components/showToast";

const RichTextEditor = dynamic(() => import("@/components/admin/textEditor"), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-md bg-muted/20 animate-pulse flex items-center justify-center text-muted-foreground text-sm">Loading editor...</div>
});

const yearOptions = [
  "None",
  "<2000",
  ...Array.from({ length: 27 }, (_, i) => (new Date().getFullYear() - i).toString()),
];

interface CreatePublicationProps {
  onSuccess: () => void;
}

const CreatePublication = ({ onSuccess }: CreatePublicationProps) => {
  const [open, setOpen] = useState(false);
  const [publicationBody, setPublicationBody] = useState("");
  const [publicationCategory, setPublicationCategory] = useState<PublicationCategory>(
    PublicationCategory.JOURNAL
  );
  const [year, setYear] = useState<string>("None");
  const [loading, setLoading] = useState(false);

  const isYearRequired =
    publicationCategory === PublicationCategory.PATENTS ||
    publicationCategory === PublicationCategory.PUBLICATION;

  const handleCreatePublication = async () => {
    if (!publicationBody.trim()) {
      ShowToast("Please provide publication details", "error");
      return;
    }

    if (isYearRequired && (year === "None" || !year)) {
      ShowToast(`Please specify the year for ${publicationCategory.toLowerCase()}`, "error");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/admin/publication", {
        publicationBody,
        publicationCategory,
        year: year === "None" ? null : year === "<2000" ? null : parseInt(year),
      });

      ShowToast("Publication added successfully", "success");
      resetForm();
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error creating publication:", error);
      ShowToast(error.response?.data?.error || "Failed to add publication", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPublicationBody("");
    setPublicationCategory(PublicationCategory.JOURNAL);
    setYear("None");
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        <Plus className="mr-2 h-4 w-4" /> Add New Publication
      </Button>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-175 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Publication</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="font-semibold">
                  Category
                </Label>
                <Select
                  value={publicationCategory}
                  onValueChange={(val) => setPublicationCategory(val as PublicationCategory)}
                >
                  <SelectTrigger id="category" className="w-full">
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
                <Label htmlFor="year" className="font-semibold">
                  Year {isYearRequired && <span className="text-red-500">*</span>}
                </Label>
                <Select
                  value={year}
                  onValueChange={(val) => setYear(val || "None")}
                  disabled={!isYearRequired && publicationCategory !== PublicationCategory.JOURNAL}
                >
                  <SelectTrigger id="year" className="w-full">
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
                  value={publicationBody}
                  onChange={setPublicationBody}
                  placeholder="Enter publication details (Authors, Title, Journal, Vol, Page, etc.)..."
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mb-4">
            <p className="text-xs text-blue-700 leading-relaxed italic">
              <strong>Note:</strong> Year is mandatory for **Patents** and **Publications**. For
              other categories, it's optional but recommended for better organization.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleCreatePublication} disabled={loading}>
              {loading ? "Adding..." : "Add Publication"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePublication;
