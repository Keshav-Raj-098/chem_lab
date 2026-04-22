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

// Sort helper: year desc, nulls last
const sortYearNullsLast = <T extends { year: number | null }>(items: T[]): T[] => {
  return [...items].sort((a, b) => {
    if (a.year === null && b.year === null) return 0;
    if (a.year === null) return 1;
    if (b.year === null) return -1;
    return b.year - a.year;
  });
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
    const [rawPublications, totalCount] = await Promise.all([
      prisma.publications.findMany({
        where: { category: activeCategory },
        orderBy: [{ createdAt: 'desc' }],
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      }),
      prisma.publications.count({ where: { category: activeCategory } })
    ]);

    const publications = sortYearNullsLast(rawPublications);
    const hasMore = totalCount > currentPage * pageSize;

    return (
      <div className="min-h-screen bg-slate-50 selection:bg-teal-200 selection:text-teal-900 pb-24">
        {/* Detail Header */}
        <div className="relative pt-16 pb-8 overflow-hidden bg-white border-b border-slate-200/60">
           {/* Background Decorative Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/50 via-white to-white -z-10" />
          
          <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
            <Link href="/publications" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors mb-4 group bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Overview
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              {formatCategoryName(activeCategory)}
            </h1>
            <p className="text-base text-slate-600 font-medium">
              Showing {publications.length} of {totalCount} publications.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
          {publications.length === 0 ? (
            <div className="text-center py-24 text-slate-500 text-lg font-medium">No publications found for this category.</div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl border border-slate-200/75 shadow-sm overflow-hidden divide-y divide-slate-100">
                {publications.map((pub) => (
                  <div key={pub.id} className="group relative px-6 md:px-10 py-6 hover:bg-gradient-to-r hover:from-teal-50/40 hover:to-transparent transition-all duration-300">
                    <div className="flex items-start gap-5">
                      {/* Year Badge */}
                      <div className="flex-shrink-0 pt-0.5">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-slate-900 text-white border border-slate-800 shadow-sm whitespace-nowrap">
                          {pub.year || "N/A"}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div 
                          className="prose prose-slate text-sm md:text-base max-w-none text-slate-700 leading-relaxed font-medium 
                                     prose-p:my-1 prose-p:last:mb-0 prose-p:first:mt-0
                                     prose-strong:text-slate-900 prose-strong:font-bold 
                                     prose-a:text-teal-600 hover:prose-a:text-teal-700 prose-a:font-semibold prose-a:decoration-teal-300 prose-a:underline-offset-4
                                     group-hover:text-slate-800 transition-colors duration-300" 
                          dangerouslySetInnerHTML={{ __html: pub.body }} 
                        />
                      </div>
                    </div>
                    {/* Hover accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full" />
                  </div>
                ))}
              </div>
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
      const rawItems = await prisma.publications.findMany({
        where: { category },
        orderBy: [{ createdAt: 'desc' }],
        take: 20,
      });
      const items = sortYearNullsLast(rawItems).slice(0, 5);
      const total = await prisma.publications.count({ where: { category } });
      return { category, items, total };
    })
  );

  // Filter out empty categories
  const activeGroups = groupedData.filter(g => g.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-teal-200 selection:text-teal-900 pb-24">
      {/* Hero Section */}
      <div className="relative pt-12 pb-8 lg:pt-16 lg:pb-10 overflow-hidden bg-white border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50/50 via-white to-white -z-10" />
        
        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Scientific <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Publications</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
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
          <section key={group.category} className="max-w-4xl mx-auto relative">
             {/* Section Heading */}
             <div className="flex items-center gap-4 px-2 mb-6">
               <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight border-b-4 border-teal-500 pb-1 inline-flex items-center gap-3">
                 {formatCategoryName(group.category)}
                 <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full align-middle">
                   {group.total}
                 </span>
               </h2>
               <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
             </div>

             {/* List Box */}
             <div className="bg-white rounded-3xl border border-slate-200/75 shadow-sm overflow-hidden divide-y divide-slate-100">
                {group.items.map(pub => (
                  <div key={pub.id} className="group relative px-6 md:px-10 py-6 hover:bg-gradient-to-r hover:from-teal-50/40 hover:to-transparent transition-all duration-300">
                    <div className="flex items-start gap-5">
                      {/* Year Badge */}
                      <div className="flex-shrink-0 pt-0.5">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-slate-900 text-white border border-slate-800 shadow-sm whitespace-nowrap">
                          {pub.year || "N/A"}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div 
                          className="prose prose-slate text-sm md:text-base max-w-none text-slate-700 leading-relaxed font-medium 
                                     prose-p:my-1 prose-p:last:mb-0 prose-p:first:mt-0
                                     prose-strong:text-slate-900 prose-strong:font-bold 
                                     prose-a:text-teal-600 hover:prose-a:text-teal-700 prose-a:font-semibold prose-a:decoration-teal-300 prose-a:underline-offset-4
                                     group-hover:text-slate-800 transition-colors duration-300" 
                          dangerouslySetInnerHTML={{ __html: pub.body }} 
                        />
                      </div>
                    </div>
                    {/* Hover accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full" />
                  </div>
                ))}
             </div>

             {/* Load More Button */}
             {group.total > 5 && (
               <div className="mt-8 flex justify-center">
                 <Link 
                   href={`/publications?category=${group.category}`}
                   className="inline-flex items-center justify-center gap-2 px-8 py-3 w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-900 text-sm font-bold rounded-full shadow-sm hover:border-teal-300 hover:text-teal-700 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                 >
                   Load More {formatCategoryName(group.category)}
                   <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
