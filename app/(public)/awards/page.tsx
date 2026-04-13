import { AwardType } from "@/lib/generated/prisma/enums";
import { fetchAwardsAction } from "@/lib/load_data/loadAwards";
import Link from "next/link";
import { ChevronRight, Award, User, Users } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    type?: string;
    page?: string;
  }>;
}

const AwardsPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const currentType = params.type as AwardType | undefined;
  const currentPage = parseInt(params.page || "1", 10);
  const pageSize = 12;

  const result = await fetchAwardsAction({
    type: currentType,
    page: 1, // We load from 1 to current page * pageSize to show all loaded items
    pageSize: currentPage * pageSize,
  });

  const awards = result.success ? result.data : [];
  const hasMore = result.hasMore;

  const categories = [
    { id: "all", label: "All Awards", value: undefined, icon: Award },
    { id: "leader", label: "Group Leader", value: AwardType.GROUP_LEADER, icon: User },
    { id: "member", label: "Group Members", value: AwardType.GROUP_MEMBER, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Area */}
      <div className="pt-28 pb-8 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-px bg-teal-600" />
                <span className="text-xs font-medium tracking-widest uppercase text-teal-600">Recognition</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif text-slate-900 leading-tight">
                Awards & Honours
              </h1>
              <p className="mt-3 text-sm text-slate-500 font-light">
                Celebrating scientific excellence and contributions of our group leader and researchers.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 p-1 bg-white rounded-lg border border-slate-200 shadow-sm">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/awards${cat.value ? `?type=${cat.value}` : ""}`}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    (cat.value === currentType) || (cat.id === "all" && !currentType)
                      ? "bg-teal-600 text-white shadow-md shadow-teal-900/10"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-12 py-20">
        {!awards || awards.length === 0 ? (
          <div className="py-24 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-6">
              <Award className="w-8 h-8" />
            </div>
            <p className="text-slate-400 font-serif italic text-lg">No awards recorded in this category yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {awards.map((award, index) => (
              <div
                key={award.id}
                className="group py-2 px-4 transition-all duration-300 hover:bg-slate-50 rounded-lg border border-slate-100 hover:border-teal-200"
              >
                <div className="flex items-center gap-4">
                  <span className="text-teal-600/30 font-serif text-2xl italic group-hover:text-teal-600/50 transition-colors min-w-fit">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                        award.type === AwardType.GROUP_LEADER
                          ? "bg-blue-50 text-blue-700"
                          : "bg-teal-50 text-teal-700"
                      }`}>
                        {award.type === AwardType.GROUP_LEADER ? "Leader" : "Member"}
                      </span>
                      <span className="text-slate-300 text-[9px] uppercase tracking-widest font-bold">
                        {new Date(award.createdAt).getFullYear()}
                      </span>
                    </div>
                    <div
                      className="text-sm text-slate-700 prose prose-slate max-w-none prose-strong:text-slate-800 prose-strong:font-semibold prose-p:my-0"
                      dangerouslySetInnerHTML={{ __html: award.body }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-16 flex justify-center">
            <Link
              href={`/awards?${currentType ? `type=${currentType}&` : ""}page=${currentPage + 1}`}
              className="group flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-900 font-medium rounded-full shadow-sm hover:shadow-md hover:border-teal-600/30 transition-all duration-300"
              scroll={false}
            >
              Discover More
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AwardsPage;

