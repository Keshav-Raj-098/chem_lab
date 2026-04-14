import { AwardType } from "@/lib/generated/prisma/enums";
import { fetchAwardsAction } from "@/lib/load_data/loadAwards";
import Link from "next/link";
import { ChevronRight, Award, User, Users, Sparkles, Trophy, Star } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 selection:bg-teal-200 selection:text-teal-900 pb-24">
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 overflow-hidden bg-white border-b border-slate-200/60">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50/50 via-white to-white -z-10" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 opacity-70 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-white text-[10px] font-bold tracking-widest uppercase shadow-sm cursor-default transition-transform hover:scale-105">
              <Sparkles className="w-3 h-3 text-teal-400" />
              Recognition & Excellence
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Awards <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">& Honours</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              Celebrating the scientific excellence, groundbreaking research, and outstanding contributions of our group leader and researchers.
            </p>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
              {categories.map((cat) => {
                const isActive = (cat.value === currentType) || (cat.id === "all" && !currentType);
                return (
                  <Link
                    key={cat.id}
                    href={`/awards${cat.value ? `?type=${cat.value}` : ""}`}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-teal-600 text-white shadow-md shadow-teal-600/25 scale-105"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 hover:scale-105 shadow-sm"
                    }`}
                  >
                    <cat.icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-100" : "text-slate-400"}`} />
                    {cat.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 lg:py-24">
        {!awards || awards.length === 0 ? (
          <div className="max-w-4xl mx-auto py-24 text-center bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300 mb-6 border border-slate-100 shadow-sm">
                <Award className="w-10 h-10" />
              </div>
              <p className="text-slate-600 font-bold text-xl md:text-2xl tracking-tight">No awards recorded yet</p>
              <p className="text-slate-500 mt-2 font-medium">Check back later for updates to this category.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {awards.map((award, index) => (
              <div key={award.id} className="relative group h-full flex flex-col">
                {/* Content Card */}
                <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/75 hover:shadow-xl hover:border-teal-200/75 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden flex flex-col">
                  {/* Subtle Number Watermark */}
                  <div className="absolute -bottom-4 -right-2 text-[10rem] font-black text-slate-50/50 -z-10 select-none group-hover:text-teal-50/30 transition-colors duration-500 leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="flex flex-col gap-6 relative z-10 flex-1">
                    <div className="flex items-start justify-between">
                      {/* Icon Container */}
                      <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/50 text-slate-400 group-hover:text-teal-600 group-hover:from-teal-50 group-hover:to-emerald-50 group-hover:border-teal-200/50 transform group-hover:rotate-6 transition-all duration-500 shadow-sm">
                        <Trophy className="w-7 h-7" />
                      </div>
                      
                      {/* Date & Type Badges */}
                      <div className="flex flex-col items-end gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-900 text-white shadow-sm">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          {new Date(award.createdAt).getFullYear()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border ${
                          award.type === AwardType.GROUP_LEADER
                            ? "bg-blue-50 text-blue-700 border-blue-200/50"
                            : "bg-teal-50 text-teal-700 border-teal-200/50"
                        }`}>
                          {award.type === AwardType.GROUP_LEADER ? "Group Leader" : "Group Member"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 flex flex-col">
                      {/* CMS Content */}
                      <div 
                        className="prose prose-slate text-sm md:text-base max-w-none text-slate-700 leading-relaxed font-medium 
                                   prose-p:my-2 prose-p:last:mb-0 prose-p:first:mt-0
                                   prose-strong:text-slate-900 prose-strong:font-bold 
                                   prose-a:text-teal-600 hover:prose-a:text-teal-700 prose-a:font-semibold prose-a:decoration-teal-300 prose-a:underline-offset-4
                                   group-hover:text-slate-800 transition-colors duration-300" 
                        dangerouslySetInnerHTML={{ __html: award.body }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-20 flex justify-center">
            <Link
              href={`/awards?${currentType ? `type=${currentType}&` : ""}page=${currentPage + 1}`}
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-slate-900 font-bold rounded-full overflow-hidden transition-all duration-300 border-2 border-slate-200 hover:border-transparent hover:shadow-2xl hover:shadow-teal-900/20 hover:-translate-y-1 sm:w-auto w-full"
              scroll={false}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                Discover More Awards
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AwardsPage;
