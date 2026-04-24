"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TimelineItem } from "./TimelineItem";
import { Loader2 } from "lucide-react";

interface TimelineProps {
  initialAwards: any[];
  initialHasMore: boolean;
  awardType: any;
  fetchAction: (params: { page: number; pageSize: number; type?: any }) => Promise<any>;
  showDate?: boolean;
}

const PAGE_SIZE = 10;

export const Timeline = ({
  initialAwards,
  initialHasMore,
  awardType,
  fetchAction,
  showDate = true
}: TimelineProps) => {
  // Compute correct starting page from the actual number of initial items loaded
  const initialPage = Math.ceil(initialAwards.length / PAGE_SIZE) + 1;

  const [awards, setAwards] = useState(initialAwards);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(initialPage);
  const loadingRef = useRef(false); // Use a ref to avoid stale closure in IntersectionObserver

  const observerTarget = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);
    try {
      const result = await fetchAction({
        type: awardType,
        page,
        pageSize: PAGE_SIZE,
      });

      if (result.success && result.data) {
        setAwards((prev) => {
          const existingIds = new Set(prev.map((item: any) => item.id));
          const newItems = result.data.filter((item: any) => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        setHasMore(result.hasMore ?? false);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load more:", error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, page, awardType, fetchAction]); // `loading` intentionally excluded — gated by ref

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]); // Only re-register when loadMore identity changes (i.e. page/hasMore changed)

  if (!awards || awards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No awards found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0">
      <div className="relative pl-2">
        {awards.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            index={index}
            showDate={showDate}
          />
        ))}
      </div>

      {/* Sentinel + Loading Indicator */}
      <div
        ref={observerTarget}
        className="mt-8 flex justify-center h-10 items-center"
      >
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading more...</span>
          </div>
        )}
      </div>
    </div>
  );
};
