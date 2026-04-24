"use client";

import { useState } from "react";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import GroupMemberForm, { GroupMemberFormData } from "../_components/GroupMemberForm";


export default function CreateMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: GroupMemberFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("category", data.category);
      formData.append("phoneNumber", data.phoneNumber || "");
      formData.append("designation", data.designation || "");
      formData.append("profileLink", data.profileLink || "");
      formData.append("researchAreas", data.researchAreas);
      
      if (data.imageFile) {
        formData.append("image", data.imageFile);
      } else {
        formData.append("profileImgUrl", data.profileImgUrl || "");
      }

      await axios.post("/admin/group", formData);
      toast.success("Group member added successfully");
      router.push("/admin/group");
    } catch (error: any) {
      console.error("Error creating group member:", error);
      toast.error(error.response?.data?.error || "Failed to add group member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex items-center gap-4 mb-8 border-b pb-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Add New Group Member</h1>
      </div>

      <div className="bg-white p-8 rounded-xl border shadow-sm">
        <GroupMemberForm
          onSubmit={handleCreate}
          loading={loading}
          onCancel={() => router.back()}
          submitLabel="Add Member"
        />
      </div>
    </div>
  );
}
