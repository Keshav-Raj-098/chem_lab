"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fetchNewsAction } from '@/lib/news';

interface NewsCardProps {
  title: string;
  body: string;
  createdAt: Date | string;
}

export const NewsCard = ({ title, body, createdAt }: NewsCardProps) => {
  return (
    <div className="news-card">
      <h3 className="news-card-title">{title}</h3>
      <div className="news-card-date">
        {new Date(createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </div>
      <div
        className="news-card-body prose prose-sm max-w-none line-clamp-3"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  )
}

const NewsSkeleton = () => (
  <div className="news-card animate-pulse">
    <div className="h-6 bg-slate-100 rounded w-3/4 mb-3" />
    <div className="h-3 bg-slate-50 rounded w-1/4 mb-4" />
    <div className="space-y-2">
      <div className="h-3 bg-slate-50 rounded" />
      <div className="h-3 bg-slate-50 rounded w-5/6" />
    </div>
  </div>
);

const NewsSection = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !hasLoaded && !loading) {
          setLoading(true);
          try {
            const result = await fetchNewsAction({
              page: 1,
              pageSize: 6,
            });
            if (result.success) {
              setNews(result.data);
              setHasLoaded(true);
            }
          } catch (error) {
            console.error("Failed to lazy load news:", error);
          } finally {
            setLoading(false);
          }
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded, loading]);

  const itemsToShow = news.slice(0, 6);

  return (
    <section ref={sectionRef} className="section news-section">
      <div className="section-container">
        <div className="section-header-row">
          <div>
            <div className="section-label">Latest Updates</div>
            <h2 className="section-heading">News &amp; Announcements</h2>
          </div>
          <Link href="/news/events" className="section-link">View all news &rarr;</Link>
        </div>

        <div className="news-grid min-h-[200px]">
          {loading && !hasLoaded ? (
            <>
              {[...Array(5)].map((_, i) => (
                <NewsSkeleton key={i} />
              ))}
            </>
          ) : (
            <>
              {itemsToShow.map((item, index) => (
                <NewsCard key={item.id || index} {...item} />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default NewsSection
