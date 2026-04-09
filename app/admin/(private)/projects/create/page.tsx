"use client";

import React, { useState } from "react";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
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
import { X, ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

const RichTextEditor = dynamic(() => import("@/components/admin/textEditor"), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-md bg-muted/20 animate-pulse flex items-center justify-center text-muted-foreground text-sm">Loading editor...</div>
});

export default function CreateProjectPage() {
  const router = useRouter();
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
  const [tempAgency, setTempAgency] = useState("");
  const [tempInvestigator, setTempInvestigator] = useState("");

  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    if (!val.trim()) return;
    setter(prev => [...prev, val.trim()]);
  };

  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

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
      router.push("/admin/projects");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Create New Research Project</h1>
        </div>
        <Button onClick={handleCreate} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? "Creating..." : <><Save className="mr-2 h-4 w-4" /> Create Project</>}
        </Button>
      </div>

      <div className="grid gap-8 bg-white p-8 rounded-xl border shadow-sm">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-base font-semibold">Project Title*</Label>
            <Input 
              id="title" 
              className="text-lg py-6"
              placeholder="Enter project title"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-base font-semibold">Short Description* (Subtitle)</Label>
            <Textarea 
              id="description" 
              placeholder="Brief overview of the project"
              className="min-h-25"
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-base font-semibold">Status</Label>
              <Select value={formData.status} onValueChange={val => setFormData({...formData, status: val || "PLANNED"})}>
                <SelectTrigger className="h-11">
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
              <Label htmlFor="duration" className="text-base font-semibold">Duration</Label>
              <Input 
                id="duration" 
                className="h-11"
                placeholder="e.g. 2024 - 2027" 
                value={formData.duration} 
                onChange={e => setFormData({...formData, duration: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="amnt" className="text-base font-semibold">Amount Funded (Lakhs INR)</Label>
              <Input 
                id="amnt" 
                className="h-11"
                type="number" 
                step="0.01" 
                value={formData.amntFunded} 
                onChange={e => setFormData({...formData, amntFunded: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="completed" className="text-base font-semibold">Completed On (Optional)</Label>
              <Input 
                id="completed" 
                className="h-11"
                type="date" 
                value={formData.completedOn} 
                onChange={e => setFormData({...formData, completedOn: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label className="text-base font-semibold">Funding Agencies</Label>
              <div className="flex gap-2">
                <Input value={tempAgency} onChange={e => setTempAgency(e.target.value)} placeholder="Add agency" className="h-11" />
                <Button type="button" size="sm" className="h-11 px-6" onClick={() => { addArrayItem(setFundingAgencies, tempAgency); setTempAgency(""); }}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {fundingAgencies.map((item, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-200 text-sm px-3 py-1.5 rounded-full flex items-center">
                    {item} <X className="ml-2 h-3.5 w-3.5 cursor-pointer hover:text-red-500" onClick={() => removeArrayItem(setFundingAgencies, idx)} />
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-base font-semibold">Investigators</Label>
              <div className="flex gap-2">
                <Input value={tempInvestigator} onChange={e => setTempInvestigator(e.target.value)} placeholder="Add investigator" className="h-11" />
                <Button type="button" size="sm" className="h-11 px-6" onClick={() => { addArrayItem(setInvestigators, tempInvestigator); setTempInvestigator(""); }}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {investigators.map((item, idx) => (
                  <span key={idx} className="bg-green-50 text-green-700 border border-green-200 text-sm px-3 py-1.5 rounded-full flex items-center">
                    {item} <X className="ml-2 h-3.5 w-3.5 cursor-pointer hover:text-red-500" onClick={() => removeArrayItem(setInvestigators, idx)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-base font-semibold">Project Body / Full Content*</Label>
            <RichTextEditor value={formData.body} onChange={val => setFormData({...formData, body: val})} />
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline" size="lg" onClick={() => router.back()}>Cancel</Button>
        <Button size="lg" onClick={handleCreate} disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-8">
          {loading ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </div>
  );
}
