"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupMemberCard from "@/components/GroupMemberCard";
import PublicPagination from "@/components/PublicPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Filter } from "lucide-react";

const CATEGORIES = [
  "all",
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

export default function GroupPage() {
  const [members, setMembers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  const fetchMembers = async (page: number, cat: string) => {
    try {
      setLoading(true);
      const categoryParam = cat !== "all" ? `&category=${cat}` : "";
      const response = await axios.get(`/api/group?page=${page}&limit=12${categoryParam}`);
      setMembers(response.data.members);
      setMeta(response.data.meta);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(meta.page, category);
  }, [meta.page, category]);

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    setMeta((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="bg-[#fafbfc] min-h-screen">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-16 mb-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center gap-3 text-blue-600 font-bold uppercase tracking-[0.2em] text-[11px] mb-4">
            <span className="w-8 h-[2px] bg-blue-600"></span>
            Meet Our Team
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Our Research <span className="text-blue-600">Group</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            A diverse team of scientists, researchers, and students working together to push the boundaries of chemical sciences and innovation.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-7xl pb-24">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-full border border-gray-100 shadow-sm overflow-x-auto no-scrollbar max-w-[calc(100vw-48px)]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  category === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {cat === "all" ? "Everyone" : cat.replace("_", " ")}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium whitespace-nowrap">
            <Users className="w-4 h-4 text-blue-500" />
            Showing {members.length} of {meta.total} members
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
            <Users className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {members.map((member: any) => (
                <GroupMemberCard key={member.id} member={member} />
              ))}
            </div>
            <PublicPagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
}
