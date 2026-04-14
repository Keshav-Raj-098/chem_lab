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
    <div className="min-h-screen bg-white pt-24 pb-16">
      {/* Hero Section */}
      <section className="section-container mb-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="section-label justify-center">Our Community</div>
          <h1 className="section-heading text-center">
            Meet Our <span className="text-blue-600">Research Family</span>
          </h1>
          <p className="text-lg text-gray-600 mt-6 leading-relaxed">
            Our diverse and talented team brings together expertise from across
            disciplines to drive innovation in chemical sciences.
          </p>
        </div>
      </section>

      {/* Members Sections */}
      <div className="section-container">
        {categoryOrder.map((category) => {
          const section = sections.get(category);
          if (!section || section.members.length === 0) return null;

          const isInView = loadedCategories.has(category);

          return (
            <div
              key={category}
              ref={(el) => setCategoryRef(el, category)}
              data-category={category}
              className="mb-20 scroll-reveal"
            >
              {/* Section Header */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {section.displayName}
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full" />
                <p className="text-gray-600 mt-4">
                  {section.members.length} member{section.members.length !== 1 ? 's' : ''}
                  {section.hasMore && ' (more available)'}
                </p>
              </div>

              {/* Members Grid */}
              {isInView ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {section.members.map((member, index) => (
                      <div
                        key={member.id}
                        className="member-card-wrapper"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <PublicGroupMemberCard member={member} />
                      </div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {section.hasMore && (
                    <div className="mt-12 flex justify-center">
                      <button
                        onClick={() => handleLoadMore(category)}
                        disabled={section.isLoading}
                        className="group relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-600/30"
                      >
                        {section.isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More
                            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                // Skeleton Loading
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(Math.min(3, section.members.length))].map(
                    (_, i) => (
                      <div
                        key={i}
                        className="bg-gray-100 rounded-2xl h-96 animate-pulse"
                      />
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
        <div className="section-container text-center py-20">
          <p className="text-2xl font-semibold text-gray-900 mb-2">
            No members found
          </p>
          <p className="text-gray-600">Check back soon for our team members.</p>
        </div>
      )}
    </div>
  );
};

export default PeoplePage;
