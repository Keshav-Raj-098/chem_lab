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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
import { Plus, X } from "lucide-react";

const RichTextEditor = dynamic(() => import("@/components/admin/textEditor"), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-md bg-muted/20 animate-pulse flex items-center justify-center text-muted-foreground text-sm">Loading editor...</div>
});

interface CreateProjectProps {
  onSuccess: () => void;
}

export default function CreateProject({ onSuccess }: CreateProjectProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    body: "",
    status: "PLANNED",
    duration: "",
    amntFunded: "",
    completedOn: "",
    mainImg: "",
  });

  const [fundingAgencies, setFundingAgencies] = useState<string[]>([]);
  const [investigators, setInvestigators] = useState<string[]>([]);
  
  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    if (!val.trim()) return;
    setter(prev => [...prev, val.trim()]);
  };

  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const [tempAgency, setTempAgency] = useState("");
  const [tempInvestigator, setTempInvestigator] = useState("");

  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.body) {
      toast.error("Please fill in required fields (Title, Description, and Body)");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/admin/projects", {
        ...formData,
        fundingAgencies,
        investigators,
      });

      toast.success("Project created successfully");
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        body: "",
        status: "PLANNED",
        duration: "",
        amntFunded: "",
        completedOn: "",
        mainImg: "",
      });
      setFundingAgencies([]);
      setInvestigators([]);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
        <Plus className="mr-2 h-4 w-4" /> Create New Project
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-200 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Research Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title*</Label>
              <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Short Description* (Subtitle)</Label>
              <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={val => setFormData({...formData, status: val || "PLANNED"})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANNED">Planned</SelectItem>
                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="e.g. 2024 - 2027" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amnt">Amount Funded (Lakhs INR)</Label>
                <Input id="amnt" type="number" step="0.01" value={formData.amntFunded} onChange={e => setFormData({...formData, amntFunded: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="completed">Completed On (Optional)</Label>
                <Input id="completed" type="date" value={formData.completedOn} onChange={e => setFormData({...formData, completedOn: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Funding Agencies */}
              <div className="grid gap-2">
                <Label>Funding Agencies</Label>
                <div className="flex gap-2">
                  <Input value={tempAgency} onChange={e => setTempAgency(e.target.value)} placeholder="Add agency" />
                  <Button type="button" size="sm" onClick={() => { addArrayItem(setFundingAgencies, tempAgency); setTempAgency(""); }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {fundingAgencies.map((item, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center">
                      {item} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeArrayItem(setFundingAgencies, idx)} />
                    </span>
                  ))}
                </div>
              </div>
              {/* Investigators */}
              <div className="grid gap-2">
                <Label>Investigators</Label>
                <div className="flex gap-2">
                  <Input value={tempInvestigator} onChange={e => setTempInvestigator(e.target.value)} placeholder="Add investigator" />
                  <Button type="button" size="sm" onClick={() => { addArrayItem(setInvestigators, tempInvestigator); setTempInvestigator(""); }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {investigators.map((item, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
                      {item} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeArrayItem(setInvestigators, idx)} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Project Body / Full Content*</Label>
              <RichTextEditor value={formData.body} onChange={val => setFormData({...formData, body: val})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={loading}>{loading ? "Creating..." : "Create Project"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
