import { prisma } from '@/lib/prisma';
import { PublicationCategory } from '@/lib/generated/prisma/enums';
import Link from 'next/link';
import { ChevronRight, FileText, Sparkles, BookOpen, ArrowLeft } from 'lucide-react';

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

// Helper to format category names nicely
const formatCategoryName = (category: string) => {
  return category
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

const PublicationsPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const activeCategory = params.category as PublicationCategory | undefined;
  const currentPage = parseInt(params.page || "1", 10);
  const pageSize = 12;

  // -------------------------------------------------------------
  // View Mode: Specific Category Detail
  // -------------------------------------------------------------
  if (activeCategory && Object.values(PublicationCategory).includes(activeCategory)) {
    const [publications, totalCount] = await Promise.all([
      prisma.publications.findMany({
        where: { category: activeCategory },
        orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      }),
      prisma.publications.count({ where: { category: activeCategory } })
    ]);

    const hasMore = totalCount > currentPage * pageSize;

    return (
      <div className="min-h-screen bg-slate-50 selection:bg-teal-200 selection:text-teal-900 pb-24">
        {/* Detail Header */}
        <div className="relative pt-32 pb-16 overflow-hidden bg-white border-b border-slate-200/60">
           {/* Background Decorative Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/50 via-white to-white -z-10" />
          
          <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
            <Link href="/publications" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors mb-6 group bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Overview
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              {formatCategoryName(activeCategory)}
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Showing {publications.length} of {totalCount} publications.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
          {publications.length === 0 ? (
            <div className="text-center py-24 text-slate-500 text-lg font-medium">No publications found for this category.</div>
          ) : (
            <div className="space-y-6">
              {publications.map((pub, idx) => (
                 <div key={pub.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/75 hover:shadow-md hover:border-teal-200 transition-all flex flex-col md:flex-row gap-6 group">
                   <div className="flex-shrink-0 mt-1 flex md:block items-center gap-4 border-b md:border-b-0 border-slate-100 pb-4 md:pb-0 mb-4 md:mb-0">
                     <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 text-teal-600">
                       <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />
                     </div>
                     <div className="inline-flex md:hidden items-center justify-center px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
                       {pub.year || "N/A"}
                     </div>
                   </div>
                   <div className="flex-1">
                     <div className="hidden md:inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-4 shadow-sm">
                       Year: {pub.year || "N/A"}
                     </div>
                     <div className="prose prose-slate md:prose-lg max-w-none text-slate-700 leading-relaxed font-medium prose-a:text-teal-600 hover:prose-a:text-teal-700 prose-a:font-semibold prose-a:underline-offset-4"
                          dangerouslySetInnerHTML={{ __html: pub.body }} />
                   </div>
                 </div>
              ))}
            </div>
          )}

          {/* Load More Pagination */}
          {hasMore && (
            <div className="mt-16 flex justify-center">
              <Link
                href={`/publications?category=${activeCategory}&page=${currentPage + 1}`}
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-slate-900 font-bold rounded-full overflow-hidden transition-all duration-300 border-2 border-slate-200 hover:border-transparent hover:shadow-2xl hover:-translate-y-1 sm:w-auto w-full"
                scroll={false}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-teal-700 transition-colors duration-300">
                  Load More Publications
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // View Mode: Master Overview
  // -------------------------------------------------------------
  // Fetch Top 5 of every category
  const categoriesToFetch = Object.values(PublicationCategory);
  const groupedData = await Promise.all(
    categoriesToFetch.map(async (category) => {
      const items = await prisma.publications.findMany({
        where: { category },
        orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
        take: 5,
      });
      const total = await prisma.publications.count({ where: { category } });
      return { category, items, total };
    })
  );

  // Filter out empty categories
  const activeGroups = groupedData.filter(g => g.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-teal-200 selection:text-teal-900 pb-24">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-white border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50/50 via-white to-white -z-10" />
        
        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-5 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-widest uppercase shadow-sm cursor-default hover:scale-105 transition-transform">
            <BookOpen className="w-3 h-3 text-teal-400" />
            Research Output
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-5">
            Scientific <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Publications</span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Explore our extensive contributions to scientific literature, including journal articles, patents, and conference proceedings.
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-24">
        {activeGroups.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300 mb-6 border border-slate-100 shadow-sm">
                <FileText className="w-10 h-10" />
              </div>
              <p className="text-slate-600 font-bold text-xl md:text-2xl tracking-tight">No publications recorded yet</p>
              <p className="text-slate-500 mt-2 font-medium">Check back later for updates to our research output.</p>
           </div>
        ) : activeGroups.map(group => (
          <section key={group.category} className="relative">
             <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-200">
               <div>
                 <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                   {formatCategoryName(group.category)}
                   <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full align-middle">
                     {group.total}
                   </span>
                 </h2>
               </div>
               
               {group.total > 5 && (
                 <Link 
                   href={`/publications?category=${group.category}`}
                   className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-sm font-bold text-slate-600 rounded-full hover:border-teal-300 hover:text-teal-700 hover:shadow-sm transition-all"
                 >
                   View All <ChevronRight className="w-4 h-4" />
                 </Link>
               )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {group.items.map(pub => (
                  <div key={pub.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/75 hover:shadow-xl hover:border-teal-200/75 transition-all duration-300 flex flex-col h-full group/card relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-50 to-transparent -z-10 rounded-bl-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                    
                    <div className="mb-5 flex justify-between items-start">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 group-hover/card:text-teal-500 group-hover/card:bg-teal-50 group-hover/card:border-teal-100 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold shadow-sm">
                        {pub.year || "N/A"}
                      </span>
                    </div>

                    <div className="prose prose-slate prose-sm md:prose-base text-slate-700 leading-relaxed font-medium flex-1 
                                  prose-a:text-slate-900 prose-a:font-bold hover:prose-a:text-teal-700 prose-a:decoration-teal-300 prose-a:underline-offset-4 prose-p:my-0 gap-2 flex flex-col"
                         dangerouslySetInnerHTML={{ __html: pub.body }} />
                  </div>
                ))}
             </div>

             {/* Mobile View All Button */}
             {group.total > 5 && (
               <div className="mt-8 md:hidden flex justify-center">
                 <Link 
                   href={`/publications?category=${group.category}`}
                   className="inline-flex items-center justify-center gap-2 px-8 py-3 w-full bg-slate-900 text-white text-sm font-bold rounded-full shadow-sm hover:bg-slate-800 transition-colors"
                 >
                   View All {formatCategoryName(group.category)} <ChevronRight className="w-4 h-4" />
                 </Link>
               </div>
             )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default PublicationsPage;
