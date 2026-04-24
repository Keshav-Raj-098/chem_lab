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

const RichTextEditor = dynamic(() => import("@/components/admin/textEditor"), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-md bg-muted/20 animate-pulse flex items-center justify-center text-muted-foreground text-sm">Loading editor...</div>
});

interface CreateAlumniProps {
  onSuccess: () => void;
}

const CreateAlumni = ({ onSuccess }: CreateAlumniProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAlumni = async () => {
    if (!name.trim() || !body.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/admin/alumni", {
        name,
        body,
      });

      toast.success("Alumni record created successfully");
      setName("");
      setBody("");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error creating alumni:", error);
      toast.error(error.response?.data?.error || "Failed to create alumni record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
        <Plus className="mr-2 h-4 w-4" /> Create New Alumni
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New Alumni</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter alumni name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Details (Rich Text)</Label>
              <RichTextEditor 
                value={body} 
                onChange={setBody} 
                placeholder="Enter alumni details..." 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
                onClick={handleCreateAlumni} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create Alumni"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateAlumni;
