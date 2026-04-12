'use client'

import React, { useState } from 'react'
import { NewsCard } from '@/components/pub/newsCard'
import { fetchNewsAction } from '@/lib/news'
import { Button } from '@/components/ui/button'

interface NewsAndAnnouncements {
  id: string
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
}

interface NewsListProps {
  initialNews: NewsAndAnnouncements[]
}

export const NewsList = ({ initialNews }: NewsListProps) => {
  const [news, setNews] = useState<NewsAndAnnouncements[]>(initialNews)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialNews.length >= 20)

  const loadMore = async () => {
    setLoading(true)
    const nextPage = page + 1
    const response = await fetchNewsAction(nextPage)
    
    if (response.success && response.data.length > 0) {
      setNews((prev) => [...prev, ...response.data as NewsAndAnnouncements[]])
      setPage(nextPage)
      setHasMore(response.data.length >= 20)
    } else {
      setHasMore(false)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {news.map((newsItem, index) => (
          <div 
            key={newsItem.id} 
            className="transition-all hover:translate-y-[-4px] duration-300"
          >
            <NewsCard 
              title={newsItem.title} 
              body={newsItem.body} 
              createdAt={newsItem.createdAt.toISOString()} 
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={loadMore} 
            disabled={loading}
            variant="outline"
            className="px-8"
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {!hasMore && news.length > 0 && (
        <p className="text-center text-muted-foreground mt-8">No more news to load.</p>
      )}
    </div>
  )
}
