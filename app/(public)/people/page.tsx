'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import PublicGroupMemberCard from '@/components/pub/PublicGroupMemberCard';
import { ChevronDown } from 'lucide-react';
import { fetchMembersByCategory } from './membersAction';
import { GroupCategory } from '@/lib/generated/prisma/enums';

interface Member {
  id: string;
  name: string;
  email: string;
  researchAreas: string;
  designation: string | null;
  category: string;
  profileImgUrl: string | null;
  profileLink: string | null;
  phoneNumber: string | null;
}

interface CategorySection {
  category: string;
  displayName: string;
  members: Member[];
  hasMore: boolean;
  isLoading: boolean;
}

const MEMBERS_PER_SECTION = 15; // Should match the server-side constant

const getCategoryDisplay = (category: string): string => {
  const displayNames: Record<string, string> = {
    POSTDOC: 'PostDocs',
    PHD: 'PhD Scholars',
    MASTERS: 'Masters Students',
    UNDERGRADUATE: 'Undergraduate',
    FACULTY: 'Faculty',
    FACULTY_FELLOW: 'Faculty Fellows',
    ALUMNI: 'Alumni',
    STAFF: 'Staff',
    RESEARCH_SCHOLAR: 'Research Scholars',
    COLLABORATOR: 'Collaborators',
    OTHER: 'Other',
  };
  return displayNames[category] || category.replace(/_/g, ' ');
};

const PeoplePage = () => {
  const [sections, setSections] = useState<Map<string, CategorySection>>(new Map());
  const [loadedCategories, setLoadedCategories] = useState<Set<string>>(new Set());
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);

  // Fetch members for a specific category
  const fetchMembers = useCallback(
    async (category: string, page: number = 1) => {
      try {
        const result = await fetchMembersByCategory(category as GroupCategory, page);

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch members');
        }

        setSections((prev) => {
          const newMap = new Map(prev);
          const existingSection = newMap.get(category) || {
            category,
            displayName: getCategoryDisplay(category),
            members: [],
            hasMore: false,
            isLoading: false,
          };

          newMap.set(category, {
            ...existingSection,
            members:
              page === 1
                ? result.data
                : [...existingSection.members, ...result.data],
            hasMore: result.meta.page < result.meta.totalPages,
            isLoading: false,
          });

          return newMap;
        });
      } catch (error) {
        console.error(`Error fetching members for ${category}:`, error);
        setSections((prev) => {
          const newMap = new Map(prev);
          const section = newMap.get(category);
          if (section) {
            section.isLoading = false;
          }
          return newMap;
        });
      }
    },
    []
  );

  // Initial load: fetch all categories with first page
  useEffect(() => {
    let mounted = true;

    const categories = [
      'FACULTY',
      'FACULTY_FELLOW',
      'POSTDOC',
      'PHD',
      'RESEARCH_SCHOLAR',
      'MASTERS',
      'UNDERGRADUATE',
      'ALUMNI',
      'STAFF',
      'COLLABORATOR',
      'OTHER',
    ];

    if (sections.size === 0) {
      setCategoryOrder(categories);
      setLoadedCategories(new Set());

      // Initialize sections
      const newSections = new Map<string, CategorySection>();
      categories.forEach((cat) => {
        newSections.set(cat, {
          category: cat,
          displayName: getCategoryDisplay(cat),
          members: [],
          hasMore: true,
          isLoading: true,
        });
      });
      setSections(newSections);

      // Fetch first page for each category
      categories.forEach((cat) => {
        fetchMembers(cat, 1);
      });
    }

    if (mounted) {
      setIsInitialLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [fetchMembers]);

  const setCategoryRef = useCallback((el: HTMLElement | null, category: string) => {
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  }, []);

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const category = entry.target.getAttribute('data-category');
            if (category) {
              setLoadedCategories((prev) => {
                if (prev.has(category)) return prev;
                const next = new Set(prev);
                next.add(category);
                return next;
              });
            }
          }
        });
      },
      { 
        rootMargin: '100px',
        threshold: 0.1 
      }
    );

    observerRef.current = observer;

    return () => observer.disconnect();
  }, []); // Run once on mount

  // Handle load more button
  const handleLoadMore = (category: string) => {
    const section = sections.get(category);
    if (section) {
      setSections((prev) => {
        const newMap = new Map(prev);
        const updated = { ...section };
        updated.isLoading = true;
        newMap.set(category, updated);
        return newMap;
      });

      const currentPage = Math.ceil(
        section.members.length / MEMBERS_PER_SECTION
      );
      fetchMembers(category, currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching Research Page Aesthetic */}
      <div className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Subtle Background Pattern/Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-12 text-center relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px bg-teal-600" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-teal-600">Our Community</span>
              <div className="w-12 h-px bg-teal-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Meet Our Research Team
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Our diverse and talented team brings together expertise from across
              disciplines to drive innovation in chemical sciences.
            </p>
          </div>
        </div>
      </div>

      {/* Filter / Nav Anchor Bar */}
      <div className="sticky top-[68px] z-40 bg-white/80 backdrop-blur-md border border-slate-100 py-3 mx-4 md:mx-12 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] mb-16 mt-[-2rem]">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs font-bold tracking-widest uppercase text-slate-400">
          <span>Members Directory</span>
          <span className="text-teal-600">{categoryOrder.length} Categories</span>
        </div>
      </div>

      {/* Members Sections */}
      <div className="max-w-6xl mx-auto px-12 pb-24">
        {categoryOrder.map((category) => {
          const section = sections.get(category);
          if (!section || section.members.length === 0) return null;

          const isInView = loadedCategories.has(category);

          return (
            <div
              key={category}
              ref={(el) => setCategoryRef(el, category)}
              data-category={category}
              className="mb-32 pt-8"
            >
              {/* Section Header */}
              <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 inline-block relative px-4 tracking-tight">
                  {section.displayName}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-teal-600"></div>
                </h2>
                <div className="text-sm font-bold text-slate-400 mt-8">
                  <span className="text-teal-600">{section.members.length}</span> member{section.members.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Members Grid */}
              {isInView ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {section.members.map((member, index) => (
                      <div
                        key={member.id}
                        className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
                        style={{
                          animationDelay: `${(index % 12) * 50}ms`,
                        }}
                      >
                        <PublicGroupMemberCard member={member} />
                      </div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {section.hasMore && (
                    <div className="mt-16 flex justify-center">
                      <button
                        onClick={() => handleLoadMore(category)}
                        disabled={section.isLoading}
                        className="group relative flex items-center gap-3 px-8 py-3 bg-white text-[#0f2557] font-medium text-sm tracking-wide rounded-full border border-slate-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-teal-200 hover:text-teal-700 hover:shadow-sm"
                      >
                        {section.isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                            Loading Members...
                          </>
                        ) : (
                          <>
                            Load More {section.displayName}
                            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:translate-y-1 group-hover:text-teal-600 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                // Skeleton Loading
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(Math.min(4, section.members.length))].map(
                    (_, i) => (
                      <div
                        key={i}
                        className="bg-slate-50/50 border border-slate-100 rounded-2xl h-80 animate-pulse relative overflow-hidden"
                      >
                         <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 rounded-bl-full" />
                         <div className="p-6 flex flex-col items-center">
                            <div className="w-24 h-24 rounded-2xl bg-slate-200 mb-5" />
                            <div className="w-3/4 h-5 bg-slate-200 rounded mb-2" />
                            <div className="w-1/2 h-3 bg-slate-200 rounded mb-6" />
                            <div className="w-full h-12 bg-slate-100 rounded" />
                         </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {sections.size === 0 && !isInitialLoading && (
        <div className="max-w-6xl mx-auto px-12 py-32 text-center">
          <div className="inline-flex w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-6 border border-slate-100">
             <div className="w-6 h-6 border-2 border-slate-200 border-t-teal-600 rounded-full animate-spin" />
          </div>
          <p className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
            Preparing Member Directory
          </p>
          <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto">
            Please wait while we gather the profiles of our latest team members and researchers.
          </p>
        </div>
      )}
    </div>
  );
};

export default PeoplePage;
