import React from 'react'
import { NewsList } from '@/components/pub/NewsList'
import { prisma } from '@/lib/prisma'

const page = async () => {
  const news = await prisma.newsAndAnnouncements.findMany({
    take: 20,
    orderBy: {
      createdAt: 'desc'
    }
  })


  return (
    <div className="min-h-screen bg-white">
      {/* Header Area */}
      <div className="pt-28 pb-8 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-px bg-teal-600" />
            <span className="text-xs font-medium tracking-widest uppercase text-teal-600">Updates</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-slate-900">News & Announcements</h1>
          <p className="mt-2 text-sm text-slate-500 font-light">
            Latest updates and announcements from our laboratory.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <NewsList initialNews={news} />
      </div>
    </div>
  )
}

export default page
