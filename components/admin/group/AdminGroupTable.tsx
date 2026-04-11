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

  const columns: Column<GroupMember>[] = [
    {
      header: "Member",
      accessorKey: "name",
      cell: (row: GroupMember) => (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border">
            {row.profileImgUrl ? (
              <Image src={row.profileImgUrl} alt={row.name} fill className="object-cover" />
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
      ),
    },
    { header: "Category", accessorKey: "category", cell: (row: GroupMember) => row.category.replace("_", " ") },
    { header: "Designation", accessorKey: "designation" },
    {
      header: "Research Areas",
      accessorKey: "researchAreas",
      cell: (row: GroupMember) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {row.researchAreas.map((area, i) => (
            <span key={i} className="bg-gray-100 text-gray-700 text-[10px] px-1.5 py-0.5 rounded">
              {area}
            </span>
          ))}
        </div>
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
        refreshTrigger={refreshTrigger}
        filtersConfig={filtersConfig}
      />
    </>
  );
}
