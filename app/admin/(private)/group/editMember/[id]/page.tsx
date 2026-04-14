"use client";

import { useEffect, useState, use } from "react";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import GroupMemberForm, { GroupMemberFormData } from "@/components/admin/group/GroupMemberForm";

export default function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialData, setInitialData] = useState<GroupMemberFormData | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`/admin/group/${id}`);
        setInitialData(response.data);
      } catch (error: any) {
        console.error("Error fetching member:", error);
        toast.error("Failed to load group member data");
        router.push("/admin/group");
      } finally {
        setFetching(false);
      }
    };
    fetchMember();
  }, [id, router]);

  const handleUpdate = async (data: GroupMemberFormData) => {
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

      await axios.put(`/admin/group/${id}`, formData);
      toast.success("Group member updated successfully");
      router.push("/admin/group");
    } catch (error: any) {
      console.error("Error updating group member:", error);
      toast.error(error.response?.data?.error || "Failed to update group member");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex items-center gap-4 mb-8 border-b pb-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Edit Group Member</h1>
      </div>

      <div className="bg-white p-8 rounded-xl border shadow-sm">
        {initialData && (
          <GroupMemberForm
            initialData={initialData}
            onSubmit={handleUpdate}
            loading={loading}
            onCancel={() => router.back()}
            submitLabel="Update Member"
          />
        )}
      </div>
    </div>
  );
}
