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
import RichTextEditor from "../textEditor";
import { Plus } from "lucide-react";

interface CreateAwardProps {
  onSuccess: () => void;
}

const CreateAward = ({ onSuccess }: CreateAwardProps) => {
  const [open, setOpen] = useState(false);
  const [awardBody, setAwardBody] = useState("");
  const [awardType, setAwardType] = useState("GROUP_MEMBER");
  const [loading, setLoading] = useState(false);

  const handleCreateAward = async () => {
    if (!awardBody.trim()) {
      toast.error("Please fill in the award description");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/admin/awards", {
        awardBody,
        awardType,
      });

      toast.success("Award created successfully");
      setAwardBody("");
      setAwardType("GROUP_MEMBER");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error creating award:", error);
      toast.error(error.response?.data?.error || "Failed to create award");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
        <Plus className="mr-2 h-4 w-4" /> Create New Award
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-175">
          <DialogHeader>
            <DialogTitle>Add New Award</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={awardType} onValueChange={(val) => setAwardType(val as string)}>
                <SelectTrigger id="category">
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
              <RichTextEditor 
                value={awardBody} 
                onChange={setAwardBody} 
                placeholder="Describe the achievement..." 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAward} disabled={loading}>
              {loading ? "Creating..." : "Create Award"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateAward;
