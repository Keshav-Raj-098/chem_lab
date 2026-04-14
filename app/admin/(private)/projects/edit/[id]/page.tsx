"use client";

import React, { useState, useEffect } from "react";
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
import { X, ArrowLeft, Save, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const RichTextEditor = dynamic(() => import("@/components/admin/textEditor"), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-md bg-muted/20 animate-pulse flex items-center justify-center text-muted-foreground text-sm">Loading editor...</div>
});

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "PLANNED",
    type: "NON_FUNDED",
    duration: "",
    amntFunded: "",
    completedOn: "",
  });

  const [fundingAgencies, setFundingAgencies] = useState("");
  const [investigators, setInvestigators] = useState("");
  const [contributors, setContributors] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/admin/projects/${id}`);
        const data = response.data;
        setFormData({
          title: data.title || "",
          description: data.description || "",
          status: data.status || "PLANNED",
          type: data.type || "NON_FUNDED",
          duration: data.duration || "",
          amntFunded: data.amntFunded || "",
          completedOn: data.completedOn ? data.completedOn.split('T')[0] : "",
        });
        setFundingAgencies(data.fundingAgencies || "");
        setInvestigators(data.investigators || "");
        setContributors(data.contributors || "");
      } catch (error) {
        toast.error("Failed to load project details");
        router.push("/admin/projects");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id, router]);

  const handleUpdate = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Please fill in required fields (Title and Description)");
      return;
    }

    try {
      setUpdating(true);
      await axios.put(`/admin/projects/${id}`, {
        ...formData,
        fundingAgencies,
        investigators,
        contributors,
      });

      toast.success("Project updated successfully");
      router.push("/admin/projects");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update project");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Edit Research Project</h1>
        </div>
        <Button onClick={handleUpdate} disabled={updating} className="bg-blue-600 hover:bg-blue-700">
          {updating ? "Updating..." : <><Save className="mr-2 h-4 w-4" /> Update Project</>}
        </Button>
      </div>

      <div className="grid gap-8 bg-white p-8 rounded-xl border shadow-sm">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-base font-semibold">Project Title*</Label>
            <Input 
              id="title" 
              className="text-lg py-6"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-base font-semibold">Short Description* (Subtitle)</Label>
            <RichTextEditor
              placeholder="A brief description of the project (max 150 characters)"
              value={formData.description}
              onChange={value => setFormData({...formData, description: value})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Label htmlFor="type" className="text-base font-semibold">Type</Label>
              <Select value={formData.type} onValueChange={val => setFormData({...formData, type: val || "NON_FUNDED"})}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FUNDED">Funded</SelectItem>
                  <SelectItem value="NON_FUNDED">Non-Funded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration" className="text-base font-semibold">Duration</Label>
              <Input 
                id="duration" 
                className="h-11"
                value={formData.duration} 
                onChange={e => setFormData({...formData, duration: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="amnt" className="text-base font-semibold">Amount Funded</Label>
              <Input 
                id="amnt" 
                className="h-11"
                value={formData.amntFunded} 
                disabled={formData.type === "NON_FUNDED"}
                onChange={
                  e => setFormData({...formData, amntFunded: e.target.value})
                } 
              />
              {formData.type === "NON_FUNDED" && <p className="text-sm text-muted-foreground">Amount is disabled for non-funded projects</p>}
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

          <div className="flex flex-col gap-3">
            <div className="grid gap-2">
              <Label htmlFor="funding" className="text-base font-semibold">Funding Agencies</Label>
              {/* <Input 
                id="funding" 
                className="h-11"
                value={fundingAgencies} 
                onChange={e => setFundingAgencies(e.target.value)} 
                placeholder="List funding agencies"
              /> */}
              <RichTextEditor
                placeholder="List funding agencies (if any)"
                value={fundingAgencies}
                onChange={value => setFundingAgencies(value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="investigators" className="text-base font-semibold">Investigators</Label>
              {/* <Input 
                id="investigators" 
                className="h-11"
                value={investigators} 
                onChange={e => setInvestigators(e.target.value)} 
                placeholder="List investigators"
              /> */}
              <RichTextEditor
                placeholder="List investigators"
                value={investigators}
                onChange={value => setInvestigators(value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contributors" className="text-base font-semibold">Contributors</Label>
            {/* <Input 
              id="contributors" 
              className="h-11"
              value={contributors} 
              onChange={e => setContributors(e.target.value)} 
              placeholder="List contributors"
            /> */}
            <RichTextEditor
              placeholder="List contributors"
              value={contributors}
              onChange={value => setContributors(value)}
             />
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline" size="lg" onClick={() => router.back()}>Cancel</Button>
        <Button size="lg" onClick={handleUpdate} disabled={updating} className="bg-blue-600 hover:bg-blue-700 px-8">
          {updating ? "Updating..." : "Update Project"}
        </Button>
      </div>
    </div>
  );
}
