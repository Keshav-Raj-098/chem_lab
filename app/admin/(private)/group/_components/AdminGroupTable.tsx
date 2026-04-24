"use client";

import React, { useState } from "react";
import { GenericDataTable, Column, FilterConfig } from "@/components/admin/GenericDataTable";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import GroupMemberForm, { GroupMemberFormData } from "./GroupMemberForm";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GroupMember extends GroupMemberFormData {
  id: string;
  createdAt: string;
}

interface AdminGroupTableProps {
  refreshTrigger: number;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
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

const getFullImageUrl = (url: string | null) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("/")) return url;
  const publicUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  return publicUrl ? `${publicUrl}/${url}` : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${url}`;
};

export default function AdminGroupTable({ refreshTrigger, setRefreshTrigger }: AdminGroupTableProps) {
  const router = useRouter();

  const fetchMembers = async (page: number, limit: number, filters?: Record<string, any>) => {
    const categoryParam = filters?.category ? `&category=${filters.category}` : "";
    const response = await axios.get(`/admin/group?page=${page}&limit=${limit}${categoryParam}`);
    return {
      data: response.data.members,
      meta: response.data.meta,
    };
  };

  const handleEdit = (member: GroupMember) => {
    router.push(`/admin/group/editMember/${member.id}`);
  };

  const handleDelete = async (member: GroupMember) => {
    if (!confirm(`Are you sure you want to delete ${member.name}?`)) return;
    try {
      await axios.delete(`/admin/group/${member.id}`);
      toast.success("Member deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete member");
    }
  };

  const handleMoveToAlumni = async (member: GroupMember) => {
    if (!confirm(`Are you sure you want to move ${member.name} to Alumni?\n\nThis will remove them from the current group list, delete their hosted image from Cloudinary, and create a new record in the Alumni table.\n\nNote: No data retrieval will be possible once moved.`)) return;
    try {
      await axios.post(`/admin/group/${member.id}/move-to-alumni`);
      toast.success("Member moved to alumni successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Move to alumni failed:", error);
      toast.error("Failed to move member to alumni");
    }
  };

  const columns: Column<GroupMember>[] = [
    {
      header: "Member",
      accessorKey: "name",
      cell: (row: GroupMember) => {
        const profileImgUrl = getFullImageUrl(row.profileImgUrl);
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border">
              {profileImgUrl ? (
                <Image src={profileImgUrl} alt={row.name} fill sizes="32px" className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">
                  No Img
                </div>
              )}
            </div>
            <div>
              <div className="font-medium">{row.name}</div>
              <div className="text-xs text-muted-foreground">{row.email}</div>
            </div>
          </div>
        );
      },
    },
    { header: "Category", accessorKey: "category", cell: (row: GroupMember) => row.category.replace("_", " ") },
    { header: "Designation", accessorKey: "designation" },
    {
      header: "Research Areas",
      accessorKey: "researchAreas",
      cell: (row: GroupMember) => (
        <div 
          className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]"
          dangerouslySetInnerHTML={{ __html: row.researchAreas }}
        />
      ),
    },
  ];

  const filtersConfig: FilterConfig[] = [
    {
      key: "category",
      label: "Category",
      options: CATEGORIES.map((cat) => ({ label: cat.replace("_", " "), value: cat })),
    },
  ];

  return (
    <>
      <GenericDataTable
        title="Group Members"
        columns={columns}
        fetchData={fetchMembers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMoveToAlumni={handleMoveToAlumni}
        refreshTrigger={refreshTrigger}
        filtersConfig={filtersConfig}
      />
    </>
  );
}
