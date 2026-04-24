'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Loader2 } from 'lucide-react';
import PublicGroupMemberCard from '@/components/pub/PublicGroupMemberCard';
import { fetchMembersByCategory } from '../membersAction';
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

const MEMBERS_PER_SECTION = 15;

const CATEGORY_ORDER: string[] = [
  'FACULTY',
  'FACULTY_FELLOW',
  'POSTDOC',
  'PHD',
  'RESEARCH_SCHOLAR',
  'MASTERS',
  'UNDERGRADUATE',
  'STAFF',
  'COLLABORATOR',
  'ALUMNI',
  'OTHER',
];

const CATEGORY_DISPLAY: Record<string, string> = {
  POSTDOC: 'Postdoctoral Researchers',
  PHD: 'Doctoral Scholars',
  MASTERS: 'Masters Students',
  UNDERGRADUATE: 'Undergraduate Researchers',
  FACULTY: 'Faculty',
  FACULTY_FELLOW: 'Faculty Fellows',
  ALUMNI: 'Alumni',
  STAFF: 'Staff',
  RESEARCH_SCHOLAR: 'Research Scholars',
  COLLABORATOR: 'Collaborators',
  OTHER: 'Staff',
};

const getCategoryDisplay = (c: string): string =>
  CATEGORY_DISPLAY[c] ?? c.replace(/_/g, ' ');

const SkeletonCard = () => (
  <div className="bg-slate-50 border border-slate-100 rounded-sm overflow-hidden animate-pulse">
    <div className="aspect-4/5 bg-slate-100" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-100 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <div className="h-2 bg-slate-100 rounded w-1/4" />
        <div className="h-2 bg-slate-100 rounded w-full" />
        <div className="h-2 bg-slate-100 rounded w-5/6" />
      </div>
    </div>
  </div>
);

const PeoplePage = () => {
  const [sections, setSections] = useState<Map<string, CategorySection>>(new Map());
  const [loadedCategories, setLoadedCategories] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchMembers = useCallback(async (category: string, page: number = 1) => {
    try {
      const result = await fetchMembersByCategory(category as GroupCategory, page);
      if (!result.success) throw new Error(result.error || 'Failed to fetch members');

      setSections((prev) => {
        const next = new Map(prev);
        const existing = next.get(category) || {
          category,
          displayName: getCategoryDisplay(category),
          members: [],
          hasMore: false,
          isLoading: false,
        };
        next.set(category, {
          ...existing,
          members: page === 1 ? result.data : [...existing.members, ...result.data],
          hasMore: result.meta.page < result.meta.totalPages,
          isLoading: false,
        });
        return next;
      });
    } catch (err) {
      console.error(`Error fetching members for ${category}:`, err);
      setSections((prev) => {
        const next = new Map(prev);
        const s = next.get(category);
        if (s) s.isLoading = false;
        return next;
      });
    }
  }, []);

  useEffect(() => {
    if (sections.size > 0) return;
    const initial = new Map<string, CategorySection>();
    CATEGORY_ORDER.forEach((cat) => {
      initial.set(cat, {
        category: cat,
        displayName: getCategoryDisplay(cat),
        members: [],
        hasMore: true,
        isLoading: true,
      });
    });
    setSections(initial);
    CATEGORY_ORDER.forEach((cat) => fetchMembers(cat, 1));
  }, [fetchMembers, sections.size]);

  const setCategoryRef = useCallback((el: HTMLElement | null) => {
    if (el && observerRef.current) observerRef.current.observe(el);
  }, []);

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
      { rootMargin: '200px', threshold: 0.05 }
    );
    observerRef.current = observer;
    return () => observer.disconnect();
  }, []);

  const handleLoadMore = (category: string) => {
    const section = sections.get(category);
    if (!section) return;
    setSections((prev) => {
      const next = new Map(prev);
      next.set(category, { ...section, isLoading: true });
      return next;
    });
    const currentPage = Math.ceil(section.members.length / MEMBERS_PER_SECTION);
    fetchMembers(category, currentPage + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="page-header">
        <div className="page-header-inner">
          <div className="page-header-eyebrow">Our Community</div>
          <h1 className="page-header-title">The Research Group</h1>
          <p className="page-header-subtitle">
            Faculty, researchers, and students advancing chemical science together — from
            postdoctoral fellows to undergraduate contributors.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20 space-y-20 md:space-y-24">
        {CATEGORY_ORDER.map((category) => {
          const section = sections.get(category);
          if (!section) return null;
          if (section.members.length === 0 && !section.isLoading) return null;

          const isInView = loadedCategories.has(category);

          return (
            <section
              key={category}
              ref={(el) => setCategoryRef(el)}
              data-category={category}
              aria-labelledby={`section-${category}`}
            >
              <div className="flex items-end justify-between gap-6 mb-10 md:mb-12 pb-5 border-b border-slate-200">
                <div>
                  <div className="inline-flex items-center gap-3 mb-3">
                    <span className="w-6 h-px bg-amber-700" aria-hidden="true" />
                    <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-700">
                      Members
                    </span>
                  </div>
                  <h2
                    id={`section-${category}`}
                    className="font-serif text-2xl md:text-3xl text-slate-900 tracking-tight"
                  >
                    {section.displayName}
                  </h2>
                </div>
                {section.members.length > 0 && (
                  <div className="text-xs md:text-sm text-slate-400 whitespace-nowrap">
                    {section.members.length}{' '}
                    {section.members.length === 1 ? 'member' : 'members'}
                  </div>
                )}
              </div>

              {isInView && section.members.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {section.members.map((member, index) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{
                          duration: 0.4,
                          delay: Math.min((index % 8) * 0.04, 0.28),
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <PublicGroupMemberCard member={member} />
                      </motion.div>
                    ))}
                  </div>

                  {section.hasMore && (
                    <div className="mt-12 flex justify-center">
                      <button
                        onClick={() => handleLoadMore(category)}
                        disabled={section.isLoading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-sm hover:border-slate-900 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {section.isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading…
                          </>
                        ) : (
                          <>
                            Show more
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {[...Array(4)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default PeoplePage;
